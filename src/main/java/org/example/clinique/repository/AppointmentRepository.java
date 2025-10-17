package org.example.clinique.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.example.clinique.entity.Appointment;

import java.time.LocalDateTime;
import java.util.List;

public class AppointmentRepository {

    private final EntityManager em;

    public AppointmentRepository(EntityManager em) {
        this.em = em;
    }

    public void save(Appointment appointment) {
        if (appointment.getId() == null) {
            em.persist(appointment);
        } else {
            em.merge(appointment);
        }
    }

    public List<Appointment> findUpcomingByPatient(Long patientId, LocalDateTime from) {
        TypedQuery<Appointment> query = em.createQuery(
                "SELECT a FROM Appointment a " +
                        "WHERE a.patient.id = :patientId AND a.startDatetime >= :from " +
                        "ORDER BY a.startDatetime ASC",
                Appointment.class
        );
        query.setParameter("patientId", patientId);
        query.setParameter("from", from);
        return query.getResultList();
    }

    public List<Appointment> findUpcomingByDoctor(Long doctorId, LocalDateTime from) {
        TypedQuery<Appointment> query = em.createQuery(
                "SELECT a FROM Appointment a " +
                        "WHERE a.doctor.id = :doctorId AND a.startDatetime >= :from " +
                        "ORDER BY a.startDatetime ASC",
                Appointment.class
        );
        query.setParameter("doctorId", doctorId);
        query.setParameter("from", from);
        return query.getResultList();
    }

    public boolean existsOverlappingAppointment(Long doctorId, LocalDateTime start, LocalDateTime end) {
        Long count = em.createQuery(
                        "SELECT COUNT(a) FROM Appointment a " +
                                "WHERE a.doctor.id = :doctorId " +
                                "AND a.startDatetime < :end " +
                                "AND a.endDatetime > :start",
                        Long.class)
                .setParameter("doctorId", doctorId)
                .setParameter("start", start)
                .setParameter("end", end)
                .getSingleResult();
        return count != null && count > 0;
    }

    public List<Appointment> findByDoctorAndDate(Long doctorId, java.time.LocalDate date) {
        java.time.LocalDateTime startOfDay = date.atStartOfDay();
        java.time.LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        
        TypedQuery<Appointment> query = em.createQuery(
                "SELECT a FROM Appointment a " +
                        "WHERE a.doctor.id = :doctorId " +
                        "AND a.startDatetime >= :startOfDay " +
                        "AND a.startDatetime < :endOfDay " +
                        "ORDER BY a.startDatetime ASC",
                Appointment.class
        );
        query.setParameter("doctorId", doctorId);
        query.setParameter("startOfDay", startOfDay);
        query.setParameter("endOfDay", endOfDay);
        return query.getResultList();
    }
}
