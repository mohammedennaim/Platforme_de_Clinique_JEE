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
<html>
<head>
    <title>Dashboard Personnel</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #e67e22; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .btn { background: #e67e22; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 5px; }
        .btn:hover { background: #d35400; }
        .btn-danger { background: #e74c3c; }
        .btn-danger:hover { background: #c0392b; }
        .info-item { margin: 10px 0; padding: 10px; background: #ecf0f1; border-radius: 4px; }
        .staff-badge { background: #e67e22; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 Dashboard Personnel</h1>
            <p>Bienvenue, <%= staff.getFirstName() %> <%= staff.getLastName() %></p>
            <p>Email: <%= staff.getEmail() %></p>
            <span class="staff-badge">PERSONNEL</span>
        </div>

        <div class="grid">
            <div class="card">
                <h3>👤 Informations Personnelles</h3>
                <div class="info-item">
                    <strong>Nom complet:</strong> <%= staff.getFirstName() %> <%= staff.getLastName() %>
                </div>
                <div class="info-item">
                    <strong>Département assigné:</strong> Accueil
                </div>
                <div class="info-item">
                    <strong>Rôle:</strong> Personnel de la clinique
                </div>
            </div>

            <div class="card">
                <h3>📋 Gestion des Rendez-vous</h3>
                <p>Assistez dans la gestion des rendez-vous</p>
                <a href="#" class="btn">Planning des rendez-vous</a>
                <a href="#" class="btn">Confirmer les rendez-vous</a>
                <a href="#" class="btn">Gérer les annulations</a>
            </div>

            <div class="card">
                <h3>👥 Accueil des Patients</h3>
                <p>Gérez l'accueil et l'orientation des patients</p>
                <a href="#" class="btn">Liste d'attente</a>
                <a href="#" class="btn">Orienter les patients</a>
                <a href="#" class="btn">Informations patients</a>
            </div>

            <div class="card">
                <h3>📞 Communication</h3>
                <p>Gérez les communications avec les patients</p>
                <a href="#" class="btn">Appels entrants</a>
                <a href="#" class="btn">Rappels de rendez-vous</a>
                <a href="#" class="btn">Messages patients</a>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>🏥 Services Support</h3>
                <p>Outils de support pour le personnel</p>
                <a href="#" class="btn">Liste des médecins</a>
                <a href="#" class="btn">Disponibilités</a>
                <a href="#" class="btn">Salles disponibles</a>
            </div>

            <div class="card">
                <h3>📊 Rapports Quotidiens</h3>
                <p>Consultez les rapports de votre département</p>
                <a href="#" class="btn">Activité du jour</a>
                <a href="#" class="btn">Statistiques patients</a>
                <a href="#" class="btn">Rapport de fin de journée</a>
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
