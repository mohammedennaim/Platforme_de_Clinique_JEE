package org.example.clinique.mapper;

import org.example.clinique.dto.AppointmentResponseDTO;
import org.example.clinique.dto.AvailabilityDTO;
import org.example.clinique.dto.DoctorSummaryDTO;
import org.example.clinique.dto.NextAvailabilityDTO;
import org.example.clinique.entity.Appointment;
import org.example.clinique.entity.Availability;
import org.example.clinique.entity.Doctor;

import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;

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
                availability.getAvailabilityDate() != null ? availability.getAvailabilityDate().toString() : null,
                availability.getDayOfWeek(),
                availability.getStartTime() != null ? availability.getStartTime().toString() : null,
                availability.getEndTime() != null ? availability.getEndTime().toString() : null,
                availability.getStatus() != null ? availability.getStatus().name() : null
        );
    }

    public static NextAvailabilityDTO toNextAvailabilityDTO(Optional<Availability> availability) {
        if (availability.isPresent()) {
            Availability avail = availability.get();
            Doctor doctor = avail.getDoctor();
            String doctorName = "";
            if (doctor != null) {
                doctorName = (doctor.getTitle() != null ? doctor.getTitle() + " " : "")
                        + doctor.getFirstName() + " " + doctor.getLastName();
            }
            return new NextAvailabilityDTO(
                    doctor != null ? doctor.getId() : null,
                    doctorName.trim(),
                    avail.getAvailabilityDate() != null ? avail.getAvailabilityDate().toString() : null,
                    avail.getStartTime() != null ? avail.getStartTime().toString() : null,
                    avail.getEndTime() != null ? avail.getEndTime().toString() : null,
                    avail.getDayOfWeek(),
                    avail.getStatus() != null ? avail.getStatus().name() : null
            );
        }
        return null;
    }
    
    /**
     * Convertit une Availability en AvailabilityTimeSlotsDTO avec génération des time slots
     */
    public static org.example.clinique.dto.AvailabilityTimeSlotsDTO toAvailabilityTimeSlotsDTO(Availability availability) {
        if (availability == null) {
            return null;
        }
        
        Doctor doctor = availability.getDoctor();
        String doctorName = "";
        if (doctor != null) {
            doctorName = (doctor.getTitle() != null ? doctor.getTitle() + " " : "")
                    + doctor.getFirstName() + " " + doctor.getLastName();
        }
        
        // Générer les time slots (créneaux de 35 minutes: 30 min RDV + 5 min pause)
        java.util.List<String> timeSlots = generateTimeSlots(
            availability.getStartTime(), 
            availability.getEndTime()
        );
        
        return new org.example.clinique.dto.AvailabilityTimeSlotsDTO(
            doctor != null ? doctor.getId() : null,
            doctorName.trim(),
            availability.getAvailabilityDate() != null ? availability.getAvailabilityDate().toString() : null,
            availability.getStartTime() != null ? availability.getStartTime().toString() : null,
            availability.getEndTime() != null ? availability.getEndTime().toString() : null,
            timeSlots
        );
    }
    
    /**
     * Génère les créneaux horaires entre startTime et endTime
     * avec un intervalle de 35 minutes (30 min rendez-vous + 5 min pause)
     */
    private static java.util.List<String> generateTimeSlots(java.time.LocalTime startTime, java.time.LocalTime endTime) {
        java.util.List<String> slots = new java.util.ArrayList<>();
        
        if (startTime == null || endTime == null) {
            return slots;
        }
        
        int APPOINTMENT_DURATION = 30; // minutes
        int BREAK_DURATION = 5; // minutes
        int INTERVAL = APPOINTMENT_DURATION + BREAK_DURATION; // 35 minutes
        
        int startMinutes = startTime.getHour() * 60 + startTime.getMinute();
        int endMinutes = endTime.getHour() * 60 + endTime.getMinute();
        
        for (int minutes = startMinutes; minutes < endMinutes; minutes += INTERVAL) {
            int hour = minutes / 60;
            int minute = minutes % 60;
            
            // Vérifier que le créneau + durée du RDV rentre dans la plage
            if (minutes + APPOINTMENT_DURATION <= endMinutes) {
                String timeSlot = String.format("%02d:%02d", hour, minute);
                slots.add(timeSlot);
            }
        }
        
        return slots;
    }
}
