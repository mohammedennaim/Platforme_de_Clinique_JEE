<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.example.clinique.entity.User" %>
<%
    String email = (String) session.getAttribute("userEmail");
    User admin = (User) session.getAttribute("user");
    if (email == null || admin == null) {
        response.sendRedirect("index.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Administrateur - Clinique Digitale</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/admin-dashboard.css">
    <script src="js/admin-dashboard.js" defer></script>
</head>
<body class="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
    
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-gradient">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <i class="fas fa-hospital text-white text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Clinique Digitale
                            </h1>
                            <p class="text-xs text-gray-500">Panneau d'administration</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center space-x-4">
                    <!-- Search Bar -->
                    <div class="hidden md:block relative">
                        <input type="text" id="searchInput" placeholder="Rechercher..." 
                               class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                        <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                    
                    <!-- Notifications -->
                    <button id="notificationBtn" class="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <i class="fas fa-bell text-xl"></i>
                        <span id="notificationBadge" class="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                            5
                        </span>
                    </button>
                    
                    <!-- User Profile -->
                    <div class="flex items-center space-x-3 border-l pl-4 cursor-pointer" id="userProfileBtn">
                        <div class="text-right">
                            <p class="text-sm font-semibold text-gray-800"><%= admin.getFirstName() %> <%= admin.getLastName() %></p>
                            <p class="text-xs text-gray-500"><%= admin.getEmail() %></p>
                        </div>
                        <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            <%= admin.getFirstName().substring(0, 1) %><%= admin.getLastName().substring(0, 1) %>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Notification Dropdown Panel -->
    <div id="notificationPanel" class="hidden fixed top-20 right-4 w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 max-h-96 overflow-y-auto">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="font-bold text-gray-800">Notifications</h3>
            <button id="markAllRead" class="text-sm text-blue-600 hover:text-blue-700">Tout marquer comme lu</button>
        </div>
        <div id="notificationList" class="divide-y divide-gray-100">
            <!-- Notifications will be dynamically inserted here -->
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Welcome Section -->
        <div class="mb-8 animate-fade-in">
            <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                <div class="relative z-10">
                    <h2 class="text-3xl font-bold mb-2">Bienvenue, <%= admin.getFirstName() %> ! 👋</h2>
                    <p class="text-blue-100 mb-4">Gérez votre clinique digitale en toute simplicité</p>
                    <div class="flex items-center space-x-2">
                        <span class="px-4 py-1 bg-white bg-opacity-20 rounded-full text-sm font-semibold backdrop-blur-sm">
                            <i class="fas fa-shield-alt mr-2"></i>Administrateur
                        </span>
                        <span id="currentDateTime" class="px-4 py-1 bg-white bg-opacity-20 rounded-full text-sm backdrop-blur-sm">
                            <i class="fas fa-clock mr-2"></i><%= new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm").format(new java.util.Date()) %>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Patients -->
            <div class="stat-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm font-medium mb-1">Total Patients</p>
                        <h3 id="totalPatients" class="text-3xl font-bold text-gray-800" data-target="1234">0</h3>
                        <p class="text-green-500 text-sm mt-2">
                            <i class="fas fa-arrow-up"></i> <span id="patientsGrowth">+12%</span> ce mois
                        </p>
                    </div>
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <i class="fas fa-users text-white text-2xl"></i>
                    </div>
                </div>
            </div>

            <!-- Rendez-vous Aujourd'hui -->
            <div class="stat-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm font-medium mb-1">RDV Aujourd'hui</p>
                        <h3 id="todayAppointments" class="text-3xl font-bold text-gray-800" data-target="48">0</h3>
                        <p class="text-blue-500 text-sm mt-2">
                            <i class="fas fa-calendar-check"></i> <span id="pendingAppointments">12</span> en attente
                        </p>
                    </div>
                    <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <i class="fas fa-calendar-alt text-white text-2xl"></i>
                    </div>
                </div>
            </div>

            <!-- Médecins Actifs -->
            <div class="stat-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm font-medium mb-1">Médecins Actifs</p>
                        <h3 id="activeDoctors" class="text-3xl font-bold text-gray-800" data-target="24">0</h3>
                        <p class="text-purple-500 text-sm mt-2">
                            <i class="fas fa-user-md"></i> <span id="specialtiesCount">8</span> spécialités
                        </p>
                    </div>
                    <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <i class="fas fa-user-md text-white text-2xl"></i>
                    </div>
                </div>
            </div>

            <!-- Revenus du Mois -->
            <div class="stat-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm font-medium mb-1">Revenus du Mois</p>
                        <h3 id="monthlyRevenue" class="text-3xl font-bold text-gray-800" data-target="45890">0</h3>
                        <p class="text-green-500 text-sm mt-2">
                            <i class="fas fa-arrow-up"></i> <span id="revenueGrowth">+8.5%</span> vs mois dernier
                        </p>
                    </div>
                    <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <i class="fas fa-chart-line text-white text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Dashboard Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            <!-- Gestion des Utilisateurs -->
            <div class="dashboard-card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-users-cog text-blue-600 mr-3"></i>
                        Gestion des Utilisateurs
                    </h3>
                </div>
                <p class="text-gray-600 mb-6 text-sm">Gérez tous les utilisateurs de la clinique</p>
                <div class="space-y-3">
                    <a href="list-doctors.jsp" class="dashboard-link group">
                        <i class="fas fa-user-md text-blue-500 group-hover:scale-110 transition-transform"></i>
                        <span>Liste des médecins</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="list-patients.jsp" class="dashboard-link group">
                        <i class="fas fa-hospital-user text-green-500 group-hover:scale-110 transition-transform"></i>
                        <span>Liste des patients</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="list-staff.jsp" class="dashboard-link group">
                        <i class="fas fa-user-nurse text-purple-500 group-hover:scale-110 transition-transform"></i>
                        <span>Liste du personnel</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="create-user.jsp" class="dashboard-link group">
                        <i class="fas fa-user-plus text-indigo-500 group-hover:scale-110 transition-transform"></i>
                        <span>Créer un utilisateur</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>

            <!-- Gestion des Rendez-vous -->
            <div class="dashboard-card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-calendar-check text-green-600 mr-3"></i>
                        Gestion des Rendez-vous
                    </h3>
                </div>
                <p class="text-gray-600 mb-6 text-sm">Surveillez et gérez tous les rendez-vous</p>
                <div class="space-y-3">
                    <a href="appointments-overview.jsp" class="dashboard-link group">
                        <i class="fas fa-chart-pie text-blue-500 group-hover:scale-110 transition-transform"></i>
                        <span>Vue d'ensemble</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="pending-appointments.jsp" class="dashboard-link group">
                        <i class="fas fa-clock text-orange-500 group-hover:scale-110 transition-transform"></i>
                        <span>Rendez-vous en attente</span>
                        <span class="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">12</span>
                    </a>
                    <a href="today-appointments.jsp" class="dashboard-link group">
                        <i class="fas fa-calendar-day text-green-500 group-hover:scale-110 transition-transform"></i>
                        <span>Aujourd'hui</span>
                        <span class="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">48</span>
                    </a>
                    <a href="waiting-list.jsp" class="dashboard-link group">
                        <i class="fas fa-list-ul text-purple-500 group-hover:scale-110 transition-transform"></i>
                        <span>Liste d'attente</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>

            <!-- Gestion de la Clinique -->
            <div class="dashboard-card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-hospital text-purple-600 mr-3"></i>
                        Gestion de la Clinique
                    </h3>
                </div>
                <p class="text-gray-600 mb-6 text-sm">Configurez les paramètres de la clinique</p>
                <div class="space-y-3">
                    <a href="manage-departments.jsp" class="dashboard-link group">
                        <i class="fas fa-building text-blue-500 group-hover:scale-110 transition-transform"></i>
                        <span>Gérer les départements</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="manage-specialties.jsp" class="dashboard-link group">
                        <i class="fas fa-stethoscope text-green-500 group-hover:scale-110 transition-transform"></i>
                        <span>Gérer les spécialités</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="system-config.jsp" class="dashboard-link group">
                        <i class="fas fa-cog text-gray-500 group-hover:scale-110 transition-transform"></i>
                        <span>Configuration système</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="backups.jsp" class="dashboard-link group">
                        <i class="fas fa-database text-indigo-500 group-hover:scale-110 transition-transform"></i>
                        <span>Sauvegardes</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>

        </div>

        <!-- Second Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            <!-- Rapports et Statistiques -->
            <div class="dashboard-card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-chart-bar text-orange-600 mr-3"></i>
                        Rapports & Statistiques
                    </h3>
                </div>
                <p class="text-gray-600 mb-6 text-sm">Consultez les rapports de la clinique</p>
                <div class="space-y-3">
                    <a href="financial-reports.jsp" class="dashboard-link group">
                        <i class="fas fa-dollar-sign text-green-500 group-hover:scale-110 transition-transform"></i>
                        <span>Rapports financiers</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="patient-statistics.jsp" class="dashboard-link group">
                        <i class="fas fa-chart-line text-blue-500 group-hover:scale-110 transition-transform"></i>
                        <span>Statistiques patients</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="doctor-performance.jsp" class="dashboard-link group">
                        <i class="fas fa-trophy text-yellow-500 group-hover:scale-110 transition-transform"></i>
                        <span>Performance médecins</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="monthly-reports.jsp" class="dashboard-link group">
                        <i class="fas fa-file-alt text-purple-500 group-hover:scale-110 transition-transform"></i>
                        <span>Rapports mensuels</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>

            <!-- Administration Système -->
            <div class="dashboard-card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-tools text-red-600 mr-3"></i>
                        Administration Système
                    </h3>
                </div>
                <p class="text-gray-600 mb-6 text-sm">Outils d'administration avancés</p>
                <div class="space-y-3">
                    <a href="system-logs.jsp" class="dashboard-link group">
                        <i class="fas fa-file-code text-gray-500 group-hover:scale-110 transition-transform"></i>
                        <span>Logs système</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="maintenance.jsp" class="dashboard-link group">
                        <i class="fas fa-wrench text-orange-500 group-hover:scale-110 transition-transform"></i>
                        <span>Maintenance</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="security.jsp" class="dashboard-link group">
                        <i class="fas fa-shield-alt text-red-500 group-hover:scale-110 transition-transform"></i>
                        <span>Sécurité</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="audit.jsp" class="dashboard-link group">
                        <i class="fas fa-search text-blue-500 group-hover:scale-110 transition-transform"></i>
                        <span>Audit</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>

            <!-- Alertes et Notifications -->
            <div class="dashboard-card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-bell text-yellow-600 mr-3"></i>
                        Alertes & Notifications
                    </h3>
                    <span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold animate-pulse">5 Nouvelles</span>
                </div>
                <p class="text-gray-600 mb-6 text-sm">Gérez les alertes système</p>
                <div class="space-y-3">
                    <a href="urgent-alerts.jsp" class="dashboard-link group bg-red-50 border-l-4 border-red-500">
                        <i class="fas fa-exclamation-triangle text-red-500 group-hover:scale-110 transition-transform"></i>
                        <span class="font-semibold text-red-700">Alertes urgentes</span>
                        <span class="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">3</span>
                    </a>
                    <a href="notifications.jsp" class="dashboard-link group">
                        <i class="fas fa-envelope text-blue-500 group-hover:scale-110 transition-transform"></i>
                        <span>Notifications</span>
                        <span class="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">12</span>
                    </a>
                    <a href="system-messages.jsp" class="dashboard-link group">
                        <i class="fas fa-comment-dots text-purple-500 group-hover:scale-110 transition-transform"></i>
                        <span>Messages système</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="notification-settings.jsp" class="dashboard-link group">
                        <i class="fas fa-cog text-gray-500 group-hover:scale-110 transition-transform"></i>
                        <span>Paramètres notifications</span>
                        <i class="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>

        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <i class="fas fa-bolt text-yellow-500 mr-3"></i>
                Actions Rapides
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="profile.jsp" class="quick-action-btn bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <i class="fas fa-user-edit text-3xl mb-2"></i>
                    <span class="text-sm font-semibold">Modifier mon profil</span>
                </a>
                <a href="change-password.jsp" class="quick-action-btn bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    <i class="fas fa-key text-3xl mb-2"></i>
                    <span class="text-sm font-semibold">Changer mot de passe</span>
                </a>
                <a href="advanced-settings.jsp" class="quick-action-btn bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                    <i class="fas fa-sliders-h text-3xl mb-2"></i>
                    <span class="text-sm font-semibold">Paramètres avancés</span>
                </a>
                <a href="<%= request.getContextPath() %>/logout" class="quick-action-btn bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                    <i class="fas fa-sign-out-alt text-3xl mb-2"></i>
                    <span class="text-sm font-semibold">Se déconnecter</span>
                </a>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gray-800 flex items-center">
                    <i class="fas fa-history text-blue-500 mr-3"></i>
                    Activité Récente
                </h3>
                <button id="refreshActivity" class="text-blue-600 hover:text-blue-700 transition-colors">
                    <i class="fas fa-sync-alt"></i> Actualiser
                </button>
            </div>
            <div id="activityList" class="space-y-4">
                <div class="activity-item">
                    <div class="activity-icon bg-green-100">
                        <i class="fas fa-user-plus text-green-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-800 font-medium">Nouveau patient enregistré</p>
                        <p class="text-gray-500 text-sm">Dr. Ahmed a ajouté un nouveau patient</p>
                    </div>
                    <span class="text-gray-400 text-sm">Il y a 5 min</span>
                </div>
                <div class="activity-item">
                    <div class="activity-icon bg-blue-100">
                        <i class="fas fa-calendar-check text-blue-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-800 font-medium">Rendez-vous confirmé</p>
                        <p class="text-gray-500 text-sm">Patient Mohammed - Consultation cardiologie</p>
                    </div>
                    <span class="text-gray-400 text-sm">Il y a 15 min</span>
                </div>
                <div class="activity-item">
                    <div class="activity-icon bg-purple-100">
                        <i class="fas fa-file-medical text-purple-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-800 font-medium">Rapport médical généré</p>
                        <p class="text-gray-500 text-sm">Dr. Fatima a créé un rapport pour Patient #1234</p>
                    </div>
                    <span class="text-gray-400 text-sm">Il y a 1 heure</span>
                </div>
                <div class="activity-item">
                    <div class="activity-icon bg-orange-100">
                        <i class="fas fa-exclamation-circle text-orange-600"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-800 font-medium">Alerte système</p>
                        <p class="text-gray-500 text-sm">Sauvegarde automatique effectuée avec succès</p>
                    </div>
                    <span class="text-gray-400 text-sm">Il y a 2 heures</span>
                </div>
            </div>
        </div>

    </div>

    <!-- Toast Notification Container -->
    <div id="toastContainer" class="fixed bottom-4 right-4 z-50 space-y-2">
        <!-- Toast notifications will be dynamically inserted here -->
    </div>

    <!-- Loading Overlay -->
    <div id="loadingOverlay" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl p-8 flex flex-col items-center">
            <div class="loader mb-4"></div>
            <p class="text-gray-700 font-semibold">Chargement...</p>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t mt-12 py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <p class="text-gray-600 text-sm">© 2025 Clinique Digitale. Tous droits réservés.</p>
                <div class="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-sm">Aide</a>
                    <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-sm">Documentation</a>
                    <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-sm">Support</a>
                    <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-sm">Confidentialité</a>
                </div>
            </div>
        </div>
    </footer>

</body>
</html>
