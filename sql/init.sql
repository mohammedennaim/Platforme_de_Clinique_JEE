-- =============================================
-- Clinique Digitale - Base PostgreSQL (sans gender OTHER)
-- =============================================

DROP SCHEMA IF EXISTS clinique CASCADE;
CREATE SCHEMA clinique;
SET search_path TO clinique;

-- =============================================
--  TABLE: users
-- =============================================
CREATE TABLE users (
                       id            SERIAL PRIMARY KEY,
                       first_name    VARCHAR(50) NOT NULL,
                       last_name     VARCHAR(50) NOT NULL,
                       email         VARCHAR(100) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role          VARCHAR(20) CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT', 'STAFF')) NOT NULL,
                       is_active     BOOLEAN DEFAULT TRUE
);

-- =============================================
--  TABLE: departments
-- =============================================
CREATE TABLE departments (
                             id SERIAL PRIMARY KEY,
                             code VARCHAR(20) UNIQUE NOT NULL,
                             name VARCHAR(100) NOT NULL,
                             description TEXT
);

-- =============================================
--  TABLE: specialties
-- =============================================
CREATE TABLE specialties (
                             id SERIAL PRIMARY KEY,
                             code VARCHAR(20) UNIQUE NOT NULL,
                             name VARCHAR(100) NOT NULL,
                             description TEXT,
                             department_id INT REFERENCES departments(id) ON DELETE SET NULL
);

-- =============================================
--  TABLE: doctors
-- =============================================
CREATE TABLE doctors (
                         id SERIAL PRIMARY KEY,
                         user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                         registration_number VARCHAR(50) UNIQUE NOT NULL,
                         title VARCHAR(50),
                         specialty_id INT REFERENCES specialties(id) ON DELETE SET NULL
);

-- =============================================
--  TABLE: patients
-- =============================================
CREATE TABLE patients (
                          id SERIAL PRIMARY KEY,
                          user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                          cin VARCHAR(20) UNIQUE,
                          birth_date DATE,
                          gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),  -- 🚀 le genre OTHER supprimé
                          address VARCHAR(255),
                          phone_number VARCHAR(20)
);

-- =============================================
--  TABLE: medical_records
-- =============================================
CREATE TABLE medical_records (
                                 id SERIAL PRIMARY KEY,
                                 patient_id INT UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
                                 blood_type VARCHAR(5),
                                 allergies TEXT,
                                 chronic_conditions TEXT
);

-- =============================================
--  TABLE: availabilities
-- =============================================
CREATE TABLE availabilities (
                                id SERIAL PRIMARY KEY,
                                doctor_id INT REFERENCES doctors(id) ON DELETE CASCADE,
                                day_of_week VARCHAR(10) CHECK (day_of_week IN
                                                               ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
                                start_time TIME NOT NULL,
                                end_time TIME NOT NULL,
                                status VARCHAR(20) CHECK (status IN ('AVAILABLE', 'UNAVAILABLE', 'ON_LEAVE')) DEFAULT 'AVAILABLE'
);

-- =============================================
--  TABLE: appointments
-- =============================================
CREATE TABLE appointments (
                              id SERIAL PRIMARY KEY,
                              doctor_id INT REFERENCES doctors(id) ON DELETE CASCADE,
                              patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
                              start_datetime TIMESTAMP NOT NULL,
                              end_datetime TIMESTAMP NOT NULL,
                              status VARCHAR(20) CHECK (status IN ('PLANNED', 'DONE', 'CANCELED')) DEFAULT 'PLANNED',
                              appointment_type VARCHAR(30) CHECK (appointment_type IN ('URGENCY', 'CONTROL', 'ANALYSIS', 'CONSULTATION')),
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
--  TABLE: medical_notes
-- =============================================
CREATE TABLE medical_notes (
                               id SERIAL PRIMARY KEY,
                               appointment_id INT UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
                               content TEXT,
                               is_locked BOOLEAN DEFAULT FALSE
);

-- =============================================
--  TABLE: waiting_list
-- =============================================
CREATE TABLE waiting_list (
                              id SERIAL PRIMARY KEY,
                              patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
                              requested_date DATE NOT NULL,
                              creation_date DATE DEFAULT CURRENT_DATE,
                              priority VARCHAR(10) CHECK (priority IN ('HIGH', 'NORMAL', 'LOW')),
                              status VARCHAR(15) CHECK (status IN ('PENDING', 'NOTIFIED', 'COMPLETED')) DEFAULT 'PENDING'
);

-- =============================================
--  Index et contraintes
-- =============================================
CREATE INDEX idx_doctor_specialty ON doctors(specialty_id);
CREATE INDEX idx_patient_cin ON patients(cin);
CREATE INDEX idx_appointment_doctor_time ON appointments(doctor_id, start_datetime);
CREATE INDEX idx_availability_day ON availabilities(day_of_week);

-- =============================================
--  Données de démo
-- =============================================
INSERT INTO departments (code, name, description)
VALUES ('DEP01', 'Cardiologie', 'Soins du cœur'),
       ('DEP02', 'Dermatologie', 'Maladies de la peau');

INSERT INTO specialties (code, name, description, department_id)
VALUES ('SPEC01', 'Cardiologue', 'Médecin du cœur', 1),
       ('SPEC02', 'Dermatologue', 'Médecin de la peau', 2);

INSERT INTO users (first_name, last_name, email, password_hash, role)
VALUES
    ('Admin', 'Root', 'admin@clinique.com', 'admin', 'ADMIN'),
    ('Dr', 'Martin', 'martin@clinique.com', '1234', 'DOCTOR'),
    ('Alice', 'Dupont', 'alice@clinique.com', '1234', 'PATIENT');

INSERT INTO doctors (user_id, registration_number, title, specialty_id)
VALUES (2, 'DOC-001', 'Dr.', 1);

INSERT INTO patients (user_id, cin, birth_date, gender, address, phone_number)
VALUES (3, 'AA12345', '1990-05-15', 'FEMALE', '12 Rue Santé', '0612345678');

INSERT INTO medical_records (patient_id, blood_type, allergies, chronic_conditions)
VALUES (1, 'O+', 'Aucune', 'Asthme');

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, status)
VALUES
    (1, 'MONDAY', '09:00', '12:00', 'AVAILABLE'),
    (1, 'TUESDAY', '14:00', '17:00', 'AVAILABLE');

INSERT INTO appointments (doctor_id, patient_id, start_datetime, end_datetime, status, appointment_type)
VALUES (1, 1, '2025-05-01 09:00', '2025-05-01 09:30', 'PLANNED', 'CONSULTATION');