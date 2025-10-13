package org.example.clinique.service;

import jakarta.persistence.EntityManager;
import org.example.clinique.dto.RegistrationResult;
import org.example.clinique.entity.*;
import org.example.clinique.entity.enums.Role;
import org.example.clinique.repository.*;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDate;
import java.util.Optional;

public class AuthService {
    private final UserRepository repoUser;
    private final PatientRepository repoPatient;
    private final DoctorRepository repoDoctor;
    private final SpecialtyRepository repoSpecialty;

    public AuthService(EntityManager em) {
        this.repoUser = new UserRepository(em);
        this.repoPatient = new PatientRepository(em);
        this.repoDoctor = new DoctorRepository(em);
        this.repoSpecialty = new SpecialtyRepository(em);
    }

    public Optional<User> login(String email, String plainPassword) {
        User user = repoUser.findByEmail(email);
        if (user == null) {
            return Optional.empty();
        }

        boolean authenticated = user.getActive() &&
                BCrypt.checkpw(plainPassword, user.getPasswordHash());

        return authenticated ? Optional.of(user) : Optional.empty();
    }

    public RegistrationResult register(String firstName, String lastName,
                                       String email, String password,
                                       Role role, String cin, LocalDate birthDate,
                                       String gender, String address,
                                       String phoneNumber, Long specialtyId) {

        // Validation des paramètres d'entrée
        if (email == null || email.trim().isEmpty()) {
            return RegistrationResult.failure("L'email ne peut pas être vide !", RegistrationResult.ERROR_TYPE_VALIDATION);
        }
        if (firstName == null || firstName.trim().isEmpty()) {
            return RegistrationResult.failure("Le prénom ne peut pas être vide !", RegistrationResult.ERROR_TYPE_VALIDATION);
        }
        if (lastName == null || lastName.trim().isEmpty()) {
            return RegistrationResult.failure("Le nom ne peut pas être vide !", RegistrationResult.ERROR_TYPE_VALIDATION);
        }
        if (password == null || password.trim().isEmpty()) {
            return RegistrationResult.failure("Le mot de passe ne peut pas être vide !", RegistrationResult.ERROR_TYPE_VALIDATION);
        }

        // Vérifier si l'utilisateur existe déjà
        Optional<User> existing = Optional.ofNullable(repoUser.findByEmail(email));
        if (existing.isPresent()) {
            return RegistrationResult.failure("Cet email est déjà utilisé.", RegistrationResult.ERROR_TYPE_EMAIL_EXISTS);
        }

        try {
            String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

            switch (role) {
                case PATIENT:
                    Patient patient = new Patient();
                    patient.setFirstName(firstName.trim());
                    patient.setLastName(lastName.trim());
                    patient.setEmail(email.trim());
                    patient.setPasswordHash(hashedPassword);
                    patient.setRole(role);
                    patient.setActive(true);
                    patient.setCin(cin);
                    patient.setGender(gender);
                    patient.setBirthDate(birthDate);
                    patient.setAddress(address);
                    patient.setPhoneNumber(phoneNumber);
                    repoPatient.save(patient);
                    break;

                case DOCTOR:
                    Doctor doctor = new Doctor();
                    doctor.setFirstName(firstName.trim());
                    doctor.setLastName(lastName.trim());
                    doctor.setEmail(email.trim());
                    doctor.setPasswordHash(hashedPassword);
                    doctor.setRole(role);
                    doctor.setActive(true);
                    // Pour un médecin, nous utilisons le CIN comme numéro d'enregistrement temporaire
                    doctor.setRegistrationNumber(cin != null ? cin : "REG_" + System.currentTimeMillis());
                    doctor.setTitle("Dr.");
                    
                    // Associer la spécialité si fournie
                    if (specialtyId != null) {
                        Specialty specialty = repoSpecialty.findById(specialtyId);
                        doctor.setSpecialty(specialty);
                    }
                    
                    repoDoctor.save(doctor);
                    break;

                default:
                    return RegistrationResult.failure("Rôle non supporté: " + role, RegistrationResult.ERROR_TYPE_VALIDATION);
            }

            return RegistrationResult.success();
        } catch (Exception e) {
            System.out.println("Erreur lors de l'enregistrement : " + e.getMessage());
            e.printStackTrace();
            return RegistrationResult.failure("Erreur lors de la création du compte : " + e.getMessage(), RegistrationResult.ERROR_TYPE_DATABASE);
        }
    }
}