package org.example.clinique.entity;

import jakarta.persistence.*;
import org.example.clinique.entity.enums.Role;

@Entity
@Table(name = "doctors", schema = "clinique")
public class Doctor extends User {

    @Column(name = "registration_number", nullable = false, unique = true)
    private String registrationNumber;

    private String title;

    @ManyToOne
    @JoinColumn(name = "specialty_id")
    private Specialty specialty;

    public Doctor(Long id, String firstName, String lastName, String email, String passwordHash, Role role, Boolean isActive, String registrationNumber, String title, Specialty specialty) {
        super(id, firstName, lastName, email, passwordHash, role, isActive);
        this.registrationNumber = registrationNumber;
        this.title = title;
        this.specialty = specialty;
    }

    public Doctor() {

    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Specialty getSpecialty() {
        return specialty;
    }

    public void setSpecialty(Specialty specialty) {
        this.specialty = specialty;
    }

    @Override
    public String toString() {
        return "Doctor{" +
                "id=" + getId() +
                ", registrationNumber='" + registrationNumber + '\'' +
                ", title='" + title + '\'' +
                ", specialty=" + specialty +
                ", firstName='" + getFirstName() + '\'' +
                ", lastName='" + getLastName() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", role=" + getRole() +
                '}';
    }
}