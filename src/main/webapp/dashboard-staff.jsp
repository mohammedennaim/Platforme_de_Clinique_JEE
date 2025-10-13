<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.example.clinique.entity.User" %>
<%
    String email = (String) session.getAttribute("userEmail");
    User staff = (User) session.getAttribute("user");
    if (email == null || staff == null) {
        response.sendRedirect("index.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Staff - Clinique Digitale</title>
    <link rel="stylesheet" href="css/staff-dashboard.css">
</head>
<body>
    <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="8" fill="url(#staffGradient)"/>
                    <path d="M20 10v20M10 20h20" stroke="white" stroke-width="3" stroke-linecap="round"/>
                    <defs>
                        <linearGradient id="staffGradient" x1="0" y1="0" x2="40" y2="40">
                            <stop offset="0%" stop-color="#f97316"/>
                            <stop offset="100%" stop-color="#ea580c"/>
                        </linearGradient>
                    </defs>
                </svg>
                <span>Clinique Staff</span>
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
            <a href="#" class="nav-item" data-section="reception">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Accueil Patients</span>
            </a>
            <a href="#" class="nav-item" data-section="communication">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Communication</span>
            </a>
            <a href="#" class="nav-item" data-section="support">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Services Support</span>
            </a>
            <a href="#" class="nav-item" data-section="reports">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                </svg>
                <span>Rapports</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            <a href="#" class="nav-item" data-section="profile">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profil</span>
            </a>
            <a href="<%= request.getContextPath() %>/logout" class="nav-item logout">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Déconnexion</span>
            </a>
        </div>
    </div>

    <div class="main-content" id="mainContent">
        <div class="top-bar">
            <div class="top-bar-left">
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <h1 class="page-title">Dashboard Staff</h1>
            </div>
            <div class="top-bar-right">
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
                        <%= staff.getFirstName().substring(0, 1) %><%= staff.getLastName().substring(0, 1) %>
                    </div>
                    <div class="user-info">
                        <div class="user-role">Staff</div>
                        <div class="user-name"><%= staff.getFirstName() %> <%= staff.getLastName() %></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="notification-dropdown" id="notificationDropdown">
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="mark-read-btn">Tout marquer comme lu</button>
            </div>
            <div class="notification-list">
                <div class="notification-item unread">
                    <div class="notification-icon appointment">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                        </svg>
                    </div>
                    <div class="notification-content">
                        <p>Nouveau rendez-vous confirmé pour 14h30</p>
                        <span class="notification-time">Il y a 5 minutes</span>
                    </div>
                </div>
                <div class="notification-item unread">
                    <div class="notification-icon patient">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="notification-content">
                        <p>Patient en attente à l'accueil</p>
                        <span class="notification-time">Il y a 12 minutes</span>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon message">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <div class="notification-content">
                        <p>Nouveau message du Dr. Martin</p>
                        <span class="notification-time">Il y a 1 heure</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-section active" id="section-dashboard">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon appointments">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Rendez-vous Aujourd'hui</div>
                        <div class="stat-value" data-target="42">0</div>
                        <div class="stat-change positive">+8% vs hier</div>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-bar" style="--progress: 75%; --color: #f97316;"></div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon patients">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Patients en Attente</div>
                        <div class="stat-value" data-target="8">0</div>
                        <div class="stat-change neutral">Temps moyen: 15min</div>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-bar" style="--progress: 40%; --color: #3b82f6;"></div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon calls">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Appels Traités</div>
                        <div class="stat-value" data-target="27">0</div>
                        <div class="stat-change positive">+12% vs hier</div>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-bar" style="--progress: 60%; --color: #10b981;"></div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon tasks">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Tâches Complétées</div>
                        <div class="stat-value" data-target="15">0</div>
                        <div class="stat-change neutral">5 en cours</div>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-bar" style="--progress: 85%; --color: #8b5cf6;"></div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <h3>Planning d'Aujourd'hui</h3>
                        </div>
                        <button class="card-action">Voir tout</button>
                    </div>
                    <div class="schedule-list" id="todaySchedule">
                         Will be populated by JavaScript 
                    </div>
                </div>
 
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                            </svg>
                            <h3>Patients en Attente</h3>
                        </div>
                        <span class="badge badge-warning">8 patients</span>
                    </div>
                    <div class="waiting-list" id="waitingPatients">
                         Will be populated by JavaScript 
                    </div>
                </div>

                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                            <h3>Activité Récente</h3>
                        </div>
                    </div>
                    <div class="activity-feed" id="activityFeed">
                         Will be populated by JavaScript 
                    </div>
                </div>

                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="20" x2="12" y2="10"></line>
                                <line x1="18" y1="20" x2="18" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="16"></line>
                            </svg>
                            <h3>Statistiques Rapides</h3>
                        </div>
                    </div>
                    <div class="quick-stats">
                        <div class="quick-stat-item">
                            <div class="quick-stat-label">Taux de présence</div>
                            <div class="quick-stat-value">92%</div>
                            <div class="quick-stat-trend positive">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                </svg>
                                +3%
                            </div>
                        </div>
                        <div class="quick-stat-item">
                            <div class="quick-stat-label">Satisfaction</div>
                            <div class="quick-stat-value">4.8/5</div>
                            <div class="quick-stat-trend positive">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                </svg>
                                +0.2
                            </div>
                        </div>
                        <div class="quick-stat-item">
                            <div class="quick-stat-label">Temps d'attente</div>
                            <div class="quick-stat-value">15min</div>
                            <div class="quick-stat-trend negative">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                                +2min
                            </div>
                        </div>
                        <div class="quick-stat-item">
                            <div class="quick-stat-label">Annulations</div>
                            <div class="quick-stat-value">3</div>
                            <div class="quick-stat-trend positive">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                </svg>
                                -2
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-section" id="section-appointments">
            <div class="section-header">
                <h2>Gestion des Rendez-vous</h2>
                <button class="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Nouveau Rendez-vous
                </button>
            </div>
            <div class="appointments-content" id="appointmentsContent">
                 Will be populated by JavaScript 
            </div>
        </div>

        <div class="content-section" id="section-reception">
            <div class="section-header">
                <h2>Accueil des Patients</h2>
                <button class="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Enregistrer Patient
                </button>
            </div>
            <div class="reception-content" id="receptionContent">
                 Will be populated by JavaScript 
            </div>
        </div>

        <div class="content-section" id="section-communication">
            <div class="section-header">
                <h2>Communication</h2>
                <button class="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Nouveau Message
                </button>
            </div>
            <div class="communication-content" id="communicationContent">
                 Will be populated by JavaScript 
            </div>
        </div>
 
        <div class="content-section" id="section-support">
            <div class="section-header">
                <h2>Services Support</h2>
            </div>
            <div class="support-content" id="supportContent">
                 Will be populated by JavaScript 
            </div>
        </div>

        <div class="content-section" id="section-reports">
            <div class="section-header">
                <h2>Rapports et Statistiques</h2>
                <button class="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Exporter Rapport
                </button>
            </div>
            <div class="reports-content" id="reportsContent">
                 Will be populated by JavaScript 
            </div>
        </div>
 
        <div class="content-section" id="section-profile">
            <div class="section-header">
                <h2>Mon Profil</h2>
            </div>
            <div class="profile-content">
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="profile-avatar-large">
                            <%= staff.getFirstName().substring(0, 1) %><%= staff.getLastName().substring(0, 1) %>
                        </div>
                        <div class="profile-info">
                            <h3><%= staff.getFirstName() %> <%= staff.getLastName() %></h3>
                            <p class="profile-role">Personnel de la Clinique</p>
                            <p class="profile-email"><%= staff.getEmail() %></p>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="btn btn-secondary">Modifier le Profil</button>
                        <button class="btn btn-secondary">Changer le Mot de Passe</button>
                        <button class="btn btn-secondary">Paramètres</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/staff-dashboard.js"></script>
</body>
</html>
