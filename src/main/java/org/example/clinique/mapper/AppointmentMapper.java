package org.example.clinique.mapper;

import org.example.clinique.dto.AppointmentResponseDTO;
import org.example.clinique.dto.AvailabilityDTO;
import org.example.clinique.dto.DoctorSummaryDTO;
import org.example.clinique.entity.Appointment;
import org.example.clinique.entity.Availability;
import org.example.clinique.entity.Doctor;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

public final class AppointmentMapper {

    private static final DateTimeFormatter ISO_DATE_TIME = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private AppointmentMapper() {
    }

    public static AppointmentResponseDTO toResponseDTO(Appointment appointment) {
        if (appointment == null) {
            return null;
        }
        Doctor doctor = appointment.getDoctor();
        String specialtyName = doctor != null && doctor.getSpecialty() != null
                ? doctor.getSpecialty().getName()
                : "";
        return new AppointmentResponseDTO(
                appointment.getId(),
                doctor != null ? doctor.getId() : null,
                doctor != null ? doctor.getTitle() + " " + doctor.getLastName() : "",
                specialtyName,
                appointment.getStartDatetime() != null ? ISO_DATE_TIME.format(appointment.getStartDatetime()) : null,
                appointment.getEndDatetime() != null ? ISO_DATE_TIME.format(appointment.getEndDatetime()) : null,
                appointment.getStatus() != null ? appointment.getStatus().name() : null,
                appointment.getAppointmentType() != null ? appointment.getAppointmentType().name() : null
        );
    }

    public static DoctorSummaryDTO toDoctorSummary(Doctor doctor, String color) {
        if (doctor == null) {
            return null;
        }
        String initials = "";
        if (doctor.getFirstName() != null && !doctor.getFirstName().isBlank()) {
            initials += doctor.getFirstName().substring(0, 1).toUpperCase(Locale.ROOT);
        }
        if (doctor.getLastName() != null && !doctor.getLastName().isBlank()) {
            initials += doctor.getLastName().substring(0, 1).toUpperCase(Locale.ROOT);
        }
        String specialtyName = doctor.getSpecialty() != null ? doctor.getSpecialty().getName() : "Généraliste";
        String fullName = (doctor.getTitle() != null ? doctor.getTitle() + " " : "") + doctor.getFirstName() + " " + doctor.getLastName();
        return new DoctorSummaryDTO(
                doctor.getId(),
                fullName.trim(),
                specialtyName,
                initials,
                color
        );
    }

    public static AvailabilityDTO toAvailabilityDTO(Availability availability) {
        if (availability == null) {
            return null;
        }
        return new AvailabilityDTO(
                availability.getId(),
                availability.getDoctor() != null ? availability.getDoctor().getId() : null,
                availability.getDayOfWeek(),
                availability.getStartTime() != null ? availability.getStartTime().toString() : null,
                availability.getEndTime() != null ? availability.getEndTime().toString() : null,
                availability.getStatus() != null ? availability.getStatus().name() : null
        );
    }
}
