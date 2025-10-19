package org.example.clinique.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.clinique.dto.AppointmentRequestDTO;
import org.example.clinique.dto.AppointmentResponseDTO;
import org.example.clinique.dto.AvailabilityDTO;
import org.example.clinique.dto.DoctorSummaryDTO;
import org.example.clinique.entity.Appointment;
import org.example.clinique.entity.Doctor;
import org.example.clinique.entity.Patient;
import org.example.clinique.entity.User;
import org.example.clinique.entity.enums.AppointmentType;
import org.example.clinique.entity.enums.Role;
import org.example.clinique.mapper.AppointmentMapper;
import org.example.clinique.repository.PatientRepository;
import org.example.clinique.service.AppointmentService;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

public class ReservationServlet extends HttpServlet {

    private static final String[] COLOR_PALETTE = {
            "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#0ea5e9"
    };

    private EntityManagerFactory emf;

    @Override
    public void init() {
        emf = Persistence.createEntityManagerFactory("cliniquePU");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getParameter("action");
        if ("viewDashboard".equals(action)) {
            // Vérifier si l'utilisateur est connecté
            HttpSession session = req.getSession(false);
            if (session == null) {
                resp.sendRedirect(req.getContextPath() + "/index.jsp");
                return;
            }

            User sessionUser = (User) session.getAttribute("user");
            if (sessionUser == null) {
                resp.sendRedirect(req.getContextPath() + "/index.jsp");
                return;
            }

            EntityManager em = emf.createEntityManager();
            try {
                AppointmentService appointmentService = new AppointmentService(em);
                PatientRepository patientRepository = new PatientRepository(em);
                Patient patient = patientRepository.findById(sessionUser.getId());
                forwardToViewdashboardPatient(req, resp, appointmentService, patient, sessionUser);
            } finally {
                em.close();
            }
            return;
        }

        HttpSession session = req.getSession(false);
        if (session == null) {
            resp.sendRedirect(req.getContextPath() + "/index.jsp");
            return;
        }

        User sessionUser = (User) session.getAttribute("user");
        String email = (String) session.getAttribute("userEmail");
        if (sessionUser == null || email == null || sessionUser.getRole() != Role.PATIENT) {
            resp.sendRedirect(req.getContextPath() + "/index.jsp");
            return;
        }

        EntityManager em = emf.createEntityManager();
        try {
            AppointmentService appointmentService = new AppointmentService(em);
            PatientRepository patientRepository = new PatientRepository(em);
            Patient patient = patientRepository.findByEmail(email);
            if (patient == null) {
                resp.sendRedirect(req.getContextPath() + "/dashboard");
                return;
            }

            req.setAttribute("formDuration", 30);
            req.setAttribute("formType", AppointmentType.CONSULTATION.name());
            forwardToView(req, resp, appointmentService, patient, sessionUser);
        } finally {
            em.close();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false);
        if (session == null) {
            resp.sendRedirect(req.getContextPath() + "/index.jsp");
            return;
        }

        User sessionUser = (User) session.getAttribute("user");
        String email = (String) session.getAttribute("userEmail");
        if (sessionUser == null || email == null || sessionUser.getRole() != Role.PATIENT) {
            resp.sendRedirect(req.getContextPath() + "/index.jsp");
            return;
        }

        EntityManager em = emf.createEntityManager();
        try {
            AppointmentService appointmentService = new AppointmentService(em);
            PatientRepository patientRepository = new PatientRepository(em);
            Patient patient = patientRepository.findByEmail(email);
            if (patient == null) {
                resp.sendRedirect(req.getContextPath() + "/index.jsp");
                return;
            }

            AppointmentRequestDTO requestDTO = AppointmentRequestDTO.fromParameters(
                    req.getParameter("doctorId"),
                    req.getParameter("appointmentDate"),
                    req.getParameter("startTime"),
                    req.getParameter("duration"),
                    req.getParameter("appointmentType")
            );

            req.setAttribute("formDoctorId", requestDTO.getDoctorId());
            req.setAttribute("formDate", requestDTO.getAppointmentDate() != null ? requestDTO.getAppointmentDate().toString() : null);
            req.setAttribute("formStartTime", requestDTO.getStartTime() != null ? requestDTO.getStartTime().toString() : null);
            req.setAttribute("formDuration", requestDTO.getDurationMinutes());
            req.setAttribute("formType", requestDTO.getAppointmentType() != null
                    ? requestDTO.getAppointmentType()
                    : AppointmentType.CONSULTATION.name());

            if (requestDTO.getDoctorId() == null || requestDTO.getAppointmentDate() == null || requestDTO.getStartTime() == null) {
                req.setAttribute("errorMessage", "Merci de renseigner tous les champs obligatoires.");
                forwardToView(req, resp, appointmentService, patient, sessionUser);
                return;
            }

            LocalDateTime start = requestDTO.toStartDateTime();
            LocalDateTime end = requestDTO.toEndDateTime();
            if (start == null || end == null) {
                req.setAttribute("errorMessage", "Créneau invalide.");
                forwardToView(req, resp, appointmentService, patient, sessionUser);
                return;
            }

            if (start.isBefore(LocalDateTime.now())) {
                req.setAttribute("errorMessage", "Impossible de réserver un créneau passé.");
                forwardToView(req, resp, appointmentService, patient, sessionUser);
                return;
            }

            AppointmentType type;
            try {
                type = requestDTO.getAppointmentType() != null
                        ? AppointmentType.valueOf(requestDTO.getAppointmentType().toUpperCase(Locale.ROOT))
                        : AppointmentType.CONSULTATION;
            } catch (IllegalArgumentException e) {
                req.setAttribute("errorMessage", "Type de rendez-vous invalide.");
                forwardToView(req, resp, appointmentService, patient, sessionUser);
                return;
            }

            // EDIT or CREATE?
            String editAppointmentIdStr = req.getParameter("editAppointmentId");
            String replaceAction = req.getParameter("replaceOld");
            String oldAppointmentIdStr = req.getParameter("oldAppointmentId");

            try {
                Appointment appointment;

                if (editAppointmentIdStr != null && !editAppointmentIdStr.trim().isEmpty()) {
                    // EDIT MODE
                    Long editAppointmentId = Long.parseLong(editAppointmentIdStr);

                    // Detect patient conflicts excluding the appointment being edited
                    List<Appointment> conflicts = appointmentService.findConflictingAppointmentsExcluding(
                            patient.getId(), start, end, editAppointmentId
                    );

                    if (!conflicts.isEmpty() && !"confirm".equals(replaceAction)) {
                        Appointment conflictingAppt = conflicts.get(0);
                        Doctor conflictDoctor = conflictingAppt.getDoctor();
                        String conflictSpecialty = conflictDoctor != null && conflictDoctor.getSpecialty() != null
                                ? conflictDoctor.getSpecialty().getName() : "autre spécialité";
                        String conflictDoctorName = conflictDoctor != null
                                ? conflictDoctor.getTitle() + " " + conflictDoctor.getLastName() : "médecin";

                        req.setAttribute("conflictWarning", true);
                        req.setAttribute("conflictMessage",
                                "Vous avez déjà un rendez-vous le " + conflictingAppt.getStartDatetime().toLocalDate() +
                                        " à " + conflictingAppt.getStartDatetime().toLocalTime() +
                                        " avec " + conflictDoctorName + " (" + conflictSpecialty + ").");
                        req.setAttribute("oldAppointmentId", conflictingAppt.getId());

                        // Preserve edit state in modal
                        req.setAttribute("editAppointmentId", editAppointmentId);

                        forwardToView(req, resp, appointmentService, patient, sessionUser);
                        return;
                    }

                    // If user confirmed replacement, cancel the conflicting appointment then update
                    if ("confirm".equals(replaceAction) && oldAppointmentIdStr != null && !oldAppointmentIdStr.isEmpty()) {
                        Long conflictingId = Long.parseLong(oldAppointmentIdStr);
                        appointmentService.cancelAppointment(conflictingId, patient.getId());
                        req.setAttribute("successMessage", "L'autre rendez-vous a été annulé.");
                    }

                    // Update the appointment
                    appointment = appointmentService.updateAppointment(
                            editAppointmentId,
                            patient.getId(),
                            requestDTO.getDoctorId(),
                            start,
                            end,
                            type
                    );

                    String previousMsg = (String) req.getAttribute("successMessage");
                    req.setAttribute("successMessage",
                            (previousMsg != null ? previousMsg + " " : "") + "Rendez-vous modifié avec succès.");

                } else {
                    // CREATE MODE
                    List<Appointment> conflicts = appointmentService.findConflictingAppointments(patient.getId(), start, end);

                    if (!conflicts.isEmpty() && !"confirm".equals(replaceAction)) {
                        Appointment conflictingAppt = conflicts.get(0);
                        Doctor conflictDoctor = conflictingAppt.getDoctor();
                        String conflictSpecialty = conflictDoctor != null && conflictDoctor.getSpecialty() != null
                                ? conflictDoctor.getSpecialty().getName() : "autre spécialité";
                        String conflictDoctorName = conflictDoctor != null
                                ? conflictDoctor.getTitle() + " " + conflictDoctor.getLastName() : "médecin";

                        req.setAttribute("conflictWarning", true);
                        req.setAttribute("conflictMessage",
                                "Vous avez déjà un rendez-vous le " + conflictingAppt.getStartDatetime().toLocalDate() +
                                        " à " + conflictingAppt.getStartDatetime().toLocalTime() +
                                        " avec " + conflictDoctorName + " (" + conflictSpecialty + ").");
                        req.setAttribute("oldAppointmentId", conflictingAppt.getId());
                        forwardToView(req, resp, appointmentService, patient, sessionUser);
                        return;
                    }

                    if ("confirm".equals(replaceAction) && oldAppointmentIdStr != null) {
                        Long oldAppointmentId = Long.parseLong(oldAppointmentIdStr);
                        appointment = appointmentService.replaceAppointment(
                                oldAppointmentId,
                                patient.getId(),
                                requestDTO.getDoctorId(),
                                start,
                                end,
                                type
                        );
                        req.setAttribute("successMessage", "L'ancien rendez-vous a été annulé et le nouveau a été enregistré avec succès.");
                    } else {
                        appointment = appointmentService.createAppointment(
                                patient.getId(),
                                requestDTO.getDoctorId(),
                                start,
                                end,
                                type
                        );
                        req.setAttribute("successMessage", "Rendez-vous enregistré avec succès.");
                    }
                }

                AppointmentResponseDTO responseDTO = AppointmentMapper.toResponseDTO(appointment);
                req.setAttribute("createdAppointment", responseDTO);

                req.setAttribute("formDoctorId", null);
                req.setAttribute("formDate", null);
                req.setAttribute("formStartTime", null);
                req.setAttribute("formDuration", requestDTO.getDurationMinutes());
                req.setAttribute("formType", type.name());
            } catch (IllegalStateException conflict) {
                req.setAttribute("errorMessage", "Ce créneau vient d'être réservé, merci de choisir un autre horaire.");
            } catch (IllegalArgumentException validation) {
                req.setAttribute("errorMessage", validation.getMessage());
            }

            forwardToView(req, resp, appointmentService, patient, sessionUser);
        } finally {
            em.close();
        }
    }

    @Override
    public void destroy() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }

    private void forwardToView(HttpServletRequest req,
                               HttpServletResponse resp,
                               AppointmentService appointmentService,
                               Patient patient,
                               User sessionUser) throws ServletException, IOException {
        populateReferenceData(req, appointmentService, patient);
        req.setAttribute("patientEntity", patient);
        req.setAttribute("patientUser", sessionUser);
        req.setAttribute("todayDate", LocalDate.now().toString());
        req.getRequestDispatcher("/reserver.jsp").forward(req, resp);
    }

    private void forwardToViewdashboardPatient(HttpServletRequest req,
                                               HttpServletResponse resp,
                                               AppointmentService appointmentService,
                                               Patient patient,
                                               User sessionUser) throws ServletException, IOException {
        populateReferenceData(req, appointmentService, patient);
        req.setAttribute("patientEntity", patient);
        req.setAttribute("patientUser", sessionUser);
        req.setAttribute("todayDate", LocalDate.now().toString());
        req.getRequestDispatcher("/dashboard-patient.jsp").forward(req, resp);
    }

    private void populateReferenceData(HttpServletRequest req,
                                       AppointmentService appointmentService,
                                       Patient patient) {
        List<DoctorSummaryDTO> doctorSummaries = mapDoctors(appointmentService.listDoctors());
        List<AvailabilityDTO> availabilityDTOs = appointmentService.listAllAvailabilities().stream()
                .map(AppointmentMapper::toAvailabilityDTO)
                .collect(Collectors.toList());
        List<AppointmentResponseDTO> appointmentDTOs = appointmentService
                .getUpcomingAppointmentsForPatient(patient.getId())
                .stream()
                .map(AppointmentMapper::toResponseDTO)
                .collect(Collectors.toList());

        Set<Long> existingDoctorIds = new HashSet<>();
        for (AppointmentResponseDTO appointment : appointmentDTOs) {
            if (appointment.getDoctorId() != null) {
                existingDoctorIds.add(appointment.getDoctorId());
            }
        }

        // Add inactive doctors from existing appointments
        for (Long doctorId : existingDoctorIds) {
            Doctor doctor = appointmentService.getDoctorByIdIncludingInactive(doctorId);
            if (doctor != null && doctorSummaries.stream().noneMatch(d -> d.getId().equals(doctorId))) {
                // Doctor is not in the active list, add it
                Random random = new Random(42);
                String color = COLOR_PALETTE[random.nextInt(COLOR_PALETTE.length)];
                DoctorSummaryDTO inactiveDoctor = AppointmentMapper.toDoctorSummary(doctor, color);
                doctorSummaries.add(inactiveDoctor);
                System.out.println("Added inactive doctor for editing: " + doctor.getFirstName() + " " + doctor.getLastName() + " - " + (doctor.getSpecialty() != null ? doctor.getSpecialty().getName() : "No specialty"));
            }
        }

        String editId = req.getParameter("edit");
        boolean isEditMode = editId != null && !editId.trim().isEmpty();
        
        List<org.example.clinique.dto.AvailabilityTimeSlotsDTO> allAvailabilitiesWithSlots = new ArrayList<>();
        for (DoctorSummaryDTO doctor : doctorSummaries) {
            List<org.example.clinique.dto.AvailabilityTimeSlotsDTO> doctorAvailabilities =
                    appointmentService.getAllAvailabilityTimeSlotsForDoctor(doctor.getId(), isEditMode);
            if (doctorAvailabilities != null && !doctorAvailabilities.isEmpty()) {
                allAvailabilitiesWithSlots.addAll(doctorAvailabilities);
            }
        }
        
        // In edit mode, if we have appointments but no availabilities, generate default time slots
        if (isEditMode && !appointmentDTOs.isEmpty()) {
            for (AppointmentResponseDTO appointment : appointmentDTOs) {
                if (appointment.getDoctorId() != null) {
                    // Check if we already have availabilities for this doctor
                    boolean hasAvailabilities = allAvailabilitiesWithSlots.stream()
                            .anyMatch(avail -> avail.getDoctorId().equals(appointment.getDoctorId()));
                    
                    if (!hasAvailabilities) {
                        // Generate default time slots for this doctor on the appointment date
                        org.example.clinique.dto.AvailabilityTimeSlotsDTO defaultAvailability = 
                                generateDefaultAvailabilityForEdit(appointment);
                        if (defaultAvailability != null) {
                            allAvailabilitiesWithSlots.add(defaultAvailability);
                            System.out.println("Generated default availability for doctor " + appointment.getDoctorId() + " on date " + appointment.getStart());
                        }
                    }
                }
            }
        }

        System.out.println("Total doctors available: " + doctorSummaries.size());
        System.out.println("Doctors specialties: " + doctorSummaries.stream().map(d -> d.getSpecialty()).collect(java.util.stream.Collectors.toList()));
        
        req.setAttribute("doctorSummaries", doctorSummaries);
        req.setAttribute("availabilityDTOs", availabilityDTOs);
        req.setAttribute("appointmentDTOs", appointmentDTOs);
        req.setAttribute("allAvailabilitiesWithSlots", allAvailabilitiesWithSlots);
        req.setAttribute("appointmentTypes", AppointmentType.values());
        req.setAttribute("availabilityJson", buildAvailabilityJson(availabilityDTOs));
        req.setAttribute("doctorsJson", buildDoctorsJson(doctorSummaries));
        req.setAttribute("appointmentsJson", buildAppointmentsJson(appointmentDTOs));
        req.setAttribute("nextAvailabilitiesJson", buildAvailabilityTimeSlotsJson(allAvailabilitiesWithSlots));
    }

    private List<DoctorSummaryDTO> mapDoctors(List<Doctor> doctors) {
        List<DoctorSummaryDTO> list = new ArrayList<>();
        Random random = new Random(42);
        for (Doctor doctor : doctors) {
            String color = COLOR_PALETTE[random.nextInt(COLOR_PALETTE.length)];
            list.add(AppointmentMapper.toDoctorSummary(doctor, color));
        }
        return list;
    }

    private String buildAvailabilityJson(List<AvailabilityDTO> availabilities) {
        StringBuilder builder = new StringBuilder();
        builder.append('[');
        boolean first = true;
        for (AvailabilityDTO availability : availabilities) {
            if (availability == null) {
                continue;
            }
            if (!first) {
                builder.append(',');
            }
            builder.append('{');
            builder.append("\"id\":").append(availability.getId() != null ? availability.getId() : "null");
            builder.append(',');
            builder.append("\"doctorId\":").append(availability.getDoctorId() != null ? availability.getDoctorId() : "null");
            builder.append(',');
            builder.append("\"availabilityDate\":").append(availability.getAvailabilityDate() != null ? "\"" + escapeJson(availability.getAvailabilityDate()) + "\"" : "null");
            builder.append(',');
            builder.append("\"dayOfWeek\":\"").append(escapeJson(availability.getDayOfWeek())).append('\"');
            builder.append(',');
            builder.append("\"startTime\":\"").append(escapeJson(availability.getStartTime())).append('\"');
            builder.append(',');
            builder.append("\"endTime\":\"").append(escapeJson(availability.getEndTime())).append('\"');
            builder.append(',');
            builder.append("\"status\":\"").append(escapeJson(availability.getStatus())).append('\"');
            builder.append('}');
            first = false;
        }
        builder.append(']');
        return builder.toString();
    }

    private String buildDoctorsJson(List<DoctorSummaryDTO> doctors) {
        StringBuilder builder = new StringBuilder();
        builder.append('[');
        boolean first = true;
        for (DoctorSummaryDTO doctor : doctors) {
            if (doctor == null) {
                continue;
            }
            if (!first) {
                builder.append(',');
            }
            builder.append('{');
            builder.append("\"id\":").append(doctor.getId() != null ? doctor.getId() : "null");
            builder.append(',');
            builder.append("\"fullName\":\"").append(escapeJson(doctor.getFullName())).append('\"');
            builder.append(',');
            builder.append("\"specialty\":\"").append(escapeJson(doctor.getSpecialty())).append('\"');
            builder.append(',');
            builder.append("\"initials\":\"").append(escapeJson(doctor.getInitials())).append('\"');
            builder.append(',');
            builder.append("\"color\":\"").append(escapeJson(doctor.getColor())).append('\"');
            builder.append('}');
            first = false;
        }
        builder.append(']');
        return builder.toString();
    }

    private String buildAppointmentsJson(List<AppointmentResponseDTO> appointments) {
        StringBuilder builder = new StringBuilder();
        builder.append('[');
        boolean first = true;
        for (AppointmentResponseDTO appointment : appointments) {
            if (appointment == null) {
                continue;
            }
            if (!first) {
                builder.append(',');
            }
            builder.append('{');
            builder.append("\"id\":").append(appointment.getId() != null ? appointment.getId() : "null");
            builder.append(',');
            builder.append("\"doctorId\":").append(appointment.getDoctorId() != null ? appointment.getDoctorId() : "null");
            builder.append(',');
            builder.append("\"doctorName\":\"").append(escapeJson(appointment.getDoctorName() != null ? appointment.getDoctorName() : "")).append('\"');
            builder.append(',');
            builder.append("\"doctorSpecialty\":\"").append(escapeJson(appointment.getDoctorSpecialty() != null ? appointment.getDoctorSpecialty() : "")).append('\"');
            builder.append(',');
            builder.append("\"start\":\"").append(escapeJson(appointment.getStart())).append('\"');
            builder.append(',');
            builder.append("\"end\":\"").append(escapeJson(appointment.getEnd())).append('\"');
            builder.append(',');
            builder.append("\"status\":\"").append(escapeJson(appointment.getStatus() != null ? appointment.getStatus() : "confirmed")).append('\"');
            builder.append(',');
            builder.append("\"appointmentType\":\"").append(escapeJson(appointment.getAppointmentType() != null ? appointment.getAppointmentType() : "Consultation")).append('\"');
            builder.append('}');
            first = false;
        }
        builder.append(']');
        return builder.toString();
    }

    private String buildAvailabilityTimeSlotsJson(List<org.example.clinique.dto.AvailabilityTimeSlotsDTO> availabilitiesWithSlots) {
        StringBuilder builder = new StringBuilder();
        builder.append('[');
        boolean first = true;

        for (org.example.clinique.dto.AvailabilityTimeSlotsDTO dto : availabilitiesWithSlots) {
            if (dto == null) continue;

            if (!first) builder.append(',');
            builder.append('{');
            builder.append("\"doctorId\":").append(dto.getDoctorId() != null ? dto.getDoctorId() : "null");
            builder.append(',');
            builder.append("\"doctorName\":\"").append(escapeJson(dto.getDoctorName())).append('\"');
            builder.append(',');
            builder.append("\"availabilityDate\":\"").append(escapeJson(dto.getAvailabilityDate())).append('\"');
            builder.append(',');
            builder.append("\"startTime\":\"").append(escapeJson(dto.getStartTime())).append('\"');
            builder.append(',');
            builder.append("\"endTime\":\"").append(escapeJson(dto.getEndTime())).append('\"');
            builder.append(',');
            builder.append("\"timeSlots\":[");

            boolean firstSlot = true;
            if (dto.getTimeSlots() != null) {
                for (String timeSlot : dto.getTimeSlots()) {
                    if (!firstSlot) builder.append(',');
                    builder.append('"').append(escapeJson(timeSlot)).append('"');
                    firstSlot = false;
                }
            }

            builder.append(']');
            builder.append('}');
            first = false;
        }

        builder.append(']');
        return builder.toString();
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
    
    private org.example.clinique.dto.AvailabilityTimeSlotsDTO generateDefaultAvailabilityForEdit(AppointmentResponseDTO appointment) {
        if (appointment.getStart() == null || appointment.getDoctorId() == null) {
            return null;
        }
        
        try {
            // Parse the appointment start time
            java.time.LocalDateTime startDateTime = java.time.LocalDateTime.parse(appointment.getStart());
            java.time.LocalDate appointmentDate = startDateTime.toLocalDate();
            
            // Generate time slots from 8:00 to 18:00 (typical working hours)
            java.time.LocalTime startTime = java.time.LocalTime.of(8, 0);
            java.time.LocalTime endTime = java.time.LocalTime.of(18, 0);
            
            java.util.List<String> timeSlots = new java.util.ArrayList<>();
            java.time.LocalTime currentTime = startTime;
            
            while (currentTime.isBefore(endTime)) {
                timeSlots.add(currentTime.toString().substring(0, 5)); // Format HH:MM
                currentTime = currentTime.plusMinutes(30); // 30-minute slots
            }
            
            // Get doctor name from appointment
            String doctorName = appointment.getDoctorName() != null ? appointment.getDoctorName() : "Médecin";
            
            return new org.example.clinique.dto.AvailabilityTimeSlotsDTO(
                appointment.getDoctorId(),
                doctorName,
                appointmentDate.toString(),
                startTime.toString(),
                endTime.toString(),
                timeSlots
            );
        } catch (Exception e) {
            System.err.println("Error generating default availability: " + e.getMessage());
            return null;
        }
    }
}