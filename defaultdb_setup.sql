-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 07 mai 2026 à 22:37
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `action_logs`, `activities`, `activity_guests`, `activity_reports`, `conversations`, `courses`, `course_assignments`, `course_lessons`, `course_modules`, `delegations`, `departments`, `dependencies`, `etablissements`, `inspections`, `inspector_profiles`, `lesson_progress`, `messages`, `notifications`, `personnel`, `profile_delegations`, `profile_departments`, `profile_dependencies`, `profile_etablissements`, `quizzes`, `quiz_assignments`, `quiz_questions`, `quiz_submissions`, `regions`, `teacher_profiles`, `timetable_slots`, `users`;
SET FOREIGN_KEY_CHECKS = 1;
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `inspector_system_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `action_logs`
--

CREATE TABLE `action_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `action_type` enum('LOGIN','LOGOUT','CREATE','UPDATE','DELETE','EXPORT') NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `entity_id` varchar(255) DEFAULT NULL,
  `entity_type` varchar(255) NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `action_logs`
--

INSERT INTO `action_logs` (`id`, `action_type`, `created_at`, `description`, `entity_id`, `entity_type`, `ip_address`, `user_id`) VALUES
(1, 'LOGIN', '2026-04-28 08:18:41.000000', 'Inspector logged in', '1', 'User', '192.168.1.1', 1),
(2, 'CREATE', '2026-04-28 11:18:41.000000', 'Created new inspection report', NULL, 'Inspection', '192.168.1.1', 1),
(3, 'LOGIN', '2026-04-28 13:52:16.000000', 'User logged in', '4', 'User', NULL, 4),
(4, 'LOGIN', '2026-04-28 13:52:59.000000', 'User logged in', '3', 'User', NULL, 3),
(5, 'LOGIN', '2026-04-29 01:22:10.000000', 'User logged in', '1', 'User', NULL, 1),
(6, 'LOGIN', '2026-04-29 01:23:32.000000', 'User logged in', '3', 'User', NULL, 3),
(7, 'LOGIN', '2026-04-29 18:20:25.000000', 'User logged in', '1', 'User', NULL, 1),
(8, 'CREATE', '2026-04-29 18:22:14.000000', 'User registered', '5', 'User', NULL, 5),
(9, 'LOGIN', '2026-04-29 18:23:08.000000', 'User logged in', '5', 'User', NULL, 5),
(10, 'LOGIN', '2026-04-29 18:25:10.000000', 'User logged in', '2', 'User', NULL, 2),
(11, 'UPDATE', '2026-04-29 19:00:56.000000', 'Password reset successfully', '5', 'User', NULL, 5),
(12, 'LOGIN', '2026-04-29 19:01:12.000000', 'User logged in', '5', 'User', NULL, 5),
(13, 'LOGIN', '2026-04-29 21:41:56.000000', 'User logged in', '5', 'User', NULL, 5),
(14, 'LOGIN', '2026-04-29 22:24:30.000000', 'User logged in', '1', 'User', NULL, 1),
(15, 'LOGIN', '2026-04-30 02:26:59.000000', 'User logged in', '5', 'User', NULL, 5),
(16, 'LOGIN', '2026-04-30 02:27:53.000000', 'User logged in', '5', 'User', NULL, 5),
(17, 'LOGIN', '2026-04-30 02:30:47.000000', 'User logged in', '5', 'User', NULL, 5),
(18, 'CREATE', '2026-04-30 18:05:59.000000', 'User registered', '6', 'User', NULL, 6),
(19, 'LOGIN', '2026-04-30 18:06:25.000000', 'User logged in', '6', 'User', NULL, 6),
(20, 'LOGIN', '2026-04-30 20:57:17.000000', 'User logged in', '5', 'User', NULL, 5),
(21, 'LOGIN', '2026-04-30 23:31:44.000000', 'User logged in', '1', 'User', NULL, 1),
(22, 'LOGIN', '2026-04-30 23:35:16.000000', 'User logged in', '2', 'User', NULL, 2),
(23, 'LOGIN', '2026-04-30 23:41:36.000000', 'User logged in', '1', 'User', NULL, 1),
(24, 'LOGIN', '2026-04-30 23:44:37.000000', 'User logged in', '5', 'User', NULL, 5),
(25, 'LOGIN', '2026-04-30 23:45:21.000000', 'User logged in', '3', 'User', NULL, 3),
(26, 'LOGIN', '2026-04-30 23:45:35.000000', 'User logged in', '5', 'User', NULL, 5),
(27, 'LOGIN', '2026-05-01 15:14:42.000000', 'User logged in', '1', 'User', NULL, 1),
(28, 'LOGIN', '2026-05-01 17:45:42.000000', 'User logged in', '5', 'User', NULL, 5),
(29, 'LOGIN', '2026-05-01 17:46:13.000000', 'User logged in', '2', 'User', NULL, 2),
(30, 'LOGIN', '2026-05-01 17:48:38.000000', 'User logged in', '5', 'User', NULL, 5),
(31, 'LOGIN', '2026-05-01 17:48:56.000000', 'User logged in', '1', 'User', NULL, 1),
(32, 'LOGIN', '2026-05-01 18:09:47.000000', 'User logged in', '1', 'User', NULL, 1),
(33, 'LOGIN', '2026-05-01 18:17:23.000000', 'User logged in', '1', 'User', NULL, 1),
(34, 'LOGIN', '2026-05-01 18:17:45.000000', 'User logged in', '5', 'User', NULL, 5),
(35, 'LOGIN', '2026-05-01 18:18:07.000000', 'User logged in', '3', 'User', NULL, 3),
(36, 'LOGIN', '2026-05-01 18:18:54.000000', 'User logged in', '5', 'User', NULL, 5),
(37, 'LOGIN', '2026-05-01 21:43:02.000000', 'User logged in', '5', 'User', NULL, 5),
(38, 'LOGIN', '2026-05-01 22:16:23.000000', 'User logged in', '1', 'User', NULL, 1),
(39, 'LOGIN', '2026-05-01 22:16:43.000000', 'User logged in', '2', 'User', NULL, 2),
(40, 'LOGIN', '2026-05-01 22:56:39.000000', 'User logged in', '2', 'User', NULL, 2),
(41, 'LOGIN', '2026-05-01 23:31:43.000000', 'User logged in', '5', 'User', NULL, 5),
(42, 'LOGIN', '2026-05-01 23:33:16.000000', 'User logged in', '2', 'User', NULL, 2),
(43, 'LOGIN', '2026-05-02 00:20:08.000000', 'User logged in', '5', 'User', NULL, 5),
(44, 'LOGIN', '2026-05-02 01:05:54.000000', 'User logged in', '2', 'User', NULL, 2),
(45, 'LOGIN', '2026-05-02 11:03:08.000000', 'User logged in', '5', 'User', NULL, 5),
(46, 'LOGIN', '2026-05-03 19:25:33.000000', 'User logged in', '5', 'User', NULL, 5),
(47, 'LOGIN', '2026-05-04 14:52:38.000000', 'User logged in', '5', 'User', NULL, 5),
(48, 'LOGIN', '2026-05-04 16:46:19.000000', 'User logged in', '5', 'User', NULL, 5),
(49, 'LOGIN', '2026-05-05 11:59:17.000000', 'User logged in', '5', 'User', NULL, 5),
(50, 'LOGIN', '2026-05-05 12:04:10.000000', 'User logged in', '5', 'User', NULL, 5),
(51, 'LOGIN', '2026-05-05 13:09:49.000000', 'User logged in', '5', 'User', NULL, 5),
(52, 'LOGIN', '2026-05-05 16:24:18.000000', 'User logged in', '5', 'User', NULL, 5),
(53, 'LOGIN', '2026-05-05 16:31:14.000000', 'User logged in', '5', 'User', NULL, 5),
(54, 'LOGIN', '2026-05-05 18:28:35.000000', 'User logged in', '5', 'User', NULL, 5),
(55, 'LOGIN', '2026-05-07 00:15:41.000000', 'User logged in', '5', 'User', NULL, 5);

-- --------------------------------------------------------

--
-- Structure de la table `activities`
--

CREATE TABLE `activities` (
  `is_online` bit(1) NOT NULL,
  `is_reminder_sent` bit(1) NOT NULL,
  `end_date_time` datetime(6) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `inspector_user_id` bigint(20) NOT NULL,
  `start_date_time` datetime(6) NOT NULL,
  `title` varchar(150) NOT NULL,
  `location` varchar(200) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `meeting_url` varchar(1000) DEFAULT NULL,
  `type` enum('INVITATION_REUNION','VISITE_PEDAGOGIQUE','INSPECTION','FORMATION','LECON_TEMOIN','REUNION_TRAVAIL','SEMINAIRE','COMMISSION','TRAINING') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `activities`
--

INSERT INTO `activities` (`is_online`, `is_reminder_sent`, `end_date_time`, `id`, `inspector_user_id`, `start_date_time`, `title`, `location`, `description`, `meeting_url`, `type`) VALUES
(b'0', b'0', '2026-05-07 11:00:00.000000', 19, 5, '2026-05-07 10:00:00.000000', 'test', 'Online', 'test', NULL, 'REUNION_TRAVAIL');

-- --------------------------------------------------------

--
-- Structure de la table `activity_guests`
--

CREATE TABLE `activity_guests` (
  `activity_id` bigint(20) NOT NULL,
  `teacher_profile_id` bigint(20) NOT NULL,
  PRIMARY KEY (`activity_id`, `teacher_profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `activity_guests`
--

INSERT INTO `activity_guests` (`activity_id`, `teacher_profile_id`) VALUES
(19, 1);

-- --------------------------------------------------------

--
-- Structure de la table `activity_reports`
--

CREATE TABLE `activity_reports` (
  `score` int(11) DEFAULT NULL,
  `activity_id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `inspector_user_id` bigint(20) NOT NULL,
  `teacher_profile_id` bigint(20) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `title` varchar(180) NOT NULL,
  `observations` varchar(4000) NOT NULL,
  `recommendations` varchar(4000) DEFAULT NULL,
  `imported_pdf_file_name` varchar(255) DEFAULT NULL,
  `imported_pdf` longblob DEFAULT NULL,
  `status` enum('DRAFT','FINAL') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `activity_reports`
--

INSERT INTO `activity_reports` (`score`, `activity_id`, `created_at`, `id`, `inspector_user_id`, `teacher_profile_id`, `updated_at`, `title`, `observations`, `recommendations`, `imported_pdf_file_name`, `imported_pdf`, `status`) VALUES
(NULL, 19, '2026-05-07 09:10:27.000000', 7, 5, NULL, '2026-05-07 09:10:27.000000', 'a', 'a', 'a', NULL, NULL, 'DRAFT');

-- --------------------------------------------------------

--
-- Structure de la table `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `last_message_time` datetime(6) NOT NULL,
  `user1_id` bigint(20) NOT NULL,
  `user2_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `conversations`
--

INSERT INTO `conversations` (`id`, `last_message_time`, `user1_id`, `user2_id`) VALUES
(1, '2026-05-01 23:22:53.000000', 1, 2),
(2, '2026-05-04 15:42:37.000000', 2, 5),
(3, '2026-05-02 00:08:37.000000', 5, 6);

-- --------------------------------------------------------

--
-- Structure de la table `courses`
--

CREATE TABLE `courses` (
  `created_at` datetime(6) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `inspector_id` bigint(20) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') NOT NULL,
  `subject` enum('ARABIC','FRENCH','ENGLISH','MATH','PHYSICS','CHEMISTRY','BIOLOGY','HISTORY_GEOGRAPHY','PHILOSOPHY','ISLAMIC_STUDIES','PHYSICAL_EDUCATION','COMPUTER_SCIENCE','ECONOMICS','ARTS','MUSIC') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `courses`
--

INSERT INTO `courses` (`created_at`, `id`, `inspector_id`, `updated_at`, `title`, `description`, `status`, `subject`) VALUES
('2026-05-01 17:45:13.000000', 4, 1, '2026-05-01 17:45:30.000000', 'Modern Pedagogy Technologies', 'This course introduces modern pedagogical approaches enhanced by digital tools and AI. It focuses on improving teaching practices through interactive methods, technology integration, and data-driven evaluation strategies.', 'PUBLISHED', 'MATH'),
('2026-05-02 11:18:09.000000', 5, 3, '2026-05-02 11:18:22.000000', 'test', 'test', 'PUBLISHED', 'MATH');

-- --------------------------------------------------------

--
-- Structure de la table `course_assignments`
--

CREATE TABLE `course_assignments` (
  `assigned_at` datetime(6) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `course_assignments`
--

INSERT INTO `course_assignments` (`assigned_at`, `course_id`, `id`, `teacher_id`) VALUES
('2026-05-01 17:45:22.000000', 4, 4, 1),
('2026-05-02 11:18:15.000000', 5, 5, 1),
('2026-05-02 11:18:19.000000', 5, 6, 2);

-- --------------------------------------------------------

--
-- Structure de la table `course_lessons`
--

CREATE TABLE `course_lessons` (
  `duration_minutes` int(11) DEFAULT NULL,
  `order_index` int(11) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `module_id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` enum('VIDEO','PDF','QUIZ') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `course_lessons`
--

INSERT INTO `course_lessons` (`duration_minutes`, `order_index`, `id`, `module_id`, `title`, `content_url`, `description`, `type`) VALUES
(12, 0, 6, 7, 'Introduction to Digital Pedagogy', 'https://www3.weforum.org/docs/WEF_New_Vision_for_Education.pdf', 'Overview of digital pedagogy principles, including how technology transforms traditional classroom teaching into interactive learning environments.', 'PDF'),
(12, 0, 7, 8, 'etet', 'dqzdq', 'zdqzdq', 'VIDEO');

-- --------------------------------------------------------

--
-- Structure de la table `course_modules`
--

CREATE TABLE `course_modules` (
  `order_index` int(11) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `course_modules`
--

INSERT INTO `course_modules` (`order_index`, `course_id`, `id`, `title`, `description`) VALUES
(0, 4, 7, 'Modern Pedagogy Methods', 'This module explores innovative teaching strategies including flipped classrooms, blended learning, and competency-based education supported by technology.'),
(0, 5, 8, 'tete', 'tete');

-- --------------------------------------------------------

--
-- Structure de la table `delegations`
--

CREATE TABLE `delegations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `region_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `delegations`
--

INSERT INTO `delegations` (`id`, `name`, `region_id`) VALUES
(1, 'Tunis 1 ', 1),
(2, 'Tunis Center', 1),
(3, 'Sousse City', 2),
(4, 'Sfax North', 3);

-- --------------------------------------------------------

--
-- Structure de la table `departments`
--

CREATE TABLE `departments` (
  `delegation_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `departments`
--

INSERT INTO `departments` (`delegation_id`, `id`, `name`) VALUES
(1, 1, 'Directions Régionales de l\'Éducation');

-- --------------------------------------------------------

--
-- Structure de la table `dependencies`
--

CREATE TABLE `dependencies` (
  `delegation_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `dependencies`
--

INSERT INTO `dependencies` (`delegation_id`, `id`, `name`) VALUES
(1, 1, 'Medina'),
(1, 2, 'Montfleury');

-- --------------------------------------------------------

--
-- Structure de la table `etablissements`
--

CREATE TABLE `etablissements` (
  `dependency_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `school_level` enum('PRIMARY','PREPARATORY','SECONDARY') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etablissements`
--

INSERT INTO `etablissements` (`dependency_id`, `id`, `name`, `school_level`) VALUES
(1, 2, 'Lycée Rue du Pacha\r\n', 'SECONDARY');

-- --------------------------------------------------------

--
-- Structure de la table `inspections`
--

CREATE TABLE `inspections` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `score` int(11) NOT NULL,
  `delegation_id` bigint(20) DEFAULT NULL,
  `inspector_user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `inspections`
--

INSERT INTO `inspections` (`id`, `created_at`, `score`, `delegation_id`, `inspector_user_id`) VALUES
(1, '2026-04-23 13:18:41.000000', 85, 2, 1),
(2, '2026-04-25 13:18:41.000000', 92, 3, 1),
(3, '2026-04-27 13:18:41.000000', 78, 4, 1);

-- --------------------------------------------------------

--
-- Structure de la table `inspector_profiles`
--

CREATE TABLE `inspector_profiles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `language` varchar(10) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `rank` enum('INSPECTOR','INSPECTOR_PRINCIPAL','INSPECTOR_GENERAL','INSPECTOR_GENERAL_ADJOINT','INSPECTOR_REGIONAL') NOT NULL,
  `school_level` enum('PRIMARY','PREPARATORY','SECONDARY') NOT NULL,
  `subject` enum('ARABIC','FRENCH','ENGLISH','MATH','PHYSICS','CHEMISTRY','BIOLOGY','HISTORY_GEOGRAPHY','PHILOSOPHY','ISLAMIC_STUDIES','PHYSICAL_EDUCATION','COMPUTER_SCIENCE','ECONOMICS','ARTS','MUSIC') NOT NULL,
  `delegation_id` bigint(20) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `dependency_id` bigint(20) DEFAULT NULL,
  `etablissement_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `inspector_profiles`
--

INSERT INTO `inspector_profiles` (`id`, `user_id`, `language`, `phone`, `first_name`, `last_name`, `rank`, `school_level`, `subject`, `delegation_id`, `department_id`, `dependency_id`, `etablissement_id`) VALUES
(1, 1, 'English', '+21629345090', 'slimen', 'bouthour', 'INSPECTOR', 'SECONDARY', 'MATH', NULL, NULL, NULL, NULL),
(2, 3, 'English', '+21629345090', 'sofienzzz', 'chbichib', 'INSPECTOR', 'SECONDARY', 'MATH', NULL, NULL, NULL, NULL),
(3, 5, 'English', '+21629345090', 'sofien', 'chbichib', 'INSPECTOR', 'SECONDARY', 'MATH', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `completed` bit(1) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `is_read` bit(1) NOT NULL,
  `conversation_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(20) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `content` text NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`is_read`, `conversation_id`, `id`, `sender_id`, `timestamp`, `file_type`, `content`, `file_name`, `file_url`) VALUES
(b'1', 1, 1, 1, '2026-04-27 21:04:47.000000', NULL, '.', NULL, NULL),
(b'1', 1, 2, 1, '2026-04-28 10:47:06.000000', 'image/png', '', 'CNTE logo _.png', '/api/messages/files/618a710f-f31f-4b9b-91f6-0e01a2c5a48b_CNTE logo _.png'),
(b'1', 2, 3, 2, '2026-04-29 18:25:24.000000', NULL, '.', NULL, NULL),
(b'1', 2, 4, 2, '2026-04-29 18:27:36.000000', NULL, '.', NULL, NULL),
(b'1', 2, 5, 2, '2026-04-29 18:32:16.000000', NULL, '.', NULL, NULL),
(b'1', 2, 6, 2, '2026-04-29 18:36:00.000000', NULL, '.', NULL, NULL),
(b'1', 2, 7, 2, '2026-04-29 18:39:10.000000', NULL, '.', NULL, NULL),
(b'1', 2, 8, 2, '2026-04-29 18:45:33.000000', NULL, '.', NULL, NULL),
(b'1', 2, 9, 5, '2026-05-01 21:52:25.000000', NULL, 'Hello', NULL, NULL),
(b'1', 2, 10, 5, '2026-05-01 22:03:34.000000', NULL, 'Hi', NULL, NULL),
(b'1', 2, 11, 2, '2026-05-01 22:16:58.000000', NULL, '.', NULL, NULL),
(b'1', 2, 12, 5, '2026-05-01 22:17:49.000000', NULL, 'Hello', NULL, NULL),
(b'1', 2, 13, 5, '2026-05-01 22:18:35.000000', NULL, '.', NULL, NULL),
(b'1', 2, 14, 2, '2026-05-01 22:18:46.000000', NULL, 'ok', NULL, NULL),
(b'1', 2, 15, 2, '2026-05-01 22:21:55.000000', NULL, '.', NULL, NULL),
(b'1', 2, 16, 2, '2026-05-01 22:22:03.000000', NULL, '.', NULL, NULL),
(b'1', 2, 17, 2, '2026-05-01 22:22:04.000000', NULL, '.', NULL, NULL),
(b'1', 2, 18, 2, '2026-05-01 22:22:05.000000', NULL, '.', NULL, NULL),
(b'1', 2, 19, 2, '2026-05-01 22:22:05.000000', NULL, '.', NULL, NULL),
(b'1', 2, 20, 2, '2026-05-01 22:28:37.000000', NULL, 'hi sir ', NULL, NULL),
(b'1', 2, 21, 2, '2026-05-01 22:32:37.000000', NULL, '.', NULL, NULL),
(b'1', 2, 22, 2, '2026-05-01 22:33:24.000000', NULL, '.', NULL, NULL),
(b'1', 2, 23, 2, '2026-05-01 22:33:25.000000', NULL, '.', NULL, NULL),
(b'1', 2, 24, 2, '2026-05-01 22:33:25.000000', NULL, '.', NULL, NULL),
(b'1', 2, 25, 2, '2026-05-01 22:35:57.000000', NULL, 'hiiiiii', NULL, NULL),
(b'1', 2, 26, 2, '2026-05-01 22:40:12.000000', NULL, '.', NULL, NULL),
(b'1', 2, 27, 5, '2026-05-01 22:45:24.000000', NULL, '.', NULL, NULL),
(b'1', 2, 28, 2, '2026-05-01 22:51:18.000000', NULL, '.', NULL, NULL),
(b'1', 2, 29, 2, '2026-05-01 22:51:27.000000', NULL, '.', NULL, NULL),
(b'1', 2, 30, 2, '2026-05-01 22:51:28.000000', NULL, '.', NULL, NULL),
(b'1', 2, 31, 2, '2026-05-01 23:20:09.000000', NULL, '.', NULL, NULL),
(b'0', 1, 32, 2, '2026-05-01 23:22:53.000000', NULL, 'hi', NULL, NULL),
(b'1', 2, 33, 2, '2026-05-01 23:34:26.000000', NULL, '.', NULL, NULL),
(b'1', 2, 34, 2, '2026-05-01 23:35:55.000000', NULL, 'hello ', NULL, NULL),
(b'0', 3, 35, 5, '2026-05-02 00:08:37.000000', NULL, 'T', NULL, NULL),
(b'1', 2, 36, 2, '2026-05-02 00:11:06.000000', NULL, 'slm ', NULL, NULL),
(b'1', 2, 37, 2, '2026-05-02 00:12:20.000000', 'image/png', '', 'logo.png', '/api/messages/files/8ab8bbed-dff7-4df8-a967-a7905fb62358_logo.png'),
(b'1', 2, 38, 5, '2026-05-02 00:39:19.000000', 'application/pdf', '', 'administrator,+PEMR-2020-2-52-59.pdf', '/api/messages/files/f4092e9e-c2f6-44d5-9baf-ad3c7639dad0_administrator,+PEMR-2020-2-52-59.pdf'),
(b'1', 2, 39, 5, '2026-05-02 01:01:06.000000', 'image/jpeg', '', '3360D89B-4230-4EFC-9879-09CAFE2E4F98.jpg', '/api/messages/files/8fd434d3-b0f6-4612-b5b0-f2ed8f05c7d1_3360D89B-4230-4EFC-9879-09CAFE2E4F98.jpg'),
(b'1', 2, 40, 5, '2026-05-02 01:01:19.000000', 'image/png', '', '992EC982-28EF-4BC7-BF46-5CF022BC6A3F.png', '/api/messages/files/7989dab7-9fca-43c0-8ea2-94bd8adfc1b7_992EC982-28EF-4BC7-BF46-5CF022BC6A3F.png'),
(b'1', 2, 41, 5, '2026-05-02 01:01:26.000000', 'application/pdf', '', 'administrator%2C%2BPEMR-2020-2-52-59.pdf', '/api/messages/files/dbcff8cc-f567-4446-a860-b15132398eed_administrator%2C%2BPEMR-2020-2-52-59.pdf'),
(b'1', 2, 42, 5, '2026-05-02 01:05:15.000000', 'image/jpeg', '', '7EB39AF2-4D5A-4885-A873-85AE4E8A2DAF.jpg', '/api/messages/files/0eee67d8-43fa-477c-a194-95941bf3953d_7EB39AF2-4D5A-4885-A873-85AE4E8A2DAF.jpg'),
(b'1', 2, 43, 5, '2026-05-02 01:05:25.000000', 'image/png', '', '02B71CBD-E67A-4329-91D2-69FBE11BA5CC.png', '/api/messages/files/b3b48d08-0198-43c6-8a16-b701d64aae2e_02B71CBD-E67A-4329-91D2-69FBE11BA5CC.png'),
(b'1', 2, 44, 5, '2026-05-02 01:05:31.000000', 'application/pdf', '', 'administrator%2C%2BPEMR-2020-2-52-59.pdf', '/api/messages/files/5c0bdd07-1b4d-4ea8-a19f-2798e4717d1b_administrator%2C%2BPEMR-2020-2-52-59.pdf'),
(b'1', 2, 45, 2, '2026-05-02 01:06:08.000000', NULL, 'test ', NULL, NULL),
(b'0', 2, 46, 5, '2026-05-02 02:58:07.000000', NULL, 'Hello', NULL, NULL),
(b'0', 2, 47, 5, '2026-05-04 15:42:37.000000', NULL, '.', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `is_read` bit(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `recipient_id` bigint(20) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` varchar(500) NOT NULL,
  `target_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`is_read`, `created_at`, `id`, `recipient_id`, `type`, `title`, `message`, `target_url`) VALUES
(b'1', '2026-04-27 18:22:07.000000', 1, 2, 'QUIZ_ASSIGNED', 'New Quiz Assigned', 'Inspector bouthour has assigned a new quiz: MATH Quiz: les nombres entier', '/teacher/quizzes'),
(b'1', '2026-04-27 18:26:48.000000', 2, 1, 'QUIZ_SUBMITTED', 'Quiz Submitted', 'Teacher sofien chbichib has submitted the quiz: MATH Quiz: les nombres entier (Score: 2/20)', '/inspector/quizzes'),
(b'1', '2026-04-27 21:00:04.000000', 3, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector I-001 invited you to: test', '/teacher/calendar'),
(b'1', '2026-04-27 21:01:35.000000', 4, 2, 'REPORT_FINALIZED', 'New Report Available!', 'Inspector I-001 has finalized a pedagogical report for you.', '/reports'),
(b'1', '2026-04-27 21:04:47.000000', 5, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from slimen bouthour', '/messages'),
(b'1', '2026-04-27 21:06:02.000000', 6, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector I-001 invited you to: weqeqwe', '/teacher/calendar'),
(b'1', '2026-04-27 21:06:59.000000', 7, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector I-001 invited you to: weqeqwe', '/teacher/calendar'),
(b'1', '2026-04-27 21:07:15.000000', 8, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector I-001 invited you to: wqweq', '/teacher/calendar'),
(b'1', '2026-04-27 21:07:31.000000', 9, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector I-001 invited you to: qwerqweeq', '/teacher/calendar'),
(b'1', '2026-04-28 04:57:38.000000', 10, 1, 'ACTIVITY_REMINDER', 'Upcoming Activity Reminder', 'Your activity \'weqeqwe\' is starting in 2 hours.', '/inspector/calendar'),
(b'1', '2026-04-28 04:57:38.000000', 11, 2, 'ACTIVITY_REMINDER', 'Upcoming Activity Reminder', 'Your activity \'weqeqwe\' is starting in 2 hours.', '/teacher/calendar'),
(b'1', '2026-04-28 10:16:12.000000', 12, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector I-002 invited you to: qwqw', '/teacher/calendar'),
(b'1', '2026-04-28 10:19:59.000000', 13, 2, 'REPORT_FINALIZED', 'New Report Available', 'Inspector I-002 has finalized a pedagogical report for you.', '/reports'),
(b'1', '2026-04-28 10:30:50.000000', 14, 2, 'QUIZ_ASSIGNED', 'New Quiz Assigned', 'Inspector bouthour has assigned a new quiz: MATH Quiz: les nombres pairs et impairs', '/teacher/quizzes'),
(b'1', '2026-04-28 10:47:06.000000', 15, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from slimen bouthour', '/messages'),
(b'1', '2026-04-28 10:59:09.000000', 16, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector I-001 invited you to: qqqq', '/teacher/calendar'),
(b'1', '2026-04-28 11:00:41.000000', 17, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector I-001 invited you to: qqqqq', '/teacher/calendar'),
(b'1', '2026-04-29 18:20:47.000000', 18, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector I-001 invited you to: test', '/teacher/calendar'),
(b'1', '2026-04-29 18:22:14.000000', 19, 5, 'REGISTRATION_SUCCESS', 'sofien bouthour', 'Welcome to the Inspector Platform! Your registration was successful.', '/profile'),
(b'1', '2026-04-29 18:24:21.000000', 20, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector T-002 invited you to: testmail', '/teacher/calendar'),
(b'1', '2026-04-29 18:25:24.000000', 21, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-04-29 18:27:36.000000', 22, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-04-29 18:29:45.000000', 23, 5, 'ACTIVITY_REMINDER', 'Upcoming Activity Reminder', 'Your activity \'testmail\' is starting in 2 hours.', '/inspector/calendar'),
(b'1', '2026-04-29 18:29:45.000000', 24, 2, 'ACTIVITY_REMINDER', 'Upcoming Activity Reminder', 'Your activity \'testmail\' is starting in 2 hours.', '/teacher/calendar'),
(b'1', '2026-04-29 18:32:16.000000', 25, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-04-29 18:36:00.000000', 26, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-04-29 18:39:10.000000', 27, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-04-29 18:45:33.000000', 28, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-04-30 02:32:20.000000', 29, 2, 'REPORT_FINALIZED', 'New Report Available!', 'Inspector T-002 has finalized a pedagogical report for you.', '/reports'),
(b'0', '2026-04-30 18:06:00.000000', 30, 6, 'REGISTRATION_SUCCESS', 'fares hammi', 'Welcome to the Inspector Platform! Your registration was successful.', '/profile'),
(b'1', '2026-04-30 20:57:44.000000', 31, 2, 'REPORT_FINALIZED', 'New Report Available', 'Inspector T-002 has finalized a pedagogical report for you.', '/reports'),
(b'1', '2026-04-30 20:58:04.000000', 32, 2, 'REPORT_FINALIZED', 'New Report Available', 'Inspector T-002 has finalized a pedagogical report for you.', '/reports'),
(b'1', '2026-04-30 21:01:26.000000', 33, 2, 'REPORT_FINALIZED', 'New Report Available', 'Inspector T-002 has finalized a pedagogical report for you.', '/reports'),
(b'1', '2026-04-30 23:54:18.000000', 34, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector T-002 invited you to: Meet ', '/teacher/calendar'),
(b'0', '2026-04-30 23:54:18.000000', 35, 6, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector T-002 invited you to: Meet ', '/teacher/calendar'),
(b'1', '2026-04-30 23:57:37.000000', 36, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector T-002 invited you to: Meet', '/teacher/calendar'),
(b'1', '2026-05-01 00:07:46.000000', 37, 2, 'REPORT_FINALIZED', 'New Report Available', 'Inspector T-002 has finalized a pedagogical report for you.', '/reports'),
(b'1', '2026-05-01 15:49:21.000000', 38, 2, 'QUIZ_ASSIGNED', 'New Quiz Assigned', 'Inspector bouthour has assigned a new quiz: MATH Quiz: les nombres entier', '/teacher/quizzes'),
(b'1', '2026-05-01 21:52:25.000000', 39, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:03:35.000000', 40, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:16:58.000000', 41, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:17:49.000000', 42, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:18:35.000000', 43, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:18:46.000000', 44, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:21:56.000000', 45, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:22:03.000000', 46, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:22:04.000000', 47, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:22:05.000000', 48, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:22:05.000000', 49, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:28:37.000000', 50, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:32:37.000000', 51, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:33:24.000000', 52, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:33:25.000000', 53, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:33:25.000000', 54, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:35:57.000000', 55, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:40:12.000000', 56, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:45:24.000000', 57, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:51:18.000000', 58, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:51:27.000000', 59, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 22:51:28.000000', 60, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 23:20:09.000000', 61, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'0', '2026-05-01 23:22:53.000000', 62, 1, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 23:34:26.000000', 63, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-01 23:35:55.000000', 64, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'0', '2026-05-02 00:08:37.000000', 65, 6, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 00:11:06.000000', 66, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 00:12:20.000000', 67, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 00:39:19.000000', 68, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 01:01:06.000000', 69, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 01:01:19.000000', 70, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 01:01:26.000000', 71, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 01:04:48.000000', 72, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector T-002 invited you to: Test', '/teacher/calendar'),
(b'1', '2026-05-02 01:05:15.000000', 73, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 01:05:25.000000', 74, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 01:05:31.000000', 75, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 01:06:08.000000', 76, 5, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 02:58:07.000000', 77, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'1', '2026-05-02 05:51:25.000000', 78, 5, 'ACTIVITY_REMINDER', 'Upcoming Activity Reminder', 'Your activity \'Test\' is starting in 2 hours.', '/inspector/calendar'),
(b'1', '2026-05-02 05:51:25.000000', 79, 2, 'ACTIVITY_REMINDER', 'Upcoming Activity Reminder', 'Your activity \'Test\' is starting in 2 hours.', '/teacher/calendar'),
(b'1', '2026-05-02 07:51:25.000000', 80, 5, 'ACTIVITY_REMINDER', 'Upcoming Activity Reminder', 'Your activity \'Meet\' is starting in 2 hours.', '/inspector/calendar'),
(b'1', '2026-05-02 07:51:25.000000', 81, 2, 'ACTIVITY_REMINDER', 'Upcoming Activity Reminder', 'Your activity \'Meet\' is starting in 2 hours.', '/teacher/calendar'),
(b'0', '2026-05-04 15:42:37.000000', 82, 2, 'NEW_MESSAGE', 'New Message', 'You received a new message from sofien chbichib', '/messages'),
(b'0', '2026-05-05 12:05:35.000000', 83, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector T-002 invited you to: test', '/teacher/calendar'),
(b'0', '2026-05-07 09:06:27.000000', 84, 2, 'ACTIVITY_INVITE', 'Activity Invitation', 'Inspector T-002 invited you to: test', '/teacher/calendar');

-- --------------------------------------------------------

--
-- Structure de la table `personnel`
--

CREATE TABLE `personnel` (
  `recruitment_date` date NOT NULL,
  `cin` varchar(8) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `serial_code` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `role` enum('ADMIN','INSPECTOR','TEACHER') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `personnel`
--

INSERT INTO `personnel` (`recruitment_date`, `cin`, `id`, `serial_code`, `first_name`, `last_name`, `role`) VALUES
('2026-04-08', '14666160', 1, 'I-001', 'slimen', 'bouthour', 'INSPECTOR'),
('2026-04-07', '14785236', 2, 'T-001', 'sofien', 'chbichib\r\n', 'TEACHER'),
('2026-04-15', '12345678', 3, 'I-002', 'slimen', 'chbichib', 'ADMIN'),
('2026-04-08', '01234567', 4, 'T-002', 'sofien', 'bouthour', 'ADMIN'),
('2026-04-08', '14672743', 5, 'T-003', 'fares', 'hammi', 'TEACHER');

-- --------------------------------------------------------

--
-- Structure de la table `profile_delegations`
--

CREATE TABLE `profile_delegations` (
  `profile_id` bigint(20) NOT NULL,
  `delegation_id` bigint(20) NOT NULL,
  PRIMARY KEY (`profile_id`, `delegation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `profile_delegations`
--

INSERT INTO `profile_delegations` (`profile_id`, `delegation_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(3, 1),
(3, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Structure de la table `profile_departments`
--

CREATE TABLE `profile_departments` (
  `profile_id` bigint(20) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  PRIMARY KEY (`profile_id`, `department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `profile_departments`
--

INSERT INTO `profile_departments` (`profile_id`, `department_id`) VALUES
(1, 1),
(3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `profile_dependencies`
--

CREATE TABLE `profile_dependencies` (
  `profile_id` bigint(20) NOT NULL,
  `dependency_id` bigint(20) NOT NULL,
  PRIMARY KEY (`profile_id`, `dependency_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `profile_dependencies`
--

INSERT INTO `profile_dependencies` (`profile_id`, `dependency_id`) VALUES
(1, 1),
(1, 2),
(3, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Structure de la table `profile_etablissements`
--

CREATE TABLE `profile_etablissements` (
  `profile_id` bigint(20) NOT NULL,
  `etablissement_id` bigint(20) NOT NULL,
  PRIMARY KEY (`profile_id`, `etablissement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `profile_etablissements`
--

INSERT INTO `profile_etablissements` (`profile_id`, `etablissement_id`) VALUES
(1, 2),
(3, 2);

-- --------------------------------------------------------

--
-- Structure de la table `quizzes`
--

CREATE TABLE `quizzes` (
  `created_at` datetime(6) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `inspector_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `topic` varchar(255) NOT NULL,
  `subject` enum('ARABIC','FRENCH','ENGLISH','MATH','PHYSICS','CHEMISTRY','BIOLOGY','HISTORY_GEOGRAPHY','PHILOSOPHY','ISLAMIC_STUDIES','PHYSICAL_EDUCATION','COMPUTER_SCIENCE','ECONOMICS','ARTS','MUSIC') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `quizzes`
--

INSERT INTO `quizzes` (`created_at`, `id`, `inspector_id`, `title`, `topic`, `subject`) VALUES
('2026-04-27 18:22:07.000000', 1, 1, 'MATH Quiz: les nombres entier', 'les nombres entier', 'MATH'),
('2026-04-28 10:30:50.000000', 2, 1, 'MATH Quiz: les nombres pairs et impairs', 'les nombres pairs et impairs', 'MATH'),
('2026-05-01 15:49:21.000000', 3, 1, 'MATH Quiz: les nombres entier', 'les nombres entier', 'MATH');

-- --------------------------------------------------------

--
-- Structure de la table `quiz_assignments`
--

CREATE TABLE `quiz_assignments` (
  `quiz_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) NOT NULL,
  PRIMARY KEY (`quiz_id`, `teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `quiz_assignments`
--

INSERT INTO `quiz_assignments` (`quiz_id`, `teacher_id`) VALUES
(3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint(20) NOT NULL,
  `correct_answer` text DEFAULT NULL,
  `options` text DEFAULT NULL,
  `question_text` text NOT NULL,
  `type` enum('MCQ','FREE_TEXT') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `quiz_id`, `correct_answer`, `options`, `question_text`, `type`) VALUES
(1, 1, 'L\'usage de contextes concrets comme les températures ou les altitudes', '[\"L\'utilisation exclusive de la règle des signes apprise par cœur\",\"L\'usage de contextes concrets comme les températures ou les altitudes\",\"La définition formelle par les classes d\'équivalence de couples d\'entiers\",\"L\'introduction directe par le calcul littéral\"]', 'Quelle approche didactique est privilégiée pour introduire les nombres relatifs en début de cycle 4 ?', 'MCQ'),
(2, 1, '0', '[\"1\",\"0\",\"-1\",\"Il n\'existe pas d\'élément neutre\"]', 'Quel est l\'élément neutre pour l\'addition dans l\'ensemble des entiers relatifs (Z) ?', 'MCQ'),
(3, 1, 'L\'ordre inverse des opposés sur la droite graduée', '[\"La commutativité\",\"L\'ordre inverse des opposés sur la droite graduée\",\"La valeur absolue\",\"La distributivité\"]', 'Un élève affirme que -8 est supérieur à -2 car 8 est plus grand que 2. Quel concept didactique cet élève n\'a-t-il pas encore intégré ?', 'MCQ'),
(4, 1, 'Soustraire un nombre revient à ajouter son opposé', '[\"La soustraction n\'est pas toujours possible\",\"Soustraire un nombre revient à ajouter son opposé\",\"La soustraction est commutative\",\"La soustraction est associative\"]', 'Dans l\'ensemble Z, quelle affirmation concernant l\'opération de soustraction est correcte ?', 'MCQ'),
(5, 1, 'De l\'allemand \'Zahlen\' (nombres)', '[\"De l\'italien \'Zero\'\",\"De l\'allemand \'Zahlen\' (nombres)\",\"Du grec \'Zeta\'\",\"Du français \'Zone\'\"]', 'D\'où provient la lettre \'Z\' utilisée pour désigner l\'ensemble des entiers relatifs ?', 'MCQ'),
(6, 1, 'Le modèle des jetons (annihilation de paires positif/négatif)', '[\"Le modèle des jetons (annihilation de paires positif/négatif)\",\"Le modèle de l\'aire d\'un rectangle\",\"L\'utilisation d\'un diagramme de Venn\",\"Le tableau de proportionnalité\"]', 'Parmi les modèles suivants, lequel est le plus efficace pour modéliser l\'addition d\'entiers de signes contraires ?', 'MCQ'),
(7, 1, 'Toujours positif', '[\"Toujours négatif\",\"Toujours positif\",\"Nul\",\"Cela dépend de la valeur absolue des facteurs\"]', 'Quel est le résultat du produit d\'un nombre pair de facteurs négatifs ?', 'MCQ'),
(8, 1, 'La réponse doit présenter une suite décroissante montrant une régularité : par exemple, 3*(-2)=-6, 2*(-2)=-4, 1*(-2)=-2, 0*(-2)=0, donc en suivant la progression de +2 à chaque étape, -1*(-2) doit égaler +2.', NULL, 'Expliquez brièvement comment justifier la règle \'moins par moins égale plus\' à un élève en utilisant une suite logique de multiplications.', 'FREE_TEXT'),
(9, 1, 'La réponse doit évoquer la difficulté historique et cognitive de concevoir un nombre comme une \'quantité inférieure à rien\' ou le passage d\'un nombre-grandeur à un nombre-position/état.', NULL, 'Qu\'est-ce qu\'un obstacle épistémologique dans l\'apprentissage des nombres négatifs ?', 'FREE_TEXT'),
(10, 1, 'La réponse peut inclure l\'utilisation de parenthèses systématiques pour les nombres, l\'usage de couleurs différentes pour le signe opératoire et le signe de polarité, ou le recours à la droite graduée pour visualiser les déplacements.', NULL, 'Proposez une activité de remédiation pour un élève qui confond le signe \'moins\' de l\'opération (soustraction) avec le signe \'moins\' de polarité (nombre négatif).', 'FREE_TEXT'),
(11, 2, '2n + 1', '[\"2n\",\"2n + 1\",\"n + 2\",\"n / 2\"]', 'Quelle est la définition algébrique standard d\'un nombre impair, où n désigne un nombre entier relatif ?', 'MCQ'),
(12, 2, 'Le groupement par paires d\'objets (jetons, cubes)', '[\"La mémorisation d\'une liste de nombres\",\"Le groupement par paires d\'objets (jetons, cubes)\",\"L\'utilisation d\'une calculatrice\",\"La division euclidienne par 3\"]', 'Lors de l\'introduction de la parité au cycle 2, quelle approche de manipulation est généralement recommandée pour favoriser la compréhension conceptuelle ?', 'MCQ'),
(13, 2, 'Toujours impair', '[\"Toujours pair\",\"Toujours impair\",\"Pair si les nombres sont consécutifs\",\"Cela dépend de la valeur des nombres\"]', 'Quelle est la parité du résultat de la somme de trois nombres impairs ?', 'MCQ'),
(14, 2, 'Il est pair', '[\"Il est impair\",\"Il est pair\",\"Il n\'est ni pair ni impair\",\"Il est à la fois pair et impair\"]', 'Parmi les propositions suivantes, laquelle caractérise mathématiquement le nombre zéro ?', 'MCQ'),
(15, 2, 'a et b sont tous les deux impairs', '[\"a et b sont tous les deux pairs\",\"a est pair et b est impair\",\"a et b sont tous les deux impairs\",\"Au moins l\'un des deux est pair\"]', 'Si le produit de deux nombres entiers \'a\' et \'b\' est un nombre impair, que peut-on affirmer avec certitude ?', 'MCQ'),
(16, 2, '8', '[\"6\",\"10\",\"8\",\"14\"]', 'Un enseignant souhaite illustrer que \'la moitié d\'un nombre pair n\'est pas forcément un nombre impair\'. Quel contre-exemple doit-il choisir ?', 'MCQ'),
(17, 2, 'La divisibilité par 2', '[\"La commutativité\",\"L\'associativité\",\"La divisibilité par 2\",\"La distributivité\"]', 'Quelle propriété des nombres pairs est utilisée pour simplifier des fractions dont le numérateur et le dénominateur se terminent par 0, 2, 4, 6 ou 8 ?', 'MCQ'),
(18, 2, 'La réponse doit utiliser le formalisme algébrique : soit (2n+1) et (2m+1) deux nombres impairs. Leur somme est (2n+1) + (2m+1) = 2n + 2m + 2 = 2(n + m + 1). Puisque la somme s\'écrit sous la forme 2k (avec k = n+m+1), le résultat est pair.', NULL, 'Comment justifieriez-vous mathématiquement auprès d\'élèves de fin de collège que la somme de deux nombres impairs est toujours un nombre pair ?', 'FREE_TEXT'),
(19, 2, 'Une réponse parfaite propose une activité de distribution ou de rangement : par exemple, demander aux élèves de former des paires de chaussures ou de gants. Si chaque objet a un partenaire, le nombre total est pair ; s\'il en reste un tout seul, le nombre est impair.', NULL, 'Proposez une situation-problème concrète pour aider des élèves de CP à distinguer un nombre pair d\'un nombre impair sans utiliser la division.', 'FREE_TEXT'),
(20, 2, 'La réponse doit mentionner l\'observation de suites de nombres consécutifs de grande taille (ex: 1 000 000 et 1 000 001) pour montrer l\'alternance constante. Il faut amener l\'élève à conclure que seule l\'unité définit la parité, indépendamment de la \'taille\' visuelle du nombre.', NULL, 'Certains élèves pensent que plus un nombre possède de chiffres, plus il a de chances d\'être pair. Quelle stratégie pédagogique mettriez-vous en place pour déconstruire cette erreur ?', 'FREE_TEXT'),
(21, 3, 'L\'utilisation de contextes concrets tels que l\'ascenseur, le thermomètre ou les dettes', '[\"Une approche purement axiomatique basée sur la structure de groupe\",\"L\'utilisation de contextes concrets tels que l\'ascenseur, le thermomètre ou les dettes\",\"L\'introduction directe par la multiplication de deux nombres négatifs\",\"La construction formelle à partir de classes d\'équivalence de couples d\'entiers naturels\"]', 'Quelle approche didactique est privilégiée pour introduire les nombres relatifs en début de cycle 4 (classe de 5ème) ?', 'MCQ'),
(22, 3, 'L\'impossibilité de concevoir une quantité inférieure à zéro (le \'moins que rien\')', '[\"La mémorisation des tables de multiplication\",\"L\'impossibilité de concevoir une quantité inférieure à zéro (le \'moins que rien\')\",\"La difficulté à tracer une droite graduée\",\"Le passage de l\'écriture décimale à l\'écriture fractionnaire\"]', 'Quel est l\'obstacle épistémologique majeur rencontré par les élèves lors de la transition des entiers naturels (N) vers les entiers relatifs (Z) ?', 'MCQ'),
(23, 3, 'Distinguer le signe de l\'opération (soustraction) du signe de polarité du nombre (négatif)', '[\"Il n\'y a aucune distinction, les deux signes ont la même fonction\",\"Distinguer le signe de l\'opération (soustraction) du signe de polarité du nombre (négatif)\",\"Expliquer que le premier moins est une multiplication cachée\",\"Indiquer que les parenthèses transforment systématiquement les nombres en positifs\"]', 'Dans l\'expression \'5 - (-3)\', quelle distinction sémantique essentielle l\'enseignant doit-il faire pour aider l\'élève ?', 'MCQ'),
(24, 3, 'Une extension erronée de l\'ordre des entiers naturels basée sur la distance à zéro', '[\"Une confusion entre l\'opposé et l\'inverse\",\"Une mauvaise lecture de la graduation\",\"Une extension erronée de l\'ordre des entiers naturels basée sur la distance à zéro\",\"Une erreur de calcul mental de base\"]', 'Quelle erreur de raisonnement un élève commet-il s\'il affirme que -8 est plus grand que -2 ?', 'MCQ'),
(25, 3, 'L\'existence d\'un symétrique pour chaque élément dans la structure de groupe (Z, +)', '[\"L\'existence d\'un élément neutre pour l\'addition\",\"La commutativité de l\'addition dans Z\",\"L\'existence d\'un symétrique pour chaque élément dans la structure de groupe (Z, +)\",\"La distributivité de la multiplication sur l\'addition\"]', 'Quelle propriété mathématique justifie que la somme de deux entiers relatifs opposés est nulle ?', 'MCQ'),
(26, 3, 'Le modèle des jetons (jetons rouges pour négatifs, jetons bleus pour positifs) with annulation par paires', '[\"L\'utilisation d\'une balance à deux plateaux\",\"Le modèle des jetons (jetons rouges pour négatifs, jetons bleus pour positifs) avec annulation par paires\",\"Le calcul de l\'aire d\'un rectangle\",\"L\'utilisation de blocs de base 10\"]', 'Parmi ces modèles de manipulation, lequel est le plus efficace pour illustrer l\'addition (-4) + (+3) ?', 'MCQ'),
(27, 3, 'Par l\'extension de la distributivité : (-1) * [1 + (-1)] = 0', '[\"C\'est une règle arbitraire décidée par les mathématiciens\",\"Par l\'extension de la distributivité : (-1) * [1 + (-1)] = 0\",\"Parce que deux signes \'moins\' s\'annulent visuellement pour former un \'plus\'\",\"Uniquement par l\'utilisation de la calculatrice\"]', 'Pourquoi le produit de deux nombres négatifs est-il positif ? Quelle justification pédagogique est souvent utilisée ?', 'MCQ'),
(28, 3, 'L\'élève peut utiliser le concept de \'déplacement\' ou de \'distance orientée\'. Pour a - b, on part de b et on regarde le chemin pour aller vers a. Si on se déplace vers la droite, le résultat est positif ; vers la gauche, il est négatif. On peut aussi modéliser cela comme faire demi-tour (le signe moins de l\'opération) puis avancer ou reculer (le signe du nombre).', NULL, 'Décrivez une activité pédagogique utilisant la \'droite numérique\' pour faire comprendre la soustraction de deux entiers relatifs.', 'FREE_TEXT'),
(29, 3, 'La réponse parfaite doit mentionner la priorité des opérations : le carré s\'applique uniquement au nombre 3 et non au signe moins, sauf s\'il y a des parenthèses (-3)². L\'enseignant doit insister sur la lecture de l\'expression : \'l\'opposé du carré de 3\' versus \'le carré de l\'opposé de 3\'.', NULL, 'Expliquez comment vous géreriez la confusion d\'un élève qui écrit \'-3² = 9\' au lieu de \'-3² = -9\'.', 'FREE_TEXT'),
(30, 3, 'Avantages : Très intuitif pour l\'ordre (plus il fait froid, plus le nombre est petit) et pour les additions/soustractions simples (variations de température). Limites : Difficilement utilisable pour modéliser la multiplication ou la division de nombres négatifs, et peut induire une confusion si l\'élève ne perçoit pas la verticalité comme une droite numérique.', NULL, 'Quels sont les avantages et les limites du modèle du \'thermomètre\' pour enseigner les opérations sur les entiers relatifs ?', 'FREE_TEXT');

-- --------------------------------------------------------

--
-- Structure de la table `quiz_submissions`
--

CREATE TABLE `quiz_submissions` (
  `score` int(11) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint(20) NOT NULL,
  `submitted_at` datetime(6) NOT NULL,
  `teacher_id` bigint(20) NOT NULL,
  `answers` longtext NOT NULL,
  `evaluation_text` text DEFAULT NULL,
  `training_suggestion` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `quiz_submissions`
--

INSERT INTO `quiz_submissions` (`score`, `id`, `quiz_id`, `submitted_at`, `teacher_id`, `answers`, `evaluation_text`, `training_suggestion`) VALUES
(2, 1, 1, '2026-04-27 18:26:48.000000', 1, '{\"1\":\"L\'utilisation exclusive de la règle des signes apprise par cœur\",\"2\":\"0\",\"3\":\"La valeur absolue\",\"4\":\"La soustraction n\'est pas toujours possible\",\"5\":\"Du grec \'Zeta\'\",\"6\":\"L\'utilisation d\'un diagramme de Venn\",\"7\":\"Nul\",\"8\":\".\",\"9\":\".\",\"10\":\".\"}', 'The teacher\'s performance is very poor, with only one correct answer out of ten. Most fundamental didactic and mathematical concepts regarding relative numbers were answered incorrectly. Furthermore, the teacher failed to provide any content for the free-text questions, indicating a significant gap in pedagogical knowledge and engagement with the subject matter.', 'Deep-immersion professional development program on the \'Didactics and History of Mathematics for Cycle 4\', specifically focusing on the conceptualization of negative numbers, historical epistemological obstacles, and diverse modeling strategies for integer operations.');

-- --------------------------------------------------------

--
-- Structure de la table `regions`
--

CREATE TABLE `regions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `regions`
--

INSERT INTO `regions` (`id`, `name`) VALUES
(3, 'Sfax'),
(2, 'Sousse'),
(1, 'Tunis');

-- --------------------------------------------------------

--
-- Structure de la table `teacher_profiles`
--

CREATE TABLE `teacher_profiles` (
  `delegation_id` bigint(20) NOT NULL,
  `dependency_id` bigint(20) NOT NULL,
  `etablissement_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `language` varchar(10) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `subject` enum('ARABIC','FRENCH','ENGLISH','MATH','PHYSICS','CHEMISTRY','BIOLOGY','HISTORY_GEOGRAPHY','PHILOSOPHY','ISLAMIC_STUDIES','PHYSICAL_EDUCATION','COMPUTER_SCIENCE','ECONOMICS','ARTS','MUSIC') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `teacher_profiles`
--

INSERT INTO `teacher_profiles` (`delegation_id`, `dependency_id`, `etablissement_id`, `id`, `user_id`, `language`, `phone`, `first_name`, `last_name`, `subject`) VALUES
(1, 1, 2, 1, 2, 'English', '+21622547780', 'sofien', 'chbichib', 'MATH'),
(1, 1, 2, 2, 6, 'French', '+21622547780', 'fares', 'hammi', 'MATH');

-- --------------------------------------------------------

--
-- Structure de la table `timetable_slots`
--

CREATE TABLE `timetable_slots` (
  `end_time` time(6) NOT NULL,
  `start_time` time(6) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `teacher_profile_id` bigint(20) NOT NULL,
  `classroom` varchar(100) DEFAULT NULL,
  `level` varchar(100) DEFAULT NULL,
  `day_of_week` enum('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY') NOT NULL,
  `subject` enum('ARABIC','FRENCH','ENGLISH','MATH','PHYSICS','CHEMISTRY','BIOLOGY','HISTORY_GEOGRAPHY','PHILOSOPHY','ISLAMIC_STUDIES','PHYSICAL_EDUCATION','COMPUTER_SCIENCE','ECONOMICS','ARTS','MUSIC') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `timetable_slots`
--

INSERT INTO `timetable_slots` (`end_time`, `start_time`, `id`, `teacher_profile_id`, `classroom`, `level`, `day_of_week`, `subject`) VALUES
('10:00:00.000000', '08:00:00.000000', 1, 1, 'test', 'test', 'MONDAY', 'MATH'),
('09:00:00.000000', '08:00:00.000000', 2, 1, 's22', '2eme ', 'WEDNESDAY', 'MATH'),
('10:00:00.000000', '08:00:00.000000', 3, 2, 'ti1', '2eme', 'MONDAY', 'MATH');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `enabled` bit(1) NOT NULL,
  `is_microsoft_connected` bit(1) NOT NULL,
  `profile_completed` bit(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `verified_at` datetime(6) DEFAULT NULL,
  `serial_code` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','INSPECTOR','TEACHER') NOT NULL,
  `profile_image_url` longtext DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `cin` varchar(20) DEFAULT NULL,
  `reset_code` varchar(6) DEFAULT NULL,
  `reset_code_expires_at` datetime(6) DEFAULT NULL,
  `expo_push_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`enabled`, `is_microsoft_connected`, `profile_completed`, `created_at`, `id`, `verified_at`, `serial_code`, `email`, `password`, `role`, `profile_image_url`, `name`, `cin`, `reset_code`, `reset_code_expires_at`, `expo_push_token`) VALUES
(b'1', b'0', b'1', '2026-04-27 16:48:26.000000', 1, NULL, 'I-001', 'slimen.bouthour@inspector.tn', '$2a$10$P3lQBROTgyxXJHZ2aFLIZOLJQQ18MXTpkkTtSsnfhxbHw.jS0LAeS', 'ADMIN', '', NULL, NULL, NULL, NULL, NULL),
(b'1', b'0', b'1', '2026-04-27 16:55:47.000000', 2, NULL, 'T-001', 'sofien.chbichib@teacher.tn', '$2a$10$fa.xIgEQK6/gpiipR9FSu.qEqxmn32njNQj.hu.nGTblQfe8CL3cm', 'TEACHER', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAEsASwDASIAAhEBAxEB/8QAHgAAAAcBAQEBAAAAAAAAAAAAAQIDBAUGBwgACQr/xABIEAACAQMCAwUGAwUFBgUEAwABAgMABBEFIQYSMQcTQVFhCCJxgZGhFDKxI0LB0fAJFVJi4SQlM3KCohZDkrLCJlOD0mNz8f/EABsBAAICAwEAAAAAAAAAAAAAAAABAgMEBQYH/8QALhEAAgIBAwMDAgYCAwAAAAAAAAECEQMEITEFEkEiMlETYQYUcYGhsSMkkcHw/9oADAMBAAIRAxEAPwCgKuKE58OtC693LJGQQUYrv6bUDHCk1M4hcisdJhsN86Ov5aKBuaROrD9RXgOorwGKHxpAGXpQctexkCrVrvBq6Zpz3kM3MVmVWiI/LG65R8+pVvtSHu7oqwGKcNZSx28E5XKTc3Jjx5Tg0U2kojL92/J/i5Dj64q1WVkx4HkvhC8xiZ4FZVJEfMylmPlsMf8AVQNJvYqiLzGllTHhiixjB9KV8cUDQmRzA0hP+TFPOT9aaTDCkmgmja/ZY0aKfUbqbkE0gm5cjw26fDeu2IV7mBFAxygbVyp7Htojw6sVUc6XWSceBVa6scE1zOodzaPUNKv8MX9hhfH3HPnUBcEZNWG7ZRG3NVbuZEeRgDuBWvcTcYuKIi4iLqcVHS5C/KpgMgJBO5plKqZcEjmA3qtwb4MtySRAX5KoVHUiuQ/ar0FIkOoOu7MAcD0xXW2s3SW55mOV8wa549qK3WbgS6vAeZV2AA8fCrtPLsyJMwdVFSxORgXZ2rNwZayA8y97LH8CGP8AOrzrlp/d9+tqsfIixqwz4825/l8qp3Zoe74Gjgce9zd+CPPnYH7H7VoOoatacT2lxLcOLK/hkZ4FC5SSNjkxk+BB6V2cPajx/Ub5pP7kGlxLZuJIW5XwVz6EYP2NM0HukeJNOZBhKVttMuLmBp4omeJM8xHhjGf1FTsxxiRjFCje950+060jmnjaZytuz8pKDJ6ZqVb/AMN2sjiSLUZsbYPIu/1phRARtknbY0rKuEU+dSf4vSSpMGnzLnoZJQf4Uymw3QYHgKVjobJqt0lrc6cHC2s7pI6co3ZM8pB8PzGg07UYYY1/EOQ1s7ywjlyGJXZfT3gp+tJuAsnN4g0wbBkPqaQbrkB5C2WO7HcnzpNlJX70ty5PSkiWkcgDIHgBTsVAKKlodZu4prFrMd3JbQG35VXmEilmY8w8fzUz0+6htXZ5bdbkcuFVmwM+dWPTrq/ktrq9sYrawjjjL5C55sKWIGfHAJpclsUVXUbC5hXvJraSBWbbmTA+FRpTc7VOXuoXV6zC4uJJgTnDHxqGlGHNSEWu9uI7u5aZE5OfBYf5sb/fNIEZGKGMUbANBQeXpRkXOceFS/D+uHQjcMLCyvjMoX/bIhJyYOcrnoaeT8balIw5fw0KeCRQIoH2qPIyu4qa0KG2tLW41W+tvxdtCwhSDmwHkYEjPoACT8qjry9kvpOeUqX/AMqgfpT+e4YcGW1vy4Q38shbHUiOMAfr9aAI+9iUBZY15I5csq56bkYq5alq1tqV1ri20/e2zaZa8p6YeMRBsfMuKrclo0nDVldAHC3MsJPxCsP40wDtGGCkgEb48fSkWRaiS99xbqusR8lzeSSRBQgToAMdMVZrHVpeH+BtMgkBaw1WS679R1ZQUAI+BWqFCMIfM0+a9nntbe3kmd4bfm7pCdk5jk48sneginuONX0WXSZYyXSaCZeeKWM5DCmC9aMc5x4eXgKFEyaCSQfqBimFw2EYGpDGKZG1lvZ0t4I2lnlcIkajJZicACk3W7LKb2R0L7K3FWmcG6RxRqWuX9vpenI6OLi5kCKdsEDPjt0qQ449uvh+DFrwmDqdyxIjkkiblkwcYUYyfpXOXGvYlx/b8X6RpNxpxjtmjM8UbnmjZsDIPqCcGp/2ZNFseDdA17WtXgVNXh1B7EiQe9CqohZFP7vvM2fPFc/kjj73Nu38HpGijllgjCSqvkmNd9qntg1rvriw0mLTbe3UvJ31nJykDrk42q59iftKXfF9xLbcS/h7LUsKyqjjldcbsPTNRXG/aPqMEt3o50ZIXvreP8ObmTDyh8AEDy3G1Z/2hJpnEHY7fapc6eLTW+HHWdHbGY5I3XKg9eVl2I6YNLLGMkodtX5Nhp5uLcu60uUbt2ldtacP6Jf3mkzw3t9GhMUKOGy3QbD+tq5Kfi3t27TL1ruxv75EjJylirOB/wCgEfWq5H2V3vAfaZwsnEkHe2euW73DIykKQqGXkI8RkLn0NbvwPx3rUugXTwTrpsZjkmhtgvOsqrtysP3TuPhU8GGEFz3C1c5z39qX7ma2HaZ2o8GXEN5xFPdTWasFeLULZ41lXxAcjlDYBwc1Yu0Ttl0HtK7Kb6OylliunkwsE6FWyAxIB6ZGKnou1N714dH1G3zK8YaeNlVoJOYfkG2+AQPiDXMTcC6lY9oWuwaezf3MuqrZwQJnlaUrzBQP8oJGfWoqOKeS5KqKprNiwtr1WaVwHGU4Xg93lAt1+7ZqegjaVgiqXY9ABmpnVuCLns+0SztLuWKV7qOIgJ1QqvvKfX3h9aJwq2ox3rPpt9HYzBN3kkCZHkDW/wAcoyipRdo8z1OOePNKGRUxhfWk9uB3kMkQY7c6kZqycGarb2FpLFcycqyXUSsuOsbZEn2AprrUF9es0+p6kLucZPM0vOflVeOeYAVOzF3slHs2tEvrdXDtDdBOcHY45hkfSmWoW0kuptDGheRyOVFGSSQKeWO63EY32RxnxIP8iaNeyBL7UXUlWV1hDKcY33+y0Emhtb2Tm6hhmBi/aKj56rvg0rqFm9oQpjcAAe8ykDJ8M0vqEkkf4KQ7ytGDlvNTgZ+1FvtavL6NopZ2aIsX7sn3QT1wPCkFEKwXvcOSFzuR1xTuS30EHIurpnG4QR4H1ptCn4h35mC5blDHoBUlqHCUlnGjC8tJQxG8cmaApsh7tbYSj8KXMYHWTqTTm01BtCRZLdV/ETJguRnCEkEfMYH1pG7sPwiqe/jkOcEIc4pe1sI7tYLiSVVhjQ84J3yGJxj1yKAGuvWK2F2qR/8ACcFlPpkjHyxUtpmtJpiaO3It1HAHM1u/5ZAzMrKfimBTbUbm11XSxzSC3v7d2IX92ZGbOPQglvkfSo+FNulNDQS/EIvJ/wAMGFtznug/ULnYGomXdzUnOQpqMk/OadgzQYF0Ag+5d7HH5x/Kk9Wj0tYo2sXuCxO6y4OKW4k4Wv8AhTUWtryB443LNbysNp4+bAdfQ9fnUURmgoap0yX0ay0iW2abUdRlgdWwLeGLLMMdQxOB4+FKXN7w9COW30y4nwd3nnOT8gKhQcCikZoQrHV5JZSgfhrVoT5l+ajMTLogiDEiK4L4P+ZR/wDrTQDFL2tyYOdSgkRwAyN0PlSYyYtH/wDph7Q5IyLrl8jzcoP0NQU4wwAqV07U0W9b8VkW0sZhcIuSqYwMD02PyqMu+6/Ev3JYxA4Ut1I86RLkCNc05RaSj6ClOYD1oBHs5NHXY0TPvUoG3oJo9Idj8KsnY9cpa9pOiTPylkldo+cZHeCNin/diq4d80rwfefhuMdDk6Bb+DJ9DIoP61Vl3xyXyjM0rUc+NvhNf2d16DpNxfabwxfalMbq/WBwZSBkrIAw8PDlWsz03gHR9K7YON9Gu4kMOrCHXrOCQbOWXurgDzxIit/+Stq0VATCgOFtIYrcL/09ftTPtG7MbPjq1tLpbmfSdc08s9jqtpjvYS2zLg7MpwMqfIdK43FbievZZxWV2qt/2YfxV2YaJf6lLcC2lnvIo+7hYsxMYB25cnbG9Z1rXZxFOOHOCu7ZrvifVoYZ4y5ZmtYW76d2J8OROXPmQKvWuWPa/o95+Dj4g0TUYieVbuSweOUDpkgMRn51buxfsqn0biSXiniLVZNe4keFrdLl0CR28bEEpGgzyjzOcnNZSluu5ljw1BtKrM99unh+O2i4W4lhTDaLqMc8yqBhbdwY5cbdAGz/ANNQnAnBcVjFcSta29xbXUTPGyrgMDnG48M4rcu33RIeIdHuLWeITRPEUZD+8pyCPoa5u4O4Q7QuC9Ojs+Gtct7rSgD3NtqkJlMQ/wAIYHOB61Dvpdt1RYsbcbSu0i4atwLpItfx97ZwWkNqjyM42VFA65+FU3s34CjTh/QtTvbcC9v9Vl1llK7qZRIYgf8Alj7sfEVbLXs04s4yZU414hW60wEM2madb9xFKQc4diSxXzG1XbWNJUy28CZgaNe9Tk23QZA+B6VVN9sXTIdj713Iw7t0h/C6tbo3/EMsjN6+7H/pWe2v5RkZ+NXn2hdS/E8bWRwArWSOMeJLMCfsKotlJzJ0rpenx7NLBf8AuTy/ruRZOo5WlxS/4SQ7ln5IAnnTWNgWG+9GOZSxJ2HSmiH9uh6b1sDQExYXQs7hZWUMo6qfEeNEfUo5r2954eaKaczKrn8pycfqaS5SRTOVXFw+FyBigkTB1WOezNvLBzzKS0coYjlzjIPn0FMwCwNIRZPUFT607jX3c0CGgj5IGpq6gL0qQm90EedNJFz40ANGBON8+FC7d2ABR+Wk5ASTQIS/O+aeKwSInO+QMedNFGDmlugoGhCc5yfLemB94k08mk26U1C1JAXS71G71CK3S5upp0gXkiWRshF8h6Uh0pe6064sEiaeJohKodCw/MCMg/QikSKCivkDGa8dqs3BemxXlzqMsqBktrGaUA/4sYH65+VVihBTo9QrsRXhivAZNRGGO52oViHjQZwceNeLsTigBYLygeVeAyaKuSBR1BoGj2N6KGw1KHAFJZGaC0WLZTFE0Q93r+mMegvITt//AGCilsKcUnplzHa6tYzy5McVxHIwHiAwJ/SoyVotxuppn0Z0Oza3mubjnLRTsgUMMYZOZTVpkcdwfhVXueJ9Nhj0eFbmOQ6lJm35HB5gUaTPrtT/AFrVotN0q5uppO7jijLM56DbNcYl2Oj1tv8AMSUl5KNxleAagsUQ5pW6Y8B4mn+kcSaNwxZ2o1G+gt5biYQxpI4BdydgPWs1sOJbnWtSXUJU7u1mBMan83J5n7VaNT1hE0k3EJQRqcl3TORjw8t96cYyvvNpkyJwUEG7VOI9N05DLe3CQQBgjO5wMk4H3xVF4av41vme3ZZbF391x0JPXFV/jq91HiHTLW5YrDGVzkrvzdAfn/GqzonF0mkrHbzqeWNuVmxvnwP1NKUHLclDKopI6CeNAoIwfUVVeIYpLjUI4bdiJ5beREKjJyRj+NPOGNe/vrTMlgXiUZI8dutReoajbWXEGkG7lEMMheLvG2AYjI3+VU7tNEZyVqTMD9orSksdf0cBWDR2Rhy3VuWRhzfPes5s/dtAPEmtV9o/ULHXeLLaK1vYeWytu7kYPn3yxYgY8tqyiM8ihc5ArrdEmtPC/g8j6vLv12WS+Rx0WkFAM6Z6Zpxj3CfIU1TPOreZwKzjTksiArnyFJDDMT4U7tdKu72FXiX9m4fDZwPcGW+gI+tKaBCqanGkvIeYMqmQZXmx7ufTNBJEYWHPj70srgQuc9KkJtcuRI4a2tkcMQcRjYikm1q65XGIsHw5BQKkRMk4PN8qK+4p5cX8tyrK6J06hQKj2coooBhZNlNNXc+FLSScw26UiwoEFBzRz0ogGKM21ADe4HSklXbpSs+7DyooGKkgNd4guItT4TjUOJXsoLJ43zuodGV1PzVPhVMJziiwGeRu5i537zA7tBnm8tqMVZGKspVh1BGCKOCl77lu4UljtOHtYmzmS4U26/ARyM335PrVPCnapfh5mc3saCR2a1kWNI1L5Y4GMDpkZ39KZ32nXWmLGLm3lgMm694hXNJj8DN85oPD1o7jJogG5pCBiXJpwq0lGN6XjGaAPYowGKUI90dKTJxQSQDCkm60oz7UiTlqCwM35flUfLv086kD+U/CmGMtj1pMki9diOtXMXa9wYk91LJCl8kEaSuWVA+VwAen5q7k420s67oWraWzELcQMmR1wQQcV83rHV5tC1vT9SgOJrG5juV9SjBv4V9MoL6HWLK2v4SGiniWVGHirAEfY1zvUYKPa0d3+H8ralFvdNHHvHvHmu9kUUevycOf3/odqQlykEhSW3bb3hsQQTnw8a2jgji647QeC7XWrLh1xpd6pdQ0hLHbLbdPMVdH4UsL/wDvWyvYUntbwcrxOAQQRvtUfw/d3nYvoUWlW1kup6NHKxjTIVkQ52Gdj1rBxVKKtnbO6rFFOXwROvcJav8AhTbRaC4jkcKwmcBUOCRjHwrl7th1nWeFON7XhTT+E4Zby5flF1JOxRcIG5gBvsD5+FdN8ce0Pc3OnSW1loUqTY2fvB7u2M+njvWR8JaRfcUcTycSa1KtzeD9mH5ce8QA3KPDYYqU+2G5biw6hpyzQUUXjs70yTS+D/xVwgSTuxHkZ94jqd/Wsm9p+8kg4Z0eFXZGe5OeU4JHKxP6itze9WTSILNSBlySB4AGuYvaf1j8TxHpFkHGIoXlZc9CxAH2U1HRJz1EaOe63kUNHkX7GWI5aPmYkltyT4mpKE94gNQiMXRU8PSrfpXDd1e20bRd0qsNjLMq/rXZUlweUK/Igi80bA9CKs/DWjWd9w+Y5YibmeWSC3fP5X5OcfHJUL/1VXu7MbNGcZU8pwcj60pDrVxDHBbRN3YguTcI6ncNyqPtyikSLfwxCLnQL+2a7is5IzyRmXoTKuCPnyYz4ZqClsWtbS6WeMx3MUqKVz4EH+IFMr3UJdQu5blwkbyHmZYxyrn4f11o/wCNkk068V3Lt+zwzHJ2JA/WgY3un70JKDlnGWz5+Jp7YaDNqFk1x30cWTyxRufembyX4ZFMZl5ba1z1IY/U/wClPzcNdXOlwK3dd2EjXA6NzH3vuKB0Q0o7skHY5prKOYYFSWrRhL24AbnAlYc3nvUdQQYgBg0DJ40cjBzSMkhBG+1AjzDAokjYHWh5g3Q0nN0oASZstQ0mBk0ZutS4AuejXBstVtbhbhrRopA4nVeYoRvkCrjxvrQ1i0jQ6tZamVbnDw25jlO2DzbetUNKODjeovcqTa2LzaXmqXGhrJHfW+lpLzR29vFFyvOVG+4HTO2T1NROlWEvE9tdNd38jyxLi2jf3ueQgty+myt88U406Vr1OF0VMclyYiw8f2gb9GqH1WSWx1m5aFWg5bhjGVGABnIxQSvYjD+agIwTQt1oD0oICkVKjrTRHwacqcigBUbLik296vE7USgdhZNqIGw1GkpLmww9TigmnYsdwaZsMGnreFNpRg0ixENfnAeuwvZO7Vv/ABJwU3D9/Lm90VQgdj+eE/8ADOfMbr8hXHuodGrZ/Yrmjm7TtZ0uYnur7SX6f4kljIP0JrB1mNTxNvwbrpGZ4tXFLh7HYru73jyxqrkLsAev9CmXF+qx2+ivO8XfxovMUxvUZaXsnDuvtpd/IOWRT3D5/wCIAf16ilNetor6zmjZm7n83MDjb/8A2uagtj0rHlfdXkxu84t0m+uu5azkSZ/e5CDygZ2OfpU7pzFUXu0VMISqKMCi65w9pQtUktOXmRmPLnx9RUHqGuw6bo1xdXEnc92GOW2wMbGjJFypIznnag3Ji0XEQfULmZnXuoxyhR5+P8K5f7ReJTecbaxcTW6SyCc28ZlGeRE90gfE+Nbn2fWk+padHczgj8TM1yVPUAtkVzpxtqDHifWrdUQGPUboiQj3vekPj8q2PTIpZZP7HFfiGTeng/l/9D/XoIY9XgmgiRLa4gilVE/KDygOvyYMKl7DVLaPJbTopMDHvMaren3izaVFayoWmhkLpJnblPUfXf5mpC2PLHnzrpGzgiQEg95goUE5wPCmdoAzyN481K83uHHlSVqO7D53yc0gHecD4Ua2bvYrtcf+WCPkwppJcg5UU80e8jtL+N5VLQnKSAdSpGDQA61aMQXawD/yo0U/HGT9yacQala2dski2ztqCNlZWf8AZjyOOuRTLULpbzUbueMEJLK7qD1AJ2othp76pdiFJEhyCTJKcKMef2HzoJD68j0vUA9x+M/ByE5aGSNjufIgYNQDlQzcrcyg7Hzo7o6zSQuP2iOY2HXcHFNZZOXI8RQRe4SR802fJ6UrswkycFV5vj6UiTsaCIUHFEkbmo9A/UfGmmARBRWO9Knbam7n3jTJItiUcUkpxSinagxvJJ6drtzpkRjhKgcxdWKgmMkYJXyOKT1LW7/VYoIbq4MscA5Y05QAoxjw6/E71HB9yaNz0qJWefYUArzNmgHWkIKVPNtTiMHFFAHnvSwoAA9KLRj0ooB5aBhWIpJl95fQ0uFzQSLyjOaCxHm3pCQZJpVidvKkJmAoJkTeKG5hWneyLM9p286QFUkSwXETegMZP6gVmsy5LGtn9lRbXTOMbTVQyyXd1q0Wjx435AYJZpPmQkfyJqnMrxS/Qz9DFy1OOvk667ROHf75slEbiG5icSwTf4HHQnzHgR5GsuvO0Fra3urTUI1sruJmje3bO5IHQnqPX0rfdSsvxcJUjfFZhxxwdY6qv+8LBbrGwkIwy/AiuUi0luempXujCbHia2GsX8k84WMcvKrMTttt5eFVnVye0DV1sYCw0tXzd3KdGXORGPj4+ma0PUezPh+3keRbOQb/AJWkYgn60fRtAjg5Yba2WCBNgiDAqLydvBbGEpPckdHshDbM6JygAAADYD0rjHjm2lteOtdjlUqzX0zr5MpdsEfKu8I7P8PZsoG+K43470KW81rjuU7yaHrqqMDOYLmJZR9Hb/uNbHpe+R/oaH8QYu7TxkvDKrZOqg/SpmAE/CoKyUs6jwJqwWwGfhXRHnqFJcrESPKk0bEIz1NLXbARE01EgbA9KBsPGoLZp9+B/wBgW6B6Sd0wz0yMj+P0pnax4BY9SanNKhjutPv4ZCwJwYuX/wC5yty5+PT50Coj40MjrGgyzHAqcjtLe14TuZ476Lv7vlhkhKkMgDcxXOfHCnNQNmXMEs7e6R7iDxyepo8hX+45AJAskc4buz1IZcZ+WPvQCFNPeXTtNKR8nfag3dCZxkiPmwxBPmds+hqNurKaFZXdCiRymIs23vdcU64guA6acsYCxLYxcpXz3Lf92amNVvrefUdKjZo5Iocd+uNmm/fJ8wcKM0CKaxydqBttqsGrd7qcMLzwxRXUKO0phQKOQY5QQNs5z9ar8g98eWBQKgteYZNGwKLJsM0xIJmmzP7xpZicGkCuT0poC2g4owORRa8DikUINivYFeBzXqQz2MUYCgAzSqpjBoAKAS1K5xQBRzZocb4oA8TXlOfhQMMCigkdKBoVxgUS6bEY+NCGpK4bKfOgtQkJDikZW5jgULH3TTa4nS2gklchVQFiTQTKh2k8Yrwpo8vduBeTKRGP8P8AmravZd0S/wBA4Q7BNauufPEXGOoX0pY78ptJoYc/ERkj4jzrirtM1+44h1eZVzI8z93DGvU+CgfHNfUDtJ4SPZd2Udj1tFyxvwtc2Gw2yyqI3+vOxp5Y/wCvN/Y6PQY1jyw+51myeVMNQ09LuIqygmlNPv47+xhuYjzJKgYH4ilmlB28a4pbnaRtGZcT8NQh0AC9T+lVtbBIZFCrjfBxV+4p/ZXDgjOFJFUtD3rnaqmjZKqsb3yhIHA6Y8a5ok4dPGFx2z2kDGKbUBbxxyKcFZVtgqN8mC10LxVfCztX3wQprD+yCR7tOPb4neTUhFnz5UWtz0mL/MfsaTq7vT0cB8PduOsaJf8A4XVIVuVikKOCOWRTnBHyroHhbizTeKNMW90+4WWPHvqdnQ+TDwrnj2iOzbUOA+0/Ww9tINPvbhry1mVTyMkh5sZ8wSR8qrvAfHFzwdqsdxGzNCx5ZY87MvwrpJxadHE5NPCSuKpnXdxcd4MAjloLVS7HO3hUboWoR8R6RDqVl79pKPdOfeyOox6eNTzwxJa200AwrqQ//ODv+oqs1TTWzFFwBgeFPdOnEdpfb+8rRSLv4h8fxpk1rPCiyMn7JkWQN6Fio+4paxTmj1BfHuc/MMpoFQF8DBcurDADEqPRtx9sUwmfKn+NSepkTRWkvi0KqfipK/wFRFx0IoIsbpMxVATkIMAH45owkbmJJ3Y/c0RV3pQEoV5evWgRIXwaws1s+Y9/IFabJzyjwX4+J+VRZTAGM0q8zyks7FmPUmkyxORQATAxk0SQgrtQRhsEE5orsQvSmiIQ9DSVHc4pEtvUgZa/GjjrRKFQaiUCy0WgGcUZFJxSGKRpkUcbV5fdFCaAAZ8DpRC++aOVyKTKHxoAHm5iK8x5RQolBJv8qB8CUkzYIpIPzDFJ3V1DbIzzSLEg3LOcCs/4q7WrPR3/AA2nAXl02cP+4P4mmlZfCEpv0ot+ua9aaFbPJcSAHB5VHVj6VlfEvGc2vO4yYLWMEhQeuOhPnvVT1PiW84k1M3V5Nz4HKnL0HwFN7+YJYyYBHMMADxOelZEY0ja4tP2r1clq9mngxO0r2nOBNMnQT2q6it9cIRkFIAZiD6HkA+dfVL2udImv+xjUbiFeaSxP4ggDJIUZP6CuC/7MHhg697Qer6xIqvFpOjuvMB0kmkVR/wBqvX1D470qLUeEr+2njEsTIAyEZDDxHzG1XuCnjlF+UZ8MjhOMvgonYVxgut8G2cTuDIiADfrtWjPLhs1yv2U6rJwhrb6WWwlrMYsH/D+79sV0fb6gt1CsgfORnY155KLhJxfg7t9skpx4ZAcY6j316sSZyQA2Piai7e15ATUrqUKS3DvgEgYpsqYjJ6bVHkt7qVGWdquqpZWUznYBTn6VB9m3B78MdmcCTLyXuoTS30wPXLnKj5KFFOeKtLPGfGlho6lzA03eT4/+2pyw+eMfOr7xMEjWBY1CxqvKANtq6PpGB3LK/wBDnurZto4l+pmk3COlcVacbTVLOK7Cg8qyoGwT8a+aXbz2Wy9lPaPf6eImTT52M1ox6chPT5Hb6V9QLWf+7tQuO9wIC3Lz+RJJBPpXPHtocBxcXcDXWrRoFvNKkE0Tj95Ojj4Eb/EV1GRKSOcizlvsT7SIODtWS31PvG0pyzERneNmHKWA+HX4Ct50ziSw1jSLRLK7juMlpXCHcZwMEeH5a43sZWRlZSQTU7pus3mkzi4s53gl81OM/Gtc0U5cCnuuTsiCcHRHTveWcPzxr5qDgj/uJqSubeaO+mjlHN3lgf2gP/EYRgk/UVivZ32xaTqNmtpxAjxaggJ78Scscg+GNjWscL67pGr3sZs175JFePvBNzAZQiq6NdKEobMNcDvdCtpx1jneJiPUKw/Rqh5fE+lTKavb/hGi/At3DNz45zgkePT1+9NZb6yRTz6e656e+Rn7UihkbEMilTBIvK7Iwjb8rEbHzxT+KbSnKFrSZBjfll6/arHw+tpf6dPEIZhpC5aR7twFi6bqeufQUCKVDE08wjQZd2AA8zQSROjSKVIKHDAjGP63p1ftaWeof7tnkkhjwVnk2JbzwOm/Spvi26VI4pEgMUmogXkpI6ErjlHpzFz8xQFFXxgMabuwKilycRtTJmIFNEWElYnptSYG1CxJ60IxipCLXR6TU5FKVEoDDpRkODRQdq9QMXDg17mHnSQ6V4nakAuGGKAHNIB68JSOlAxSe6hsbeSe4kWKGNSWdjgAVlXFHbMFkkh0iEcnQTy+PqBSXbBxC888emQyHkjXnkVT1J6A/KsiuJc94TksAegO3TrWRGHybbT4FKKlIl9Z4v1PV5M3Ny8/Mfyk4Wqtd3pOqynO8SgAHYj1+9OlyZlBG3N0zmo+6Ci8u2bcB1GfkfvVjSXBtFFRVIf28+MBX5c+XhT3VWKWIUn8wPz23/hUTZtzNy5yQQMDxP8AOpLWQeRFOwTz+A3/AF+1SXAHc39kvpSue0rU+UczXFjbA48AJ2P/ALhX0T1K3F1p9xFjJZCBnzrhr+yb04RdmnG12B70msIhPny26/8A7mtq9q32kz2PaR/4e4e5LnjjU4Ga1RhzLaR9O+cf+0eJHpV8faipvcoXaDpr8OccLcqhXv0BOP8AED/IitU4Q1kz6THg823jWI+yvxnxD2tcB69Fxrp76nqvDcircag0Q7yWN8lSfNlwdx+7itf0i2TSrlY4nLW8w5k+Fcl1DSTjKWaPH9HWaHWQnCOCXuX8ljaUySEnbNJavKLXS5Xzg4wKGA88mDTXi1SdICLnmdsYFaJcm6apFc7P9IitH1jie7cBAjRAncxquWc/Pb/0mobSeNND7RtAh1nh7UY9T02T3VlQEFXHVWU7qfQ1F+0rx5b9m/ZbJwtpk6DiDVLVomCneKOQFXc+pDMB8c1xn2S67rPYLxWs2J59AuyqajaJnBU/+Yo/xL/MV6BpcP0cUYI4XUZfrZZTZ2p+G/EX8iFQwZBkGq3xjwrFe6Jc6VfIj2N7E8al9xkg7E+FWXSr63v5Yb20lE1rcQCSKVTkOp6EVLXWnprWjT2sgBMgIViPyt4EVmGJZ8bdZ0qXQ9c1DTp9pbS4eBseasR/CgVsJ8PGrZ2x6RLo/a1xTZzArLHeyFs+pz/GqeG25fAHpWA9pMyI8A95hxvkg1aOBOOtR4J1qK7szzJzZaJz7r+e3wzVVICtsACfKvPIyFCOqnw9ajyKUVJUzsrgjjWy4r7PJLi3aM3UFype2b88anl5x8CwX/0ml+J+I7riCWFp+6URLyqIk5QBnNc39lHFLaDxEsDzclpejuZFJ25v3T9dvnW7l+bNVs0moh2ToeRShApxzY8POnetcQXOpwpEcQ20eyW8WyL/ADqK7wjGKGU8yAeJNRMQkOGtPXUtWghkISIZkkJOwRVLN9gak9W1mLVdMkS5yt3DPzwYG3I2zJ6YwCPnUJbEw5KMVJGMg+FISuTIfjTC6FuYd0fPNMnG1OM+7vTdznamiIky+VeCnFCzYIFCCMUwLMlLUgsmaVJzUCkNQr1pOhXrQApQE0FBzb0ADSVzcx2lvLPKcRxoXJ9AM0qzcpzVQ7StUax4ZmVG5ZJ2EYPp1NSirdFmOLlJJGP8Q6mdQ1C4nb3jM5Y58c/1j5VXycb5PKCeXlP3FO7py0iEMygncg/1mo+4k5e8jYhW8MDqduvyrLOkjsel2nQk5JzsfiTt6bfao25TBmOcBpDjHoANvIU/LPJdQScowUIJO+dz/XyphcANEj5x+bfzGft0/rFBaDpEyh1GASDtgdD6fSpPUXEgXIGT7w+WcfzqB088twxzsfLbNTN0BJa942Gdl5T6jc0Ig+TvH+zt7R7Xs49n3tE1i5jFxLFrMYt7YH3ppXt1CLj1I+xpOw7Ntc4x4xuOMOIJpbzVb9+9leTfl64Rc9FAOAKwz2DXl1TtJ1DQrieRtMaNbt7bP7NplPKr48wGIr6fWnCVpaWdv3cAXcqTj0/0q/G7iRZjb8L8X8G6NqGq8C3KWk17aiG/tGjDLcoAcEZGzrk4Yb7077NNWXW9Ed5Jil7YsEnt2GChyADjy/lW76PYxpaYCgKpxjHWsR7XOAb7hLXU4x4cjMgKFdRsl2WZOh+e+flRlxxywlF+UWYpvHNTXgvMNyVbIxSOt30iWN1eIFZbC3kuMOMqWVcjPpkVTeGuJ49bhtFs3aRbsYjRh76sOoPkRUh2hcQ2mh6SeGoLiOfVrwKtysZyYYs5fmPgWA5QPUnw35XS9PyR1L+qto/z8HUavXw/Lp4nvL+Pk54vbLUO0zjC51zVmaaRm7ws422xgAeAA2p9dcDxX8jd5CkiMcYI8hWk2MEFlakKoUmpCw0le4iJUHqSfjXX8I5Nsq/Zpw7ccO2slkOb8DG5eFSciMN1Uemd60jTpe7jZdsq3NvSNrapCjFVAIpC/ZrcNKBsV3pET5u+2dp4sPaB16RECLcxQT7eOYwpP1U1h2ysT9a6J9t2NZe1W0vFXeawVWPmQ7fwIrnZgDkDIrAmqkzIjwgM8xoZAGQ48fDzNAyYxQq2SF6eVVkhxG/KysDgjBBrpThbVxq/D9jdBuZniHMf8w2P3FczHZx8BWydjmp97o11Zs2Whk5lB8Af9aGa/VwTh3GmB80cyE49KaxPS6sCKiaccpPgEEUTmyxNEoQcZoEHZ+YUk4oWbaiElupoEI7k5o46UB2oR0oEWBDvS+cU3yBSocVAqD5o6daR5xQiQA9aAFz1omcGid6POimXegA7SdayPta1jvtVtrEMeWJSW8smtO1C/TT7WW5lYLFGOZifAVz5rGqHV9SvLp9zI7Hz+FXY1bNho4vucyJuZFWa2dxhSejA7b46+FM9SdYLo8y5AO++39YpXUZGGmo4JZQSdmAB33xTHXX7qRNiObGzeG1Xm4iha1djdImeZOqn0ps4zYgYPMy7g+GTv+ufrSlhOFcFgQOQ4x1rxhK2sScuSFGQT028fqfpQWDC3blnjUY/MAfPFTTuJIJdjgeHnnJGP1qIjh7u67xzlTvlupx/Q+tSrczxPjGQAMnqfT+HwoIvY6A/s+Iu/wC2PVJFIPd2Q+eZB0r6zRW/e6cngQcj6V8oP7PUunbJqigZ5rIA4HT9qNq+s1tgWbqfzBKvhsiLIzTuZXkXPu7HFLXUMV7bywSqGVgVIPiKQ0nMl0R1yDQ3bGB5HbZVGTU7FZlen8B2UXEPENnpMr6XdCxExu1Ye4WYjKAjZsdT5Y+NZlovB6aWGneWS4nuPfaaUlmc+ZPzrULyzOo6xeuwJMkpXr+6ABj7U9GhxysqlRhRsMdKjvdtiKPpmjvI68xDKN6nxbcq4A2HhU5NpK2iZUAfCmYiGaYDUx4HTGVFNrqESwOhxuCKkHGR9qRltzy+fMKEB88fbbsGtuJtJkKn8ki83wKn+NcxhssOm/pXa3t78OtbaRoeoEHLXLw9PNCf/jXFC74YA9KxMq9RfFgsx6D60UMVbzOetexkADrRQCGwR8KpJikje9t5VduynU2suJYYWbCXKtE2fPqP0qjSE81SOi3zWOoWtwpPNFMrfHG5FMpyQ7ouJ02r8tLI+1R9pcpcxJIhyrKGB+IzTsN5GoHOtVsOeb40INEU+dHoI8AN0otGbpRaABAyaNiiqMmjUATVGXpQUI6VApBoMmvE4NEd8DagA5bFF5hmkTKaL3lAFS7WLt4eF2VDgSSBGx5YJ/hWLQsRbT56gbE+PyrW+1q6C6PaRkZDzczYPgB/rWQxZWC5A3x05R5eOTWVjRvNIv8AGhvcAPpDA4IPNnmGSdqitXlPLbdCqopPluP6+tSCyFtGnC9VOcKcdf1qJ1A81rZtt70a5+W1SbNhEeafJi4ZeuI2HxzT+ZeQFAMcq4HwwKi9NfNxy5BzH47noalSAXl5T7uN0Y/D/Q0J2FbkeVVpt916nm+2aehsQsM7kYIPnjb+vSkXQx8xIwwJ+Hr8vShULJGRkptn4ef3pjOsP7NfSjedqOvzMOYJbRqB6mQn/wCNfUbHdmUf5DXze/swrIvxZxLcMvLg267/AP5TX0jnwJJf+WrY8UVyILRJCuo4ztk0717lV5oTssqMmfLNRliTHqzAnG4anfGgK6fcyISHSMspHwzUyBUobVY9Wzj948w9cb1JrArXiIBs4J29MfzqNsrgT3iy+EqK4+ag/wAanbOPM5kxsin70AROsoEYJULHFzlhnp41Maw3PdVHW0fLHNgeBoAaJDzrnyalPw+24p1aw86HHjSl6O6hyeo3oA5T9vvTo7nsit5FUNPb6hG4J6qCGDY+tfOAe7gAnA23r6O+2iG1Ls3uwMskciyH0wRXzjmzHLJnck/zrHyl0Agb3hQEk9T1xQfLFeOxrHLA8gCsgHiBQxHGB494M0lI3NJEMYwKPGfdB/zg0xM6A4B1IalwxaMDl48wt/0nb7VZ4qy7sb1Re6vrFiAeYTID47YP6CtRibIqLOfzw7MjQ4Uk0qCcUkjDApVWyKRjMBicUXJzShwaKVGaACnfxr2TQAYoaAJ3nr3NnpXlG9CGGagY9sIxbJ3pMtvR5GHMaRLb0DQNENC26+VEfZPhQMoHapODHaRDcgO2fjgY+1ZTlo0ljxsFI3z8av8A2i3RuNZ5M+7EoXH3qi3Mfc3IxsuMKD9v4/Ws2HtOh0yrFEiLU80N1GCObkOxPiOm1R1y+dJswABsykn0Y/zp5G3d6uy8pPekgADx6CmV2v8Au2IYxyu65/6s/wAagzNjsKaO/PfwpygZBAPl61Ny4U827FvPxP8Ar+lV/RjnUIT4g4H0qy92xWM494gE5/r5fKiPApcjZ1HOOYhguTk56jpmixpkswJCjAJA8MdaVjDOhV1JydyB614RsIzgEEjA+Pj/AKVMDur+y/tAy8TXOGBN5Cg5vHCMf419ALiTMsp89q4l/sx7QDg3V7gLktfv+0PU8sUf867Uc80xPpV0eCuRBs/d6up80z9zUtr3Lc2TA/lkjYfaonUcR3ML46EqTTzV5+bQZZB+ZFf9DUiBUbBe6lgj/wAEMa/RAKtiIILMjxI+9VHRVNxcW79AYo23/wCUVcJ94Cf3QcUAVu9TnlfzG9N405YpPUU+uEzKxpDuSYpcA9KAEbD3SfhTPWZWcFQcbU8gPJzE+VR18e8YnzoAwD2j9JOp9nutLglRAzYUZO1fMK5fMrEdDX1w7WNON3wrqMSjrA+/yzXyU1CPu7t1648fOqMvBbBjQNg0OSFJoGGSKNjc1jFoEjBQpPXGKMm0SnIGSf0pC5b9pEPDBo5bEIHpQBYuBNTbTdespQfdMnI2/gdjXQStiuZdLkMVxAV2KsGBrpO2YyRq3+IA1Fmp1q3iyQj3FOEG3WmcdLoTmg1o4oM0QUO4G3WgiDReahBJ60U9aAJ7m3oud6LkV7IqBRR5tzSTHBpUkUhId8UDDBxy0hK/unfG1eZ8eNMdSuvw9hcyZGUjYjPnimuRrkyPXrtr3V7uViWy5A+GdgPlVb1T8o885+FS9y/NPIACMnc+dROobggdfGs5bI6eCpIresMY5YbnlzvzEAdCDuKDUEItpjjA/ENgfIGnWoxCW3mUj3sEjA3pnesXsnYkc3PvjzKqaqfkuENHlKahCF8WANWm3KmONmBUBfdB65yR/AVU9IP+8rc+AcE1bYATCAzc+3XwJz1x96IkZcgMoMoDLtjoPDJ2H8KRcFTIebl5jgHwG/8Arilo1ORtyjbOfAZ6fE9KJMgVSuB1HqOvj6VYRTPpp/Zq6eLbsSubsL/xLyc5I/zBf/jXVy9d+tc2/wBntALf2cdLwMGa6uGPr+2eul3j5bgL51YnsRZA6ouVY/4HzSd5Jnh/UUBBKJzfEEGneoIOa5H+Zqh5WAjmRj7rJykfI1JERnoEaLDCwG/dqAPQKKs0+2nqDsSc004U1TTdF1EHUMJbiyCwsV5gGOMjHiSNqP3zy6ejOpQ9cE5IGdgflikpW6G+BjIuabt7oYeYp0+6nHWm05xk58KkJDGQhY29RUZJuKf3J/LUc7e8fSlwMqXHMYl0W8Q9DGw+1fIHXFC6pcAf42XPwYivsBxZ72nXIb/C2foa+QnE6GLXr+MgLi4kHKvQe8aqy+0nAimx47dDXhsM17PvZ8a833xWKXDe6b/aY1/y5pST8iY8Rmkbgn8R16AClSeZ9/ACgEPLIBGUnrkYrpGwYNawsOhRT9q5uteua6F0C477R7J16GFdvlSo1mt4iTUbY2xThCKZowzS4J2NI1Q4yBQ5zRFOR614kjpQRFKKQc0K58aTZyDQBNYr1GBzQN1qBSBSD/8AENLHpTeRt6AEpMVAcXzfh9CnIOCxCj5mpxztmqpx/LjT7aMnAaQsceg/1qUFckXYV3TSM5lXlOeuT1qHvZlEwBOCRknwFPdRu+6YgHf7VFyDmyTvnck/xrNZ0SfgZ3E/dsrcqkbE/WmeoxFLFSDkEgDA6gL1+tKaq4MGQQSAfTx8qQMon0VWzkq5U+n9Zqtl0eBjpfu6hbnycZHnVxjY9wuVw2MHHTNU2xPJdxnG+Rj03FXOFyIMY2DFT9f6HyohwRkBHgHmyQAMjH9f1ikLgqI9/dDD3gdttv03pyeY864HN+Y/Tr+tM7hiVwN8nBb5fx6/Sp+SB9ZfYZthYez5wlAGLmSN5iSP8Ts38a6PkTN58BXNvsU3BPZHwrbn9yyQ4+OTXSs7clxzValsJsrmqzCJ7httmJOaqzXTymQMQcknap7iBuVbsDx3qq27ZVj48p2qSREldHt3mvFZiSkSKAPkP9KnLkctqxzsSPlTPS0FuhJO7AbfKnd6wFqkf7zEHHpTYDQoRGW8MUwlcPnHTFSF5KsEB+HSo4YFqWxufGkBHSnmLnywBUXMxDH0qUQ84PxqK1AiIEk4zmgCqcYXISxvGP8AhavkjxoOXirVB5XUv/uNfV3jGYS6deKDn3Wr5TcdR8nFerb5xdSD/uNVZfaTiQHNg145JyTQDHNgnqDj5CjYIjIPUCsQuGk+9y3pilUOXb44+1JuM3kg8AR+lHi3Z/LmO/nQMeW78pUeGa3nhCbveHbFh0EePptWCRbEVs3Zne9/w8I/3oXZT8DvQYGqXoTLkGIalkLZ6mkk/NS6nFRNOxVXIpdTkb03U560pkHpQQFubakm/MaDmPnXqAJlZB54o3eCmnOKHvagUjkyDFN5DvQd5mk3begAD0qgdod2rX1tbrn9nGWPxJ/0q+F8Csz49l5tccA5KxgfD+s1ZjXqM3SK8hSL4c83lvTOc8rjGxFSEy5YP47D4fGo67H7U+XUVls3iIvUd0Oc8uOg/r1rRewD2duLPaItuJdP4Pht7nUNGhW8e0mkCNKrEL7mfHJH1rPrl+ddxsPDGa66/snuMoOGfaRvdKuZe7TXdImtIgTs0yskqj/0xPiq2WnKPGfZrxR2aa8umcTaHe6LepIAY7yEpnfwJ60/jyZZRkgc5OPnX6DOMeAOGe0bSZNN4m0LT9cs3Xl7q+t1l5fVSRlT6jFcfdr39lzwfxE1zf8AAmp3HDF5JlvwU5M9sx64HN7y/WkqIM+WkiMrg4zt0x4423+X3phN3jRgjLb+7tj4Gt87X/Y67Uex6WWXVNAlvtPjyBf6cO+jZR0zgZGd81gdwJoCI5U7tw3KVwQ2fh4D+dWVtZCz6++x1pf4Xsw0aaT8qWMIB8j3YzWx32qCe4VF6Ft6zbsXlTQOx3QUQLG8lnFkDbHugVa+Gw+p34clmQH5Vcgbsc8TIUkyejJVRjl5ZSvmGH2NXTjeRLZ4kPlVHikVpA/hk/yqSIlwtDl1Phyj9KUm/aysx6DYUS2PLGmRgkD9KNcuI4WPSh8gRer3Cu8aKcsSNqNeKIbTbpgUwi/2jUA3lTzWXMcQQYANIBlZJkE9fjVa4nuxAWXxPQVbNOtZp1AiidyfIU1veyXW+JLwFQlvF4s5yR8qGBj+pyfiYZVbdSpzXzE7U4fw3aFxDFkHlvZOnTrX264f9mqxWEf3vez3J8VjPID9N/vXKf8AaFew7oNhwG3aB2e6ObPUdLbOq2cDM34qFiMy4JPvqdyfEE+VUz9S7VyNNLdnzCxgk0cHO3h40NxBJazPDMjRyoSrIwwVPiDRVYAEGsbgyPAyR+a5lb1peJwSWx1HSmcTD3z5mlUYjApDJGJgK0Xsp1IR3dzaM2A6c6j1B/kay6KTlOMmp7hrWDpOq29wDsjb+o8aCnNDvg0dBB870rG5PWmMFwssSupyrAEGnEclROeezHqnApUOMU2R8ileakQYrzCvcwpNj4ig5qYEiWOK8GoSu1JjPjUCkUD79aK779aLSbNk5oAAvt1rLeK5O/1+8bGeVgv0FaY7+FZbrsmdVvn65lYA/A1dj5M/Rr1tkHPyhxnfxA86hr2dXlJBx8amLkqrIGOQc5qu62yxsGQ7Hbp9avkbuKEJmDKd+pAHl0rtL2JfYz4z4r0zhDtl4Z4l0qA2mrCb8BdxyK4EEpWROZdvfUkfBq5P7Guy/V+2vtK4e4N0hH/EareR273HIWWCPOXkbHgqhm+VfoE7O+zvQOy3gfSeFOH7JLPSNNhEMUY6nfLM3mzEkk+tVk3wT4mRejjHhk70ZblCNnBohsrcHARfrScmkwSfusD6Gpekppg3GJomRwskbbMjAEEeorDe1f2POyjtcWWTVuGItP1B9xf6T/s8o+IAKn5itsOhwsCMv/6jRP7giAyHdfmakmkLezFNQ7H9S0LRbSx0i9W9s7WNY1SYd3KVGw9M1ZuDtEl0qzKzxNFIRvzVoTaJJt3dw4+O9NZdJu0B5gkyn/Dsf5VcpRrkjTRkfH1+G1EIWBwNhVTt29xvgavHaFwFqb3I1Cyje4gUYeMj318c48RVZ0PSHun7kIXlYMAmPHx+FTTRInLViXCsenTNObuxur+Pu7aJnLHGeg+tW7QuAljInuiWcjYeAq1w6XBaIOWMZHQkUm0DM50Ds+m5xJM5Lf4UXb6mrVFwJZyOplhUgeLZY/yqfu7+00q1ae9uYbK3UZMk7hFHzNYrx57YPBPCAkt9Olk4gvlyOS0GIwR5ucD6URU8m0EVSnGK3Zs9poNnaooihBxsPAfaonirtG4W4CtjLrOsWmn4BxGX5nJ/5RvXDvaH7XvGnFveQ2N0mg2L7CO12kHoWNYPqfFd3qepmAvc6vqM3vBCxYt8z0q9ael3ZpUjGjmlkkoYo22du8de3Jpdlz23C2lPqEuDi6vG5I/ko3P1FYFxH26ca9qd1FY6jqjrb3DiMWlsvdx+8cYIByRv4msebReMZYpJotEUFN+RpQCat3Ztwfxle6/ZTTabDZxRtzNLJMDynwOPGsfJrNFhhJwkrSZsMfTdbkmlkg0r/g519qb2ftb7L+M9Q1lEmv8AhzU52nhvjuY2Y5ZJMdDk7HoRisFz1Jr7PDhfT9Y0SSz1W1j1SGZeWWO5HMrD4V8y/a87HrXsa7TZoNKjePRNRgW9s423MQYkNH8mBx6EVzmj1bzeifJvdZo/oPvj7TBIWBGPMmnAHvCma5HLscdelLC6CL8K2Zqx0sZ5vjR+SWE83L7tN1neQDlX507t++bGQMeWaYjbOz69a84ZtyxJKEpkny6farRG1U3s0H+4ZAOnfEj02FXFBUPJzubbIx1G/rTgMCOtNI6cJ+WgpFOY4NFY77V6vUyJMA5FJHrSi9KI3WoFIU9KQkOFpc9KSk6CgdDXqazDUwDqN1zdO9br8TWoyDArJ9Y3u75j1MpH0Y4rIw8s2ejXqZCapMpYgb486repZlhIO2DkCpnUZCz46DOKgr9ikWQdyTkn4mrJM3COg/Y242uuG112HTrhrPUIZo7qOaM8rgFWRsN18vrXWtr7TfaJp5AXiCaVAfyy+9+tcAezdeSwdpDRI2EuLGVJB5gFWH3FdTSbLW30jU8StGl1jcM3pZvmm+2fxvaFUuFsrweIeIDP0q12Ht06gm15oEEgG37KQqa5OLHmHxpY/lzWW9Pilu4mPHNkXDOzbH24tCcD8bpF9bsevdOGxVk072vuCb4L3uoXdkf/AOaEnH0rgWSZhkZ2zXkY4qp6XE3wWLPkXk+k+ne0PwZqhAg4psRnoJm7s/erhpfaHo+qcgttUsbrPjDcq2fvXyt7xgBg4ryXMkThkcq2c5FVz0cK2LI6ud8H11huoboAqQ3qCDWO6B24cA6p7Qevdmtoqx8UadaJNNIQAkrkBnjX/MoYE1wlwx2ncVcJT3uoaRrt5Z3Fjb9/FiTnQt3iL7yNkMMMdiKzHgcahY9vD9oia3qDcUHUJLlrl3RlZmDAgry7jHhWty6WUZKMWZ2LPGcbkj6x8fdtXB/Z0kh1jWIIpkB/2WNg0pPlyjeuY+0H26r26aW24S01LSLcC8u/ef4hegrk7irU72/4juLu9vJr28uEWeaedsvI7bsxxgZJqvXOpzJJgcu+R0rZYtPCPu3MPJlk9kaVxf2m8S8cXhuta1e5vX8FeQ8oHkBVD1TX0sI5DIwVhkgZ3akra5klhDMdzVz7HeF9O1u+1e8vIBNPAgSMn90MCT+gp6zULRaeWZRui3p+k/PaqOC6sgtL7NeMOKLKK+M506zlAYRouXCnpk1oHYx2eWvA/GV/dcQXM00E0KrHNKPdQgnO/h1H0ro/R9Gs7ThcukILcnKCfDaobR7OG8lvjLGGEbKqrjYDHlXmmp6jqcyqctn4PVNN03SaWV44bx8+eBG+h029n5dNCyQvgBkOc7bmn00MWnxIEULJsNqrvFWj22mywSWam0kOW54DyEHB8RVbtePNTbUBby9xOqtjmdPe8uoIrTdzszXujW9LvHRSrHKtXEX9oNqNvcdo3CtkffeDSJZJQd1CtNhc/NT9a7K0u/kliTIUZPgK4B9ti+lb2gNQy2e40u0RAfBSXJH1Y1uem286NJ1VJaf9zBZntr627mSHC5GFXY/KmdxoFvYkFScnxc5r0jd1dkL+9uT40rqHvWaknJGCM/Out5OPGZgZWK8oUjqPOi8oLe7sR4UvISbRJc++Dy59N6Gcbo3iVBNRA0nsr1NXs7y1IxIrh/iMAfwq/I2ayLs7Ypr0RG3eRureoAB/WtZj8PlUGaTVJLK0O46X5uXakIOopZutJGIw4ahoo60Y9aEKj//Z', NULL, NULL, NULL, NULL, NULL),
(b'1', b'0', b'1', '2026-04-28 09:50:46.000000', 3, NULL, 'I-002', 'slimen.bouthour1@teacher.tn', '$2a$10$xbjq1gC9D.obf14LnRry6ujdVktjKnX5AboQsihdtXtVlB0UaKO0a', 'TEACHER', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAEsASwDASIAAhEBAxEB/8QAHQAAAAYDAQAAAAAAAAAAAAAAAQIDBAUGAAcICf/EAEgQAAIBAwIDBQYDBQUFBwUBAAECAwAEEQUhBhIxBxNBUWEUInGBkaEIMsEVI0JSsWJygtHwFiSSouEJFyUzU7LxNENUc6PC/8QAGwEAAgIDAQAAAAAAAAAAAAAAAAECAwQFBgf/xAAzEQACAgECBAUDAgYCAwAAAAAAAQIRAyExBAUSQRVRYqHhEyJhcbEGIzIzQoFSkcHR8P/aAAwDAQACEQMRAD8A8qqyvR/hDQLTXL25k1K4e10uyhNxcyxAF8ZCqqg/xFmAoOI9KtbScXOmTSXOlTs3cSSjDrjqjDzAIp0aXxH0e/wecNZXoEaxRmiiPifo9/g8/ayvQQpt0owGDRQeJ+j3+Dz5rK9CyNvjRPA0UHifo9/g896yvQU9aMoOaKDxP0e/wefFZXoWQR6UTcn1ooPE/R7/AAee9ZXobGhFC6E0UHifo9/g88ayvQ7u8DcUHJ6UUPxL0e/weeVZXpVwXw9HxLr0FlcX0Wl2ZBee9nGUhQDdseJ6ADzIqO1bTDpeo3NtziYRSsiyL0dQdmHoRg/Oih+Iur6Pf4POasr0WsmltZWdHaPmVkYqcEqRgj5jarR2iwI0nDxGOV9GttgPIEfpRQ/EdG+j3+DzBrK9DzapjpR0sA3UYFFEVzK/8Pf4PO2sr0VMgjUxqgUDx8akDYe0aYsxOCkfKvqQWJH0FFD8S9Hv8Hm1WV6OaDoLa3eG2E6W7CNpOaTphRk/YH6UaTQrOI4fV4OU/wAiE0UHiPo9/g84ayvRSSy0uGUBLqW4GeqrilGk0cKALe5dgOrSbZoofiPo9/g856yvRM31moKjT0c+cjEmmV5MtwylII4VAxiMdaKF4l6Pf4PPmsrv/l6UJGBRQvEvR7/B5/1ld9v0pE7iihrmV/4e/wAHBVZXeEi5pIjBooPEvR7/AAcKVld0UU9aKF4l6Pf4Nj8Hxd5bcQaXIpW4ubEtCp/N3kbrIF+YVhTOdGseGEt7gkTzXffRxnIKoEwWIPTmJH/DT7jyIaPx9rKWjd17PduEaM+IOMim+icNcQdoeqTRaXZz6reqnPIUxhFGBlicADcfWpGofZJaldxQFatGvcBahwxEzajNZxzJjNvHcLJJ1x0UmozQtIfWdXt7VPdVm5pH8I41HM7n0Cgn5UEOlp6jrifSIdKn01bcMEuNPt7lg/UO6At981DtEcg4q1ce3Ivn0O8ReVZ9PXlX+VVlkRR8goFVo74oB6MKBsdqIFJY0sRgGgUDNAhIR74NKLGBR9s+tZQFBTjNJhcv0pYAZo/KKBBVAo2N6wLWdOtIA0gyQQKLy0oMEUOBTJUWS2s2/wBgGdOQSz37hScDKxojMufXIPyoeNe6lseGWSFY5W01TK4GC7d4+Cf8IAplIXbgmBOc8keoPyr6tGn+VPeN42ibQ42BVl02HI8slj+tBd/iys5CgAn61P3kOr8UrpqRabK4s7RbVWRD7ygkgn64+VI6Zr/7KghW1sbdrvmPNczDmOPAAHYU4v8AijX3QGW8nijZiilBypkdQMdaCKRC3mnXGmz91cQvDIPBxSXNgdadPPJczRy3MjXJU7h2/N6ZqyrxZpUaGMcM2vJjDN3hLH4HFAUijy/nOKn4JYn07TbeN+adnuO8QfwgheX9ajr6OBrqQ2wdYCcqr4yPSk7aVrS4imQAtG4cZ8xQQoc2sgsRa3cLNHMtwY3bPVWXw+XMPmKhb2JoLqaI7FHKEA+RxUrIQ2mTADDe0Iyjy2b/AKUWfTjqfEtzAriNTK5LnoMZJ/oaAIQDBo6LsTirDJpNhqerrp2mrIrtKsEUshwJGJwMjw3NRFzaNZ3k1uxBaJyjFemQcGgKoZsQD0or7rtSkqjeijGMUEarURbqKMeg+FCVoHHTFA0ItSRpVgc0mRtQAjIpNIsDk05cU3bdjtQMJRW60YgigoJRRsjtIgEHGupKrCQNIGDDfmBQHP3qL0t7m2vRbLfSaWkzCOeQEgKv9oDcjYbVcNO0e31LSbbim5liSz061WCeFj781yh5Y0A9V5GJ8lNUm5nkvruWeVueSVi7MfEk0BLeyd1HT9CsgcavNqk2OsMRVPTdt6jdO1WPTdK1ONI39ru0WFZAdkiyTIPi2FHwz50yCYqQ0PS4NV1GKC5votOtjvJcSgkKPgPGgjdvQc8Tnu7TQLVh+8t9Oj5h4++zyD7OKhBuKvGv3PCEeo3EsUt9rLvsr83cxoAMKAOpAAAqlheuBtQEtAuMg0CrvRsUKqM0EDOUctBy06it+8lWNTzFjgcviaUitpDMYkjZ5QSOUDJ26/0oHTGXJgillTYetL2FmdR1G1tgwRp5kiDHoOYgZ+9Smq2T6Hax2Msai4Z2kd8b8oJVR88E/MUE0tLIMpiicuaXYbbUSkwoAKcUOKFT4UJIHU4ovSxK26RO8OCwvrW507Ur4adC7LcR3DIWCsoIIIHmG+opt2mdoPDt97FPb3o9sjDWrWZUhljTZJM9NxnaqFxbrrW0LLBL3cYXdq1ZDbtrV6bp0AgDElR1JB33rFlm/wCJ0vCcubh1Z1/o2Lcdp1tFdqkaBV8HdtqsUPafaa0JEnjEeAqxrC4ZVI6k+p3NaZnt9LvJ2LZVE/MytjFNkuNGtiRaXZWRM5TON/OqPqyvRm0fL+GejidFaRPZ6hNGZJuSA/mZd2Hyqelj4fSM8jXcj+eMZrmvT+0g2DRd4+Suwk8cevnW1uDeNIOKYnjUqLiNQ2x2YedZOPL1aM0HF8A8C646xLLf+zCRfZRIFxv3mKZkedLOMUjINqyDS9x3pVq2pXCWcal5JZYgqjqffAP9aRiZk1u4kzy81wzZB8C1J2Oo3OlX0F3aTNBcQsHSRDggiknkIUv/ABE5zTJLYfcPzLa67p91I3JFBdxu7noAHBP9KPxZw/f6Jr2oR3trLC3fuysyEBlLHDA+RFRt7qFxe8gkkJA8BsM+eKe33FOr3+mpYT6hPLaJ0jdyR9T4Uh6VRAyH3jSYFLsmB0ogFMqphOU1jLtSuQCBRZDjG1BJIbtHtmkSN6dncdKTFpPcuEhheRj4KpNA+l9huVzWMoUdKd3Wmz6eQs8bROf4WG9NZDtQNKtxCVQy7U2p22AhNNWO/lQF0Xm64evbPS4b2ReWzmYKpB6tyBv6H7Gmyw8iA46ir1qha84GiiUc3s2n21yoXff2h4iT8nFU28dQqKvRQFNAmkthrnNCic8iAnAJwcVZdNsLCx0GG51C3aWS/nMaODgwxLy5dfMknG/gpqJvrH9k69NaMDiC4Ke91IDY3oEkhxxnottw7rT6VbsZmtAElmbq0h3b6ZA+VRAXC1b+0aXSNR1Ge9sSYr72uaK5hYkiX3yVmU+RGxHgR61UObCUBKNS0EycmsqY4T4ebiPV4oGburUMvfy/yKSAPmSQBUzq2qafr1nNaWWlW2nx2YaSGWIkyOgOCHJ6+dAKNojeGgIJLy9Iy1rbl09HLBF+7VPcP6XqV3x3cSWtpNcNDNI8pjXIQMrDc+pNQ2kMsfDerszAM0lsgz1xzMx+6ip6y4pu+GuLL2D22e0sZrr/AHhYv4tiAT54zSJqq1K8dEv9B1zTUvIDbytOhVWIJ2YdcVcO2Xh4x622uWztLpt0zxcxxmGWNijRkeH5cj41r6a7nN0s7TySTI3MHdiSCD13p7JxLqN3bzwT3DSW9xMbmSNtwZSclvnk0tRppKiOA3rCuZDRsjNCo98mhkBIL77VEcSapBplogclpZGCqijeptAe8IAySdq1lruqzvxdNGqGW1jmWITNjAPjy+gAbfzqjNKlRuOW8OsuXrlsiF41uriWQLLEluuAqxKxO+cDJ9dtvCmurWicLcOANKqMUDtJ0G/vePr/AEpbEut8YSxW6iS2gbmkkxzKFB9fmB8KY9pug6nrPcxtGzIAGKrkYH8Ix/ryrX9S2s7TpfS3Rqu71cSysQxlZxzDqAF8z/lUTc3LlTKrHnX7irBd8KXVlJEHhdcsWfIPkMD4UjbcH394eZIGEOCCzbAnOayIyitzCak9yCutUdAB3hyw339as3Z5x1Jw9rNjcGQ8qShHGcBkOxB/r8qkNJ7Kr7VY2EGny3smdyo2HwpjrfZrPokLvPbyWcye8ocHfHpTU49WjITxTcHa0Z1vaXaXttHNGco4yDWTHCmqt2Ga1HxRwQkt7MtnPaMYGiKMXOMYPTG9Wi6IVjyksM7etZsXZxGbH9Obh5Ejr2lw2E0ghzgMrgk9UYe7/Q/WoyRfdqxa4Y7ptRa3kW4SKG0UspyMiMBv+bamur3Ctr9pNFGsavbQSFANs90oO3qcmpldUivB+V+maUKs/RTv5CpD/aa7kKgx22V8e6GTRm4hvCQeaNSOnJGBSEnEYx6bdzg8lu5A3JIwAPnTYIzsIgBnmxnxp3PqN3dZMly5z1AOAaHQhCut2JuGCW/fL3jHwXO9MWg2W0FrPGt5FKoPKWQe63KR4fI1P3tnw3ZM3dJqN0MBl5pEUYO46LTxHi13W7Ca5wwuLS5VseDKsnL9PcquX7FYbNl6GHHxwzUFlCr69YwDFnpECEfxTs0h/QU2ueKtRuJPcmFtHjBjtkEY+29O57G3i0G8ZolM6NE3e53V25vc+mSfWq5igNha4mknLPI7SMepY5NMm6ml2b3cUhy0C1bE5T7uKQKEnYUvOMZHiDRBtQFFtjvJoVkiWZlWVBGy52ZeYNj6gH5UgxLHHzqS9oj0LWZCq2+pJEWQd4vNG/hnB+1OrziiO/tJIW0bToSVwJI4ArL6g0ELvdga3cN7Ho0fMSiWiBR5HmbP+vSnHGcUsnErPynvLmKGcDHUvGpP3JodOl0m902D9pTyQT2OVCRrn2hCSeX0OSRnyNOn4jsp9NlvLqKV9cKvDAwP7uNGbPMf7QBKjy+QoLaQx4etdCu5Ll9evrq0AA7oW0XOZD45J6eFO0i4dcullaahqL9AG90fQVHaFr8+hTPLDDbXBdeUrcwrKvXPRgalLztK1u7jeNZYbONhjktIViGP8IoIWqD6VqCW12bWG2azSNnuXjJycpExXPwOT86idCiR7LVZAd47fu1P9osD/RWpPRr1YdTD3MjCOVXid+pHOpUsfhmpW7uLDRLWys7aYXr94015JH+RiRyhVPopO/m1Ia2K2pJQrnY4yPPH/wA05ubmW7uDLM5eQ4yx6mn2uX2myqkOlWXstupyzynmlkPmT4D0qLzvSsiwGyzGjBcLWYBo43G9FioxI80YrhjSgxy0R/zCgkiN1W9FhAznOCcEjwGCSc/AVReFODNW7ReI4rPSVMgZcEIh2XBwTV31qMTW/ctnlkdVYjwXx+2a6y/CVwDp+k6StytqFmmGTLjDFQdlPz3rW8XJxWh2fJsaeK/yaw4P/ClPw7EO/jBdo1kO35m32Pz/AFrYmndgulPaIt5ZK83qM11Lc6dAyFii5FVy900Rzuy7Kd8VzUnNPc7qEoSVUcv8Wfha0TXOdViSEtggquCMDFRMX4WdKs7aPkiDyI3RvEV1Hf26lQcVEGPkfwNQeSdbln0oN3Rr3hvsu0nRdOjiWxhjITBIUZzWnPxUdkmn3fBEmrxQrHd2hAyBu6E4I/X5V09dNhRgVrXtvsTq3AOpW2PzRZ28CDVmLLJTTKc2OLg0cD9h1rejW9S021ga5WRDNyoMsOXq2PnWz7gMjcpyrDqD4VqbR1l0HtEsyrFMzFGI2zkEf5VtZiXYblmJ2rr8DuB5bzbGoZrXcGORo1IVioIwQD13z/Wn11IWSKfGSlryA/AlR/r0pj3Zzg7EeFSN/HyaBayeMjNGPgpyf/cPpWSaVNjjSY9Ig0i2nvreW4nlmdAsbcvu+6Mk+m9Rms6fJpOpXVkx5pIXKE+frT7Sr2xtrOI3Ikae1cyRRKPdkzg4Plgih1a9stYhju+aSLUeQLPGRlHZRjnB8MgDI880EqQlqWgm2sYdQgm57KYKIyevPj31PkVP2I86iVBJ9ambjVidIttOiC+z8veSKRn95zH3h5HGB8Kjo0+lIi1qPuGWP7dsEY8y97yAHw5tv1pvcwhm0uAdWXGPi5o2n3As7+3nwT3UivgehzT7WrNtN4rsoJB7qC3KjzDBXH/uost7DDUYLk6SwSNirMbu4bwUMcJn5En51BSKO7XHXxqe1HUJbx7ycoVgiQW6oOnTlH0AP0qCfZKZGW4gRtStkneXkCqMlnUAee9EbfINP+H4RJrVkrbDvA303/SkCCcTBFvTAiBDGW5gB0YnJHyzj5VByHlbGan9esHSdb2NXNnefvopG367lSfMEkH4VAzp+9O1Mky1Nbuqh2TlXPKCfOgAxUxrLGa1HKAREkL/APEGyf6VDjegxmCvWjyn9386Jn94RRnpE9zI22oxHjQKMijUgMG+KMcUVeoqd4T0u31WfUIrjolq0qkdRyspP/LzUh7uiE5RS1rbm7uoIFIUyyLGCegycVO6twvJPr1xb6Na3F3A6ieBI152ETAMM48g2M0yg0y50vWbJLmB4XMyHlcYP5hQOmnqMJrZ7fdh7vMVB8yOv3oypkbVZOPtIn0bVobWWExRrApjJx7+SSzdf5ub6VX02WgdU6AIwKI4xvSoHNQSr7vzoJJEfMiyyp3hIXnUYAznevQPsU0v2Lh+E92qqExkDrXAakLMCRsrK3/MK9IOz6Hu+HrZwMLIgYDy2rT8dJJqzt+Sa4X+pYpmypFQuo/m+VTEgwM+FQ2q3KIuT1rSSidZieuhB3hDKPjUVcwlWDeFSVxKjxBwdutNJponiLcwAXqaq6b0NgnRETqTnPSqlxZa/tHTLmFvyuhWrZeanZNH7t1FzY3AcHHxqo6lqMcrPDkYP8anNQp42mQdZE0cAdotguk9qEEHIyILyM5HiCwzW1ND0p3vNQjdQ8ltCWXyLZAX6kiqb27WYh7ZdPgU45ZFc/2vGrTb67cWamSAhGnih526k8jKwP1QV1/BtyxpnlvOv76Qyi3UFvzUncM7AIXYopyF8AaldXn0+8uvabCJ7bvQGlgY5CP48p8iSajHGXxWdZoBNhnei8pAOxqT1TRLjSYo2nXlWXm5G88Eg/69RTyyWxsbef2qyN5Ij7ZlKDHgelMSiQXNhcUvCObb5VMPxDY8qxQaFbqf53kZj+lIXGoC6GFt4YAP/TBpWFURVxzIJOU4PhTe8u7i7jSaaaSWVQqK7nJVVACgegAAHwp7ONiaY3BAiI8zSJUxXUdVju4kigjeINI00wJ90vsBj0G/1qObLtjwo67g+lZISiE+PSnZHfURK+9TvT7qWxuknhH7xM4yPMYP2NJPaTQ28U7xOIZCQkhX3WI64NSVlrV0qR2tvHCvMvKCIgWb5mluTSMtNF1e7sDHFDKbPn58SNhebzGahL2xktLqSKVOWRTggHNWriS1u7K1tRNfST85eOSPOFR15eYDH94VXDlt2JY+JpkmTVvqEsLTBj3iSx90Vby8PoQKTosiosrBGLoDgE7EilANthTMcKPzZpeK1muDyxQvIx6Kikk0RV36VY/9utdXT4LJdSljtoUWKNYwFwo6DI3qL8hkRJpN5CnM9rMq+bRsP0podqkJdev7hSJL6dweoaQmmGe8bbck/ejYCy6m8dpNHw6tvEqxOolnI995SBnfwAO2PSmPD+ow6Rcal7QjsZrKa2QKOjtgDPpsaLrNxJJxbdTSbyG8JOP79DxFY+wa9qMAGyTtj4E5H2NIktHY71bVJILbSZLWd43awWGTkbBPK7gA49Av0onDkT6jxNpELuWMl5CmWOerioRveIBpwj4dWUkEHIIoCUrLbf36cS6jdWeo3SwSRzSm3uZDtuxIQny8qqrxmJmUkHlJGR0NCfeDZ3z19awDO1A9wYzRZ9kz60qibUncbx0FiGQR7qYwxkCSTCqT0yTtXVGvfjE4O7NeHtM02GWTWdZSJIpYLQZSGTAyrv0zv0G9aM7O+x3Xu1Mam+jvFbLaJjv5jgGUjKqvr41rbiP8PPEvDnBw1fVVLWK6osV6OvJzOIwQfLIAz/arUcU8U5rqlsdjyXHmjBvp+19//vybo1D8R3a32kQSajwlpt5baXJkLKIR3e23usSObGOo86pF7xh218N6rbSXer3t212rSNZSR94uBnOOXOK3jf61NZ9/o2g2lvF7LbSPF7RhI1RE2UeewAArUbdomtaxqNvq8xtbu30/u4Z4RHyFgzNnl88Bc7eYrHjNdFqCOjUejKoOdM2roP4nOGbnhYTahrFvY3MbCG4iuH5Xik8VYHcHY7GtHds3axxH2lahZ6XwNrqtYvHzubOUsz5PLnC5OPXpWcfdl0va120T6FpivbpeaJHql+YBsWhd442JPpJjPjitf9lk99wzw1daREsdlew669lczyRjEaRgAZHxJPzqnDixJ9d3+DOzTyZIdCVfnuOj+HPtP0RIr1tRvO/udwhvY0fHX8pfP1qRse1bibsPuItN4qt726tJ3UIb0hWj6klHBKuu48dsVsTWeItZ0+HTLqynurqNoZJZbWZiQ7rgKqEbgE5+la47XNUm4+7JNeW7t3S7iZJYo2GWSYuqAAnzzj51flcW1CUVRr8GGddcG9PMhO0PiW2427UNO1SyVhHgqytjIwnpsR13qxtG0aW4YYPdKcfLNRPYb2GXJ1bUrXU7xraHR17qe5YZHeFfD0yft61P6upg1Se2Jy1u3s5Pqnu/pWz4WeKnDG9jjOcYs6yLNljSeifnRJadwnrGpWTXVvp08lvjPe8hC4z1z5VDyxNFO6t1U4ODU3a2EMmnxZ1wrnBa1IYY36eVMNRt4LdwIpDIT1JGKzLOdZYeIdZsNc0a5jUlZ4Hge3z/ABDu+SUfUA/Koi6hJkvGyMdyG+yn9ai4F/MTvtt6VNSN/wCEXFxgnFuiN8ebl/oKLJLYibLS7ieFrlU/dL5nc+ZA6kCpPSNJa9E3JGZZV5SAvrkAfXFF06PvtWhiGF5I0iPplf8AMmmsdzNCsqczIrbMnTJB8aQhLUbSayleG4jaKVfzIw3FNrSayi5zeW8k6ke6I25SDR7+V3TJYsxIGSfWnOnafYXbst7eixCrlWK5DHyoHQg97pQJ7jTXX/8AZJnemdlEsl1GrY5c5IPoM0+udMsI535dREiDoyp1plA8MGoR8zloOfDMBvynYmgVUSGnXL62bm1mOYUiDQIBsjDYY+OT9aitGuVstXtrmUcwikDnHjg5qShuU0BIntJg9ysiyMwGw5TlR9d6Zak9lc6i89ijRRS+80DDaJvEL6eVAxyNWc6Hc6dKglSSRZ45G/NHL0Yg+TDqPQVDkYp4w5Upk7jmqVkmXSS+0mOJWi0Uhcgc8jtvn/4NLxappHR9HTB2ysjAj71ddO4ftuOuzLQbW1mgt9cgadI++cRrMI5AxUn+YJNkf3TWsZIngkaOReWRCVZc5wR1FMqyR6f9hpmt5L5mjjaK2LbKDkgfOrA+q8O2K/7ppEt43899LnHyXAqtgYOaEnIxUSuyVl4jSVz/AOF2KJ4BY+n3qKuHErM4jWM9QqdKLy0NDBEmYRJxEkrjMbSidv7v5j9qca+5uJYLpgczwq5Y9SRlf0qPW+mMIjLAqBgHG+PLPlTh9Sik0hbaaEyTxk91IW2VTjII8em3xNImmRajLGnKLt0pCL8+KcggDegSDHZdqxN6DmyKFDgUE0KISBTe5B9340urZFI3rcsYx1zRdalh0F+GAvqEdnZxXEkPcapLcSqjEcwEC8ucdRs33rd/G3AcPGfZ3xRoaRKTqMNwsR8FlYl0YfB8EfCtC/hJvBbXPEMx/Nboki/NXU/aus9Dtlito4lPMoRdyeuwrkeJVcTP8/8Ao9T5fkUuX4XWyr3dmkeE5NL477OdPvzp4e9aER31q0Y54blfdmRh1BDBqquudl9ndNaSxabBZQW7c2WUKBvvt06eJrZfaj2JWeqX9xrWg6pqXC+sTnnnm0uUBJm83jYFSduowfOtQ/8Ac3r/ABHcG14n421bUtOD4a2jC24m33DFd8HbYY+NR0S1ZucUVlXXFFt/DPolhrl/x3xnAgls76WPRrCYrjnt7ZSHZf7LSu3x5BXPd7wza6Z278U6FJJ7FHr00epWRY4VpAO7mUZ8dlb513NwloFjwpwtBpmnWyWtnbR8iRIMKu+dq5l7aOzSx401q29pDwSJJzRXcLckkL9Mq3h4VKU0v0aoeLHfVT1uycsuG7hLKzgaKMlRhi0Qyd/Otf8AHfDVvf8AE/DvDlnDG0kl6NS1IJ1jtoDzrzf3pREuPjT+z7JOM5rdbduPtXWyAxyosfOR5c2P0q98G9mGn8FwTyQGa7vrgD2m9vJDLNNjplvLrsMDeqrX9SdhPHOtVoQWl8PxRWPEKxIAZJzNJjfmJVRv9K5x1a5W917UZ0OUkuZHBHkWJrqW5VdOsb25iBWe6gmjY/zcgPLj6muQ7K5LHPiTWw5TH78k3+F+5yH8T5P5ODHXm/2ROxMVx4AHNI3E/ePk9BRmc92B4mkZ1wi43PjXRnnwrCwdcg5p5LqTR6Tc2QRWSYqSxzlcHwqOsBs49aXnjJhfHXG1A0KpqkjKjDCSLjLKN2x0JpS91FtTl794khdt2CDHMfEn1NRkcUoA2B86dxLnGaACzRcyqfKkrpffGPAU9dQFppL7x+VADKQe8aIibk+VLyrvSRGAaBCLuckeFGgABzQMtCm1AxWZ85Azj1poQud+tLStgbUzkk96mgLQvtNryQS95EYyWCElSpOM/AnFAAMk7/M5p3o+lXOvXyQQt3lxIGbLnwUZO/wFIywSW87wyoUlQlWQ9QR1FOzHSdWxOjGNggcqQpOAfA1iDerPxLaracIcNLygSSd/IxHUgsuM/KgdXbKrWVlGJyKTBAqcA1gTmNAMBTvWcxx7u1IYqqAfGjdBikkVs5OaVC0ACBtQNstHAxRHagtQMbYol37yg+tYDSNy2y+VBI33+EmzGo3/ABPbFWIeGFSy9RkuP1rrrRojZxxwscmKNUJ8yABXHf4ReMdK4d4t1ez1K5ismvbdTDLKcBmjYkrnzIJ+ldScH8a2HF/7WudOkSe3s7x7XvIzkMVRDsf8Vczx0enM5HonKcqnwcMd7X+5N8R3SRWbsx/hNav06Y3Wo+0OMQK4wo3J97BNOe1/imaynsdItWCXN1ks7HZEGMn7gfOoDhXUWgg5GDXLZKcy+B9fjvWB0/Ue51mCSw4+nuzYkPHFleJqNrHBcRey4BeeBo1kyP4CRhgPMVpHiri2wvNYudMWOU3II5XEZ5M+XN0zVp4o1TULfWYreJpgZSS2R7qrg5wfjj61pnifTb3RtWN1I8sk0ZDcrbBs+VTlFy0YY5dHY3NwpcloDBMwZ1AwfOpW5KpzA7Z2FaX4V44uIr9EdyJQ2QAdjkdCPlmtt3Nx39vbypv3gDKfMmsdpxdF0p9aK7ZaUL+Fbrl7wwd5GqFtveYhmx6LXGiwCO6CL0DV1pF2oaBw5pOsw393HDf2skvLA53kycpgfE1ypLFbCfnimaaU7seXlArecshKLna8jz7+I80MixRjK6v/AMDljzPmiS9DQQtzGhul3RR1bYVvjiaFNPAAJxvmnc2EQDzppYwu04i/LzMFBPxxUrqGhTWKI07AMXeML/dIB++fpQNIZiN3TKIXx/KM0EcM2Ae5f/hNTEN7cWuhAWsxheOX96g/iU9G+RGPnTF9XvpMg3TfKgeg3uYZlIHcyflz+U0yZiGwylTgdafy6lef/kudsbmmVxLJMyNI3Mw2zQISYb5pvMcNR3kKkg70i2ScmgQjzGjpuKAjJoVGxFAAN40ykGWNPGOKa8u58aaA2rNqnDketRNo1nc6fbCKcFriYyNkxOF+5FRfE1z7bq/thYNJcwQzSkeMjRqXJ9ebOag/CpLTtB1LU7OW5tLOe6ghYJI8Sl+UkZAON/CmVNuWg0X8w9Tirb2g3EUn7MtbfBgtIjArDoxQIjH5shPzqreyzibuu5kMv/p8h5vpVkfhbVL+x01RZPAI42Um4dY8kux2BPkR1osSRVuXANJ7jxpeVWjnljccroSpGc7ikiu1RDuFIyaWjG1J4NLIpxQAoq0PKaPHisYYNA0F8KIwxQlsHrRHffrQWBR1pK52A8qVXpmkrv8AKvxoJIZSLufrXWX4Kr/2jg3iqwDZeG9SYL6PGBn/APnXJ0u0ZPjW8fwYcTppXaBq+kyzBBqdnzRqx/M8RzgevKzH5Vr+Mh1YZM3fKcix8VC3vob37XeH5NUitNQhJWYI0BbGeUNjf5FQa0Pwv2i9ovBXapZcCarothfWWpe/Y6v3JXnBPuhxnBI3rrjXLKO9sZoWG2M1CaxwdYcTW1kxAW7smWS3uFGGQjGcGuYxPWmerQkklYlJwhxJeTyQ3NlZzYVyHGUzykdPjkGqJ2i8FcQWGjazfy/sx57KAtDFIuVYhVIBOc+OKt2sdq/FfDTz20tta3YUYSVgQw2xuPkDWlO0Xi/iftCvVhulW2hc8vdW5OZA2Mqw8Fyqk+PujpvWW1CiePBxs2upRUfM1l2NJxjxxxPcalrC2kNlb3T2ttBbQBVPmxJySN9vnXTGrp7JcQ2yHAgjyceYqu8IaRBwvp1pBFjljYczgdTnJNO9f1iKK2vdQmcLEFYsT/KBk/0rXzl1y0DO1j/Q457Qpxcdo+vOCGHtTrkehxUbBKO/wOvjUfLey6lqFzetkvPK8pOPFmJ/Wn+jwC7vVDuqZ/jc7Cu5xR6YJM8QzS68spebJOJct8add2DPAxGeVh1p3caXBZ24mTUba4fm5RDEGJx55IxTS4bu4GbOD4VMrLfxRYpMZLi0gSIWEz2cvdjcnHMrN6k94M+gpfiiK11SCKWwvFlmghDyQtjB5hzkqfMFiCPSqjb6tdsbxhMy+1kmYDo+Tn+ppMMV3BI+FAySvig1JVVcJIFGB5MoOPvUdb28l1dRwxjLuwUD1p2zm41i0JP8EZ+ij/KkNNuGguxOnUcx+oI/WgEPNY0m2s4y9rd+1rG3dykrjD79PMbdagZG6ipe3hV9KvJG5+ZXjVfLfm/yqIlG5oExvIuTmiAZFLOCR0pFm5RQRClcGiE4JonPjIO9D4UAJSPgmkgaGX81Yq5FSAt1/bwWt5LFb3Iu4VwFmClQ3rg71YeDNctNFW47++1Gwkf8klmQV/xL41VR4UqDtSfkUp1qWNNSubziTvbC9lNxdyLGbiUBWJYgEnyoeJIo3/f2uoXd9GjmKR58qeYjIIGehA+1ROiXJttYspR/BMjb/EVYotJvZdE15I4WkmN5GiooyTylubA9AwqNE0+wx4h0iztdOsrmxl74YWO5PMD+9ZQ4I9MEj4qarw/KaVmWaCSSCVWjZW96M+BH/wA0jTI/kzNLqdqbPtvR4nztQIcjwoXbeiA0DHJoAA4pFjuaVPSkWHvGgmmGQkrRbgcyihhOSw8qFxlaCxDCfaI020TiS74R4l03WbJylzYzCZD546qfQjI+dO7n8hqvah1NRcU1TJxk4tSjuj0o4X42teLuF9N1SEtCt/apcoko3AYZA/Spa0d7NIwzAxFcZHUnz+lau7B9P/2k/D3wvLA3d31lC8Mb4znkkcYPyAq4aBrqalp8lvKjpd27GN0cYZG38PpXISgozkl5nq+HO5Y4T80v2Kt2mcVT6ZepEtslzG4JY7Z6dB61SdG4gOr3BxaCyYE5VgObA26/661sfiZNPguY572FCSPeJGcAf/G9UHU0gtrppbDl7t2yxXoD5/Y/SiSuNG2hla76B+INX/ZWj84kC8/uY8QxIxVD7UdYmj7O7+2hYmQpHE79D77qp+ZBNBxprY1vX9L0eyJky/tE3IcgRqc5PzxTbtgtzpvZbqE6n94Z7cq3wkXFLDjrLBPzRq+NyOfD5ZLsn+xo/hjV3u7y5s7jkSCa2e3jBT8smMJj15sZ+NE0e5ey5sIhOeUh1zVfF9cXV/7U8hMofvNhjBznNWOa7/aF01z3aRNK3OyoMDJ612aeh5ITk+rzXlrHA6xKinPuIAaYahJ+4x6igRt8eFFuh3mBnp4UgHEWFUVkz8owPGk3m7tRSQmLsSaALDaQc8PtZGFismPN/a5uQf8Auphay+zypJyKyqQSrdCPKlrTWu60O6sO7DGZ1Ik/lUEEj5kCmTH3aB2TDcQRvI8b2cUdiw3t4TjB/mBPjUbqj6Zj/c/aS53PeqAB9DWX1hHa6RDdm4AuZGB9nIxmMkgMD47g0ymikjhWVkKK2eQkY5h6UAxvK/KKayNmjyPzUlIRiMqc5B5vQ5oICbDFBzGhbrQDxoASYb0ovSsHjWDcVIaLCPClF6CkVBApQHahGOxUHG4OMU/fXdQkMb+2zo8YIRo5CpUEb4I86jXbAoA+KVErFN2csxLE9SeppNutZ3lBSEGYZBrI0OaFfWlIyM7UAHUYoG60aisMsKAAohJY9KOV6UZUoJxEYhylvWhb8poTgSEURjjOfGgtGl3+Q1CX0eQTjpUzcnKsKidUuoLGBnnkCKTyjPifADzNA0m9ju38HKyydhlrHKpVVvLgJnxXmzn6k1K8c6Te6RfXGs6TGzzlVFzbKATKo6MM/wAQ6eo28BTz8OcEencM67okG8Gian+zVOepS1ty5+JZmPzq+6xpBuAXQb4rleI+zPL9T03go9PDQg+yRy1x32gQanYz23ecrBSG51wVY+Q/11qt3XHdnBo0VtCrzXLqAsUa5LE5PKMfH71vLizhO0uZXN1pVvO+dmaMZqi3HDtpZS8tlYRQuNiVQA/WsdzrU2KhJ9yo8B8MzWs1zf345tTvSOcD8sUY3VB8Op9aX7etKluezO9hjA7zmhKL54kXb4noK2FomjGEBnAHjVJ/Ew81l2NcT3du/dz2loLqMjrzRyLIP/bSwzbzRk/ND4jCpcPOHmmcgWL+5zEYPkfCrDaOHbA8Kd9oOhLonFkqxoI4b2KO+iUdAsi5IA8g3MKZ6euFZvHOK7VqtDyGUXGTiyUhTYUSXPfqM7DenEJAWmtxKFuNvKogDK4Y77ClYgMAnp4025e+AA8aeFeWMj0oEOry1SzvpoozlEPun0O9Gs44Glhe7Z0tDJySGPHOBjqufl9aX19VlhtGgi5Z1AjlOf8AzCwDKfocfKmV2qqUiVuYRjBPm3jQBJcU2dvdcQw2dtI8giKW6cygYCgD5eJ+tML6SbWTM6OWW2WOKGEdFTJGw+OPm1O4NTt14sN2rfu5opuXnH5ZHhcAfJmxTLhfVI9J1JruccypCy8g8WOAPoTzf4aAI+9sJbe7mtwDNJESH7sEgEdfpTEDNWbTdTltLd0t7s28ntPeSybZkTHT13zkeOaiNTt+5kWQqEM+ZRGP4QTt+poEyNJzWDxrEXA3o2KCImRQEgYrH/NSbdalQyzA5FDmiIdqNmgxw53rKKCfKjVEZmKEdaClFUE0ABg4OKPGNqELtijYGKAMzQE0IwR1oh3NAxQb9aNkZpEZFGL4xk0FiEJmPekjpSby4HWsmP7w0lIRQTQlO6pE7uwVRuWPQCtZcJ3U3a5+IfgThi15nsp9Whyn80SN3jsf8CN8qlu1DiVbDRZbWCYd9IMPyn8q+vxq2/8AZmcHLxX+IbVOIpF54+H9MdkYjOJZz3Q/5BLV+KNy1Nlw+P7etneP4ZJmXU+1u1lYd4nGd3Mo/sPBblfsPtW7mTNc39kOqDhn8RPaJo0rlU1IwXwVtvfwYzj/AIK6NaYKM52rjuK/vzX5O/wr+XFryIrWNKhnRnYAVrTU9KhinkdQD73lW1r1hNayYO4Ga1lrc3vKBjNYclqbTE/tIuCFUVvd+Faq/EjIrdlfEMJwe/tJIcH1GK22Bywsx8BmufvxH6oZeF5LVCS00qRhB1OXAx96eONzjXmPK/skjQv44dMvNG4Q4I4l0+V4JbaNbOSSM4JVk5kz8Cjf8VaG7O+3i4gultteBmt2IHtCL7yHzI8R0ruT8RvZtL2hdmV9w1GuL32VHteYYxNHhlHzwV+deZevcIa1whetBq2m3Ng6sUxOhAyOoz4132SDpNHnDxwmnaOzrfVIbq2jmglWaOReZXXcEUjJIWYktv41z92O9pbaXdR6Rfv/ALlOwEUjHaJif6HNdH2EcdpeRSThZ7dnMRYdM9D9M1j0arLjeN12Bt1CqD44pZmHKaNa2Rn1FbMusbFinM229A9nPGrBl5uWNZH5d+UEZ3pFFEtOwnXlX85tIph6lRg/YGoR3x7oGw8amoVBm0cn/wC7bmMj/G61CPgZ86BNDK6kPOmDuDmiKTy8udj1o0x5jmsRcGgiPNLtUuJ2aZuWGEcznxOegHmTTe7la8uXnfYnov8AKOgH0pPnYKfeIHpQM21ABGXBoGIXwzRZlLAHPQ0BUgDegVCcn5qIRk0Zyec0mWINTDsWVfGjLtRR0ocZpdzHFF6UY9BSYFHx0pDBUZOKXC4HSk41pUnakBgOKIz7mjUDJmgAnPy7UZRkUHJR8cooGIuxBODikJJDnc5paZuVSTjGM5O1VXXuO9K0ZWV5+9nG4jj3+pppWWwjKTpIsUrARsxOABnetdcUdpSRu9vpjBnX3TNnofSqJxD2panxDHKsUnsdo5KLHEd/mfhUHZyBUUEbnqfCr4Q8zZYeGadzD8V6jzWvNI5aSTLOc9a9CP8AsquA10Pse1/ieRR7XrmqtGreLQQKEX5c7S15tcVTkMNioUYbbOf+lex/4HOHBw/+GHgGEjEk2nLeMcYyZiZf/wDdZONamf8A0qkULtShn4L/ABLWmrxki31C2K83hzIynH/PmulNJ1iPVtPinjYHKjOPOtR/ia0Azw22oxJ++s+SUMPIZDD6H7Ch7JOKzNp4t5JMg7rmuP5ni+nxDktnqdjwE1l4dea0Nt3177Nau48PCtcLzXlw7uCBnbPlVzvZ1aAioBogHHL0rUmyi6WhG6ji3snPhjxrQ2qaM/HnaLpGnBBJa2lwL258RyIcgfNuWt38aXK2eiyMeuOlU/sl0FrOy1DXZo8TalKUiJ8Ilz/U5+1bDgcDz54rstTC43N9LBJ93oNuLo+fUBMPyhz961d+IXslsu1Ls1vbaO3Rb9R38EgG4kHT69K2xxBGZkuAPzKQ4+RqH9tZdINnJ70/dqqudhIDjp679K7xV00cR3PIg202lX0trOhhuLeQxujbFWU4I+1b+7O+2myGh6dpeuI0clvOGF8NwUxjDD/Cu/pUV+LvgiPhjtSe+to+SHU4xK4C4AkGzH57Vp+0cqvLnbyrBnGnRKcFkVM7C07WLfW3W6trlZIpn5xIh6AmrLHLb3+pzTQ3CwlrdvclfALkFSPhjeuOOHeLNR4Zv4rmymwqMC0L7o48iPKt8aH278Pajawm4tILG4YYaN1ZlU/3qpcTXT4eUdlobIkuDb2Olyg8zQvIpI9GDfrSXEcK2+u36RgCPvmZcfyk5H2NK2utLe6PbSW1vby95cFYwi5Byq4xSrzajdXLQjS1luFHvJ3ZLAA8u+/mKjRiPcrkgwVFLwwtcOkceDJIQqjOMk9KdDWh34V7C3JGQQVP+dOrW9guHSBNHjuZnbCiMkHJ8qRWRV3bS2bNDPGYpVOGVhgilItOmnsLi6jXmjgZFf05s4P2q2cS3mnWlgkOpRx3WqBT3SRsT3ORsJG/ix5enWobguM32py2RHNDcwtHIM4GNiDnz5gv1pjohJoXhfkdSpwDgjfcAj7EUlMeTlFOtSupLu+nllXkkLksvl4Y+WMUxuuo9KEJ6CUjYY01bOetKOxJ60mTmpES2KcijLSCPvS61HuUdgw60aijrRsiix0KK+KNzj1pGjZFIBUOM0JcGkC2DQF/I0AOKqnG/aJacKxezxqLq/YZ7sHZBtuxqY1XVF0vTri6kbCxIW+fhXN2u3st/ezTyktJMxZvEk+lWwjepn8Li+o25bEjr/aHq2tse+u2SPf93GeUY8qql5fS+zXDs+SqnxyfWglV32VCMAgnqSc/akLlgum3R+JGPSsikkbuEFBaDS0uOWNAzEKFBOR0z51MaeRJIck7DJHpUG7iJ1UZBUADHwAxU1pQYq7oN1XYevTFCGyJ4nmOLg7lwCMeZz/TP9K94uxbRRw72U8I6cF5Ra6TaQYH9mFB+leEGoQLPeIvVXlA9Nzjevf6e/0/hHhZ728uY7XTdPtu8lnkOFSNV6n5CrobshIge1PQxrGisCAV5HVs/DNc2cBzXGj6oLaRWURMU3GOhrRXbb+Ijj3tg4xseLOFLm703hvh+4M1hp0Z5TMoOGllH8RZfA9BXZep6S7aRw/caraxW8uqWMd3HLFICqyFA7R59MjfxFavmHCPiEul017m04Di1wzalsyaF680K77EUaAczVD6VPz2nLnJQ8tTVkMgVxkouMmn2OuhUoqSKZ2gI2pXMWnxhv3rrGceGds1D9rHarwv2E2nCOj6zJNFa6g7WUN3GoKQlVX35BnIXcZIBxmrrbw2sfEl5qt9IsNhpsLTyTMMqgHia4d/ETrM3b/xxPdxB10jTYmSzgK9ATksf7TYB+ldXynFWJ5PM5nmmW8ix9kdW6g0c8XfRSLLFKnMsiMGVwRkEEdRTC30cajp8KkhTnKsfA1z/wDhx48v+H0/2H4gcmDf9k3Mp/KT1hJ+4+Yro3TH5baBR4HBroEaNnJX44uGkuez+1v5cLqGmXqK5Ye8yP7uxxuM4riODqPPwr0x/Gxwqdb7EtZv4kLS2ISR+XqUDg/avNBByxKaxM39SLIOxWWQKdzgjwoI3JBA8TtmgzzCigkEnpiqbLDZHZ12p33DclrZXUxk0sTDn8TEenMPhsceldPanxhKdVm1HSr1/Z76GORZQMMVI8fLfJ+dcOW7FZXB3/i3re/ZHxT+0tCbTpZC09kcKWO5jPT6HP1FRaNbxWNRj1I2Ejsbhnckk+NSNnq1zp3eezP3bSLylwPeA9D4VFBt6Ojkt12qs1IEzs8xLHJO5J8asFnKum8PLJFJi6uJzzFeqImCPqx/5agAA0jE7jpS8hxFt6U9Q2Hes30Go6nLcwxNCJQHdD0D4HNj0JyfnTC4POwxREyc1kreXWhCuxBhuaSK4NKMepNJhqkRLJGMmnCU3R+WlkfNQKhTNZmi5rM0AKA7UJO1EHSsJwKAB3NZ0oFbIojuRtQBRu1nWBbaVBZKcNM5Z/7o6Z+f9K0teyGQHK7Z2DL+tXLtJ1M33E1wA3NHEO6AHp1+9UYn3JXVveBySGz9R4msuKpHQcPFwgkwnKpbkxnGMknc77UyuAJNPlQHmV9tvH/WfrSsc2ZkKkA/lORt13+W9JqjpBChbfvlxjp5/wCvnUjMTI27cLJzAk+8RkeO/hU3ps5kgI/hI6/T/rUDfKB7oBJOSB5/9P8AKpLSWwqKCcbgnzzSsUthvqk2Cr5C5fnJ9BjevVn8RPFV32vzWXBGjyM2gQJFPqM8R925kKgqmR1VRgn1ryl11Bg4Hur0Xz2/p/lXqb+CLS4dT7GuHbmVBNcNApZ5CWJ6jcn0Aq3G9WRYn2adj8fDwFo8PNDICpyNjtS3GXCfEvZveabdvqd7qnCFnlIbCWQstkrFconkuwx5YFdGSabHa3RIQLiTAA6YqR1XR7TVbGWzuUE1vKpV1PiCMVkadyJq7SL+zmt7eazuFmguIhJG4P5h/n51MR33cqctv4DzrUF7ol92P6/Jps/NNwzdSNJbTtnNqxJ2z/Kav2havYxabLrer3iWOm2pK97MfzsP5R/F8q5XjeW5J51LHtJ/9HUcHzDHDA4z0cV/2Uvt4u9VtNKsdKs5pO61INJcxoNnAYcoPoM/atc6PwEumaWFeMrLOff28TWw9U4nPHGuPqTRGK0RVhtI3GGEQ3yfVixJ8th4U5SIXt1EgXZDk7bV0uKEccFCOyOcyZJZZOct2a6l7PI75cGMCRW5kcDBUg7EGtq6bbzQ2aGUhpfzMR0zTi3sFjP5RnOelPzH7oAGxFWXZUVPtliXV+ybiy0yrC50u4UA+fdtj715FnAXc5GM162cfSmDh++t3GUeCRcHxGMV5NXkXs9zMhG6uRj51i5lsyzHoNy3KMeNCjY8fSgChtxtQYIyaxi0Om0nTbFW/sz1kaVxValjiOcGFh4HPT74qoRnIJPkRS1lMbeaOVDhkYEH50yucVKLTOqBIaUVz4GorTNRTUrG2uo/yyxhhUgj9Kgc4Lo5BpR5iygUkDmhoExQMRRSc0HNRGbfrigiEl6bUnjFKNg0Xc0Con6Wh6UiDijK+DUCoX5qEHNJd56VneelADlTtRT0pIS7UDS7UAKE4FMdY1BdP025umIAiQtucfClzJkVrvtY4k9jsV01XHPNh3H9nwH1qUVbouxQeSaSNZXd293dtI/55ZST575+tRkTHkuo5EKsnvcr4yeu2fpTmdwJIATj3vlTBcLqVxGeRgYicZ3zmsv8HQrVjLvedni5sNnIbzP/AFpdMm1hLDOZGyP8JqLWU+1yAHIzsT4/6zUnE3fQwAruC5DHxxt+v0oLdkMr7eUt/KOn6n/XjS2lzHkkxlskYxWXkXe83Nj3icHpsNsn5YrNObuvcByw974j/WaBNdwNbfEKHBIxtj+nwFesH4E7Uw9ifC/jzWaMfic15Q6rGTBgsQCo2+nSvWT8Cqyf9x/DjuCvLZp18t6shuRex0PrECj3htzfbajxsVtkc77Cg158wwN0B2obeMvpikeZFXWRsr/HFhY6hok0t3CkyRKX5WGcgDJHz6VqXjHgrR9f0HhSZZVe8SEK1lEx5IQBk5XO2DgZO5ya2bxs5/Yz2u4aUD5jO/8Ar1quafpS8jScgx+XIFRduqEUC30RUCRojRhNhtVh07SxbQgk5J8xVth0SMrnlGaZXdsIn5cbUwI2O3IfbcYNAyYAp4U5QMDrSfc87FfAUgKZ2gWXtWhT4GWCtgee1eTPFtu1nxNqsDDlKXUq/DDtXsNrGlm+tHixkHbFeUfb3o/7B7W+JrPB5Y71wc7dQG/Wq8q+0sizX6t7ufI4oh97JPXwFGKlQARiilS2ceFYZcDGTvt8vKsTPMCD03NAmQDnY0UHl3znyoEzfHZVqQu+G+5LZe3lZMf2eo/rV2VySBWnOyHURb6te2xY/v1yFz4r/wBCfpW3o3GKTVGh4iHRkY8VqMDmkIzvmlwRSMUGinrRqKetAtwKMBmi0ZcY6igCbByKGiIcij1AoQagNYTRS2PGgYbODvRS3rSTSHPWiGQ+dAC7OAK0J2lzPJxXd85/KwCnPhgVvJpNq0Hx3MZ+IdRYjBMx5MAdBtiroK2bHglc2Ql8+JrfONsbnoD54pG7PLqxJJ/JIRzeWNh9qDVWMb22/LsBnOTtmm95NnWbRxgLKh+PvKdqyGbpIiInIuZB1YDn2qZsm57SPoMKcZ88ioFSBcHPiPLwxU3YSCSxV2y4CkN5+G36VBPUk0GuFOQSNjk4Px2/WkbYBApYYOSc+fhTqSMNGgDc3u5O2/Xf9PvTfPLIQpAHifI+fx8qkBmoZkUKCRggda9ifwa6YLTsA4WYDrp8JJ8SSgP61473Cg8jADcjIPRQP1r2p/C/Z/s7sO4bhYcrJYQBh692tTjuRkX7Xj/uMPoac6O3PpbgnJG9NtcXvLFVB8DQ8OSCSykP8y5q0qK/r4S4hPPgtEGXfyJH6imulRKloy46sTReJuaLWokXISa3kz5ZHKf86Ppj81sBjcdBQA7tYQ1kZGGCCR96rt8QXJzjfAq13A9msAh6kZNVS4UHqM+9QAhNEFjjPi3hQi29848d6cTpgQg+VPIYMAN6YoAipo1jRiwHma8tfxlwRr27a9PEF5JBCwx4HuwDn4kV6gcSXPdQSAbk+VeYv4v7J4u064mcf+cgbm88HFQnsSjuaF6KfjRQdiD4n9KFiSMbfOgrDMgNEBz+e1J55g3xo0ZIdcDcUnGSEOfE7UgLFwfqZ0riK2uM4AmRT/dOx+xroVMtg+FcxI5jkyDg8wwfWuiuGtXXWNGtLpWyzoA48mGx+9DNVxkNpk4maXTNN0cedLK4zUTVsUwaKQd6OGBFAcUCCA460GKMwGKCgCbRsUbnPlRFFKYwKgY4UglTSbbUsT7ppBzQC1AJzRWoOagb89BIBmCjJ6CtBcUSm71CeXbJkZ8D4+H3rd2tytDp1y6HDCM4PyrRt0Obv2O5HQ+W9ZGLubTgdeplf1Us1vE7EMq9ceWaa3cg77TJVPNhwp28zgfaneoKF0x1HTp96jyf9ws28RcKM/Nf8zVkjcIjrh2W8ck5YHFTui4fT+Y9Vcjr4VAX/u3kmNt6ndDOLNfLnJ+1QW5KWw5bbm8FQdMZ38P1pJwVAUggk5G3Xwz/AFpWVjnA2HNjb4UaUAhWO5xn7GrCKEJ4SyoiRl8nA36V7hdkFoNN7OdNtwvKFgjjx8EArxLsFB1nT874lj2Pqd69yuEAF4XtABgZb+tWRFLYdX780IHUYxn45ptwvPiEIfFcU5l/+mX0qO0hily4GwEmPvVhUMuKUUzo52ZBIB6ggUnw8ne4PULRONGK6tEo2UxyEj6U44aULbMR1oAd6u3MnL/KMVXZI9wfA1YtTG3xFQjgcooAb3S57selL85S2GPKk7kDMf8AdoJzi3A8xQBWdcBkRj1JyK8+vxv6SbTX9MuxGSJEdGceGMYH9a9DL1QynNcOfjthVbDSpQPeE8n9D/nUZbEo7nFxyT8KxTkEeVGoq9HrCMgOhJkAztSauHkVRsAaUTZhTaA5YH+1SAcTN+8ABz72a252Q6k0lneWjHaJg6/PY/0rT7nMwPlWx+yKRv2rdrnYxZI+YpMxOJ1xM3DG2TTmPHWmUdOU6VE0Q7GAKHNIr0ox6CmRYfc0FELEHGaMOlAH/9k=', NULL, NULL, NULL, NULL, NULL),
(b'1', b'0', b'0', '2026-04-28 13:18:41.000000', 4, NULL, 'ADMIN-001', 'admin@inspector.com', '$2a$10$BFn4FsK.iB9m3kjLblwy4ustERA6tJfspUM7c9ITVARCor2XkYDXi', 'ADMIN', NULL, 'Main Admin', NULL, NULL, NULL, NULL);
INSERT INTO `users` (`enabled`, `is_microsoft_connected`, `profile_completed`, `created_at`, `id`, `verified_at`, `serial_code`, `email`, `password`, `role`, `profile_image_url`, `name`, `cin`, `reset_code`, `reset_code_expires_at`, `expo_push_token`) VALUES
(b'1', b'0', b'1', '2026-04-29 18:22:14.000000', 5, NULL, 'T-002', 'chbichib.sofiene@gmail.com', '$2a$10$Et7UKbMFkba6SYmoCygd3udzcS5O6UjA1ZcyQK.OkiLT2RwpqaAbu', 'INSPECTOR', 'data:image/jpeg;base64,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', NULL, NULL, '305716', '2026-05-05 12:19:02.000000', NULL);
INSERT INTO `users` (`enabled`, `is_microsoft_connected`, `profile_completed`, `created_at`, `id`, `verified_at`, `serial_code`, `email`, `password`, `role`, `profile_image_url`, `name`, `cin`, `reset_code`, `reset_code_expires_at`, `expo_push_token`) VALUES
(b'1', b'0', b'1', '2026-04-30 18:05:59.000000', 6, NULL, 'T-003', 'fares.1elhammi@gmail.com', '$2a$10$NpMlOlmm4fBrh0dZZW0vjeInNWxoVdekGq0WfpBxpCJXkVtIZnMQO', 'TEACHER', 'data:image/jpeg;base64,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', NULL, NULL, '814709', '2026-04-30 21:01:54.000000', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `action_logs`
--
ALTER TABLE `action_logs`
  ADD KEY `FK6locj4o5mo2ktklow0ywpfheg` (`user_id`);

--
-- Index pour la table `activities`
--
ALTER TABLE `activities`
  ADD KEY `FK8xeeefop81ac5dfy3rvnku1a3` (`inspector_user_id`);

--
-- Index pour la table `activity_guests`
--
ALTER TABLE `activity_guests`
  ADD KEY `FK3bqmvjh1a3e1koth7rurpwx91` (`teacher_profile_id`),
  ADD KEY `FKbhn7po1hepsn8ojrju17nif3c` (`activity_id`);

--
-- Index pour la table `activity_reports`
--
ALTER TABLE `activity_reports`
  ADD KEY `FKk7fw5am5dai1ey6ka5xyh62l3` (`activity_id`),
  ADD KEY `FKshdeoackt3f1em8a7mq9ld2lt` (`inspector_user_id`),
  ADD KEY `FK977uvs47ustloar8rbvqmqgea` (`teacher_profile_id`);

--
-- Index pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD KEY `FK8wv0rmd8jb3cqcbyng15ubrmk` (`user1_id`),
  ADD KEY `FKe7w0k1xem21pp85wxh5moodnk` (`user2_id`);

--
-- Index pour la table `courses`
--
ALTER TABLE `courses`
  ADD KEY `FKfcorcd3gqn5a0aim4764qndv6` (`inspector_id`);

--
-- Index pour la table `course_assignments`
--
ALTER TABLE `course_assignments`
  ADD UNIQUE KEY `UKi2b2vy0qihv7wkss0puqc62jh` (`course_id`,`teacher_id`),
  ADD KEY `FK72jev2xuicw5cxlcbvfc0dp5o` (`teacher_id`);

--
-- Index pour la table `course_lessons`
--
ALTER TABLE `course_lessons`
  ADD KEY `FKohkdsgpvvrkpi6k7c9c0w3esp` (`module_id`);

--
-- Index pour la table `course_modules`
--
ALTER TABLE `course_modules`
  ADD KEY `FKtn63pa8l33002k4xuwkcuefll` (`course_id`);

--
-- Index pour la table `delegations`
--
ALTER TABLE `delegations`
  ADD UNIQUE KEY `UK_b046xxnaduqesuya1ctotpsyr` (`name`),
  ADD KEY `FKgm7hb20dlq0wksovp1u0kdbf1` (`region_id`);

--
-- Index pour la table `departments`
--
ALTER TABLE `departments`
  ADD KEY `FK5ry7wrujddhjquff8tldcg2u` (`delegation_id`);

--
-- Index pour la table `dependencies`
--
ALTER TABLE `dependencies`
  ADD KEY `FKatxx6ynbit4aosijkwkhcw4kd` (`delegation_id`);

--
-- Index pour la table `etablissements`
--
ALTER TABLE `etablissements`
  ADD KEY `FK83yswb2esprav0so2sv6jy96r` (`dependency_id`);

--
-- Index pour la table `inspections`
--
ALTER TABLE `inspections`
  ADD KEY `FKas8faafuqgduo9iyqy495etcl` (`delegation_id`),
  ADD KEY `FKr75vi36g0xn9rq6mf8cw4ehps` (`inspector_user_id`);

--
-- Index pour la table `inspector_profiles`
--
ALTER TABLE `inspector_profiles`
  ADD UNIQUE KEY `UK_4k1d7ereh451w9hxv66oqxgib` (`user_id`),
  ADD KEY `FK9liupvyse1xfip6lj7i4ecqv3` (`delegation_id`),
  ADD KEY `FKgxpkb9kj51a01w0wqv8nw5ksl` (`department_id`),
  ADD KEY `FK46vusu9wcog2x8tke4o4nj9w0` (`dependency_id`),
  ADD KEY `FKorl9yl44tb3091grynxsubo18` (`etablissement_id`);

--
-- Index pour la table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD UNIQUE KEY `UK9s5lj97mlxt7t5x19uporqe2p` (`lesson_id`,`teacher_id`),
  ADD KEY `FKdfd18irryi42p4m2qrpb7nwv5` (`teacher_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD KEY `FKt492th6wsovh1nush5yl5jj8e` (`conversation_id`),
  ADD KEY `FK4ui4nnwntodh6wjvck53dbk9m` (`sender_id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD KEY `FKqqnsjxlwleyjbxlmm213jaj3f` (`recipient_id`);

--
-- Index pour la table `personnel`
--
ALTER TABLE `personnel`
  ADD UNIQUE KEY `UK_6bq5ji4icknl249f75fx21pas` (`cin`),
  ADD UNIQUE KEY `UK_6eekxoywl3l7cdoskwfgynxha` (`serial_code`);

--
-- Index pour la table `profile_delegations`
--
ALTER TABLE `profile_delegations`
  ADD KEY `FKn447fym5r639bnq29q5rdpqou` (`delegation_id`),
  ADD KEY `FK57g8wvv8o83lbn6rleh82mvrh` (`profile_id`);

--
-- Index pour la table `profile_departments`
--
ALTER TABLE `profile_departments`
  ADD KEY `FKrdgfitts1ruy8uet694tqi9pg` (`department_id`),
  ADD KEY `FKetmflbwsokowc7udoq1f7cc9t` (`profile_id`);

--
-- Index pour la table `profile_dependencies`
--
ALTER TABLE `profile_dependencies`
  ADD KEY `FK5ayc2we5f9e5ch81bki0wgv09` (`dependency_id`),
  ADD KEY `FKpohjwqoddot9lxkjemdaf8y41` (`profile_id`);

--
-- Index pour la table `profile_etablissements`
--
ALTER TABLE `profile_etablissements`
  ADD KEY `FK5mllmgiqsxa3r3ibyykc2u0ye` (`etablissement_id`),
  ADD KEY `FK2hsi8iw6ya1t27cjvba3l28es` (`profile_id`);

--
-- Index pour la table `quizzes`
--
ALTER TABLE `quizzes`
  ADD KEY `FKebon51sego16fh7u1lpxhofad` (`inspector_id`);

--
-- Index pour la table `quiz_assignments`
--
ALTER TABLE `quiz_assignments`
  ADD KEY `FKkbec65aap50jwts181t0lvew0` (`teacher_id`),
  ADD KEY `FKn0a1ujwg431xx2hkjtwlhwv30` (`quiz_id`);

--
-- Index pour la table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD KEY `FKanfmgf6ksbdnv7ojb0pfve54q` (`quiz_id`);

--
-- Index pour la table `quiz_submissions`
--
ALTER TABLE `quiz_submissions`
  ADD KEY `FK7rmflyrtaibx04079o6tiu0me` (`quiz_id`),
  ADD KEY `FKl363qjquyu5xcnc9nnhjrcfds` (`teacher_id`);

--
-- Index pour la table `regions`
--
ALTER TABLE `regions`
  ADD UNIQUE KEY `UK_1m9qnhbk56c8iskxvfupln9me` (`name`);

--
-- Index pour la table `teacher_profiles`
--
ALTER TABLE `teacher_profiles`
  ADD UNIQUE KEY `UK_85e2atxgeqqdc1ntgmupd4sia` (`user_id`),
  ADD KEY `FK1aksodsfqaojyosetnxow5sd6` (`delegation_id`),
  ADD KEY `FK20p4y1745gww8sj8dep9vnj2` (`dependency_id`),
  ADD KEY `FKlwopfniwdsx2hhw95afjomko4` (`etablissement_id`);

--
-- Index pour la table `timetable_slots`
--
ALTER TABLE `timetable_slots`
  ADD KEY `FK173885iq3ags1be7hp5ih3yf3` (`teacher_profile_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `UK_rbufxqwr30j3moma7bxv0f0oo` (`serial_code`),
  ADD UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--



















































--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `action_logs`
--
ALTER TABLE `action_logs`
  ADD CONSTRAINT `FK6locj4o5mo2ktklow0ywpfheg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `FK8xeeefop81ac5dfy3rvnku1a3` FOREIGN KEY (`inspector_user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `activity_guests`
--
ALTER TABLE `activity_guests`
  ADD CONSTRAINT `FK3bqmvjh1a3e1koth7rurpwx91` FOREIGN KEY (`teacher_profile_id`) REFERENCES `teacher_profiles` (`id`),
  ADD CONSTRAINT `FKbhn7po1hepsn8ojrju17nif3c` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`);

--
-- Contraintes pour la table `activity_reports`
--
ALTER TABLE `activity_reports`
  ADD CONSTRAINT `FK977uvs47ustloar8rbvqmqgea` FOREIGN KEY (`teacher_profile_id`) REFERENCES `teacher_profiles` (`id`),
  ADD CONSTRAINT `FKk7fw5am5dai1ey6ka5xyh62l3` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`),
  ADD CONSTRAINT `FKshdeoackt3f1em8a7mq9ld2lt` FOREIGN KEY (`inspector_user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `FK8wv0rmd8jb3cqcbyng15ubrmk` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKe7w0k1xem21pp85wxh5moodnk` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `FKfcorcd3gqn5a0aim4764qndv6` FOREIGN KEY (`inspector_id`) REFERENCES `inspector_profiles` (`id`);

--
-- Contraintes pour la table `course_assignments`
--
ALTER TABLE `course_assignments`
  ADD CONSTRAINT `FK72jev2xuicw5cxlcbvfc0dp5o` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_profiles` (`id`),
  ADD CONSTRAINT `FKbin2ne1ecpys8b297vuyo52km` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Contraintes pour la table `course_lessons`
--
ALTER TABLE `course_lessons`
  ADD CONSTRAINT `FKohkdsgpvvrkpi6k7c9c0w3esp` FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`);

--
-- Contraintes pour la table `course_modules`
--
ALTER TABLE `course_modules`
  ADD CONSTRAINT `FKtn63pa8l33002k4xuwkcuefll` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Contraintes pour la table `delegations`
--
ALTER TABLE `delegations`
  ADD CONSTRAINT `FKgm7hb20dlq0wksovp1u0kdbf1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`);

--
-- Contraintes pour la table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `FK5ry7wrujddhjquff8tldcg2u` FOREIGN KEY (`delegation_id`) REFERENCES `delegations` (`id`);

--
-- Contraintes pour la table `dependencies`
--
ALTER TABLE `dependencies`
  ADD CONSTRAINT `FKatxx6ynbit4aosijkwkhcw4kd` FOREIGN KEY (`delegation_id`) REFERENCES `delegations` (`id`);

--
-- Contraintes pour la table `etablissements`
--
ALTER TABLE `etablissements`
  ADD CONSTRAINT `FK83yswb2esprav0so2sv6jy96r` FOREIGN KEY (`dependency_id`) REFERENCES `dependencies` (`id`);

--
-- Contraintes pour la table `inspections`
--
ALTER TABLE `inspections`
  ADD CONSTRAINT `FKas8faafuqgduo9iyqy495etcl` FOREIGN KEY (`delegation_id`) REFERENCES `delegations` (`id`),
  ADD CONSTRAINT `FKr75vi36g0xn9rq6mf8cw4ehps` FOREIGN KEY (`inspector_user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `inspector_profiles`
--
ALTER TABLE `inspector_profiles`
  ADD CONSTRAINT `FK46vusu9wcog2x8tke4o4nj9w0` FOREIGN KEY (`dependency_id`) REFERENCES `dependencies` (`id`),
  ADD CONSTRAINT `FK9liupvyse1xfip6lj7i4ecqv3` FOREIGN KEY (`delegation_id`) REFERENCES `delegations` (`id`),
  ADD CONSTRAINT `FKgxpkb9kj51a01w0wqv8nw5ksl` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `FKkswvtlh7mot5jm39r3yks002o` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKorl9yl44tb3091grynxsubo18` FOREIGN KEY (`etablissement_id`) REFERENCES `etablissements` (`id`);

--
-- Contraintes pour la table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD CONSTRAINT `FKdfd18irryi42p4m2qrpb7nwv5` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_profiles` (`id`),
  ADD CONSTRAINT `FKshvj4jx8uyf17o3f25js9iwfh` FOREIGN KEY (`lesson_id`) REFERENCES `course_lessons` (`id`);

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `FK4ui4nnwntodh6wjvck53dbk9m` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKt492th6wsovh1nush5yl5jj8e` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`);

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FKqqnsjxlwleyjbxlmm213jaj3f` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `profile_delegations`
--
ALTER TABLE `profile_delegations`
  ADD CONSTRAINT `FK57g8wvv8o83lbn6rleh82mvrh` FOREIGN KEY (`profile_id`) REFERENCES `inspector_profiles` (`id`),
  ADD CONSTRAINT `FKn447fym5r639bnq29q5rdpqou` FOREIGN KEY (`delegation_id`) REFERENCES `delegations` (`id`);

--
-- Contraintes pour la table `profile_departments`
--
ALTER TABLE `profile_departments`
  ADD CONSTRAINT `FKetmflbwsokowc7udoq1f7cc9t` FOREIGN KEY (`profile_id`) REFERENCES `inspector_profiles` (`id`),
  ADD CONSTRAINT `FKrdgfitts1ruy8uet694tqi9pg` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

--
-- Contraintes pour la table `profile_dependencies`
--
ALTER TABLE `profile_dependencies`
  ADD CONSTRAINT `FK5ayc2we5f9e5ch81bki0wgv09` FOREIGN KEY (`dependency_id`) REFERENCES `dependencies` (`id`),
  ADD CONSTRAINT `FKpohjwqoddot9lxkjemdaf8y41` FOREIGN KEY (`profile_id`) REFERENCES `inspector_profiles` (`id`);

--
-- Contraintes pour la table `profile_etablissements`
--
ALTER TABLE `profile_etablissements`
  ADD CONSTRAINT `FK2hsi8iw6ya1t27cjvba3l28es` FOREIGN KEY (`profile_id`) REFERENCES `inspector_profiles` (`id`),
  ADD CONSTRAINT `FK5mllmgiqsxa3r3ibyykc2u0ye` FOREIGN KEY (`etablissement_id`) REFERENCES `etablissements` (`id`);

--
-- Contraintes pour la table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `FKebon51sego16fh7u1lpxhofad` FOREIGN KEY (`inspector_id`) REFERENCES `inspector_profiles` (`id`);

--
-- Contraintes pour la table `quiz_assignments`
--
ALTER TABLE `quiz_assignments`
  ADD CONSTRAINT `FKkbec65aap50jwts181t0lvew0` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_profiles` (`id`),
  ADD CONSTRAINT `FKn0a1ujwg431xx2hkjtwlhwv30` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`);

--
-- Contraintes pour la table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `FKanfmgf6ksbdnv7ojb0pfve54q` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`);

--
-- Contraintes pour la table `quiz_submissions`
--
ALTER TABLE `quiz_submissions`
  ADD CONSTRAINT `FK7rmflyrtaibx04079o6tiu0me` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`),
  ADD CONSTRAINT `FKl363qjquyu5xcnc9nnhjrcfds` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_profiles` (`id`);

--
-- Contraintes pour la table `teacher_profiles`
--
ALTER TABLE `teacher_profiles`
  ADD CONSTRAINT `FK1aksodsfqaojyosetnxow5sd6` FOREIGN KEY (`delegation_id`) REFERENCES `delegations` (`id`),
  ADD CONSTRAINT `FK20p4y1745gww8sj8dep9vnj2` FOREIGN KEY (`dependency_id`) REFERENCES `dependencies` (`id`),
  ADD CONSTRAINT `FK38hlnhfrimybow0wdfwnsfhew` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKlwopfniwdsx2hhw95afjomko4` FOREIGN KEY (`etablissement_id`) REFERENCES `etablissements` (`id`);

--
-- Contraintes pour la table `timetable_slots`
--
ALTER TABLE `timetable_slots`
  ADD CONSTRAINT `FK173885iq3ags1be7hp5ih3yf3` FOREIGN KEY (`teacher_profile_id`) REFERENCES `teacher_profiles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
