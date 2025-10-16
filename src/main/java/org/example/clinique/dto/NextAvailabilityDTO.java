package org.example.clinique.dto;

public class NextAvailabilityDTO {
    private Long doctorId;
    private String doctorName;
    private String availabilityDate;
    private String startTime;
    private String endTime;
    private String dayOfWeek;
    private String status;

    public NextAvailabilityDTO() {
    }

    public NextAvailabilityDTO(Long doctorId, String doctorName, String availabilityDate, 
                               String startTime, String endTime, String dayOfWeek, String status) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.availabilityDate = availabilityDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.dayOfWeek = dayOfWeek;
        this.status = status;
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

    public String getAvailabilityDate() {
        return availabilityDate;
    }

    public void setAvailabilityDate(String availabilityDate) {
        this.availabilityDate = availabilityDate;
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

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
