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
import org.example.clinique.dto.NextAvailabilityDTO;
import org.example.clinique.entity.Doctor;
import org.example.clinique.entity.User;
import org.example.clinique.entity.enums.Role;
import org.example.clinique.repository.DoctorRepository;
import org.example.clinique.service.AppointmentService;

import java.io.IOException;

@WebServlet("/doctor-dashboard")
public class DoctorDashboardServlet extends HttpServlet {

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
        
        if (sessionUser == null || email == null || sessionUser.getRole() != Role.DOCTOR) {
            resp.sendRedirect(req.getContextPath() + "/dashboard");
            return;
        }

        EntityManager em = emf.createEntityManager();
        try {
            DoctorRepository doctorRepository = new DoctorRepository(em);
            Doctor doctor = doctorRepository.findByUserId(sessionUser.getId());
            
            if (doctor == null) {
                resp.sendRedirect(req.getContextPath() + "/dashboard");
                return;
            }

            AppointmentService appointmentService = new AppointmentService(em);
            
            org.example.clinique.dto.AvailabilityTimeSlotsDTO nextAvailabilityWithSlots = 
                appointmentService.getNextAvailabilityForDoctor(doctor.getId());
            
            // Convertir en NextAvailabilityDTO pour le JSP (pour compatibilité)
            NextAvailabilityDTO nextAvailDTO = null;
            if (nextAvailabilityWithSlots != null) {
                nextAvailDTO = new NextAvailabilityDTO(
                    nextAvailabilityWithSlots.getDoctorId(),
                    nextAvailabilityWithSlots.getDoctorName(),
                    nextAvailabilityWithSlots.getAvailabilityDate(),
                    nextAvailabilityWithSlots.getStartTime(),
                    nextAvailabilityWithSlots.getEndTime(),
                    null, // dayOfWeek
                    "AVAILABLE" // status
                );
            }
            
            req.setAttribute("doctor", doctor);
            req.setAttribute("nextAvailability", nextAvailDTO);
            req.setAttribute("hasNextAvailability", nextAvailDTO != null);
            
            req.getRequestDispatcher("/dashboard-doctor.jsp").forward(req, resp);
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
}
