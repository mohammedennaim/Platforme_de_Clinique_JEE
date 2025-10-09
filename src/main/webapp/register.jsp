<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title>Créer un compte</title>
    <style>
        body{background:#f4f4f4;font-family:sans-serif;}
        .box{width:350px;margin:60px auto;background:white;padding:25px;border-radius:10px;
            box-shadow:0 0 10px #ccc;}
        input,select,button{width:100%;margin-top:10px;padding:8px;}
        .error{color:red;}
    </style>
</head>
<body>
<div class="box">
    <h2>Inscription</h2>
    <form action="register" method="post">
        <input type="text" name="firstName" placeholder="Prénom" required>
        <input type="text" name="lastName" placeholder="Nom" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Mot de passe" required>
        <select name="role">
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Médecin</option>
        </select>
        <button type="submit">Créer le compte</button>
        <p class="error"><%= request.getAttribute("error") != null ? request.getAttribute("error") : "" %></p>
    </form>
    <p>Déjà inscrit? <a href="index.jsp">Connexion</a></p>
</div>
</body>
</html>