<%@ page contentType="text/html;charset=UTF-8" %>
<%
    String email = (String) session.getAttribute("userEmail");
    if (email == null) {
        response.sendRedirect("index.jsp");
        return;
    }
%>
<html>
<head><title>Tableau de bord</title></head>
<body>
<h2>Bienvenue 👋 : <%= email %></h2>
<a href="logout">Se déconnecter</a>
</body>
</html>