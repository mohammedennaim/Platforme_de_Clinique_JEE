package org.example.clinique.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.example.clinique.entity.enums.Role;
import org.example.clinique.service.AuthService;

import java.io.IOException;

@WebServlet(urlPatterns = {"/login", "/register"})
public class AuthServlet extends HttpServlet {

    private EntityManagerFactory emf;

    @Override
    public void init() {
        emf = Persistence.createEntityManagerFactory("cliniquePU");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        EntityManager em = emf.createEntityManager();
        AuthService authService = new AuthService(em);

        String path = req.getServletPath();
        HttpSession session = req.getSession();

        switch (path) {
            case "/login" -> {
                String email = req.getParameter("email");
                String password = req.getParameter("password");
                if (authService.login(email, password)) {
                    session.setAttribute("userEmail", email);
                    resp.sendRedirect("dashboard.jsp");
                } else {
                    req.setAttribute("error", "Email ou mot de passe invalide");
                    req.getRequestDispatcher("index.jsp").forward(req, resp);
                }
            }

            case "/register" -> {
                String fn = req.getParameter("firstName");
                String ln = req.getParameter("lastName");
                String email = req.getParameter("email");
                String pass = req.getParameter("password");
                String role = req.getParameter("role");

                boolean ok = authService.register(fn, ln, email, pass, Role.valueOf(role.toUpperCase()));
                if (ok) {
                    req.setAttribute("message", "Compte créé avec succès ! Vous pouvez vous connecter.");
                    req.getRequestDispatcher("index.jsp").forward(req, resp);
                } else {
                    req.setAttribute("error", "Cet email est déjà utilisé.");
                    req.getRequestDispatcher("register.jsp").forward(req, resp);
                }
            }
        }
        em.close();
    }

    @Override
    public void destroy() {
        emf.close();
    }
}