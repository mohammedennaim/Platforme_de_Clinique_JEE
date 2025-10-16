package org.example.clinique.dto;

import java.util.List;

/**
 * DTO pour représenter la prochaine disponibilité d'un médecin avec ses créneaux horaires
 */
public class AvailabilityTimeSlotsDTO {
    private Long doctorId;
    private String doctorName;
    private String availabilityDate;
    private String startTime;
    private String endTime;
    private List<String> timeSlots;

    public AvailabilityTimeSlotsDTO() {
    }

    public AvailabilityTimeSlotsDTO(Long doctorId, String doctorName, String availabilityDate, 
                                    String startTime, String endTime, List<String> timeSlots) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.availabilityDate = availabilityDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.timeSlots = timeSlots;
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

    public List<String> getTimeSlots() {
        return timeSlots;
    }

    public void setTimeSlots(List<String> timeSlots) {
        this.timeSlots = timeSlots;
    }
}
