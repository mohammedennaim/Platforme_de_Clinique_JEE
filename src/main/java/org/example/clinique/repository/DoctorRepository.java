package org.example.clinique.repository;

import jakarta.persistence.EntityManager;
import org.example.clinique.entity.Doctor;

public class DoctorRepository {
    private final EntityManager em;

    public DoctorRepository(EntityManager em) {
        this.em = em;
    }

    public void save(Doctor doctor) {
        if (doctor.getId() == null) {
            em.persist(doctor);
        } else {
            em.merge(doctor);
        }
    }

    public Doctor findById(Long id) {
        return em.find(Doctor.class, id);
    }

    public Doctor findByEmail(String email) {
        try {
            return em.createQuery("SELECT d FROM Doctor d WHERE d.email = :email", Doctor.class)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    public Doctor findByRegistrationNumber(String registrationNumber) {
        try {
            return em.createQuery("SELECT d FROM Doctor d WHERE d.registrationNumber = :regNum", Doctor.class)
                    .setParameter("regNum", registrationNumber)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
}