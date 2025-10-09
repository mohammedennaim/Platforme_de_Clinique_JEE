<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
  <title>Connexion</title>
  <style>
    body { background:#f4f4f4; font-family:sans-serif; }
    .box { width:300px; margin:80px auto; background:white; padding:25px; border-radius:10px;
      box-shadow:0 0 10px #aaa; }
    input, button { width:100%; margin-top:10px; padding:8px; }
    .error{color:red;} .message{color:green;}
  </style>
</head>
<body>
<div class="box">
  <h2>Connexion</h2>
  <form action="login" method="post">
    <input type="text" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Mot de passe" required>
    <button type="submit">Se connecter</button>
    <p class="error"><%= request.getAttribute("error") != null ? request.getAttribute("error") : "" %></p>
    <p class="message"><%= request.getAttribute("message") != null ? request.getAttribute("message") : "" %></p>
  </form>
  <p>Pas encore inscrit? <a href="register.jsp">Créer un compte</a></p>
</div>
</body>
</html>