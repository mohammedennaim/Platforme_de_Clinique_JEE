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
import org.example.clinique.entity.User;
import org.example.clinique.entity.enums.Role;
import org.example.clinique.repository.AppointmentRepository;

import java.io.IOException;

@WebServlet(name = "CancelAppointmentServlet", urlPatterns = {"/api/appointments/cancel"})
public class CancelAppointmentServlet extends HttpServlet {

    private EntityManagerFactory emf;

    @Override
    public void init() {
        emf = Persistence.createEntityManagerFactory("cliniquePU");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // Check authentication
        HttpSession session = req.getSession(false);
        if (session == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\":\"Session expirée\"}");
            return;
        }

        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null || sessionUser.getRole() != Role.PATIENT) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write("{\"error\":\"Accès refusé\"}");
            return;
        }

        // Get appointment ID from request parameter
        String appointmentIdStr = req.getParameter("id");
        if (appointmentIdStr == null || appointmentIdStr.trim().isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"ID de rendez-vous manquant\"}");
            return;
        }

        Long appointmentId;
        try {
            appointmentId = Long.parseLong(appointmentIdStr);
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"ID de rendez-vous invalide\"}");
            return;
        }

        cancelAppointment(appointmentId, resp);
    }

    private void cancelAppointment(Long appointmentId, HttpServletResponse resp) throws IOException {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            
            AppointmentRepository appointmentRepository = new AppointmentRepository(em);
            
            // Cancel the appointment
            appointmentRepository.cancelAppointment(appointmentId);
            
            em.getTransaction().commit();
            
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("{\"success\":true,\"message\":\"Rendez-vous annulé avec succès\"}");
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"Erreur lors de l'annulation: " + e.getMessage() + "\"}");
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
