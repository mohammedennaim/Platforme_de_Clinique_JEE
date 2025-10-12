package org.example.clinique.repository;

import jakarta.persistence.EntityManager;
import org.example.clinique.entity.Staff;

public class StaffRepository {
    private final EntityManager em;

    public StaffRepository(EntityManager em) {
        this.em = em;
    }

    public void save(Staff staff) {
        if (staff.getId() == null) {
            em.persist(staff);
        } else {
            em.merge(staff);
        }
    }

    public Staff findById(Long id) {
        return em.find(Staff.class, id);
    }

    public Staff findByEmail(String email) {
        try {
            return em.createQuery("SELECT s FROM Staff s WHERE s.email = :email", Staff.class)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
}