package org.example.clinique.mapper;

import org.example.clinique.dto.AppointmentResponseDTO;
import org.example.clinique.dto.AvailabilityDTO;
import org.example.clinique.dto.DoctorSummaryDTO;
import org.example.clinique.dto.NextAvailabilityDTO;
import org.example.clinique.entity.Appointment;
import org.example.clinique.entity.Availability;
import org.example.clinique.entity.Doctor;
import java.time.LocalDate;
import java.util.List;
import org.example.clinique.dto.AvailabilityTimeSlotsDTO;

import java.time.format.DateTimeFormatter;
import java.time.LocalTime;
import java.time.LocalDateTime;
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
    
    public static AvailabilityTimeSlotsDTO toAvailabilityTimeSlotsDTO(
            Availability availability, 
            List<Appointment> existingAppointments) {
        return toAvailabilityTimeSlotsDTO(availability, existingAppointments, false);
    }
    
    public static AvailabilityTimeSlotsDTO toAvailabilityTimeSlotsDTO(
            Availability availability, 
            List<Appointment> existingAppointments,
            boolean isEditMode) {
        if (availability == null) {
            return null;
        }
        
        Doctor doctor = availability.getDoctor();
        String doctorName = "";
        if (doctor != null) {
            doctorName = (doctor.getTitle() != null ? doctor.getTitle() + " " : "")
                    + doctor.getFirstName() + " " + doctor.getLastName();
        }
        
        List<String> allTimeSlots = generateTimeSlots(
            availability.getStartTime(), 
            availability.getEndTime()
        );
        
        // In edit mode, include all time slots
        // In creation mode, filter out time slots that are already booked
        List<String> availableTimeSlots;
        if (isEditMode) {
            availableTimeSlots = allTimeSlots; // Include all slots for editing
        } else {
            availableTimeSlots = filterAvailableSlots(
                allTimeSlots,
                existingAppointments,
                availability.getAvailabilityDate()
            );
        }

        System.out.println("Available time slots: " + availableTimeSlots);
        System.out.println("Doctor name: " + doctorName);
        System.out.println("Availability date: " + availability.getAvailabilityDate());
        System.out.println("Start time: " + availability.getStartTime());
        System.out.println("End time: " + availability.getEndTime());
        System.out.println("Is edit mode: " + isEditMode);
        
        return new AvailabilityTimeSlotsDTO(
            doctor != null ? doctor.getId() : null,
            doctorName.trim(),
            availability.getAvailabilityDate() != null ? availability.getAvailabilityDate().toString() : null,
            availability.getStartTime() != null ? availability.getStartTime().toString() : null,
            availability.getEndTime() != null ? availability.getEndTime().toString() : null,
            availableTimeSlots
        );
    }
    
    private static java.util.List<String> filterAvailableSlots(
            List<String> allSlots,
            List<Appointment> appointments,
            LocalDate availabilityDate) {
        
        java.util.List<String> availableSlots = new java.util.ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        
        for (String slot : allSlots) {
            // Parse the slot time (format "HH:mm")
            String[] parts = slot.split(":");
            int slotHour = Integer.parseInt(parts[0]);
            int slotMinute = Integer.parseInt(parts[1]);
            LocalTime slotTime = LocalTime.of(slotHour, slotMinute);
            LocalDateTime slotDateTime = LocalDateTime.of(availabilityDate, slotTime);
            
            // Skip if slot is in the past
            if (slotDateTime.isBefore(now) || slotDateTime.isEqual(now)) {
                continue;
            }
            
            
            boolean isBooked = false;
            
            // Check if this slot overlaps with any existing appointment
            if (appointments != null && !appointments.isEmpty()) {
                for (Appointment appointment : appointments) {
                    if (appointment.getStartDatetime() != null && appointment.getEndDatetime() != null) {
                        // Check if slot time falls within appointment time range
                        if (!slotDateTime.isBefore(appointment.getStartDatetime()) && 
                            slotDateTime.isBefore(appointment.getEndDatetime())) {
                            isBooked = true;
                            break;
                        }
                    }
                }
            }
            
            if (!isBooked) {
                availableSlots.add(slot);
            }
        }
        
        return availableSlots;
    }
    

    private static List<String> generateTimeSlots(LocalTime startTime, LocalTime endTime) {
        List<String> slots = new java.util.ArrayList<>();
        
        if (startTime == null || endTime == null) {
            return slots;
        }

        int APPOINTMENT_DURATION = 30;
        int BREAK_DURATION = 5;
        int INTERVAL = APPOINTMENT_DURATION + BREAK_DURATION;
        
        int LUNCH_BREAK_START = 12 * 60;
        int LUNCH_BREAK_END = 13 * 60;
        
        int startMinutes = startTime.getHour() * 60 + startTime.getMinute();
        int endMinutes = endTime.getHour() * 60 + endTime.getMinute();
        
        for (int minutes = startMinutes; minutes < endMinutes; minutes += INTERVAL) {
            int hour = minutes / 60;
            int minute = minutes % 60;
            int slotEndMinutes = minutes + APPOINTMENT_DURATION;

            if (slotEndMinutes <= endMinutes) {
                boolean startsInLunchBreak = (minutes >= LUNCH_BREAK_START && minutes < LUNCH_BREAK_END);
                boolean endsInLunchBreak = (slotEndMinutes > LUNCH_BREAK_START && slotEndMinutes <= LUNCH_BREAK_END);
                boolean overlapsLunchBreak = (minutes < LUNCH_BREAK_START && slotEndMinutes > LUNCH_BREAK_START);
                
                if (!startsInLunchBreak && !endsInLunchBreak && !overlapsLunchBreak) {
                    String timeSlot = String.format("%02d:%02d", hour, minute);
                    slots.add(timeSlot);
                }
            }
        }
        
        return slots;
    }
}
