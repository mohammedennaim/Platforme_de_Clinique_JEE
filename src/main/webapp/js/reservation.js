// ========================================
// Global State
// ========================================
let currentStep = 1;
let selectedSpecialty = null;
let selectedDoctor = null;
let selectedDate = null;
let selectedTime = null;
let currentWeekStart = null;

let doctors = [];
let availabilities = [];
let appointments = [];
let nextAvailabilitiesWithSlots = []; // Contient doctorId, doctorName, availabilityDate, startTime, endTime, timeSlots[]

const APPOINTMENT_DURATION = 30;
const BREAK_DURATION = 5;

// ========================================
// Specialty Icons Mapping
// ========================================
const specialtyIcons = {
  'Cardiologie': '❤️',
  'Dermatologie': '🩺',
  'Pédiatrie': '👶',
  'Orthopédie': '🦴',
  'Neurologie': '🧠',
  'Ophtalmologie': '👁️',
  'Gynécologie': '🌸',
  'Psychiatrie': '💭',
  'Radiologie': '📷',
  'Médecine générale': '🏥',
  'Chirurgie': '🔪',
  'ORL': '👂',
  'Urologie': '💧',
  'Gastro-entérologie': '🍽️',
  'Pneumologie': '🫁',
  'Endocrinologie': '⚖️',
  'Rhumatologie': '🦴',
  'Anesthésie': '💉',
  'Oncologie': '🎗️',
  'Néphrologie': '🫘'
};

const shortDayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  loadData();
  renderSpecialties();
  initializeCalendar();
});

// ========================================
// Load Data from Server
// ========================================
function loadData() {
  try {
    const doctorsEl = document.getElementById('doctorsData');
    const availabilityEl = document.getElementById('availabilityData');
    const appointmentsEl = document.getElementById('appointmentsData');
    const nextAvailabilitiesEl = document.getElementById('nextAvailabilitiesData');
    const availabilityTimeSlotsEl = document.getElementById('availabilityTimeSlotsData');

    if (doctorsEl && doctorsEl.textContent.trim()) {
      doctors = JSON.parse(doctorsEl.textContent.trim());
    }

    if (availabilityEl && availabilityEl.textContent.trim()) {
      availabilities = JSON.parse(availabilityEl.textContent.trim());
    }

    if (appointmentsEl && appointmentsEl.textContent.trim()) {
      appointments = JSON.parse(appointmentsEl.textContent.trim());
    }

    if (nextAvailabilitiesEl && nextAvailabilitiesEl.textContent.trim()) {
      nextAvailabilitiesWithSlots = JSON.parse(nextAvailabilitiesEl.textContent.trim());
    }
  } catch (error) {
    console.error('Error loading data:', error);
    doctors = [];
    availabilities = [];
    appointments = [];
    nextAvailabilitiesWithSlots = [];
  }
}

// ========================================
// Step 1: Render Specialties
// ========================================
function renderSpecialties() {
  const container = document.getElementById('specialtyGrid');
  if (!container) return;

  const specialties = [...new Set(doctors.map(d => d.specialty))].sort();

  if (specialties.length === 0) {
    container.innerHTML = '<p class="placeholder">Aucune spécialité disponible</p>';
    return;
  }

  container.innerHTML = specialties.map(specialty => `
    <div class="specialty-card" onclick="selectSpecialty('${escapeHtml(specialty)}')">
      <div class="specialty-icon">${specialtyIcons[specialty] || '🏥'}</div>
      <div class="specialty-name">${escapeHtml(specialty)}</div>
    </div>
  `).join('');
}

function selectSpecialty(specialty) {
  selectedSpecialty = specialty;
  
  const filteredDoctors = doctors.filter(d => d.specialty === specialty);  
  
  if (filteredDoctors.length === 0) {
    alert('Aucun médecin disponible pour cette spécialité');
    return;
  }

  // Random selection
  selectedDoctor = filteredDoctors[Math.floor(Math.random() * filteredDoctors.length)];
  nextStep();
}

// ========================================
// Step 2: Display Selected Doctor
// ========================================
function renderSelectedDoctor() {
  const container = document.getElementById('selectedDoctor');
  if (!container || !selectedDoctor) return;

  const initials = getInitials(selectedDoctor.firstName, selectedDoctor.lastName);

  container.innerHTML = `
    <div class="doctor-avatar">${escapeHtml(initials)}</div>
    <div class="doctor-info">
      <h3>${escapeHtml(selectedDoctor.fullName)}</h3>
      <p>${escapeHtml(selectedDoctor.specialty)}</p>
    </div>
  `;
}

function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
}

// ========================================
// Step 3: Calendar & Time Slots
// ========================================
function initializeCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() + diff);
}

function renderCalendar() {
  const container = document.getElementById('calendarGrid');
  const weekLabel = document.getElementById('currentWeek');
  
  if (!container || !currentWeekStart) return;

  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(currentWeekStart.getDate() + 6);

  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  weekLabel.textContent = `${currentWeekStart.getDate()} ${monthNames[currentWeekStart.getMonth()]} - ${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let html = '';
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    
    const dayOfWeek = date.getDay();
    const isPast = date < today;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const isDisabled = isPast; // Désactiver uniquement les jours passés
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    
    const classes = ['calendar-day'];
    if (isDisabled) classes.push('disabled');
    if (isSelected) classes.push('selected');

    html += `
      <div class="${classes.join(' ')}" 
           onclick="${isDisabled ? '' : `selectDate('${date.toISOString()}')`}">
        <div class="day-name">${shortDayNames[date.getDay()]}</div>
        <div class="day-number">${date.getDate()}</div>
      </div>
    `;
  }

  container.innerHTML = html;
}

function selectDate(dateStr) {
  selectedDate = new Date(dateStr);
  selectedTime = null;
  
  renderCalendar();
  renderTimeSlots();
  
  document.getElementById('confirmTimeBtn').disabled = true;
}

function renderTimeSlots() {
  const container = document.getElementById('timeSlots');
  if (!container || !selectedDate || !selectedDoctor) {
    if (container) {
      container.innerHTML = '<p class="placeholder">Sélectionnez une date pour voir les créneaux disponibles</p>';
    }
    return;
  }

  const selectedDateISO = formatDateISO(selectedDate);

  // Chercher les time slots depuis le backend pour ce médecin et cette date
  const availabilityData = nextAvailabilitiesWithSlots.find(avail => {
    return String(avail.doctorId) === String(selectedDoctor.id) && 
           avail.availabilityDate === selectedDateISO;
  });

  if (!availabilityData || !availabilityData.timeSlots || availabilityData.timeSlots.length === 0) {
    container.innerHTML = '<p class="placeholder">Aucun créneau disponible pour cette date</p>';
    return;
  }

  // Filtrer les créneaux déjà réservés
  const availableSlots = availabilityData.timeSlots.filter(timeSlot => {
    return !isTimeSlotBooked(selectedDate, timeSlot);
  });

  if (availableSlots.length === 0) {
    container.innerHTML = '<p class="placeholder">Tous les créneaux sont réservés pour cette date</p>';
    return;
  }

  container.innerHTML = `
    <div class="time-slots-grid">
      ${availableSlots.map(timeSlot => {
        const classes = ['time-slot'];
        if (selectedTime === timeSlot) classes.push('selected');
        
        return `
          <div class="${classes.join(' ')}" onclick="selectTime('${timeSlot}')">
            ${timeSlot}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function isWithinBookingWindow(date, time) {
  const now = new Date();
  const slotDateTime = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  slotDateTime.setHours(hours, minutes, 0, 0);
  
  // Vérifier seulement si le créneau est dans le futur
  return slotDateTime > now;
}

function isTimeSlotBooked(date, time) {
  const dateStr = formatDateISO(date);
  
  return appointments.some(apt => {
    if (String(apt.doctorId) !== String(selectedDoctor.id)) return false;
    if (apt.status === 'CANCELED') return false;
    
    const aptStart = apt.start ? apt.start.substring(0, 10) : '';
    const aptTime = apt.start ? apt.start.substring(11, 16) : '';
    
    // Check if appointment overlaps with slot (including 5-minute break)
    if (aptStart === dateStr) {
      const [aptHour, aptMin] = aptTime.split(':').map(Number);
      const [slotHour, slotMin] = time.split(':').map(Number);
      
      const aptStartMinutes = aptHour * 60 + aptMin;
      const slotStartMinutes = slotHour * 60 + slotMin;
      const slotEndMinutes = slotStartMinutes + APPOINTMENT_DURATION;
      
      // Check overlap
      return slotStartMinutes < (aptStartMinutes + APPOINTMENT_DURATION ) && 
             slotEndMinutes > aptStartMinutes;
    }
    
    return false;
  });
}

function selectTime(time) {
  selectedTime = time;
  renderTimeSlots();
  
  document.getElementById('confirmTimeBtn').disabled = false;
}

function previousWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  selectedDate = null;
  selectedTime = null;
  renderCalendar();
  document.getElementById('timeSlots').innerHTML = '<p class="placeholder">Sélectionnez une date pour voir les créneaux disponibles</p>';
  document.getElementById('confirmTimeBtn').disabled = true;
}

function nextWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  selectedDate = null;
  selectedTime = null;
  renderCalendar();
  document.getElementById('timeSlots').innerHTML = '<p class="placeholder">Sélectionnez une date pour voir les créneaux disponibles</p>';
  document.getElementById('confirmTimeBtn').disabled = true;
}

// ========================================
// Step 4: Confirmation
// ========================================
function renderConfirmation() {
  const container = document.getElementById('confirmationDetails');
  if (!container) return;

  const dateStr = selectedDate ? formatDateFull(selectedDate) : '';
  
  container.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">Spécialité</span>
      <span class="detail-value">${escapeHtml(selectedSpecialty || '')}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Médecin</span>
      <span class="detail-value">Dr. ${escapeHtml(selectedDoctor?.firstName || '')} ${escapeHtml(selectedDoctor?.lastName || '')}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Date</span>
      <span class="detail-value">${dateStr}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Heure</span>
      <span class="detail-value">${selectedTime || ''}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Durée</span>
      <span class="detail-value">${APPOINTMENT_DURATION} minutes</span>
    </div>
  `;

  document.getElementById('finalDoctorId').value = selectedDoctor?.id || '';
  document.getElementById('finalDate').value = formatDateISO(selectedDate);
  document.getElementById('finalStartTime').value = selectedTime || '';
}

// ========================================
// Step Navigation
// ========================================
function nextStep() {
  if (currentStep === 1 && !selectedSpecialty) {
    alert('Veuillez sélectionner une spécialité');
    return;
  }
  
  if (currentStep === 3 && !selectedTime) {
    alert('Veuillez sélectionner une date et une heure');
    return;
  }

  if (currentStep < 4) {
    setStep(currentStep + 1);
  }
}

function previousStep() {
  if (currentStep > 1) {
    setStep(currentStep - 1);
  }
}

function setStep(step) {
  currentStep = step;

  document.querySelectorAll('.step').forEach(function(el, index) {
    el.classList.remove('active', 'completed');
    if (index + 1 < currentStep) {
      el.classList.add('completed');
    } else if (index + 1 === currentStep) {
      el.classList.add('active');
    }
  });

  document.querySelectorAll('.step-content').forEach(function(el, index) {
    el.classList.remove('active');
    if (index + 1 === currentStep) {
      el.classList.add('active');
    }
  });

  if (currentStep === 2) {
    renderSelectedDoctor();
  } else if (currentStep === 3) {
    renderCalendar();
    renderTimeSlots();
  } else if (currentStep === 4) {
    renderConfirmation();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// Utility Functions
// ========================================
function formatDateFull(date) {
  if (!date) return '';
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

function formatDateISO(date) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}