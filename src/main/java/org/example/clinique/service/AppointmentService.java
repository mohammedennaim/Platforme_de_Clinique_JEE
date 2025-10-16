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

    public List<Appointment> getUpcomingAppointmentsForPatient(Long patientId, int limit) {
        return appointmentRepository.findUpcomingByPatient(patientId, LocalDateTime.now(), limit);
    }

    public List<Doctor> listDoctors() {
        return doctorRepository.findAll();
    }

    /**
     * Retourne la prochaine disponibilité du médecin avec ses créneaux horaires (time slots)
     * Chaque créneau dure 30 minutes avec 5 minutes de pause (total 35 minutes entre chaque)
     */
    public org.example.clinique.dto.AvailabilityTimeSlotsDTO getNextAvailabilityForDoctor(Long doctorId) {
        if (doctorId == null) {
            return null;
        }

        Optional<Availability> availabilityOpt = availabilityRepository.findAvailabilityByDoctor(doctorId);
        
        if (availabilityOpt.isPresent()) {
            return org.example.clinique.mapper.AppointmentMapper.toAvailabilityTimeSlotsDTO(availabilityOpt.get());
        }
        
        return null;
    }
    
    /**
     * Retourne toutes les disponibilités du médecin avec leurs créneaux horaires (time slots)
     */
    public List<org.example.clinique.dto.AvailabilityTimeSlotsDTO> getAllAvailabilityTimeSlotsForDoctor(Long doctorId) {
        if (doctorId == null) {
            return List.of();
        }

        List<Availability> availabilities = availabilityRepository.findAvailabilitiesByDoctor(doctorId);
        List<org.example.clinique.dto.AvailabilityTimeSlotsDTO> result = new java.util.ArrayList<>();
        
        for (Availability availability : availabilities) {
            if (availability.getAvailabilityDate() == null || 
                availability.getStartTime() == null || 
                availability.getEndTime() == null) {
                continue;
            }
            
            org.example.clinique.dto.AvailabilityTimeSlotsDTO dto = 
                org.example.clinique.mapper.AppointmentMapper.toAvailabilityTimeSlotsDTO(availability);
            
            if (dto != null) {
                result.add(dto);
            }
        }
        
        return result;
    }

    public List<Availability> listAllAvailabilities() {
        return availabilityRepository.findAllActive();
    }
}
