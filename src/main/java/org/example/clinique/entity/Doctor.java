package org.example.clinique.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors", schema = "clinique")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    private String title;

    @ManyToOne
    @JoinColumn(name = "specialty_id")
    private Specialty specialty;

    public Doctor(Long id, User user, String registrationNumber, String title, Specialty specialty) {
        this.id = id;
        this.user = user;
        this.registrationNumber = registrationNumber;
        this.title = title;
        this.specialty = specialty;
    }

    public Doctor() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
}