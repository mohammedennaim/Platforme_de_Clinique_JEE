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
import org.example.clinique.entity.Patient;
import org.example.clinique.entity.User;
import org.example.clinique.entity.enums.AppointmentType;
import org.example.clinique.entity.enums.Role;
import org.example.clinique.mapper.AppointmentMapper;
import org.example.clinique.repository.PatientRepository;
import org.example.clinique.service.AppointmentService;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.stream.Collectors;

public class AppointmentServlet extends HttpServlet {

    private EntityManagerFactory emf;
    private static final String[] COLOR_PALETTE = {
            "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#0ea5e9"
    };

    @Override
    public void init() {
        emf = Persistence.createEntityManagerFactory("cliniquePU");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false);
        if (session == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            writeJson(resp.getWriter(), "{\"error\":\"Session expirée\"}");
            return;
        }

        User sessionUser = (User) session.getAttribute("user");
        String email = (String) session.getAttribute("userEmail");
        if (sessionUser == null || email == null || sessionUser.getRole() != Role.PATIENT) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            writeJson(resp.getWriter(), "{\"error\":\"Accès refusé\"}");
            return;
        }

        EntityManager em = emf.createEntityManager();
        try {
            AppointmentService appointmentService = new AppointmentService(em);
            PatientRepository patientRepository = new PatientRepository(em);
            Patient patient = patientRepository.findByEmail(email);
            if (patient == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                writeJson(resp.getWriter(), "{\"error\":\"Patient introuvable\"}");
                return;
            }

            List<DoctorSummaryDTO> doctorDTOs = mapDoctors(appointmentService.listDoctors());
            List<AvailabilityDTO> availabilityDTOs = appointmentService.listAllAvailabilities()
                    .stream()
                    .map(AppointmentMapper::toAvailabilityDTO)
                    .collect(Collectors.toList());
            List<AppointmentResponseDTO> appointmentDTOs = appointmentService
                    .getUpcomingAppointmentsForPatient(patient.getId(), 20)
                    .stream()
                    .map(AppointmentMapper::toResponseDTO)
                    .collect(Collectors.toList());

            String json = buildAppointmentsPayload(doctorDTOs, availabilityDTOs, appointmentDTOs);
            writeJson(resp.getWriter(), json);
        } finally {
            em.close();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        HttpSession session = req.getSession(false);
        if (session == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            writeJson(resp.getWriter(), "{\"error\":\"Session expirée\"}");
            return;
        }

        User sessionUser = (User) session.getAttribute("user");
        String email = (String) session.getAttribute("userEmail");
        if (sessionUser == null || email == null || sessionUser.getRole() != Role.PATIENT) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            writeJson(resp.getWriter(), "{\"error\":\"Accès refusé\"}");
            return;
        }

        req.setCharacterEncoding("UTF-8");
        AppointmentRequestDTO requestDTO = AppointmentRequestDTO.fromParameters(
                req.getParameter("doctorId"),
                req.getParameter("appointmentDate"),
                req.getParameter("startTime"),
                req.getParameter("duration"),
                req.getParameter("appointmentType")
        );

        if (requestDTO.getDoctorId() == null || requestDTO.getAppointmentDate() == null || requestDTO.getStartTime() == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeJson(resp.getWriter(), "{\"error\":\"Merci de renseigner tous les champs obligatoires\"}");
            return;
        }

        EntityManager em = emf.createEntityManager();
        try {
            PatientRepository patientRepository = new PatientRepository(em);
            Patient patient = patientRepository.findByEmail(email);
            if (patient == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                writeJson(resp.getWriter(), "{\"error\":\"Patient introuvable\"}");
                return;
            }

            LocalDateTime start = requestDTO.toStartDateTime();
            LocalDateTime end = requestDTO.toEndDateTime();
            if (start == null || end == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                writeJson(resp.getWriter(), "{\"error\":\"Créneau invalide\"}");
                return;
            }

            if (start.isBefore(LocalDateTime.now())) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                writeJson(resp.getWriter(), "{\"error\":\"Impossible de réserver un créneau passé\"}");
                return;
            }

            AppointmentType type;
            try {
                type = requestDTO.getAppointmentType() != null
                        ? AppointmentType.valueOf(requestDTO.getAppointmentType().toUpperCase(Locale.ROOT))
                        : AppointmentType.CONSULTATION;
            } catch (IllegalArgumentException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                writeJson(resp.getWriter(), "{\"error\":\"Type de rendez-vous invalide\"}");
                return;
            }

            AppointmentService appointmentService = new AppointmentService(em);
            AppointmentResponseDTO dto;
            try {
                dto = AppointmentMapper.toResponseDTO(
                        appointmentService.createAppointment(patient.getId(), requestDTO.getDoctorId(), start, end, type)
                );
            } catch (IllegalStateException conflict) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                writeJson(resp.getWriter(), "{\"error\":\"Ce créneau vient d'être réservé, merci de choisir un autre horaire\"}");
                return;
            } catch (IllegalArgumentException validation) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                writeJson(resp.getWriter(), "{\"error\":\"" + escapeJson(validation.getMessage()) + "\"}");
                return;
            }

            resp.setStatus(HttpServletResponse.SC_CREATED);
            writeJson(resp.getWriter(), buildSingleAppointmentPayload(dto));
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

    private List<DoctorSummaryDTO> mapDoctors(List<org.example.clinique.entity.Doctor> doctors) {
        List<DoctorSummaryDTO> list = new ArrayList<>();
        Random random = new Random(42);
        for (org.example.clinique.entity.Doctor doctor : doctors) {
            String color = COLOR_PALETTE[random.nextInt(COLOR_PALETTE.length)];
            list.add(AppointmentMapper.toDoctorSummary(doctor, color));
        }
        return list;
    }

    private String buildAppointmentsPayload(List<DoctorSummaryDTO> doctors,
                                            List<AvailabilityDTO> availabilities,
                                            List<AppointmentResponseDTO> appointments) {
        StringBuilder builder = new StringBuilder();
        builder.append('{');
        builder.append("\"doctors\":");
        appendDoctorArray(builder, doctors);
        builder.append(',');
        builder.append("\"availabilities\":");
        appendAvailabilityArray(builder, availabilities);
        builder.append(',');
        builder.append("\"appointments\":");
        appendAppointmentArray(builder, appointments);
        builder.append('}');
        return builder.toString();
    }

    private String buildSingleAppointmentPayload(AppointmentResponseDTO appointment) {
        StringBuilder builder = new StringBuilder();
        builder.append('{');
        builder.append("\"appointment\":");
        appendAppointment(builder, appointment);
        builder.append('}');
        return builder.toString();
    }

    private void appendDoctorArray(StringBuilder builder, List<DoctorSummaryDTO> doctors) {
        builder.append('[');
        for (int i = 0; i < doctors.size(); i++) {
            if (i > 0) {
                builder.append(',');
            }
            appendDoctor(builder, doctors.get(i));
        }
        builder.append(']');
    }

    private void appendAvailabilityArray(StringBuilder builder, List<AvailabilityDTO> availabilities) {
        builder.append('[');
        for (int i = 0; i < availabilities.size(); i++) {
            if (i > 0) {
                builder.append(',');
            }
            appendAvailability(builder, availabilities.get(i));
        }
        builder.append(']');
    }

    private void appendAppointmentArray(StringBuilder builder, List<AppointmentResponseDTO> appointments) {
        builder.append('[');
        for (int i = 0; i < appointments.size(); i++) {
            if (i > 0) {
                builder.append(',');
            }
            appendAppointment(builder, appointments.get(i));
        }
        builder.append(']');
    }

    private void appendDoctor(StringBuilder builder, DoctorSummaryDTO doctor) {
        builder.append('{');
        builder.append("\"id\":").append(doctor.getId());
        builder.append(',');
        builder.append("\"fullName\":\"").append(escapeJson(doctor.getFullName())).append("\"");
        builder.append(',');
        builder.append("\"specialty\":\"").append(escapeJson(doctor.getSpecialty())).append("\"");
        builder.append(',');
        builder.append("\"initials\":\"").append(escapeJson(doctor.getInitials())).append("\"");
        builder.append(',');
        builder.append("\"color\":\"").append(escapeJson(doctor.getColor())).append("\"");
        builder.append('}');
    }

    private void appendAvailability(StringBuilder builder, AvailabilityDTO availability) {
        builder.append('{');
        builder.append("\"id\":").append(availability.getId());
        builder.append(',');
        builder.append("\"doctorId\":").append(availability.getDoctorId());
        builder.append(',');
        builder.append("\"dayOfWeek\":\"").append(escapeJson(availability.getDayOfWeek())).append("\"");
        builder.append(',');
        builder.append("\"startTime\":\"").append(escapeJson(availability.getStartTime())).append("\"");
        builder.append(',');
        builder.append("\"endTime\":\"").append(escapeJson(availability.getEndTime())).append("\"");
        builder.append(',');
        builder.append("\"status\":\"").append(escapeJson(availability.getStatus())).append("\"");
        builder.append('}');
    }

    private void appendAppointment(StringBuilder builder, AppointmentResponseDTO appointment) {
        builder.append('{');
        builder.append("\"id\":").append(appointment.getId());
        builder.append(',');
        builder.append("\"doctorId\":").append(appointment.getDoctorId());
        builder.append(',');
        builder.append("\"doctorName\":\"").append(escapeJson(appointment.getDoctorName())).append("\"");
        builder.append(',');
        builder.append("\"doctorSpecialty\":\"").append(escapeJson(appointment.getDoctorSpecialty())).append("\"");
        builder.append(',');
        builder.append("\"start\":\"").append(escapeJson(appointment.getStart())).append("\"");
        builder.append(',');
        builder.append("\"end\":\"").append(escapeJson(appointment.getEnd())).append("\"");
        builder.append(',');
        builder.append("\"status\":\"").append(escapeJson(appointment.getStatus())).append("\"");
        builder.append(',');
        builder.append("\"appointmentType\":\"").append(escapeJson(appointment.getAppointmentType())).append("\"");
        builder.append('}');
    }

    private void writeJson(PrintWriter writer, String payload) {
        writer.write(payload);
        writer.flush();
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
}
