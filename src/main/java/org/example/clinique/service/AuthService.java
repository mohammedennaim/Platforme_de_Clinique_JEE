package org.example.clinique.service;

import jakarta.persistence.EntityManager;
import org.example.clinique.entity.User;
import org.example.clinique.entity.enums.Role;
import org.example.clinique.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;

public class AuthService {
    private final UserRepository repo;

    public AuthService(EntityManager em) {
        this.repo = new UserRepository(em);
    }

    public boolean login(String email, String plainPassword) {
        User user = repo.findByEmail(email);
        if (user == null) return false;
        return user.getActive() && BCrypt.checkpw(plainPassword, user.getPasswordHash());
    }

    public boolean register(String firstName, String lastName,
                            String email, String plainPassword,
                            Role role) {
        if (repo.findByEmail(email) != null) {
            return false;
        }

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPasswordHash(BCrypt.hashpw(plainPassword, BCrypt.gensalt()));
        user.setRole(role);
        user.setActive(true);

        repo.save(user);
        return true;
    }
}