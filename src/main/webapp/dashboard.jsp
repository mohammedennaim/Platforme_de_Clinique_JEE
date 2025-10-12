<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.example.clinique.entity.User" %>
<%@ page import="org.example.clinique.entity.enums.Role" %>
<%
    String email = (String) session.getAttribute("userEmail");
    User user = (User) session.getAttribute("user");
    if (email == null || user == null) {
        response.sendRedirect("index.jsp");
        return;
    }
%>
<html>
<head>
    <title>Tableau de bord - Clinique Digitale</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
        }
        .role-badge { 
            display: inline-block; 
            padding: 5px 15px; 
            border-radius: 20px; 
            color: white; 
            font-size: 12px; 
            margin-left: 10px; 
        }
        .role-admin { background: #8e44ad; }
        .role-doctor { background: #2c3e50; }
        .role-patient { background: #27ae60; }
        .role-staff { background: #e67e22; }
        .btn { 
            display: inline-block; 
            padding: 10px 20px; 
            background: #3498db; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 5px; 
        }
        .btn:hover { background: #2980b9; }
        .btn-danger { background: #e74c3c; }
        .btn-danger:hover { background: #c0392b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 Clinique Digitale</h1>
            <h2>Bienvenue, <%= user.getFirstName() %> <%= user.getLastName() %></h2>
            <p>Email: <%= email %></p>
            <span class="role-badge role-<%= user.getRole().name().toLowerCase() %>">
                <%= user.getRole().name() %>
            </span>
        </div>
        
        <div style="text-align: center;">
            <p>Vous êtes connecté en tant que <strong><%= user.getRole().name() %></strong></p>
            <p>Redirection automatique vers votre dashboard...</p>
            
            <script>
                // Redirection automatique après 3 secondes
                setTimeout(function() {
                    window.location.href = 'dashboard';
                }, 3000);
            </script>
            
            <a href="dashboard" class="btn">Accéder à mon dashboard</a>
            <a href="logout" class="btn btn-danger">Se déconnecter</a>
        </div>
    </div>
</body>
</html>