<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
  <title>Clinique Digitale - Connexion</title>
  <style>
    body { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Arial', sans-serif; 
      margin: 0; 
      padding: 0; 
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 28px;
    }
    .logo p {
      color: #7f8c8d;
      margin: 5px 0 0 0;
    }
    .form-group {
      margin-bottom: 20px;
    }
    input {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: #3498db;
    }
    button {
      width: 100%;
      padding: 12px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover {
      background: #2980b9;
    }
    .error {
      color: #e74c3c;
      background: #fdf2f2;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
      border-left: 4px solid #e74c3c;
    }
    .message {
      color: #27ae60;
      background: #f0f9f0;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
      border-left: 4px solid #27ae60;
    }
    .register-link {
      text-align: center;
      margin-top: 20px;
    }
    .register-link a {
      color: #3498db;
      text-decoration: none;
    }
    .register-link a:hover {
      text-decoration: underline;
    }
    .role-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
      font-size: 14px;
      color: #6c757d;
    }
  </style>
</head>
<body>
<div class="container">
  <div class="logo">
    <h1>🏥 Clinique Digitale</h1>
    <p>Plateforme de gestion médicale</p>
  </div>
  
  <form action="login" method="post">
    <div class="form-group">
      <input type="email" name="email" placeholder="Adresse email" required>
    </div>
    <div class="form-group">
      <input type="password" name="password" placeholder="Mot de passe" required>
    </div>
    <button type="submit">Se connecter</button>
    
    <% if (request.getAttribute("error") != null) { %>
      <div class="error"><%= request.getAttribute("error") %></div>
    <% } %>
    
    <% if (request.getAttribute("message") != null) { %>
      <div class="message"><%= request.getAttribute("message") %></div>
    <% } %>
  </form>
  
  <div class="register-link">
    <p>Pas encore inscrit? <a href="register.jsp">Créer un compte</a></p>
  </div>
  
  <div class="role-info">
    <strong>Comptes de test disponibles :</strong><br>
    • Admin: admin@clinique.com / admin<br>
    • Médecin: martin@clinique.com / 1234<br>
    • Patient: alice@clinique.com / 1234<br>
    <small style="color: #95a5a6; margin-top: 10px; display: block;">
      Les mots de passe sont maintenant sécurisés avec BCrypt
    </small>
  </div>
</div>
</body>
</html>