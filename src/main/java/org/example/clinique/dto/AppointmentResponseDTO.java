package org.example.clinique.dto;

public class AppointmentResponseDTO {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialty;
    private String start;
    private String end;
    private String status;
    private String appointmentType;

    public AppointmentResponseDTO() {
    }

    public AppointmentResponseDTO(Long id, Long doctorId, String doctorName, String doctorSpecialty, String start, String end, String status, String appointmentType) {
        this.id = id;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.doctorSpecialty = doctorSpecialty;
        this.start = start;
        this.end = end;
        this.status = status;
        this.appointmentType = appointmentType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorSpecialty() {
        return doctorSpecialty;
    }

    public void setDoctorSpecialty(String doctorSpecialty) {
        this.doctorSpecialty = doctorSpecialty;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(String appointmentType) {
        this.appointmentType = appointmentType;
    }
}
