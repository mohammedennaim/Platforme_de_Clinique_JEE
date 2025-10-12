package org.example.clinique.repository;

import jakarta.persistence.EntityManager;
import org.example.clinique.entity.Specialty;

import java.util.List;

public class SpecialtyRepository {
    private final EntityManager em;

    public SpecialtyRepository(EntityManager em) {
        this.em = em;
    }

    public Specialty findById(Long id) {
        return em.find(Specialty.class, id);
    }

    public List<Specialty> findAll() {
        return em.createQuery("SELECT s FROM Specialty s ORDER BY s.name", Specialty.class)
                .getResultList();
    }


    public Specialty findByCode(String code) {
        try {
            return em.createQuery("SELECT s FROM Specialty s WHERE s.code = :code", Specialty.class)
                    .setParameter("code", code)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
}