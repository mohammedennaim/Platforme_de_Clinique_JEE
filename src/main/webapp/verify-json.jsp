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
    <title>🔍 Vérification JSON</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 6px; }
        .json-box { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 4px; overflow-x: auto; }
        pre { margin: 0; white-space: pre-wrap; word-wrap: break-word; font-size: 12px; }
        .success { background: #d4edda; border-color: #c3e6cb; }
        .warning { background: #fff3cd; border-color: #ffeaa7; }
        .error { background: #f8d7da; border-color: #f5c6cb; }
        .btn { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        h3 { margin-top: 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Vérification des données JSON</h1>
        
        <div class="section success">
            <h3>✅ Session configurée</h3>
            <p><strong>Email:</strong> alice@clinique.com</p>
            <p><strong>Date:</strong> <%= java.time.LocalDate.now() %></p>
        </div>

        <div class="section">
            <button onclick="loadAndAnalyze()" class="btn">Charger et analyser les données</button>
            <button onclick="location.href='reserver'" class="btn" style="background: #28a745;">Aller à la page de réservation</button>
        </div>

        <div id="results"></div>

        <div class="grid" style="margin-top: 20px;">
            <div class="section">
                <h3>👨‍⚕️ Doctors JSON</h3>
                <div id="doctorsBox" class="json-box">Cliquez sur "Charger" pour voir...</div>
            </div>
            
            <div class="section">
                <h3>📅 Availabilities JSON</h3>
                <div id="availabilitiesBox" class="json-box">Cliquez sur "Charger" pour voir...</div>
            </div>
            
            <div class="section">
                <h3>🗓️ Appointments JSON</h3>
                <div id="appointmentsBox" class="json-box">Cliquez sur "Charger" pour voir...</div>
            </div>
        </div>
    </div>

    <script>
        async function loadAndAnalyze() {
            try {
                console.log('Chargement de /reserver...');
                const response = await fetch('/reserver');
                const html = await response.text();
                
                // Extraire les JSONs
                const doctorsMatch = html.match(/id="doctorsData"[^>]*>\s*(.*?)\s*<\/script>/s);
                const availabilityMatch = html.match(/id="availabilityData"[^>]*>\s*(.*?)\s*<\/script>/s);
                const appointmentsMatch = html.match(/id="appointmentsData"[^>]*>\s*(.*?)\s*<\/script>/s);
                
                // Parse et affiche
                if (doctorsMatch) {
                    const doctorsJson = doctorsMatch[1].trim();
                    const doctors = JSON.parse(doctorsJson);
                    document.getElementById('doctorsBox').innerHTML = 
                        '<strong>Count:</strong> ' + doctors.length + '<br><pre>' + JSON.stringify(doctors, null, 2) + '</pre>';
                    console.log('Doctors:', doctors);
                } else {
                    document.getElementById('doctorsBox').innerHTML = 
                        '<span style="color: red;">❌ Pas trouvé dans le HTML</span>';
                }
                
                if (availabilityMatch) {
                    const availabilityJson = availabilityMatch[1].trim();
                    const availabilities = JSON.parse(availabilityJson);
                    
                    // Analyse
                    const withDate = availabilities.filter(a => a.availabilityDate).length;
                    const today = new Date().toISOString().split('T')[0];
                    const todayCount = availabilities.filter(a => a.availabilityDate === today).length;
                    
                    document.getElementById('availabilitiesBox').innerHTML = 
                        '<strong>Count:</strong> ' + availabilities.length + '<br>' +
                        '<strong>Avec availabilityDate:</strong> ' + withDate + '<br>' +
                        '<strong>Pour aujourd\'hui (' + today + '):</strong> ' + todayCount + '<br>' +
                        '<pre>' + JSON.stringify(availabilities.slice(0, 3), null, 2) + '</pre>' +
                        '<small>... (showing first 3 of ' + availabilities.length + ')</small>';
                    console.log('Availabilities:', availabilities);
                } else {
                    document.getElementById('availabilitiesBox').innerHTML = 
                        '<span style="color: red;">❌ Pas trouvé dans le HTML</span>';
                }
                
                if (appointmentsMatch) {
                    const appointmentsJson = appointmentsMatch[1].trim();
                    console.log('Raw appointments JSON:', appointmentsJson);
                    
                    if (appointmentsJson === '[]' || appointmentsJson === '') {
                        document.getElementById('appointmentsBox').innerHTML = 
                            '<span style="color: orange;">⚠️ Tableau vide [] - Aucun rendez-vous existant</span>';
                    } else {
                        const appointments = JSON.parse(appointmentsJson);
                        document.getElementById('appointmentsBox').innerHTML = 
                            '<strong>Count:</strong> ' + appointments.length + '<br><pre>' + JSON.stringify(appointments, null, 2) + '</pre>';
                        console.log('Appointments:', appointments);
                    }
                } else {
                    document.getElementById('appointmentsBox').innerHTML = 
                        '<span style="color: red;">❌ Pas trouvé dans le HTML</span>';
                }
                
                // Résumé
                const resultsDiv = document.getElementById('results');
                let summary = '<div class="section success"><h3>📊 Résumé de l\'analyse</h3>';
                
                if (doctorsMatch && availabilityMatch) {
                    const doctors = JSON.parse(doctorsMatch[1].trim());
                    const availabilities = JSON.parse(availabilityMatch[1].trim());
                    const appointments = appointmentsMatch ? JSON.parse(appointmentsMatch[1].trim()) : [];
                    
                    summary += '<p>✅ <strong>' + doctors.length + ' médecins</strong> chargés</p>';
                    summary += '<p>✅ <strong>' + availabilities.length + ' disponibilités</strong> chargées</p>';
                    summary += '<p>' + (appointments.length === 0 ? '⚠️' : '✅') + ' <strong>' + appointments.length + ' rendez-vous</strong> existants</p>';
                    
                    // Vérifier availabilityDate
                    const withDate = availabilities.filter(a => a.availabilityDate).length;
                    if (withDate === availabilities.length) {
                        summary += '<p>✅ Tous les availabilities ont le champ <code>availabilityDate</code></p>';
                    } else {
                        summary += '<p>⚠️ Seulement ' + withDate + '/' + availabilities.length + ' ont <code>availabilityDate</code></p>';
                    }
                    
                    // Check today
                    const today = new Date().toISOString().split('T')[0];
                    const todayAvails = availabilities.filter(a => a.availabilityDate === today);
                    if (todayAvails.length > 0) {
                        summary += '<p>✅ <strong>' + todayAvails.length + ' disponibilités</strong> pour aujourd\'hui (' + today + ')</p>';
                    } else {
                        const dayOfWeek = new Date().getDay();
                        if (dayOfWeek === 0 || dayOfWeek === 6) {
                            summary += '<p>⚠️ Week-end - pas de consultations</p>';
                        } else {
                            summary += '<p>⚠️ Aucune disponibilité pour aujourd\'hui</p>';
                        }
                    }
                } else {
                    summary += '<p>❌ Impossible de charger toutes les données</p>';
                }
                
                summary += '</div>';
                resultsDiv.innerHTML = summary;
                
            } catch (error) {
                console.error('Erreur:', error);
                document.getElementById('results').innerHTML = 
                    '<div class="section error"><h3>❌ Erreur</h3><p>' + error.message + '</p></div>';
            }
        }
        
        // Chargement automatique
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(loadAndAnalyze, 500);
        });
    </script>
</body>
</html>