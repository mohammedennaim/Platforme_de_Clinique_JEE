package org.example.clinique.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.example.clinique.entity.User;

import java.io.IOException;

public class DashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        
        HttpSession session = req.getSession();
        String email = (String) session.getAttribute("userEmail");
        User user = (User) session.getAttribute("user");
        
        if (email == null || user == null) {
            resp.sendRedirect(req.getContextPath() + "/index.jsp");
            return;
        }
        
        // Rediriger vers le dashboard approprié selon le rôle
        String dashboardUrl = switch (user.getRole()) {
            case DOCTOR -> "/dashboard-doctor.jsp";
            case PATIENT -> "/reserver?action=viewDashboard"; // Use ReservationServlet to load patient dashboard with data
            case ADMIN -> "/dashboard-admin.jsp";
            case STAFF -> "/dashboard-staff.jsp";
            default -> "/dashboard.jsp";
        };
        
        resp.sendRedirect(req.getContextPath() + dashboardUrl);
    }
}
