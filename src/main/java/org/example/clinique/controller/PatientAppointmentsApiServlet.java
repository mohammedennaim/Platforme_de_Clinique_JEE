package org.example.clinique.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.clinique.dto.AppointmentResponseDTO;
import org.example.clinique.entity.Patient;
import org.example.clinique.entity.User;
import org.example.clinique.mapper.AppointmentMapper;
import org.example.clinique.repository.PatientRepository;
import org.example.clinique.service.AppointmentService;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/api/patient/appointments")
public class PatientAppointmentsApiServlet extends HttpServlet {

    private EntityManagerFactory emf;

    @Override
    public void init() throws ServletException {
        super.init();
        emf = Persistence.createEntityManagerFactory("cliniquePU");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");

        User sessionUser = (User) req.getSession().getAttribute("user");
        if (sessionUser == null) {
            System.out.println("❌ No session user found");
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("[]");
            return;
        }

        System.out.println("✅ Session user: " + sessionUser.getEmail() + " (ID: " + sessionUser.getId() + ")");

        EntityManager em = emf.createEntityManager();
        try (PrintWriter out = resp.getWriter()) {
            AppointmentService appointmentService = new AppointmentService(em);
            PatientRepository patientRepository = new PatientRepository(em);
            Patient patient = patientRepository.findById(sessionUser.getId());
            
            if (patient == null) {
                System.out.println("❌ Patient not found for user ID: " + sessionUser.getId());
                out.write("[]");
                return;
            }

            System.out.println("✅ Patient found: " + patient.getFirstName() + " " + patient.getLastName() + " (ID: " + patient.getId() + ")");

            List<org.example.clinique.entity.Appointment> appointments =
                    appointmentService.getUpcomingAppointmentsForPatient(patient.getId());

            System.out.println("📊 Appointments found: " + appointments.size());

            // Build JSON array
            StringBuilder builder = new StringBuilder();
            builder.append('[');
            boolean first = true;
            for (org.example.clinique.entity.Appointment appointment : appointments) {
                AppointmentResponseDTO dto = AppointmentMapper.toResponseDTO(appointment);
                if (dto == null) continue;
                if (!first) builder.append(',');
                builder.append('{');
                builder.append("\"id\":").append(dto.getId() != null ? dto.getId() : "null");
                builder.append(',');
                builder.append("\"doctorId\":").append(dto.getDoctorId() != null ? dto.getDoctorId() : "null");
                builder.append(',');
                builder.append("\"doctorName\":\"").append(escapeJson(dto.getDoctorName())).append('\"');
                builder.append(',');
                builder.append("\"doctorSpecialty\":\"").append(escapeJson(dto.getDoctorSpecialty())).append('\"');
                builder.append(',');
                builder.append("\"start\":\"").append(escapeJson(dto.getStart())).append('\"');
                builder.append(',');
                builder.append("\"end\":\"").append(escapeJson(dto.getEnd())).append('\"');
                builder.append(',');
                builder.append("\"status\":\"").append(escapeJson(dto.getStatus())).append('\"');
                builder.append(',');
                builder.append("\"appointmentType\":\"").append(escapeJson(dto.getAppointmentType())).append('\"');
                builder.append('}');
                first = false;
            }
            builder.append(']');
            out.write(builder.toString());
        } finally {
            em.close();
        }
    }

    private String escapeJson(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    @Override
    public void destroy() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
        super.destroy();
    }
}
