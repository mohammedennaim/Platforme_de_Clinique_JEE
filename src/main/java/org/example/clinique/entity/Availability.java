package org.example.clinique.entity;

import org.example.clinique.entity.enums.AvailabilityStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "availabilities", schema = "clinique")
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(name = "availability_date")
    private LocalDate availabilityDate;

    @Column(length = 10)
    private String dayOfWeek;

    @Column(name = "start_time")
    private LocalTime startTime;
    
    @Column(name = "end_time")
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AvailabilityStatus status = AvailabilityStatus.AVAILABLE;

    public Availability(Long id, Doctor doctor, LocalDate availabilityDate, String dayOfWeek, LocalTime startTime, LocalTime endTime, AvailabilityStatus status) {
        this.id = id;
        this.doctor = doctor;
        this.availabilityDate = availabilityDate;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public Availability() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDate getAvailabilityDate() {
        return availabilityDate;
    }

    public void setAvailabilityDate(LocalDate availabilityDate) {
        this.availabilityDate = availabilityDate;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public AvailabilityStatus getStatus() {
        return status;
    }

    public void setStatus(AvailabilityStatus status) {
        this.status = status;
    }
}
