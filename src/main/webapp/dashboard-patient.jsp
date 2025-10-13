<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.example.clinique.entity.User" %>
<%
    String email = (String) session.getAttribute("userEmail");
    User patient = (User) session.getAttribute("user");
    if (email == null || patient == null) {
        response.sendRedirect("index.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Patient - Clinique Digitale</title>
    <link rel="stylesheet" href="css/patient-dashboard.css">
</head>
<body>
    <!-- Sidebar Navigation -->
    <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="8" fill="url(#gradient1)"/>
                    <path d="M20 10v20M10 20h20" stroke="white" stroke-width="3" stroke-linecap="round"/>
                    <defs>
                        <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40">
                            <stop offset="0%" stop-color="#10b981"/>
                            <stop offset="100%" stop-color="#059669"/>
                        </linearGradient>
                    </defs>
                </svg>
                <span>Clinique</span>
            </div>
            <button class="sidebar-toggle" id="sidebarToggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
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
            <a href="#" class="nav-item" data-section="medical-records">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Dossier médical</span>
            </a>
            <a href="#" class="nav-item" data-section="prescriptions">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                <span>Ordonnances</span>
            </a>
            <a href="#" class="nav-item" data-section="doctors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Médecins</span>
            </a>
            <a href="#" class="nav-item" data-section="profile">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Mon profil</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            <a href="<%= request.getContextPath() %>/logout" class="logout-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Déconnexion</span>
            </a>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content" id="mainContent">
        <!-- Top Header -->
        <header class="top-header">
            <div class="header-left">
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <h1 class="page-title">Tableau de bord</h1>
            </div>
            <div class="header-right">
                <div class="search-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input type="text" placeholder="Rechercher..." id="searchInput">
                </div>
                <button class="notification-btn" id="notificationBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span class="notification-badge">3</span>
                </button>
                <div class="user-menu">
                    <div class="user-avatar">
                        <span><%= patient.getFirstName().substring(0, 1) %><%= patient.getLastName().substring(0, 1) %></span>
                    </div>
                    <div class="user-info">
                        <span class="user-name"><%= patient.getFirstName() %> <%= patient.getLastName() %></span>
                        <span class="user-role">Patient</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Notification Dropdown -->
        <div class="notification-dropdown" id="notificationDropdown">
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="mark-read-btn">Tout marquer comme lu</button>
            </div>
            <div class="notification-list">
                <div class="notification-item unread">
                    <div class="notification-icon success">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div class="notification-content">
                        <p class="notification-text">Votre rendez-vous avec Dr. Martin a été confirmé</p>
                        <span class="notification-time">Il y a 5 minutes</span>
                    </div>
                </div>
                <div class="notification-item unread">
                    <div class="notification-icon info">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </div>
                    <div class="notification-content">
                        <p class="notification-text">Nouvelle ordonnance disponible</p>
                        <span class="notification-time">Il y a 1 heure</span>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon warning">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <div class="notification-content">
                        <p class="notification-text">Rappel: Rendez-vous demain à 10h00</p>
                        <span class="notification-time">Il y a 3 heures</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dashboard Section -->
        <div class="content-section active" id="section-dashboard">
            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-value" data-target="3">0</h3>
                        <p class="stat-label">Rendez-vous à venir</p>
                        <div class="stat-progress">
                            <div class="stat-progress-bar" style="width: 60%; background: linear-gradient(90deg, #10b981 0%, #059669 100%);"></div>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-value" data-target="5">0</h3>
                        <p class="stat-label">Ordonnances actives</p>
                        <div class="stat-progress">
                            <div class="stat-progress-bar" style="width: 75%; background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);"></div>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-value" data-target="12">0</h3>
                        <p class="stat-label">Consultations totales</p>
                        <div class="stat-progress">
                            <div class="stat-progress-bar" style="width: 85%; background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);"></div>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 class="stat-value" data-target="2">0</h3>
                        <p class="stat-label">Résultats en attente</p>
                        <div class="stat-progress">
                            <div class="stat-progress-bar" style="width: 40%; background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Dashboard Grid -->
            <div class="dashboard-grid">
                <!-- Upcoming Appointments -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-header-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        <h3>Prochains rendez-vous</h3>
                        <button class="card-action-btn">Voir tout</button>
                    </div>
                    <div class="appointments-list" id="upcomingAppointments">
                        <!-- Appointments will be loaded dynamically -->
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-header-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                        <h3>Activité récente</h3>
                    </div>
                    <div class="activity-list" id="recentActivity">
                        <!-- Activity will be loaded dynamically -->
                    </div>
                </div>

                <!-- Health Metrics -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-header-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                        </div>
                        <h3>Indicateurs de santé</h3>
                    </div>
                    <div class="health-metrics" id="healthMetrics">
                        <!-- Health metrics will be loaded dynamically -->
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-header-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </div>
                        <h3>Actions rapides</h3>
                    </div>
                    <div class="quick-actions-grid">
                        <button class="quick-action-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>Prendre RDV</span>
                        </button>
                        <button class="quick-action-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span>Mes ordonnances</span>
                        </button>
                        <button class="quick-action-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span>Trouver médecin</span>
                        </button>
                        <button class="quick-action-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span>Messagerie</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Appointments Section -->
        <div class="content-section" id="section-appointments">
            <div class="section-header">
                <h2>Mes rendez-vous</h2>
                <button class="primary-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Nouveau rendez-vous
                </button>
            </div>
            <div class="appointments-grid" id="appointmentsGrid">
                <!-- Appointments will be loaded dynamically -->
            </div>
        </div>

        <!-- Medical Records Section -->
        <div class="content-section" id="section-medical-records">
            <div class="section-header">
                <h2>Mon dossier médical</h2>
                <button class="primary-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Télécharger dossier
                </button>
            </div>
            <div class="medical-records-grid" id="medicalRecordsGrid">
                <!-- Medical records will be loaded dynamically -->
            </div>
        </div>

        <!-- Prescriptions Section -->
        <div class="content-section" id="section-prescriptions">
            <div class="section-header">
                <h2>Mes ordonnances</h2>
            </div>
            <div class="prescriptions-grid" id="prescriptionsGrid">
                <!-- Prescriptions will be loaded dynamically -->
            </div>
        </div>

        <!-- Doctors Section -->
        <div class="content-section" id="section-doctors">
            <div class="section-header">
                <h2>Nos médecins</h2>
                <div class="filter-group">
                    <select class="filter-select">
                        <option value="">Toutes les spécialités</option>
                        <option value="cardiology">Cardiologie</option>
                        <option value="dermatology">Dermatologie</option>
                        <option value="pediatrics">Pédiatrie</option>
                        <option value="orthopedics">Orthopédie</option>
                    </select>
                </div>
            </div>
            <div class="doctors-grid" id="doctorsGrid">
                <!-- Doctors will be loaded dynamically -->
            </div>
        </div>

        <!-- Profile Section -->
        <div class="content-section" id="section-profile">
            <div class="section-header">
                <h2>Mon profil</h2>
                <button class="primary-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Modifier profil
                </button>
            </div>
            <div class="profile-grid">
                <div class="profile-card">
                    <div class="profile-avatar-large">
                        <span><%= patient.getFirstName().substring(0, 1) %><%= patient.getLastName().substring(0, 1) %></span>
                    </div>
                    <h3><%= patient.getFirstName() %> <%= patient.getLastName() %></h3>
                    <p class="profile-role">Patient</p>
                    <div class="profile-stats">
                        <div class="profile-stat">
                            <span class="profile-stat-value">12</span>
                            <span class="profile-stat-label">Consultations</span>
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-value">5</span>
                            <span class="profile-stat-label">Ordonnances</span>
                        </div>
                        <div class="profile-stat">
                            <span class="profile-stat-value">3</span>
                            <span class="profile-stat-label">Médecins</span>
                        </div>
                    </div>
                </div>
                <div class="profile-info-card">
                    <h3>Informations personnelles</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Email</span>
                            <span class="info-value"><%= patient.getEmail() %></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Téléphone</span>
                            <span class="info-value">+212 6 12 34 56 78</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Date de naissance</span>
                            <span class="info-value">15 Mai 1990</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Genre</span>
                            <span class="info-value">Féminin</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Groupe sanguin</span>
                            <span class="info-value">A+</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Adresse</span>
                            <span class="info-value">12 Rue de la Santé, Casablanca</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/patient-dashboard.js"></script>
</body>
</html>
