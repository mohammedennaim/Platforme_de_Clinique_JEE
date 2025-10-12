package org.example.clinique.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import org.example.clinique.entity.Patient;

public class PatientRepository {
    private final EntityManager em;

    public PatientRepository(EntityManager em) {
        this.em = em;
    }

    public Patient findById(Long id) {
        return em.find(Patient.class, id);
    }

    public Patient findByEmail(String email) {
        try {
            TypedQuery<Patient> query = em.createQuery(
                    "SELECT p FROM Patient p WHERE p.email = :email", Patient.class);
            query.setParameter("email", email);
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public Patient findByCin(String cin) {
        try {
            TypedQuery<Patient> query = em.createQuery(
                    "SELECT p FROM Patient p WHERE p.cin = :cin", Patient.class);
            query.setParameter("cin", cin);
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public void save(Patient patient) {
        if (patient.getId() == null) {
            em.persist(patient);
        } else {
            em.merge(patient);
        }
    }
}
