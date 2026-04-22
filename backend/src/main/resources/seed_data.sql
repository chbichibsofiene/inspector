-- Administrative Hierarchy Setup

-- 1. Insert a Delegation
INSERT INTO delegations (name) VALUES ('Tunis 1 (Admin)');
SET @delegation_id = LAST_INSERT_ID();

-- 2. Insert Departments (Subjects)
INSERT INTO departments (name, delegation_id) VALUES ('Informatique', @delegation_id);
SET @dept_id = LAST_INSERT_ID();
INSERT INTO departments (name, delegation_id) VALUES ('Mathématiques', @delegation_id);
INSERT INTO departments (name, delegation_id) VALUES ('Physique', @delegation_id);

-- 3. Insert Dependencies (Districts or Zones)
INSERT INTO dependencies (name, delegation_id) VALUES ('Zone Nord', @delegation_id);
SET @dependency_id = LAST_INSERT_ID();

-- 4. Insert Etablissements (Schools)
INSERT INTO etablissements (name, school_level, dependency_id) VALUES ('Lycée Pilote Bourguiba', 'SECONDARY', @dependency_id);
SET @school_id = LAST_INSERT_ID();
INSERT INTO etablissements (name, school_level, dependency_id) VALUES ('Collège Carnot', 'PREPARATORY', @dependency_id);
INSERT INTO etablissements (name, school_level, dependency_id) VALUES ('Ecole Primaire Les Pins', 'PRIMARY', @dependency_id);

-- 5. Insert Test Users (Optional: Password 'password123' hashed using BCrypt)
-- Inspector User
INSERT INTO users (email, password, role, enabled, profile_completed, created_at, serial_code) 
VALUES ('inspector@example.com', '$2a$10$T2k71y.k.jQ6H6.iHjQq2O4r9R6bA1oG7C/94N7J6d7gH0n5fB3P6', 'INSPECTOR', true, true, NOW(), 'INSP-1234');
SET @ins_user_id = LAST_INSERT_ID();

INSERT INTO inspector_profiles (user_id, delegation_id, department_id, dependency_id, first_name, last_name, phone, rank, subject, school_level, language) 
VALUES (@ins_user_id, @delegation_id, @dept_id, @dependency_id, 'Admin', 'Inspector', '555-0000', 'INSPECTOR', 'COMPUTER_SCIENCE', 'SECONDARY', 'FRENCH');

-- Teacher User
INSERT INTO users (email, password, role, enabled, profile_completed, created_at, serial_code)
VALUES ('teacher@example.com', '$2a$10$T2k71y.k.jQ6H6.iHjQq2O4r9R6bA1oG7C/94N7J6d7gH0n5fB3P6', 'TEACHER', true, true, NOW(), 'TEACH-1234');
SET @teach_user_id = LAST_INSERT_ID();

-- Teacher Profile
INSERT INTO teacher_profiles (user_id, delegation_id, dependency_id, etablissement_id, first_name, last_name, phone, subject, language)
VALUES (@teach_user_id, @delegation_id, @dependency_id, @school_id, 'Ahmed', 'Trabelsi', '555-1111', 'COMPUTER_SCIENCE', 'FRENCH');
