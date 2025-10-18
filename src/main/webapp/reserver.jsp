<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="org.example.clinique.entity.User" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
  String email = (String) session.getAttribute("userEmail");
  User patientSession = (User) session.getAttribute("user");
  if (email == null || patientSession == null) {
    response.sendRedirect("index.jsp");
    return;
  }
%>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réserver un rendez-vous - Clinique Digitale</title>
  <link rel="stylesheet" href="css/reservation.css">
</head>
<body>
  <div class="container">
    <!-- Bouton de retour au dashboard -->
    <div class="back-to-dashboard">
      <a href="${pageContext.request.contextPath}/dashboard-patient.jsp" class="btn-back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Retour au Dashboard
      </a>
    </div>

    <div class="progress-bar">
      <div class="step active" data-step="1">
        <div class="step-circle">1</div>
        <div class="step-label">Spécialité</div>
      </div>
      <div class="step-line"></div>
      <div class="step" data-step="2">
        <div class="step-circle">2</div>
        <div class="step-label">Médecin</div>
      </div>
      <div class="step-line"></div>
      <div class="step" data-step="3">
        <div class="step-circle">3</div>
        <div class="step-label">Date & Heure</div>
      </div>
      <div class="step-line"></div>
      <div class="step" data-step="4">
        <div class="step-circle">4</div>
        <div class="step-label">Confirmation</div>
      </div>
    </div>

    <div class="step-content active" id="step1">
      <div class="card">
        <h2>Choisissez une spécialité</h2>
        <p class="subtitle">Sélectionnez la spécialité médicale dont vous avez besoin</p>
        <div class="specialty-grid" id="specialtyGrid">
           Specialties will be loaded here 
        </div>
      </div>
    </div>
 
    <div class="step-content" id="step2">
      <div class="card">
        <h2>Votre médecin</h2>
        <p class="subtitle">Un médecin disponible a été sélectionné pour vous</p>
        <div class="doctor-selected" id="selectedDoctor">
           Selected doctor will appear here 
        </div>
        <div class="button-group">
          <button class="btn btn-secondary" onclick="previousStep()">Retour</button>
          <button class="btn btn-primary" onclick="nextStep()">Continuer</button>
        </div>
      </div>
    </div>

    <div class="step-content" id="step3">
      <div class="card">
        <h2>Choisissez votre créneau</h2>
        <p class="subtitle">Sélectionnez une date et une heure disponibles (minimum 2h à l'avance)</p>
        
        <div class="calendar-container">
          <div class="calendar-header">
            <button class="btn-icon" onclick="previousWeek()">‹</button>
            <h3 id="currentWeek"></h3>
            <button class="btn-icon" onclick="nextWeek()">›</button>
          </div>
          
          <div class="calendar-grid" id="calendarGrid">
             Calendar will be generated here 
          </div>
          
          <div class="time-slots" id="timeSlots">
            <p class="placeholder">Sélectionnez une date pour voir les créneaux disponibles</p>
          </div>
        </div>

        <div class="button-group">
          <button class="btn btn-secondary" onclick="previousStep()">Retour</button>
          <button class="btn btn-primary" id="confirmTimeBtn" disabled onclick="nextStep()">Confirmer</button>
        </div>
      </div>
    </div>

    <div class="step-content" id="step4">
      <div class="card">
        <div class="success-icon">✓</div>
        <h2>Récapitulatif de votre rendez-vous</h2>
        <div class="confirmation-details" id="confirmationDetails">
           Confirmation details will appear here 
        </div>
        <form method="post" action="${pageContext.request.contextPath}/reserver" id="finalForm">
          <input type="hidden" name="doctorId" id="finalDoctorId">
          <input type="hidden" name="appointmentDate" id="finalDate">
          <input type="hidden" name="startTime" id="finalStartTime">
          <input type="hidden" name="duration" value="30">
          <input type="hidden" name="appointmentType" value="CONSULTATION">
          
          <div class="form-group">
            <label for="notes">Message au médecin (optionnel)</label>
            <textarea id="notes" name="notes" rows="3" placeholder="Précisez le motif de votre consultation..."></textarea>
          </div>

          <div class="button-group">
            <button type="button" class="btn btn-secondary" onclick="previousStep()">Retour</button>
            <button type="submit" class="btn btn-success">Confirmer la réservation</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Conflict Warning Modal -->
  <c:if test="${conflictWarning}">
  <div class="modal-overlay" id="conflictModal">
    <div class="modal-content">
      <div class="modal-icon warning">⚠️</div>
      <h3>Conflit de rendez-vous</h3>
      <p class="conflict-message">${conflictMessage}</p>
      <p class="conflict-question">Souhaitez-vous annuler l'ancien rendez-vous et le remplacer par celui-ci, ou conserver l'ancien ?</p>
      
      <form method="post" action="${pageContext.request.contextPath}/reserver" class="conflict-form">
        <input type="hidden" name="doctorId" value="${formDoctorId}">
        <input type="hidden" name="appointmentDate" value="${formDate}">
        <input type="hidden" name="startTime" value="${formStartTime}">
        <input type="hidden" name="duration" value="${formDuration}">
        <input type="hidden" name="appointmentType" value="${formType}">
        <input type="hidden" name="oldAppointmentId" value="${oldAppointmentId}">
        
        <div class="modal-buttons">
          <button type="submit" name="replaceOld" value="confirm" class="btn btn-warning">
            Remplacer l'ancien
          </button>
          <button type="button" class="btn btn-secondary" onclick="closeConflictModal()">
            Conserver l'ancien
          </button>
        </div>
      </form>
    </div>
  </div>
  </c:if>

  <script id="doctorsData" type="application/json">
    ${doctorsJson}
  </script>
  <script id="availabilityData" type="application/json">
    ${availabilityJson}
  </script>
  <script id="appointmentsData" type="application/json">
    ${appointmentsJson}
  </script>
  <script id="nextAvailabilitiesData" type="application/json">
    ${nextAvailabilitiesJson}
  </script>
  <script id="availabilityTimeSlotsData" type="application/json">
    ${availabilityTimeSlotsJson}
  </script>

  <script src="js/reservation.js"></script>
  <script>
    function closeConflictModal() {
      const modal = document.getElementById('conflictModal');
      if (modal) {
        modal.style.display = 'none';
      }
      // Redirect to clear form state
      window.location.href = '${pageContext.request.contextPath}/reserver';
    }
  </script>
</body>
</html>