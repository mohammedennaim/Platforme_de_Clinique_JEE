package org.example.clinique.dto;

public class AvailabilityDTO {
    private Long id;
    private Long doctorId;
    private String availabilityDate;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private String status;

    public AvailabilityDTO() {
    }

    public AvailabilityDTO(Long id, Long doctorId, String availabilityDate, String dayOfWeek, String startTime, String endTime, String status) {
        this.id = id;
        this.doctorId = doctorId;
        this.availabilityDate = availabilityDate;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
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

    public String getAvailabilityDate() {
        return availabilityDate;
    }

    public void setAvailabilityDate(String availabilityDate) {
        this.availabilityDate = availabilityDate;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
