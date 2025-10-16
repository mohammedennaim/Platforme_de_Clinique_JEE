package org.example.clinique.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.example.clinique.entity.Availability;
import org.example.clinique.entity.enums.AvailabilityStatus;

import java.util.List;
import java.util.Optional;

public class AvailabilityRepository {

    private final EntityManager em;

    public AvailabilityRepository(EntityManager em) {
        this.em = em;
    }

    public List<Availability> findAvailabilitiesByDoctor(Long doctorId) {
        TypedQuery<Availability> query = em.createQuery(
                "SELECT av FROM Availability av JOIN FETCH av.doctor " +
                "WHERE av.doctor.id = :doctorId AND av.status = :status " +
                "AND (av.availabilityDate > CURRENT_DATE " +
                "     OR (av.availabilityDate = CURRENT_DATE AND av.startTime >= CURRENT_TIME)) " +
                "ORDER BY av.availabilityDate ASC, av.startTime ASC",
                Availability.class
        );
        query.setParameter("doctorId", doctorId);
        query.setParameter("status", AvailabilityStatus.AVAILABLE);
        return query.getResultList();
    }
    
    public Optional<Availability> findAvailabilityByDoctor(Long doctorId) {
        TypedQuery<Availability> query = em.createQuery(
                "SELECT av FROM Availability av JOIN FETCH av.doctor " +
                "WHERE av.doctor.id = :doctorId AND av.status = :status " +
                "AND (av.availabilityDate > CURRENT_DATE " +
                "     OR (av.availabilityDate = CURRENT_DATE AND av.startTime >= CURRENT_TIME)) " +
                "ORDER BY av.availabilityDate ASC, av.startTime ASC",
                Availability.class
        );
        query.setParameter("doctorId", doctorId);
        query.setParameter("status", AvailabilityStatus.AVAILABLE);
        return query.getResultStream().findFirst();
    }

    public List<Availability> findAllActive() {
        TypedQuery<Availability> query = em.createQuery(
                "SELECT av FROM Availability av JOIN FETCH av.doctor WHERE av.status = :status AND (av.availabilityDate IS NULL OR av.availabilityDate >= CURRENT_DATE)",
                Availability.class
        );
        query.setParameter("status", AvailabilityStatus.AVAILABLE);
        return query.getResultList();
    }

    public List<Availability> findByDoctorAndDate(Long doctorId, java.time.LocalDate date) {
        TypedQuery<Availability> query = em.createQuery(
                "SELECT av FROM Availability av JOIN FETCH av.doctor WHERE av.doctor.id = :doctorId AND av.availabilityDate = :date AND av.status = :status",
                Availability.class
        );
        query.setParameter("doctorId", doctorId);
        query.setParameter("date", date);
        query.setParameter("status", AvailabilityStatus.AVAILABLE);
        return query.getResultList();
    }
}
