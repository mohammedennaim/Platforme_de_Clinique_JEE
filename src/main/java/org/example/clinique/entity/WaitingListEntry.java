package org.example.clinique.entity;

import org.example.clinique.entity.enums.Priority;
import org.example.clinique.entity.enums.WaitingStatus;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "waiting_list", schema = "clinique")
public class WaitingListEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private LocalDate requestedDate;
    private LocalDate creationDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private WaitingStatus status = WaitingStatus.PENDING;

    public WaitingListEntry(Long id, Patient patient, LocalDate requestedDate, LocalDate creationDate, Priority priority, WaitingStatus status) {
        this.id = id;
        this.patient = patient;
        this.requestedDate = requestedDate;
        this.creationDate = creationDate;
        this.priority = priority;
        this.status = status;
    }

    public WaitingListEntry() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public LocalDate getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(LocalDate requestedDate) {
        this.requestedDate = requestedDate;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public WaitingStatus getStatus() {
        return status;
    }

    public void setStatus(WaitingStatus status) {
        this.status = status;
    }
}
