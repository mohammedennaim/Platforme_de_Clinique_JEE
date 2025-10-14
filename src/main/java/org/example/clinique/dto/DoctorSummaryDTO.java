package org.example.clinique.dto;

public class DoctorSummaryDTO {
    private Long id;
    private String fullName;
    private String specialty;
    private String initials;
    private String color;

    public DoctorSummaryDTO() {
    }

    public DoctorSummaryDTO(Long id, String fullName, String specialty, String initials, String color) {
        this.id = id;
        this.fullName = fullName;
        this.specialty = specialty;
        this.initials = initials;
        this.color = color;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getInitials() {
        return initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
