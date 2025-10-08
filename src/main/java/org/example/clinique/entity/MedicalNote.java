package org.example.clinique.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medical_notes", schema = "clinique")
public class MedicalNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "appointment_id", unique = true)
    private Appointment appointment;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Boolean isLocked = false;

    public MedicalNote(Long id, Appointment appointment, String content, Boolean isLocked) {
        this.id = id;
        this.appointment = appointment;
        this.content = content;
        this.isLocked = isLocked;
    }

    public MedicalNote() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getLocked() {
        return isLocked;
    }

    public void setLocked(Boolean locked) {
        isLocked = locked;
    }
}