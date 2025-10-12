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
<html>
<head>
    <title>Dashboard Patient</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #27ae60; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .btn { background: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 5px; }
        .btn:hover { background: #229954; }
        .btn-danger { background: #e74c3c; }
        .btn-danger:hover { background: #c0392b; }
        .info-item { margin: 10px 0; padding: 10px; background: #ecf0f1; border-radius: 4px; }
        .urgent { background: #e74c3c; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 Dashboard Patient</h1>
            <p>Bienvenue, <%= patient.getFirstName() %> <%= patient.getLastName() %></p>
            <p>Email: <%= patient.getEmail() %></p>
        </div>

        <div class="grid">
            <div class="card">
                <h3>👤 Informations Personnelles</h3>
                <div class="info-item">
                    <strong>Nom complet:</strong> <%= patient.getFirstName() %> <%= patient.getLastName() %>
                </div>
                <div class="info-item">
                    <strong>CIN:</strong> AA12345
                </div>
                <div class="info-item">
                    <strong>Date de naissance:</strong> 1990-05-15
                </div>
                <div class="info-item">
                    <strong>Genre:</strong> FEMALE
                </div>
                <div class="info-item">
                    <strong>Téléphone:</strong> 0612345678
                </div>
                <div class="info-item">
                    <strong>Adresse:</strong> 12 Rue Santé
                </div>
            </div>

            <div class="card">
                <h3>📅 Mes Rendez-vous</h3>
                <p>Gérez vos rendez-vous médicaux</p>
                <a href="#" class="btn">Voir mes rendez-vous</a>
                <a href="#" class="btn">Prendre un rendez-vous</a>
                <a href="#" class="btn urgent">Rendez-vous urgent</a>
            </div>

            <div class="card">
                <h3>📋 Mon Dossier Médical</h3>
                <p>Consultez votre dossier médical</p>
                <a href="#" class="btn">Voir mon dossier</a>
                <a href="#" class="btn">Historique médical</a>
                <a href="#" class="btn">Prescriptions</a>
            </div>

            <div class="card">
                <h3>🏥 Services</h3>
                <p>Accédez aux services de la clinique</p>
                <a href="#" class="btn">Liste des médecins</a>
                <a href="#" class="btn">Spécialités disponibles</a>
                <a href="#" class="btn">Liste d'attente</a>
            </div>
        </div>

        <div class="card">
            <h3>⚙️ Actions</h3>
            <a href="#" class="btn">Modifier mon profil</a>
            <a href="#" class="btn">Changer mon mot de passe</a>
            <a href="logout" class="btn btn-danger">Se déconnecter</a>
        </div>
    </div>
</body>
</html>
