<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.example.clinique.entity.User" %>
<%
    String email = (String) session.getAttribute("userEmail");
    User doctor = (User) session.getAttribute("user");
    if (email == null || doctor == null) {
        response.sendRedirect("index.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Médecin - Clinique Digitale</title>
    <link rel="stylesheet" href="css/doctor-dashboard.css">
    <script src="js/doctor-dashboard.js" defer></script>
</head>
<body>
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <div class="logo-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                </div>
                <span class="logo-text">Clinique Digitale</span>
            </div>
        </div>

        <nav class="sidebar-nav">
            <a href="#" class="nav-item active" data-section="dashboard">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Tableau de bord</span>
            </a>
            <a href="#" class="nav-item" data-section="appointments">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Rendez-vous</span>
            </a>
            <a href="#" class="nav-item" data-section="patients">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Patients</span>
            </a>
            <a href="#" class="nav-item" data-section="prescriptions">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Ordonnances</span>
            </a>
            <a href="#" class="nav-item" data-section="consultations">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <span>Consultations</span>
            </a>
            <a href="#" class="nav-item" data-section="schedule">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Mon Emploi du temps</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            <div class="user-profile">
                <div class="user-avatar">
                    <%= doctor.getFirstName().substring(0, 1) %><%= doctor.getLastName().substring(0, 1) %>
                </div>
                <div class="user-info">
                    <div class="user-name"><%= doctor.getFirstName() %> <%= doctor.getLastName() %></div>
                    <div class="user-role">Médecin</div>
                </div>
            </div>
            <a href="logout" class="logout-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Déconnexion</span>
            </a>
        </div>
    </aside>

    <main class="main-content">
        <header class="top-bar">
            <div class="search-container">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input type="text" class="search-input" id="searchInput" placeholder="Rechercher un patient, rendez-vous...">
                <kbd class="search-kbd">Ctrl K</kbd>
            </div>

            <div class="top-bar-actions">
                <button class="icon-btn" id="notificationBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span class="notification-badge" id="notificationBadge">3</span>
                </button>

                <button class="icon-btn" id="themeToggle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                </button>
            </div>
            <div class="notification-dropdown" id="notificationDropdown">
                <div class="notification-header">
                    <h3>Notifications</h3>
                    <button class="mark-read-btn">Tout marquer comme lu</button>
                </div>
                <div class="notification-list" id="notificationList">
                     Notifications will be dynamically added here 
                </div>
            </div>
        </header>

        <div class="content-wrapper content-section active" id="section-dashboard">
            <div class="page-header">
                <div>
                    <h1 class="page-title">Bienvenue, Dr. <%= doctor.getLastName() %></h1>
                    <p class="page-subtitle">Voici un aperçu de votre journée</p>
                </div>
                <div class="quick-actions">
                    <button class="btn btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nouvelle consultation
                    </button>
                    <button class="btn btn-secondary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Voir l'agenda
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card stat-card-blue">
                    <div class="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Rendez-vous aujourd'hui</div>
                        <div class="stat-value" data-target="12">0</div>
                        <div class="stat-change positive">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                            +2 depuis hier
                        </div>
                    </div>
                    <div class="stat-progress">
                        <div class="stat-progress-bar" data-progress="75"></div>
                    </div>
                </div>

                <div class="stat-card stat-card-green">
                    <div class="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Patients actifs</div>
                        <div class="stat-value" data-target="248">0</div>
                        <div class="stat-change positive">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                            +15 ce mois
                        </div>
                    </div>
                    <div class="stat-progress">
                        <div class="stat-progress-bar" data-progress="92"></div>
                    </div>
                </div>

                <div class="stat-card stat-card-purple">
                    <div class="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Consultations en attente</div>
                        <div class="stat-value" data-target="7">0</div>
                        <div class="stat-change neutral">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            À traiter
                        </div>
                    </div>
                    <div class="stat-progress">
                        <div class="stat-progress-bar" data-progress="45"></div>
                    </div>
                </div>

                <div class="stat-card stat-card-orange">
                    <div class="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Heures de consultation</div>
                        <div class="stat-value" data-target="42">0</div>
                        <div class="stat-change positive">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                            Cette semaine
                        </div>
                    </div>
                    <div class="stat-progress">
                        <div class="stat-progress-bar" data-progress="68"></div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card appointments-card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Rendez-vous d'aujourd'hui
                        </h2>
                        <button class="btn-link">Voir tout</button>
                    </div>
                    <div class="appointments-list" id="appointmentsList">
                         Appointments will be dynamically added 
                    </div>
                </div>

                <div class="dashboard-card patients-card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Patients récents
                        </h2>
                        <button class="btn-link">Voir tout</button>
                    </div>
                    <div class="patients-list" id="patientsList">
                         Patients will be dynamically added 
                    </div>
                </div>

                <div class="dashboard-card chart-card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                            Activité hebdomadaire
                        </h2>
                        <select class="chart-select">
                            <option>Cette semaine</option>
                            <option>Ce mois</option>
                            <option>Cette année</option>
                        </select>
                    </div>
                    <div class="chart-container">
                        <canvas id="activityChart"></canvas>
                    </div>
                </div>
                <div class="dashboard-card tasks-card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                            Tâches en attente
                        </h2>
                        <span class="task-count" id="taskCount">5</span>
                    </div>
                    <div class="tasks-list" id="tasksList">
                         Tasks will be dynamically added 
                    </div>
                </div>

                <div class="dashboard-card activity-card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                            Activité récente
                        </h2>
                        <button class="btn-link">Tout voir</button>
                    </div>
                    <div class="activity-list" id="activityList">
                         Activity will be dynamically added 
                    </div>
                </div>
 
                <div class="dashboard-card quick-stats-card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                            </svg>
                            Statistiques rapides
                        </h2>
                    </div>
                    <div class="quick-stats-grid" id="quickStatsGrid">
                         Quick stats will be dynamically added 
                    </div>
                </div>
            </div>
        </div>

        <div class="content-wrapper content-section" id="section-appointments">
            <div class="page-header">
                <div>
                    <h1 class="page-title">Rendez-vous</h1>
                    <p class="page-subtitle">Gérez tous vos rendez-vous</p>
                </div>
                <div class="quick-actions">
                    <button class="btn btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nouveau rendez-vous
                    </button>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card" style="grid-column: span 12;">
                    <div class="card-header">
                        <h2 class="card-title">Tous les rendez-vous</h2>
                        <div style="display: flex; gap: 1rem;">
                            <select class="chart-select">
                                <option>Aujourd'hui</option>
                                <option>Cette semaine</option>
                                <option>Ce mois</option>
                            </select>
                            <button class="btn-link">Filtrer</button>
                        </div>
                    </div>
                    <div class="appointments-list" id="allAppointmentsList">
                         Appointments will be dynamically added 
                    </div>
                </div>
            </div>
        </div>

        <div class="content-wrapper content-section" id="section-patients">
            <div class="page-header">
                <div>
                    <h1 class="page-title">Patients</h1>
                    <p class="page-subtitle">Liste de tous vos patients</p>
                </div>
                <div class="quick-actions">
                    <button class="btn btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nouveau patient
                    </button>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card" style="grid-column: span 12;">
                    <div class="card-header">
                        <h2 class="card-title">Liste des patients</h2>
                        <input type="text" class="search-input" placeholder="Rechercher un patient..." style="max-width: 300px;">
                    </div>
                    <div class="patients-list" id="allPatientsList">
                         Patients will be dynamically added 
                    </div>
                </div>
            </div>
        </div>

        <div class="content-wrapper content-section" id="section-prescriptions">
            <div class="page-header">
                <div>
                    <h1 class="page-title">Ordonnances</h1>
                    <p class="page-subtitle">Gérez les ordonnances de vos patients</p>
                </div>
                <div class="quick-actions">
                    <button class="btn btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nouvelle ordonnance
                    </button>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card" style="grid-column: span 12;">
                    <div class="card-header">
                        <h2 class="card-title">Ordonnances récentes</h2>
                        <button class="btn-link">Voir tout</button>
                    </div>
                    <div class="prescriptions-list" id="prescriptionsList">
                         Prescriptions will be dynamically added 
                    </div>
                </div>
            </div>
        </div>

        <div class="content-wrapper content-section" id="section-consultations">
            <div class="page-header">
                <div>
                    <h1 class="page-title">Consultations</h1>
                    <p class="page-subtitle">Historique des consultations</p>
                </div>
                <div class="quick-actions">
                    <button class="btn btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nouvelle consultation
                    </button>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card" style="grid-column: span 12;">
                    <div class="card-header">
                        <h2 class="card-title">Consultations récentes</h2>
                        <select class="chart-select">
                            <option>Toutes</option>
                            <option>En cours</option>
                            <option>Terminées</option>
                        </select>
                    </div>
                    <div class="consultations-list" id="consultationsList">
                         Consultations will be dynamically added 
                    </div>
                </div>
            </div>
        </div>

        <div class="content-wrapper content-section" id="section-schedule">
            <div class="page-header">
                <div>
                    <h1 class="page-title">Mon Emploi du temps</h1>
                    <p class="page-subtitle">Planifiez votre semaine</p>
                </div>
                <div class="quick-actions">
                    <button class="btn btn-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Configurer disponibilités
                    </button>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card" style="grid-column: span 12;">
                    <div class="card-header">
                        <h2 class="card-title">Calendrier hebdomadaire</h2>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn-link">← Semaine précédente</button>
                            <button class="btn-link">Semaine suivante →</button>
                        </div>
                    </div>
                    <div class="schedule-calendar" id="scheduleCalendar">
                        <p style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                            Calendrier en cours de chargement...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <div class="toast-container" id="toastContainer"></div>
</body>
</html>
