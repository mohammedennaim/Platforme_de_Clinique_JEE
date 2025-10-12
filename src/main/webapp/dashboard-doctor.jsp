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
<html>
<head>
    <title>Dashboard Médecin</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .btn { background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 5px; }
        .btn:hover { background: #2980b9; }
        .btn-danger { background: #e74c3c; }
        .btn-danger:hover { background: #c0392b; }
        .info-item { margin: 10px 0; padding: 10px; background: #ecf0f1; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 Dashboard Médecin</h1>
            <p>Bienvenue, Dr. <%= doctor.getFirstName() %> <%= doctor.getLastName() %></p>
            <p>Email: <%= doctor.getEmail() %></p>
        </div>

        <div class="grid">
            <div class="card">
                <h3>📋 Informations Personnelles</h3>
                <div class="info-item">
                    <strong>Nom complet:</strong> Dr. <%= doctor.getFirstName() %> <%= doctor.getLastName() %>
                </div>
                <div class="info-item">
                    <strong>Numéro d'enregistrement:</strong> DOC-001
                </div>
                <div class="info-item">
                    <strong>Spécialité:</strong> Cardiologue
                </div>
                <div class="info-item">
                    <strong>Titre:</strong> Dr.
                </div>
            </div>

            <div class="card">
                <h3>📅 Gestion des Rendez-vous</h3>
                <p>Gérez vos rendez-vous et votre planning</p>
                <a href="#" class="btn">Voir mes rendez-vous</a>
                <a href="#" class="btn">Planifier un rendez-vous</a>
                <a href="#" class="btn">Gérer mes disponibilités</a>
            </div>

            <div class="card">
                <h3>👥 Gestion des Patients</h3>
                <p>Consultez et gérez vos patients</p>
                <a href="#" class="btn">Liste des patients</a>
                <a href="#" class="btn">Dossiers médicaux</a>
                <a href="#" class="btn">Notes médicales</a>
            </div>

            <div class="card">
                <h3>📊 Statistiques</h3>
                <p>Consultez vos statistiques de consultation</p>
                <a href="#" class="btn">Rapports mensuels</a>
                <a href="#" class="btn">Statistiques patients</a>
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
