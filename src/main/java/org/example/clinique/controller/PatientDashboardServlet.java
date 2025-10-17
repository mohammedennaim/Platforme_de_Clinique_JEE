package org.example.clinique.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.clinique.dto.AppointmentResponseDTO;
import org.example.clinique.entity.Patient;
import org.example.clinique.entity.User;
import org.example.clinique.entity.enums.Role;
import org.example.clinique.mapper.AppointmentMapper;
import org.example.clinique.repository.PatientRepository;
import org.example.clinique.service.AppointmentService;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet("/dashboard-patient")
public class PatientDashboardServlet extends HttpServlet {

    private EntityManagerFactory emf;

    @Override
    public void init() {
        emf = Persistence.createEntityManagerFactory("cliniquePU");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession(false);
        if (session == null) {
            resp.sendRedirect(req.getContextPath() + "/index.jsp");
            return;
        }

        User sessionUser = (User) session.getAttribute("user");
        String email = (String) session.getAttribute("userEmail");
        
        if (sessionUser == null || email == null || sessionUser.getRole() != Role.PATIENT) {
            resp.sendRedirect(req.getContextPath() + "/dashboard");
            return;
        }

        EntityManager em = emf.createEntityManager();
        try {
            AppointmentService appointmentService = new AppointmentService(em);
            PatientRepository patientRepository = new PatientRepository(em);
            Patient patient = patientRepository.findByEmail(email);
            
            if (patient == null) {
                resp.sendRedirect(req.getContextPath() + "/dashboard");
                return;
            }

            // Get patient appointments
            List<AppointmentResponseDTO> appointmentDTOs = appointmentService
                    .getUpcomingAppointmentsForPatient(patient.getId())
                    .stream()
                    .map(AppointmentMapper::toResponseDTO)
                    .collect(Collectors.toList());

            // Set attributes
            req.setAttribute("patientEntity", patient);
            req.setAttribute("patientUser", sessionUser);
            req.setAttribute("todayDate", LocalDate.now().toString());
            req.setAttribute("appointmentDTOs", appointmentDTOs);
            req.setAttribute("appointmentsJson", buildAppointmentsJson(appointmentDTOs));

            req.getRequestDispatcher("/dashboard-patient.jsp").forward(req, resp);
        } finally {
            em.close();
        }
    }

    @Override
    public void destroy() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }

    private String buildAppointmentsJson(List<AppointmentResponseDTO> appointments) {
        StringBuilder builder = new StringBuilder();
        builder.append('[');
        boolean first = true;
        for (AppointmentResponseDTO appointment : appointments) {
            if (appointment == null) {
                continue;
            }
            if (!first) {
                builder.append(',');
            }
            builder.append('{');
            builder.append("\"id\":").append(appointment.getId() != null ? appointment.getId() : "null");
            builder.append(',');
            builder.append("\"doctorId\":").append(appointment.getDoctorId() != null ? appointment.getDoctorId() : "null");
            builder.append(',');
            builder.append("\"doctorName\":\"").append(escapeJson(appointment.getDoctorName() != null ? appointment.getDoctorName() : "")).append('\"');
            builder.append(',');
            builder.append("\"doctorSpecialty\":\"").append(escapeJson(appointment.getDoctorSpecialty() != null ? appointment.getDoctorSpecialty() : "")).append('\"');
            builder.append(',');
            builder.append("\"start\":\"").append(escapeJson(appointment.getStart())).append('\"');
            builder.append(',');
            builder.append("\"end\":\"").append(escapeJson(appointment.getEnd())).append('\"');
            builder.append(',');
            builder.append("\"status\":\"").append(escapeJson(appointment.getStatus() != null ? appointment.getStatus() : "confirmed")).append('\"');
            builder.append(',');
            builder.append("\"appointmentType\":\"").append(escapeJson(appointment.getAppointmentType() != null ? appointment.getAppointmentType() : "Consultation")).append('\"');
            builder.append('}');
            first = false;
        }
        builder.append(']');
        return builder.toString();
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
