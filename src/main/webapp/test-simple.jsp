<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.example.clinique.entity.User" %>
<%@ page import="org.example.clinique.entity.enums.Role" %>
<%
  // Configuration de session
  session.setAttribute("userEmail", "alice@clinique.com");
  User testUser = new User();
  testUser.setId(4L);
  testUser.setEmail("alice@clinique.com");
  testUser.setRole(Role.PATIENT);
  session.setAttribute("user", testUser);
%>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>🔍 Test Simple Créneaux</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f5f5f5; }
        .box { background: white; padding: 15px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
        .success { background: #d4edda; }
        .warning { background: #fff3cd; }
        .error { background: #f8d7da; }
        pre { overflow-x: auto; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>🔍 Test Simple de Filtrage des Créneaux</h1>
    
    <div class="box success">
        <h3>✅ Session: alice@clinique.com</h3>
        <p>Date du jour: <%= java.time.LocalDate.now() %></p>
        <p>Jour de la semaine: <%= java.time.LocalDate.now().getDayOfWeek() %></p>
    </div>

    <div class="box">
        <h3>Test 1: Charger les données</h3>
        <button onclick="test1()">Exécuter Test 1</button>
        <div id="test1Result"></div>
    </div>

    <div class="box">
        <h3>Test 2: Filtrer par médecin (Dr. Martin - ID 2)</h3>
        <button onclick="test2()">Exécuter Test 2</button>
        <div id="test2Result"></div>
    </div>

    <div class="box">
        <h3>Test 3: Filtrer par date (aujourd'hui)</h3>
        <button onclick="test3()">Exécuter Test 3</button>
        <div id="test3Result"></div>
    </div>

    <div class="box">
        <h3>Test 4: Filtrer par date (demain)</h3>
        <button onclick="test4()">Exécuter Test 4</button>
        <div id="test4Result"></div>
    </div>

    <script>
        let doctors = [];
        let availabilities = [];
        let appointments = [];

        async function loadData() {
            try {
                const response = await fetch('/reserver');
                const html = await response.text();
                
                const doctorsMatch = html.match(/id="doctorsData"[^>]*>\s*(.*?)\s*<\/script>/s);
                const availabilityMatch = html.match(/id="availabilityData"[^>]*>\s*(.*?)\s*<\/script>/s);
                const appointmentsMatch = html.match(/id="appointmentsData"[^>]*>\s*(.*?)\s*<\/script>/s);
                
                if (doctorsMatch) doctors = JSON.parse(doctorsMatch[1].trim());
                if (availabilityMatch) availabilities = JSON.parse(availabilityMatch[1].trim());
                if (appointmentsMatch) appointments = JSON.parse(appointmentsMatch[1].trim());
                
                return true;
            } catch (error) {
                console.error('Erreur:', error);
                return false;
            }
        }

        async function test1() {
            const resultDiv = document.getElementById('test1Result');
            resultDiv.innerHTML = '<p>Chargement...</p>';
            
            const success = await loadData();
            
            if (success) {
                let html = '<div class="success">';
                html += '<p><strong>✅ Données chargées:</strong></p>';
                html += '<p>Médecins: ' + doctors.length + '</p>';
                html += '<p>Disponibilités: ' + availabilities.length + '</p>';
                html += '<p>Rendez-vous: ' + appointments.length + '</p>';
                
                if (availabilities.length > 0) {
                    html += '<p><strong>Premier availability:</strong></p>';
                    html += '<pre>' + JSON.stringify(availabilities[0], null, 2) + '</pre>';
                }
                
                html += '</div>';
                resultDiv.innerHTML = html;
            } else {
                resultDiv.innerHTML = '<div class="error"><p>❌ Erreur de chargement</p></div>';
            }
        }

        async function test2() {
            const resultDiv = document.getElementById('test2Result');
            
            if (availabilities.length === 0) {
                await loadData();
            }
            
            const doctorId = 2; // Dr. Martin
            
            // Test avec différentes méthodes de comparaison
            const filtered1 = availabilities.filter(a => a.doctorId === doctorId);
            const filtered2 = availabilities.filter(a => a.doctorId == doctorId);
            const filtered3 = availabilities.filter(a => parseInt(a.doctorId) === doctorId);
            const filtered4 = availabilities.filter(a => String(a.doctorId) === String(doctorId));
            
            let html = '<div>';
            html += '<p><strong>Filtrage pour Dr. Martin (ID: ' + doctorId + '):</strong></p>';
            html += '<p>Avec === (strict): ' + filtered1.length + ' résultats</p>';
            html += '<p>Avec == (loose): ' + filtered2.length + ' résultats</p>';
            html += '<p>Avec parseInt(): ' + filtered3.length + ' résultats</p>';
            html += '<p>Avec String(): ' + filtered4.length + ' résultats</p>';
            
            if (availabilities.length > 0) {
                html += '<p><strong>Type de doctorId dans data:</strong> ' + typeof availabilities[0].doctorId + '</p>';
                html += '<p><strong>Valeur:</strong> ' + availabilities[0].doctorId + '</p>';
            }
            
            if (filtered2.length > 0) {
                html += '<p><strong>Exemple de résultat:</strong></p>';
                html += '<pre>' + JSON.stringify(filtered2[0], null, 2) + '</pre>';
            }
            
            html += '</div>';
            resultDiv.innerHTML = html;
        }

        async function test3() {
            const resultDiv = document.getElementById('test3Result');
            
            if (availabilities.length === 0) {
                await loadData();
            }
            
            const today = new Date().toISOString().split('T')[0]; // Format: 2025-10-14
            
            const filtered = availabilities.filter(a => a.availabilityDate === today);
            
            let html = '<div>';
            html += '<p><strong>Filtrage pour aujourd\'hui (' + today + '):</strong></p>';
            html += '<p>Résultats: ' + filtered.length + '</p>';
            
            if (filtered.length > 0) {
                html += '<p><strong>Créneaux trouvés:</strong></p>';
                filtered.slice(0, 5).forEach(a => {
                    html += '<p>- ' + a.startTime + ' - ' + a.endTime + ' (Doctor ID: ' + a.doctorId + ')</p>';
                });
            } else {
                html += '<p class="warning">⚠️ Aucun créneau pour aujourd\'hui</p>';
                html += '<p><strong>Dates disponibles (échantillon):</strong></p>';
                const uniqueDates = [...new Set(availabilities.map(a => a.availabilityDate))].slice(0, 10);
                uniqueDates.forEach(date => {
                    html += '<p>- ' + date + '</p>';
                });
            }
            
            html += '</div>';
            resultDiv.innerHTML = html;
        }

        async function test4() {
            const resultDiv = document.getElementById('test4Result');
            
            if (availabilities.length === 0) {
                await loadData();
            }
            
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            
            const filtered = availabilities.filter(a => a.availabilityDate === tomorrowStr);
            
            let html = '<div>';
            html += '<p><strong>Filtrage pour demain (' + tomorrowStr + '):</strong></p>';
            html += '<p>Résultats: ' + filtered.length + '</p>';
            
            if (filtered.length > 0) {
                html += '<p><strong>Créneaux trouvés:</strong></p>';
                filtered.slice(0, 5).forEach(a => {
                    html += '<p>- ' + a.startTime + ' - ' + a.endTime + ' (Doctor ID: ' + a.doctorId + ')</p>';
                });
            } else {
                html += '<p class="warning">⚠️ Aucun créneau pour demain</p>';
            }
            
            html += '</div>';
            resultDiv.innerHTML = html;
        }

        // Auto-load
        window.addEventListener('load', () => {
            setTimeout(() => {
                test1();
            }, 500);
        });
    </script>
</body>
</html>
