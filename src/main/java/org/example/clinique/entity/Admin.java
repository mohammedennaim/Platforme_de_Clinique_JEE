package org.example.clinique.entity;

import jakarta.persistence.*;
import org.example.clinique.entity.enums.Role;

@Entity
@Table(name = "admins", schema = "clinique")
public class Admin extends User {

    public Admin(Long id, String firstName, String lastName, String email, String passwordHash, Role role, Boolean isActive) {
        super(id, firstName, lastName, email, passwordHash, role, isActive);
    }

    public Admin() {

    }

    @Override
    public String toString() {
        return "Admin{" +
                "id=" + getId() +
                ", firstName='" + getFirstName() + '\'' +
                ", lastName='" + getLastName() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", role=" + getRole() +
                '}';
    }
}