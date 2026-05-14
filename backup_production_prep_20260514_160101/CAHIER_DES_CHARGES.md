# Cahier des Charges : Plateforme "Inspector"

## 1. Présentation du Projet
### 1.1 Contexte
Le projet **Inspector** est une plateforme web et mobile complète conçue pour moderniser et centraliser l'espace de travail des inspecteurs de l'éducation en Tunisie. Actuellement, de nombreux processus (planification, rapports, communication) sont manuels ou dispersés. Cette solution vise à digitaliser l'intégralité du cycle de vie de l'inspection pédagogique.

### 1.2 Objectifs
- **Centralisation** : Regrouper toutes les activités professionnelles des inspecteurs dans un seul outil.
- **Automatisation** : Générer automatiquement des rapports d'évaluation au format PDF et gérer les notifications.
- **Communication** : Faciliter les échanges en temps réel entre inspecteurs et enseignants via une messagerie intégrée.
- **Analyse de Données** : Offrir aux administrateurs une vue d'ensemble des performances pédagogiques par région et délégation.
- **Formation** : Intégrer un module d'IA pour la génération de quiz et le suivi de la formation continue.

---

## 2. Analyse Fonctionnelle
### 2.1 Rôles Utilisateurs
1. **ADMIN** (Administrateur Système)
2. **INSPECTOR** (Inspecteur)
3. **TEACHER** (Enseignant)

### 2.2 Fonctionnalités par Rôle

#### A. Module Administrateur (Command Center)
- **Audit & Traçabilité** : Consultation des journaux d'actions (logs) pour le suivi des activités des utilisateurs sur le système.
- **Tableau de Bord Analytics** (Style Power BI) :
    - Visualisation des KPIs (Taux de complétion des activités, scores moyens).
    - Analyse géographique par **Région** et **Délégation**.
    - Classement des "Top Performers" (Enseignants et Délégations).
    - Graphiques d'évolution des activités dans le temps.

#### B. Module Inspecteur (Gestion Opérationnelle)
- **Calendrier Interactif** : Planification des visites, formations et réunions.
- **Gestion des Rapports** :
    - Création de rapports d'évaluation avec score, observations et recommandations.
    - Exportation automatique en PDF avec mise en page professionnelle.
    - Importation de rapports scannés (fichiers PDF externes).
- **Sessions Virtuelles** : Intégration native avec **Jitsi Meet** pour les réunions à distance.
- **Messagerie** : Chat en temps réel avec les enseignants sous sa supervision.

#### C. Module Enseignant (Suivi & Formation)
- **Espace Personnel** : Consultation de l'emploi du temps synchronisé avec l'inspecteur.
- **Accès aux Rapports** : Visualisation des évaluations finalisées et téléchargement des PDFs (Note confidentielle masquée sur le PDF).
- **Module AI Quiz** :
    - Génération de quiz par IA selon le sujet choisi.
    - Passation de tests en ligne et enregistrement automatique des scores.
- **Messagerie** : Contact direct avec l'inspecteur pour assistance ou clarifications.

---

## 3. Spécifications Techniques
### 3.1 Architecture
- **Modèle** : Architecture découplée (Frontend / Backend).
- **API** : RESTful API sécurisée par **JWT**.
- **Mobile** : Application cross-platform pour l'accès en mobilité.

### 3.2 Stack Technologique
- **Backend** :
    - Langage : **Java 17**
    - Framework : **Spring Boot 3.2.x**
    - Sécurité : **Spring Security** + **JWT** (Stateless)
    - Persistance : **Spring Data JPA** / **Hibernate**
    - Base de données : **MySQL 8.0**
- **Frontend Web** :
    - Bibliothèque : **React 18**
    - Build Tool : **Vite**
    - Design : **Vanilla CSS** avec esthétique "Premium Dark/Glassmorphism"
    - Graphiques : **Recharts**
- **Mobile** :
    - Framework : **React Native** (Expo)
- **Services Tierces** :
    - IA : **Google Gemini AI** (pour les quiz)
    - Visioconférence : **Jitsi Meet API**
    - Email : **SMTP (JavaMailSender)**

---

## 4. Design et Esthétique
### 4.1 Identité Visuelle
- **Style** : Moderne, professionnel, et épuré.
- **Thème** : Dark Mode par défaut avec des accents de couleurs vibrantes (gradients) pour les KPIs.
- **UX** : Micro-animations lors des transitions, composants "Glassmorphism", et navigation intuitive.

### 4.2 Composants Clés
- **Analytics Dashboard** : Cartes de statistiques interactives, graphiques en aires (Area Charts) et barres de progression.
- **Report Editor** : Formulaires structurés avec validation en temps réel.
- **Messenger** : Interface de chat fluide avec indicateurs de présence et bulles de messages modernes.

---

## 5. Sécurité et Performances
- **Authentification** : Authentification forte avec validation d'email et réinitialisation de mot de passe par OTP.
- **Autorisations** : Contrôle d'accès basé sur les rôles (RBAC) pour protéger les endpoints sensibles.
- **Export PDF** : Moteur de génération de PDF performant capable de gérer le wrapping de texte pour les longs paragraphes.
- **Notifications** : Système de notifications en temps réel via WebSockets ou polling efficace.

---

## 6. Livrables Attendus
1. **Code Source** : Backend (Spring Boot), Frontend Web (React), Mobile App (React Native).
2. **Base de Données** : Schéma relationnel exporté (SQL).
3. **Documentation** : Manuel d'installation, Guide utilisateur, et Documentation technique.
4. **Rapport Final** : Analyse UML complète (Diagrammes de classes, séquences, cas d'utilisation).
