<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="org.example.clinique.entity.Specialty" %>
<html>
<head>
    <title>Créer un compte</title>
    <style>
        body{background:#f4f4f4;font-family:sans-serif;}
        .box{width:350px;margin:60px auto;background:white;padding:25px;border-radius:10px;
            box-shadow:0 0 10px #ccc;}
        input,select,button{width:100%;margin-top:10px;padding:8px;}
        .error{color:red;}
        .hidden{display:none;}
    </style>
</head>
<body>
<div class="box">
    <h2>Inscription</h2>
    <form action="register" method="post">
        <input type="text" name="firstName" placeholder="Prénom" required>
        <input type="text" name="lastName" placeholder="Nom" required>
        <input type="text" name="cin" placeholder="CIN" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Mot de passe" required>
        <select name="gender" required>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
        </select>
        <input type="date" name="birthDate" placeholder="BirthDate">
        <input type="tel" name="phoneNumber" placeholder="your phone">
        <input type="text" name="address" placeholder="your adresse">
        <select name="role" id="roleSelect" required onchange="toggleSpecialty()">
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Médecin</option>
        </select>
        
        <!-- Champ spécialité visible seulement pour les médecins -->
        <div id="specialtyDiv" class="hidden">
            <select name="specialtyId" id="specialtySelect">
                <option value="">Sélectionnez une spécialité</option>
                <%
                    List<Specialty> specialties = (List<Specialty>) request.getAttribute("specialties");
                    if (specialties != null) {
                        for (Specialty specialty : specialties) {
                %>
                    <option value="<%= specialty.getId() %>"><%= specialty.getName() %></option>
                <%
                        }
                    }
                %>
            </select>
        </div>
        
        <button type="submit">Créer le compte</button>
        <p class="error"><%= request.getAttribute("error") != null ? request.getAttribute("error") : "" %></p>
    </form>
    <p>Déjà inscrit ? <a href="index.jsp">Connexion</a></p>
</div>

<script>
function toggleSpecialty() {
    var roleSelect = document.getElementById('roleSelect');
    var specialtyDiv = document.getElementById('specialtyDiv');
    var specialtySelect = document.getElementById('specialtySelect');
    
    if (roleSelect.value === 'DOCTOR') {
        specialtyDiv.classList.remove('hidden');
        specialtySelect.setAttribute('required', 'required');
    } else {
        specialtyDiv.classList.add('hidden');
        specialtySelect.removeAttribute('required');
        specialtySelect.value = '';
    }
}
</script>
</body>
</html>