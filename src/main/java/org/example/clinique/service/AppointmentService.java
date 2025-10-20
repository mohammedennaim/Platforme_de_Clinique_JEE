package org.example.clinique.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import org.example.clinique.entity.Appointment;
import org.example.clinique.entity.Availability;
import org.example.clinique.entity.Doctor;
import org.example.clinique.entity.Patient;
import org.example.clinique.entity.enums.AppointmentStatus;
import org.example.clinique.entity.enums.AppointmentType;
import org.example.clinique.repository.AppointmentRepository;
import org.example.clinique.repository.AvailabilityRepository;
import org.example.clinique.repository.DoctorRepository;
import org.example.clinique.repository.PatientRepository;
import org.example.clinique.dto.AvailabilityTimeSlotsDTO;
import org.example.clinique.mapper.AppointmentMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class AppointmentService {

    private final EntityManager em;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AvailabilityRepository availabilityRepository;

    public AppointmentService(EntityManager em) {
        this.em = em;
        this.appointmentRepository = new AppointmentRepository(em);
        this.doctorRepository = new DoctorRepository(em);
        this.patientRepository = new PatientRepository(em);
        this.availabilityRepository = new AvailabilityRepository(em);
    }

    public Appointment createAppointment(Long patientId,
                                         Long doctorId,
                                         LocalDateTime start,
                                         LocalDateTime end,
                                         AppointmentType type) {
        if (patientId == null) {
            throw new IllegalArgumentException("Patient introuvable");
        }
        if (doctorId == null) {
            throw new IllegalArgumentException("Veuillez sélectionner un médecin");
        }
        if (start == null || end == null) {
            throw new IllegalArgumentException("La plage horaire doit être renseignée");
        }
        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("L'heure de fin doit être postérieure à l'heure de début");
        }

        Doctor doctor = doctorRepository.findById(doctorId);
        if (doctor == null) {
            throw new IllegalArgumentException("Médecin introuvable");
        }

        Patient patient = patientRepository.findById(patientId);
        if (patient == null) {
            throw new IllegalArgumentException("Patient introuvable");
        }

        if (appointmentRepository.existsOverlappingAppointment(doctorId, start, end)) {
            throw new IllegalStateException("Ce créneau est déjà réservé");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setStartDatetime(start);
        appointment.setEndDatetime(end);
        appointment.setAppointmentType(type != null ? type : AppointmentType.CONSULTATION);
        appointment.setStatus(AppointmentStatus.PLANNED);
        appointment.setCreatedAt(LocalDateTime.now());

        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            appointmentRepository.save(appointment);
            tx.commit();
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        }
        return appointment;
    }

    public List<Appointment> getUpcomingAppointmentsForPatient(Long patientId) {
        return appointmentRepository.findUpcomingByPatient(patientId, LocalDateTime.now());
    }

    public List<Appointment> getUpcomingAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findUpcomingByDoctor(doctorId, LocalDateTime.now());
    }

    public List<Doctor> listDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long doctorId) {
        return doctorRepository.findById(doctorId);
    }

    public Doctor getDoctorByIdIncludingInactive(Long doctorId) {
        return doctorRepository.findByIdIncludingInactive(doctorId);
    }

    public AvailabilityTimeSlotsDTO getNextAvailabilityForDoctor(Long doctorId) {
        if (doctorId == null) {
            return null;
        }

        Optional<Availability> availabilityOpt = availabilityRepository.findAvailabilityByDoctor(doctorId);

        if (availabilityOpt.isPresent()) {
            Availability availability = availabilityOpt.get();
            List<Appointment> appointments = appointmentRepository.findByDoctorAndDate(
                    doctorId,
                    availability.getAvailabilityDate()
            );
            return AppointmentMapper.toAvailabilityTimeSlotsDTO(
                    availability,
                    appointments
            );
        }

        return null;
    }

    public List<AvailabilityTimeSlotsDTO> getAllAvailabilityTimeSlotsForDoctor(Long doctorId) {
        return getAllAvailabilityTimeSlotsForDoctor(doctorId, false);
    }
    
    public List<AvailabilityTimeSlotsDTO> getAllAvailabilityTimeSlotsForDoctor(Long doctorId, boolean isEditMode) {
        if (doctorId == null) {
            return List.of();
        }

        System.out.println("getAllAvailabilityTimeSlotsForDoctor called for doctor " + doctorId + ", editMode: " + isEditMode);

        List<Availability> availabilities = availabilityRepository.findAvailabilitiesByDoctor(doctorId);
        System.out.println("Found " + availabilities.size() + " availabilities for doctor " + doctorId);
        
        List<AvailabilityTimeSlotsDTO> result = new java.util.ArrayList<>();

        for (Availability availability : availabilities) {
            if (availability.getStartTime() == null || availability.getEndTime() == null) {
                System.out.println("Skipping availability with null time fields: startTime=" + availability.getStartTime() + 
                                 ", endTime=" + availability.getEndTime());
                continue;
            }

            System.out.println("Processing availability: date=" + availability.getAvailabilityDate() + 
                             ", startTime=" + availability.getStartTime() + ", endTime=" + availability.getEndTime());

            // For recurring availabilities (date is null), we need to handle them differently
            if (availability.getAvailabilityDate() == null) {
                // This is a recurring availability, we'll use it for any date
                System.out.println("Processing recurring availability");
                
                AvailabilityTimeSlotsDTO dto = AppointmentMapper.toAvailabilityTimeSlotsDTO(
                        availability,
                        new java.util.ArrayList<>(), // No appointments for recurring availability
                        isEditMode
                );

                if (dto != null) {
                    System.out.println("Generated recurring DTO with " + (dto.getTimeSlots() != null ? dto.getTimeSlots().size() : 0) + " time slots");
                    result.add(dto);
                }
            } else {
                // This is a specific date availability
                List<Appointment> appointments = appointmentRepository.findByDoctorAndDate(
                        doctorId,
                        availability.getAvailabilityDate()
                );
                
                System.out.println("Found " + appointments.size() + " appointments for this date");

                AvailabilityTimeSlotsDTO dto = AppointmentMapper.toAvailabilityTimeSlotsDTO(
                        availability,
                        appointments,
                        isEditMode
                );

                if (dto != null) {
                    System.out.println("Generated DTO with " + (dto.getTimeSlots() != null ? dto.getTimeSlots().size() : 0) + " time slots");
                    result.add(dto);
                } else {
                    System.out.println("Failed to generate DTO for availability");
                }
            }
        }

        // If no availabilities found and we're in edit mode, create a default one
        if (result.isEmpty() && isEditMode) {
            System.out.println("No availabilities found for doctor " + doctorId + " in edit mode, creating default availability");
            
            // Create a default availability for today
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalTime startTime = java.time.LocalTime.of(8, 0);
            java.time.LocalTime endTime = java.time.LocalTime.of(18, 0);
            
            // Generate time slots
            java.util.List<String> timeSlots = new java.util.ArrayList<>();
            java.time.LocalTime currentTime = startTime;
            while (currentTime.isBefore(endTime)) {
                timeSlots.add(currentTime.toString().substring(0, 5));
                currentTime = currentTime.plusMinutes(30);
            }
            
            // Get doctor name
            Doctor doctor = doctorRepository.findById(doctorId);
            String doctorName = doctor != null ? 
                (doctor.getTitle() != null ? doctor.getTitle() + " " : "") + 
                doctor.getFirstName() + " " + doctor.getLastName() : "Médecin";
            
            org.example.clinique.dto.AvailabilityTimeSlotsDTO defaultAvailability = 
                new org.example.clinique.dto.AvailabilityTimeSlotsDTO(
                    doctorId,
                    doctorName,
                    today.toString(),
                    startTime.toString(),
                    endTime.toString(),
                    timeSlots
                );
            
            result.add(defaultAvailability);
            System.out.println("Created default availability with " + timeSlots.size() + " time slots");
        }

        System.out.println("Returning " + result.size() + " availability DTOs for doctor " + doctorId);
        return result;
    }

    public List<Availability> listAllAvailabilities() {
        return availabilityRepository.findAllActive();
    }

    /**
     * Check if patient has conflicting appointments in the same time slot
     */
    public List<Appointment> findConflictingAppointments(Long patientId, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findConflictingAppointmentsForPatient(patientId, start, end);
    }

    /**
     * NEW: conflicts for patient excluding a given appointment (for edit)
     */
    public List<Appointment> findConflictingAppointmentsExcluding(Long patientId, LocalDateTime start, LocalDateTime end, Long excludeAppointmentId) {
        return appointmentRepository.findConflictingAppointmentsForPatientExcluding(patientId, start, end, excludeAppointmentId);
    }

    /**
     * Update an existing appointment
     */
    public Appointment updateAppointment(Long appointmentId, Long patientId, Long doctorId,
                                         LocalDateTime start, LocalDateTime end, AppointmentType type) {
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();

            // Find existing appointment
            Appointment existingAppointment = appointmentRepository.findById(appointmentId);
            if (existingAppointment == null) {
                throw new IllegalArgumentException("Rendez-vous introuvable");
            }

            // Verify patient ownership
            if (!existingAppointment.getPatient().getId().equals(patientId)) {
                throw new IllegalArgumentException("Vous ne pouvez modifier que vos propres rendez-vous");
            }

            // Check if appointment can be modified (not in the past, not completed)
            if (existingAppointment.getStartDatetime().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Impossible de modifier un rendez-vous passé");
            }

            if (existingAppointment.getStatus() == AppointmentStatus.DONE) {
                throw new IllegalArgumentException("Impossible de modifier un rendez-vous terminé");
            }

            // Validate new doctor
            Doctor doctor = doctorRepository.findById(doctorId);
            if (doctor == null) {
                throw new IllegalArgumentException("Médecin introuvable");
            }

            // Check for overlapping appointments (excluding current appointment)
            if (appointmentRepository.existsOverlappingAppointmentExcluding(doctorId, start, end, appointmentId)) {
                throw new IllegalStateException("Ce créneau est déjà réservé");
            }

            // Update appointment
            existingAppointment.setDoctor(doctor);
            existingAppointment.setStartDatetime(start);
            existingAppointment.setEndDatetime(end);
            existingAppointment.setAppointmentType(type != null ? type : AppointmentType.CONSULTATION);
            existingAppointment.setStatus(AppointmentStatus.PLANNED);

            appointmentRepository.save(existingAppointment);

            tx.commit();
            return existingAppointment;
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        }
    }

    /**
     * Cancel an existing appointment and create a new one
     */
    public Appointment replaceAppointment(Long oldAppointmentId, Long patientId, Long doctorId,
                                          LocalDateTime start, LocalDateTime end, AppointmentType type) {
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();

            // Cancel old appointment
            appointmentRepository.cancelAppointment(oldAppointmentId);

            // Create new appointment (without transaction since we're already in one)
            Doctor doctor = doctorRepository.findById(doctorId);
            if (doctor == null) {
                throw new IllegalArgumentException("Médecin introuvable");
            }

            Patient patient = patientRepository.findById(patientId);
            if (patient == null) {
                throw new IllegalArgumentException("Patient introuvable");
            }

            if (appointmentRepository.existsOverlappingAppointment(doctorId, start, end)) {
                throw new IllegalStateException("Ce créneau est déjà réservé");
            }

            Appointment appointment = new Appointment();
            appointment.setDoctor(doctor);
            appointment.setPatient(patient);
            appointment.setStartDatetime(start);
            appointment.setEndDatetime(end);
            appointment.setAppointmentType(type != null ? type : AppointmentType.CONSULTATION);
            appointment.setStatus(AppointmentStatus.PLANNED);
            appointment.setCreatedAt(LocalDateTime.now());

            appointmentRepository.save(appointment);

            tx.commit();
            return appointment;
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        }
    }

    /**
     * NEW: Cancel appointment transactionally with ownership checks
     */
    public void cancelAppointment(Long appointmentId, Long patientId) {
        EntityTransaction tx = em.getTransaction();
        try {
            tx.begin();
            Appointment appt = appointmentRepository.findById(appointmentId);
            if (appt == null) {
                throw new IllegalArgumentException("Rendez-vous introuvable");
            }
            if (!appt.getPatient().getId().equals(patientId)) {
                throw new IllegalArgumentException("Vous ne pouvez annuler que vos propres rendez-vous");
            }
            if (appt.getStatus() == AppointmentStatus.DONE) {
                throw new IllegalArgumentException("Impossible d'annuler un rendez-vous terminé");
            }
            appointmentRepository.cancelAppointment(appointmentId);
            tx.commit();
        } catch (RuntimeException e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            throw e;
        }
    }
}