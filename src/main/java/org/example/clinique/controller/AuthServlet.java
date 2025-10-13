package org.example.clinique.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.example.clinique.dto.RegistrationResult;
import org.example.clinique.entity.Specialty;
import org.example.clinique.entity.enums.Role;
import org.example.clinique.repository.SpecialtyRepository;
import org.example.clinique.service.AuthService;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public class AuthServlet extends HttpServlet {

    private EntityManagerFactory emf;

    @Override
    public void init() {
        emf = Persistence.createEntityManagerFactory("cliniquePU");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        
        String path = req.getServletPath();
        
        if ("/register".equals(path)) {
            // Charger les spécialités pour le formulaire d'enregistrement
            EntityManager em = emf.createEntityManager();
            try {
                SpecialtyRepository specialtyRepo = new SpecialtyRepository(em);
                List<Specialty> specialties = specialtyRepo.findAll();
                req.setAttribute("specialties", specialties);
                req.getRequestDispatcher("register.jsp").forward(req, resp);
            } finally {
                em.close();
            }
        } else {
            // Pour les autres chemins, rediriger vers la page appropriée
            resp.sendRedirect("index.jsp");
        }
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

                var authenticatedUser = authService.login(email, password);

                if (authenticatedUser.isPresent()) {
                    var user = authenticatedUser.get();
                    session.setAttribute("userEmail", user.getEmail());
                    session.setAttribute("user", user);
                    session.setAttribute("role", user.getRole());
                    resp.sendRedirect("/dashboard");
                } else {
                    session.removeAttribute("user");
                    session.removeAttribute("userEmail");
                    session.removeAttribute("role");
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
                String cin = req.getParameter("cin");
                String birthDate = req.getParameter("birthDate");
                String gender = req.getParameter("gender");
                String address = req.getParameter("address");
                String phone = req.getParameter("phoneNumber");
                String specialtyId = req.getParameter("specialtyId");

                if (fn == null || fn.trim().isEmpty() || 
                    ln == null || ln.trim().isEmpty() || 
                    email == null || email.trim().isEmpty() || 
                    pass == null || pass.trim().isEmpty() || 
                    role == null || role.trim().isEmpty() ||
                    birthDate == null || birthDate.trim().isEmpty()) {
                    req.setAttribute("error", "Tous les champs obligatoires doivent être remplis.");
                    req.getRequestDispatcher("register.jsp").forward(req, resp);
                    return;
                }

                try {
                    em.getTransaction().begin();
                    
                    // Convertir specialtyId en Long si fourni
                    Long specialtyIdLong = null;
                    if (specialtyId != null && !specialtyId.trim().isEmpty()) {
                        try {
                            specialtyIdLong = Long.parseLong(specialtyId);
                        } catch (NumberFormatException e) {
                            // Ignorer si la conversion échoue
                        }
                    }
                    
                    RegistrationResult result = authService.register(fn, ln, email, pass, Role.valueOf(role.toUpperCase()), cin, LocalDate.parse(birthDate), gender, address, phone, specialtyIdLong);
                    if (result.isSuccess()) {
                        em.getTransaction().commit();
                        req.setAttribute("message", "Compte créé avec succès ! Vous pouvez vous connecter.");
                        req.getRequestDispatcher("index.jsp").forward(req, resp);
                    } else {
                        em.getTransaction().rollback();
                        // Recharger les spécialités en cas d'erreur
                        SpecialtyRepository specialtyRepo = new SpecialtyRepository(em);
                        List<Specialty> specialties = specialtyRepo.findAll();
                        req.setAttribute("specialties", specialties);
                        // Afficher le message d'erreur spécifique
                        req.setAttribute("error", result.getErrorMessage());
                        req.getRequestDispatcher("register.jsp").forward(req, resp);
                    }
                } catch (IllegalArgumentException e) {
                    if (em.getTransaction().isActive()) {
                        em.getTransaction().rollback();
                    }
                    // Recharger les spécialités en cas d'erreur
                    SpecialtyRepository specialtyRepo = new SpecialtyRepository(em);
                    List<Specialty> specialties = specialtyRepo.findAll();
                    req.setAttribute("specialties", specialties);
                    req.setAttribute("error", "Rôle invalide ou date de naissance incorrecte.");
                    req.getRequestDispatcher("register.jsp").forward(req, resp);
                } catch (Exception e) {
                    if (em.getTransaction().isActive()) {
                        em.getTransaction().rollback();
                    }
                    // Recharger les spécialités en cas d'erreur
                    SpecialtyRepository specialtyRepo = new SpecialtyRepository(em);
                    List<Specialty> specialties = specialtyRepo.findAll();
                    req.setAttribute("specialties", specialties);
                    req.setAttribute("error", "Erreur lors de la création du compte : " + e.getMessage());
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