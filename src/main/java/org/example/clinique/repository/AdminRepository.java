package org.example.clinique.repository;

import jakarta.persistence.EntityManager;
import org.example.clinique.entity.Admin;

public class AdminRepository {
    private final EntityManager em;

    public AdminRepository(EntityManager em) {
        this.em = em;
    }

    public void save(Admin admin) {
        if (admin.getId() == null) {
            em.persist(admin);
        } else {
            em.merge(admin);
        }
    }

    public Admin findById(Long id) {
        return em.find(Admin.class, id);
    }

    public Admin findByEmail(String email) {
        try {
            return em.createQuery("SELECT a FROM Admin a WHERE a.email = :email", Admin.class)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
}