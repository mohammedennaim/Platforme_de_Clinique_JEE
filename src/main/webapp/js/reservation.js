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

// Constants
const APPOINTMENT_DURATION = 30; // minutes
const BREAK_DURATION = 5; // minutes
const BOOKING_WINDOW_HOURS = 2; // hours

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

    if (doctorsEl && doctorsEl.textContent.trim()) {
      doctors = JSON.parse(doctorsEl.textContent.trim());
    }

    if (availabilityEl && availabilityEl.textContent.trim()) {
      availabilities = JSON.parse(availabilityEl.textContent.trim());
    }

    if (appointmentsEl && appointmentsEl.textContent.trim()) {
      appointments = JSON.parse(appointmentsEl.textContent.trim());
    }
  } catch (error) {
    console.error('Error loading data:', error);
    doctors = [];
    availabilities = [];
    appointments = [];
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
      <h3>Dr. ${escapeHtml(selectedDoctor.firstName)} ${escapeHtml(selectedDoctor.lastName)}</h3>
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
    const isDisabled = isPast || isWeekend;
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

  const dayOfWeekNum = selectedDate.getDay();
  if (dayOfWeekNum === 0 || dayOfWeekNum === 6) {
    container.innerHTML = '<p class="placeholder">Pas de consultations le week-end</p>';
    return;
  }

  const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][dayOfWeekNum];
  const selectedDateISO = formatDateISO(selectedDate);

  // Find doctor's availability for this date
  const doctorAvailabilities = availabilities.filter(a => {
    const dateMatch = a.availabilityDate === selectedDateISO;
    const dayMatch = !a.availabilityDate && a.dayOfWeek === dayOfWeek;
    const doctorMatch = String(a.doctorId) === String(selectedDoctor.id);
    const statusMatch = a.status === 'AVAILABLE';
    
    return doctorMatch && (dateMatch || dayMatch) && statusMatch;
  });

  if (doctorAvailabilities.length === 0) {
    container.innerHTML = '<p class="placeholder">Aucun créneau disponible pour cette date</p>';
    return;
  }

  // Generate time slots with 5-minute breaks
  const slots = [];
  doctorAvailabilities.forEach(availability => {
    const startTimeStr = availability.startTime || '00:00:00';
    const endTimeStr = availability.endTime || '00:00:00';
    
    const [startHour, startMin] = startTimeStr.split(':').map(Number);
    const [endHour, endMin] = endTimeStr.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    for (let minutes = startMinutes; minutes < endMinutes; minutes += (APPOINTMENT_DURATION + BREAK_DURATION)) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      
      // Check if slot is within 2-hour booking window
      const isWithinWindow = isWithinBookingWindow(selectedDate, timeStr);
      
      // Check if slot is already booked
      const isBooked = isTimeSlotBooked(selectedDate, timeStr);
      
      // Check if slot fits before end time
      const slotEndMinutes = minutes + APPOINTMENT_DURATION;
      const fitsInSchedule = slotEndMinutes <= endMinutes;
      
      if (fitsInSchedule) {
        slots.push({
          time: timeStr,
          disabled: !isWithinWindow || isBooked
        });
      }
    }
  });

  if (slots.length === 0) {
    container.innerHTML = '<p class="placeholder">Aucun créneau disponible</p>';
    return;
  }

  container.innerHTML = `
    <div class="time-slots-grid">
      ${slots.map(slot => {
        const classes = ['time-slot'];
        if (slot.disabled) classes.push('disabled');
        if (selectedTime === slot.time) classes.push('selected');
        
        return `
          <div class="${classes.join(' ')}" 
               onclick="${slot.disabled ? '' : `selectTime('${slot.time}')`}">
            ${slot.time}
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
  
  const twoHoursFromNow = new Date(now.getTime() + BOOKING_WINDOW_HOURS * 60 * 60 * 1000);
  
  return slotDateTime >= twoHoursFromNow;
}

function isTimeSlotBooked(date, time) {
  const dateStr = formatDateISO(date);
  
  return appointments.some(apt => {
    if (String(apt.doctorId) !== String(selectedDoctor.id)) return false;
    if (apt.status === 'CANCELLED') return false;
    
    const aptStart = apt.start ? apt.start.substring(0, 10) : '';
    const aptTime = apt.start ? apt.start.substring(11, 16) : '';
    
    // Check if appointment overlaps with slot (including 5-minute break)
    if (aptStart === dateStr) {
      const [aptHour, aptMin] = aptTime.split(':').map(Number);
      const [slotHour, slotMin] = time.split(':').map(Number);
      
      const aptStartMinutes = aptHour * 60 + aptMin;
      const slotStartMinutes = slotHour * 60 + slotMin;
      const slotEndMinutes = slotStartMinutes + APPOINTMENT_DURATION + BREAK_DURATION;
      
      // Check overlap
      return slotStartMinutes < (aptStartMinutes + APPOINTMENT_DURATION + BREAK_DURATION) && 
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