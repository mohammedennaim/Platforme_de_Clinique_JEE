package org.example.clinique.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;

public class AppointmentRequestDTO {
    private Long doctorId;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private int durationMinutes;
    private String appointmentType;

    public AppointmentRequestDTO() {
    }

    public AppointmentRequestDTO(Long doctorId, LocalDate appointmentDate, LocalTime startTime, int durationMinutes, String appointmentType) {
        this.doctorId = doctorId;
        this.appointmentDate = appointmentDate;
        this.startTime = startTime;
        this.durationMinutes = durationMinutes;
        this.appointmentType = appointmentType;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(String appointmentType) {
        this.appointmentType = appointmentType;
    }

    public LocalDateTime toStartDateTime() {
        if (appointmentDate == null || startTime == null) {
            return null;
        }
        return appointmentDate.atTime(startTime);
    }

    public LocalDateTime toEndDateTime() {
        LocalDateTime startDateTime = toStartDateTime();
        if (startDateTime == null) {
            return null;
        }
        return startDateTime.plusMinutes(Math.max(durationMinutes, 0));
    }

    public static AppointmentRequestDTO fromParameters(String doctorIdStr, String dateStr, String timeStr, String durationStr, String typeStr) {
        AppointmentRequestDTO dto = new AppointmentRequestDTO();
        try {
            if (doctorIdStr != null) {
                dto.setDoctorId(Long.parseLong(doctorIdStr));
            }
        } catch (NumberFormatException e) {
            dto.setDoctorId(null);
        }

        try {
            if (dateStr != null) {
                dto.setAppointmentDate(LocalDate.parse(dateStr));
            }
        } catch (DateTimeParseException e) {
            dto.setAppointmentDate(null);
        }

        try {
            if (timeStr != null) {
                dto.setStartTime(LocalTime.parse(timeStr));
            }
        } catch (DateTimeParseException e) {
            dto.setStartTime(null);
        }

        int duration = 30;
        if (durationStr != null && !durationStr.isBlank()) {
            try {
                duration = Integer.parseInt(durationStr);
            } catch (NumberFormatException ignored) {
            }
        }
        dto.setDurationMinutes(duration <= 0 ? 30 : duration);
        dto.setAppointmentType(typeStr);
        return dto;
    }
}
