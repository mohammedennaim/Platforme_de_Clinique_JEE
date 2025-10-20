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
        // First try to find availabilities with specific dates
        TypedQuery<Availability> queryWithDate = em.createQuery(
                "SELECT av FROM Availability av JOIN FETCH av.doctor " +
                "WHERE av.doctor.id = :doctorId AND av.status = :status " +
                "AND av.availabilityDate IS NOT NULL " +
                "AND av.availabilityDate >= CURRENT_DATE " +
                "ORDER BY av.availabilityDate ASC, av.startTime ASC",
                Availability.class
        );
        queryWithDate.setParameter("doctorId", doctorId);
        queryWithDate.setParameter("status", AvailabilityStatus.AVAILABLE);
        List<Availability> resultWithDate = queryWithDate.getResultList();
        
        // Then try to find recurring availabilities (without specific date)
        TypedQuery<Availability> queryRecurring = em.createQuery(
                "SELECT av FROM Availability av JOIN FETCH av.doctor " +
                "WHERE av.doctor.id = :doctorId AND av.status = :status " +
                "AND av.availabilityDate IS NULL " +
                "ORDER BY av.startTime ASC",
                Availability.class
        );
        queryRecurring.setParameter("doctorId", doctorId);
        queryRecurring.setParameter("status", AvailabilityStatus.AVAILABLE);
        List<Availability> resultRecurring = queryRecurring.getResultList();
        
        // Combine both results
        List<Availability> result = new java.util.ArrayList<>();
        result.addAll(resultWithDate);
        result.addAll(resultRecurring);
        
        System.out.println("findAvailabilitiesByDoctor: Found " + resultWithDate.size() + " dated availabilities and " + 
                         resultRecurring.size() + " recurring availabilities for doctor " + doctorId);
        return result;
    }
    
    public Optional<Availability> findAvailabilityByDoctor(Long doctorId) {
        TypedQuery<Availability> query = em.createQuery(
                "SELECT av FROM Availability av JOIN FETCH av.doctor " +
                "WHERE av.doctor.id = :doctorId AND av.status = :status " +
                "AND av.availabilityDate >= CURRENT_DATE " +
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
    
    public List<Availability> findAnyAvailabilitiesForDoctor(Long doctorId) {
        TypedQuery<Availability> query = em.createQuery(
                "SELECT av FROM Availability av JOIN FETCH av.doctor " +
                "WHERE av.doctor.id = :doctorId AND av.status = :status " +
                "ORDER BY av.availabilityDate ASC, av.startTime ASC",
                Availability.class
        );
        query.setParameter("doctorId", doctorId);
        query.setParameter("status", AvailabilityStatus.AVAILABLE);
        List<Availability> result = query.getResultList();
        return result;
    }
}
