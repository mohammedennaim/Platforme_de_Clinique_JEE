// ========================================
// Global State
// ========================================
let currentStep = 1
let selectedSpecialty = null
let selectedDoctor = null
let selectedDate = null
let selectedTime = null
let currentWeekStart = null

let doctors = []
let availabilities = []
let appointments = []
let nextAvailabilitiesWithSlots = [] // Contient doctorId, doctorName, availabilityDate, startTime, endTime, timeSlots[]

const APPOINTMENT_DURATION = 30
const BREAK_DURATION = 5

const shortDayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

// Garder la date/heure originales du RDV en édition
let originalEditDateISO = null
let originalEditTime = null

// Flag: fallback d'affichage du créneau actuel uniquement
let fallbackCurrentSlotOnly = false

// ========================================
// Specialty Icons Mapping
// ========================================
const specialtyIcons = {
  Cardiologie: "❤️",
  Dermatologie: "🩺",
  Pédiatrie: "👶",
  Orthopédie: "🦴",
  Neurologie: "🧠",
  Ophtalmologie: "👁️",
  Gynécologie: "🌸",
  Psychiatrie: "💭",
  Radiologie: "📷",
  "Médecine générale": "🏥",
  Chirurgie: "🔪",
  ORL: "👂",
  Urologie: "💧",
  "Gastro-entérologie": "🍽️",
  Pneumologie: "🫁",
  Endocrinologie: "⚖️",
  Rhumatologie: "🦴",
  Anesthésie: "💉",
  Oncologie: "🎗️",
  Néphrologie: "🫘",
}

// ========================================
// Helpers (Edit Mode)
// ========================================
function getEditId() {
  // 1) URL param ?edit=ID
  const urlParams = new URLSearchParams(window.location.search)
  const editFromUrl = urlParams.get("edit")
  if (editFromUrl) return String(editFromUrl)

  // 2) Hidden input
  const hidden = document.getElementById("editAppointmentId")
  if (hidden && hidden.value) return String(hidden.value)

  // 3) SessionStorage
  try {
    const stored = sessionStorage.getItem("editingAppointment")
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && parsed.id) return String(parsed.id)
    }
  } catch (e) {}
  return null
}

function hasAvailabilityForDate(doctorId, dateISO) {
  return nextAvailabilitiesWithSlots.some(
    av =>
      String(av.doctorId) === String(doctorId) &&
      av.availabilityDate === dateISO &&
      av.timeSlots &&
      av.timeSlots.length > 0
  )
}

function getNextAvailabilityDateForDoctor(doctorId, fromISO) {
  const todayISO = new Date().toISOString().substring(0, 10)
  const thresholdISO = fromISO || todayISO
  const candidates = nextAvailabilitiesWithSlots
    .filter(av => String(av.doctorId) === String(doctorId) && av.timeSlots && av.timeSlots.length > 0)
    .map(av => av.availabilityDate)
    .filter(d => d >= thresholdISO)
    .sort()
  return candidates.length > 0 ? candidates[0] : null
}

// Bouton confirmer: centraliser l'activation
function updateConfirmBtn() {
  const btn = document.getElementById("confirmTimeBtn")
  if (!btn) return
  // Actif si on a une date et une heure choisies
  btn.disabled = !(selectedDate && selectedTime)
}

// ========================================
// Initialize
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  loadData()
  renderSpecialties()
  initializeCalendar()

  // Check for editing mode
  const urlParams = new URLSearchParams(window.location.search)
  const editId = urlParams.get("edit")

  if (editId) {
    const editData = sessionStorage.getItem("editingAppointment")
    if (editData) {
      const appointment = JSON.parse(editData)
      setTimeout(() => {
        loadEditMode(appointment)
      }, 200)
    }
  } else {
    // Pre-select doctor by URL
    const doctorId = urlParams.get("doctorId")
    const specialty = urlParams.get("specialty")
    if (doctorId && specialty) {
      setTimeout(() => {
        autoSelectFromUrl(specialty, Number.parseInt(doctorId))
      }, 100)
    }
  }

  // If updated, reset UI after a delay
  const successMessage = document.querySelector(".success-message, .alert-success")
  if (successMessage && successMessage.textContent.includes("modifié")) {
    setTimeout(() => {
      resetToCreationMode()
    }, 3000)
  }
})

// ========================================
// Auto-select Specialty and Doctor from URL
// ========================================
function autoSelectFromUrl(specialtyName, doctorId) {
  selectedSpecialty = specialtyName

  const doctor = doctors.find((d) => d.id === doctorId)
  if (!doctor) {
    console.error("Doctor not found:", doctorId)
    return
  }

  selectedDoctor = doctor

  const now = new Date()
  const nextAvail = nextAvailabilitiesWithSlots
    .filter((av) => String(av.doctorId) === String(doctorId) && av.timeSlots && av.timeSlots.length > 0)
    .map((av) => ({ ...av, dateObj: new Date(av.availabilityDate) }))
    .filter((av) => av.dateObj >= new Date(now.toISOString().substring(0, 10)))
    .sort((a, b) => a.dateObj - b.dateObj)[0]

  if (nextAvail) {
    selectedDate = new Date(nextAvail.availabilityDate + "T00:00:00")
  }

  setStep(3)
  setTimeout(() => {
    const el = document.getElementById("timeSlots")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
  }, 300)
}

// ========================================
// Reset Creation Mode
// ========================================
function resetToCreationMode() {
  const editIdInput = document.getElementById("editAppointmentId")
  if (editIdInput) editIdInput.remove()

  const formTitle = document.querySelector("#step4 h2")
  if (formTitle) formTitle.textContent = "Récapitulatif de votre rendez-vous"

  const finalForm = document.getElementById("finalForm")
  if (finalForm) {
    const submitButton = finalForm.querySelector('button[type="submit"]')
    if (submitButton) {
      submitButton.textContent = "Confirmer la réservation"
      submitButton.classList.remove("btn-primary")
      submitButton.classList.add("btn-success")
    }
  }

  sessionStorage.removeItem("editingAppointment")
  selectedSpecialty = null
  selectedDoctor = null
  selectedDate = null
  selectedTime = null
  originalEditDateISO = null
  originalEditTime = null
  fallbackCurrentSlotOnly = false
  setStep(1)
}

// ========================================
// Load Data from Server
// ========================================
function loadData() {
  try {
    const doctorsEl = document.getElementById("doctorsData")
    const availabilityEl = document.getElementById("availabilityData")
    const appointmentsEl = document.getElementById("appointmentsData")
    const nextAvailabilitiesEl = document.getElementById("nextAvailabilitiesData")

    if (doctorsEl && doctorsEl.textContent.trim()) {
      doctors = JSON.parse(doctorsEl.textContent.trim())
    } else {
      console.warn("No doctors data found in DOM")
    }

    if (availabilityEl && availabilityEl.textContent.trim()) {
      availabilities = JSON.parse(availabilityEl.textContent.trim())
    }

    if (appointmentsEl && appointmentsEl.textContent.trim()) {
      appointments = JSON.parse(appointmentsEl.textContent.trim())
    }

    if (nextAvailabilitiesEl && nextAvailabilitiesEl.textContent.trim()) {
      nextAvailabilitiesWithSlots = JSON.parse(nextAvailabilitiesEl.textContent.trim())
    } else {
      console.warn("No availabilities data found in DOM")
    }
  } catch (error) {
    console.error("Error loading data:", error)
    doctors = []
    availabilities = []
    appointments = []
    nextAvailabilitiesWithSlots = []
  }
}

// ========================================
// Step 1: Render Specialties
// ========================================
function renderSpecialties() {
  const container = document.getElementById("specialtyGrid")
  if (!container) return

  const validDoctors = doctors.filter((d) => d && d.specialty && d.specialty.trim() !== "")
  let specialties = [...new Set(validDoctors.map((d) => d.specialty))].sort()

  if (specialties.length === 0 && selectedSpecialty) {
    specialties = [selectedSpecialty]
  }

  if (specialties.length === 0) {
    container.innerHTML = '<p class="placeholder">Aucune spécialité disponible</p>'
    return
  }

  container.innerHTML = specialties
    .map((specialty) => {
      const isSelected = selectedSpecialty === specialty
      const doctorsForSpecialty = doctors.filter(d => d && d.specialty === specialty)
      const hasDoctors = doctorsForSpecialty.length > 0

      const urlParams = new URLSearchParams(window.location.search)
      const editId = urlParams.get("edit")
      const canSelect = hasDoctors || editId || isSelected

      return `
        <div class="specialty-card ${isSelected ? 'selected' : ''} ${!hasDoctors ? 'no-doctors' : ''}" 
             onclick="${canSelect ? `selectSpecialty('${escapeHtml(specialty)}')` : ''}">
          <div class="specialty-icon">${specialtyIcons[specialty] || "🏥"}</div>
          <div class="specialty-name">${escapeHtml(specialty)}</div>
          ${!hasDoctors && !editId ? '<div class="specialty-warning">Aucun médecin disponible</div>' : ''}
        </div>
      `
    })
    .join("")
}

function selectSpecialty(specialty) {
  selectedSpecialty = specialty

  const urlParams = new URLSearchParams(window.location.search)
  const editId = urlParams.get("edit")

  if (editId) {
    if (selectedDoctor && selectedDoctor.specialty === specialty) {
      nextStep()
      return
    }
  }

  let filteredDoctors = doctors.filter((d) => d && d.specialty === specialty)

  if (filteredDoctors.length === 0) {
    filteredDoctors = doctors.filter((d) => d && d.specialty &&
      d.specialty.toLowerCase().trim() === specialty.toLowerCase().trim())
  }

  if (filteredDoctors.length === 0) {
    filteredDoctors = doctors.filter((d) => d && d.specialty &&
      d.specialty.toLowerCase().includes(specialty.toLowerCase()))
  }

  if (filteredDoctors.length === 0) {
    if (!editId) {
      showToast("Aucun médecin disponible pour cette spécialité. Veuillez choisir une autre spécialité.", "error")
    }
    return
  }

  selectedDoctor = filteredDoctors[Math.floor(Math.random() * filteredDoctors.length)]
  nextStep()
}

// ========================================
// Step 2: Display Selected Doctor
// ========================================
function renderSelectedDoctor() {
  const container = document.getElementById("selectedDoctor")
  if (!container || !selectedDoctor) return

  const initials = selectedDoctor.initials || getInitialsFromFullName(selectedDoctor.fullName || "")

  container.innerHTML = `
    <div class="doctor-avatar">${escapeHtml(initials)}</div>
    <div class="doctor-info">
      <h3>${escapeHtml(selectedDoctor.fullName || "")}</h3>
      <p>${escapeHtml(selectedDoctor.specialty || "")}</p>
    </div>
  `
}

function getInitialsFromFullName(fullName) {
  if (!fullName) return ""
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
}

// Backward compatibility if used elsewhere
function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : ""
  const last = lastName ? lastName.charAt(0).toUpperCase() : ""
  return first + last
}

// ========================================
// Step 3: Calendar & Time Slots
// ========================================
function initializeCalendar() {
  const editId = getEditId()
  
  if (editId && selectedDate) {
    // In edit mode, start with the week containing the appointment date
    const appointmentDate = new Date(selectedDate)
    appointmentDate.setHours(0, 0, 0, 0)
    
    const dayOfWeek = appointmentDate.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    currentWeekStart = new Date(appointmentDate)
    currentWeekStart.setDate(appointmentDate.getDate() + diff)
    
    console.log("Edit mode: Calendar initialized for appointment week starting", currentWeekStart)
  } else {
    // In create mode, start with current week
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dayOfWeek = today.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    currentWeekStart = new Date(today)
    currentWeekStart.setDate(today.getDate() + diff)
  }
}

function renderCalendar() {
  const container = document.getElementById("calendarGrid")
  const weekLabel = document.getElementById("currentWeek")

  if (!container || !currentWeekStart) return

  const weekEnd = new Date(currentWeekStart)
  weekEnd.setDate(currentWeekStart.getDate() + 6)

  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
  weekLabel.textContent = `${currentWeekStart.getDate()} ${monthNames[currentWeekStart.getMonth()]} - ${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const editId = getEditId()

  let html = ""
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart)
    date.setDate(currentWeekStart.getDate() + i)

    const isPast = date < today
    const dateISO = formatDateISO(date)

    // Exclude the appointment being edited
    const hasAppointmentInSameSpecialty = selectedDoctor
      ? appointments.some((apt) => {
          if (apt.status === "CANCELED") return false
          if (editId && String(apt.id) === String(editId)) return false
          const aptDate = apt.start ? apt.start.split("T")[0] : null
          return aptDate === dateISO && apt.doctorSpecialty === selectedDoctor.specialty
        })
      : false

    const isDisabled = isPast || hasAppointmentInSameSpecialty
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

    const classes = ["calendar-day"]
    if (isDisabled) classes.push("disabled")
    if (hasAppointmentInSameSpecialty && !isPast) classes.push("has-appointment")
    if (isSelected) classes.push("selected")

    html += `
      <div class="${classes.join(" ")}" 
           onclick="${isDisabled ? "" : `selectDate('${date.toISOString()}')`}"
           title="${hasAppointmentInSameSpecialty && !isPast ? "Vous avez déjà un rendez-vous en " + selectedDoctor.specialty + " ce jour" : ""}">
        <div class="day-name">${shortDayNames[date.getDay()]}</div>
        <div class="day-number">${date.getDate()}</div>
      </div>
    `
  }

  container.innerHTML = html
}

function selectDate(dateStr) {
  const newDate = new Date(dateStr)
  selectedDate = newDate

  // En mode édition: si on clique sur la même date que le RDV d'origine,
  // on garde le créneau original sélectionné; sinon on réinitialise.
  const editId = getEditId()
  const clickedISO = formatDateISO(newDate)
  if (editId && originalEditDateISO && clickedISO === originalEditDateISO) {
    selectedTime = originalEditTime
  } else {
    selectedTime = null
  }

  renderCalendar()
  renderTimeSlots()
  updateConfirmBtn()
}

function renderTimeSlots() {
  const container = document.getElementById("timeSlots")
  if (!container || !selectedDate || !selectedDoctor) {
    if (container) {
      container.innerHTML = '<p class="placeholder">Sélectionnez une date pour voir les créneaux disponibles</p>'
    }
    return
  }

  const selectedDateISO = formatDateISO(selectedDate)
  const editId = getEditId()

  // Exclude the appointment being edited from same-specialty day blocking
  const hasAppointmentInSameSpecialty = appointments.some((apt) => {
    if (apt.status === "CANCELED") return false
    if (editId && String(apt.id) === String(editId)) return false
    const aptDate = apt.start ? apt.start.split("T")[0] : null
    return aptDate === selectedDateISO && apt.doctorSpecialty === selectedDoctor.specialty
  })

  if (hasAppointmentInSameSpecialty) {
    container.innerHTML = `<p class="placeholder">Vous avez déjà un rendez-vous en ${selectedDoctor.specialty} prévu ce jour-là</p>`
    fallbackCurrentSlotOnly = false
    updateConfirmBtn()
    return
  }

  // Fetch availability for this doctor/date
  const availabilityData = nextAvailabilitiesWithSlots.find((avail) => {
    return String(avail.doctorId) === String(selectedDoctor.id) && avail.availabilityDate === selectedDateISO
  })
  
  console.log("Looking for availability for doctor", selectedDoctor.id, "on date", selectedDateISO)
  console.log("Available data:", availabilityData)
  console.log("All availabilities:", nextAvailabilitiesWithSlots)
  
  // Debug: Log all availabilities for this doctor
  const doctorAvailabilities = nextAvailabilitiesWithSlots.filter(avail => 
    String(avail.doctorId) === String(selectedDoctor.id)
  )
  console.log("Doctor availabilities:", doctorAvailabilities)

  // If no availability that day:
  if (!availabilityData || !availabilityData.timeSlots || availabilityData.timeSlots.length === 0) {
    // In edit mode, show current slot so user peut confirmer ou changer de date
    if (editId && selectedTime) {
      fallbackCurrentSlotOnly = true
      renderTimeSlotsGrid([selectedTime], container)
      // Activer le bouton Confirmer pour laisser l'utilisateur garder ce créneau
      updateConfirmBtn()
      container.insertAdjacentHTML(
        'beforeend',
        '<p class="hint">Ceci est le créneau de votre rendez-vous actuel. Pour reprogrammer, choisissez une date qui a des disponibilités.</p>'
      )
      return
    }
    // In create mode or edit mode without selected time
    container.innerHTML = '<p class="placeholder">Aucun créneau disponible pour cette date</p>'
    fallbackCurrentSlotOnly = false
    updateConfirmBtn()
    return
  }

  // Compute available slots
  let availableSlots = availabilityData.timeSlots
  if (editId) {
    // In edit: ensure current selectedTime is visible even if not part of availability list
    if (selectedTime && !availableSlots.includes(selectedTime)) {
      availableSlots = [...availableSlots, selectedTime].sort()
      console.log("Added current appointment time to available slots:", selectedTime)
    }
    // In edit mode, don't filter out booked slots - show all available slots
    // The backend already handles this by not filtering by existing appointments
    console.log("Edit mode: Showing all available slots:", availableSlots)
  } else {
    // In create: filter out booked ones
    availableSlots = availabilityData.timeSlots.filter((timeSlot) => !isTimeSlotBooked(selectedDate, timeSlot))
  }

  if (availableSlots.length === 0) {
    container.innerHTML = '<p class="placeholder">Tous les créneaux sont réservés pour cette date</p>'
    fallbackCurrentSlotOnly = false
    updateConfirmBtn()
    return
  }

  fallbackCurrentSlotOnly = false
  renderTimeSlotsGrid(availableSlots, container)
  updateConfirmBtn()
}

function isWithinBookingWindow(date, time) {
  const now = new Date()
  const slotDateTime = new Date(date)
  const [hours, minutes] = time.split(":").map(Number)
  slotDateTime.setHours(hours, minutes, 0, 0)
  return slotDateTime > now
}

function renderTimeSlotsGrid(availableSlots, container) {
  const editId = getEditId()

  console.log("renderTimeSlotsGrid called with slots:", availableSlots)
  console.log("Current selectedTime:", selectedTime)
  console.log("Edit mode:", !!editId)

  container.innerHTML = `
    <div class="time-slots-grid">
      ${availableSlots
        .map((timeSlot) => {
          const classes = ["time-slot"]
          if (selectedTime === timeSlot) classes.push("selected")

          // Visual booked state (clickable in edit mode)
          const isBooked = isTimeSlotBooked(selectedDate, timeSlot)
          if (isBooked && editId) {
            classes.push("booked")
          }

          const isClickable = !isBooked || editId
          const clickHandler = isClickable ? `onclick="selectTime('${timeSlot}')" ` : ""

          return `
            <div class="${classes.join(" ")}" ${clickHandler}>
              ${timeSlot}
              ${isBooked && editId && selectedTime !== timeSlot ? '<div class="slot-status">Réservé</div>' : ''}
            </div>
          `
        })
        .join("")}
    </div>
  `
  
  // In edit mode, ensure the current appointment time is selected by default
  if (editId && selectedTime && availableSlots.includes(selectedTime)) {
    console.log("Edit mode: Current appointment time is available and should be selected:", selectedTime)
  }
}

function isTimeSlotBooked(date, time) {
  const dateStr = formatDateISO(date)
  const editId = getEditId()

  return appointments.some((apt) => {
    if (String(apt.doctorId) !== String(selectedDoctor.id)) return false
    if (apt.status === "CANCELED") return false

    // Exclude the appointment being edited
    if (editId && String(apt.id) === String(editId)) return false

    const aptStart = apt.start ? apt.start.substring(0, 10) : ""
    const aptTime = apt.start ? apt.start.substring(11, 16) : ""

    if (aptStart === dateStr) {
      const [aptHour, aptMin] = aptTime.split(":").map(Number)
      const [slotHour, slotMin] = time.split(":").map(Number)

      const aptStartMinutes = aptHour * 60 + aptMin
      const slotStartMinutes = slotHour * 60 + slotMin
      const slotEndMinutes = slotStartMinutes + APPOINTMENT_DURATION

      return slotStartMinutes < aptStartMinutes + APPOINTMENT_DURATION && slotEndMinutes > aptStartMinutes
    }
    return false
  })
}

function selectTime(time) {
  selectedTime = time
  renderTimeSlots()
  updateConfirmBtn()
}

function previousWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7)
  selectedDate = null
  selectedTime = null
  renderCalendar()
  const ts = document.getElementById("timeSlots")
  if (ts) ts.innerHTML = '<p class="placeholder">Sélectionnez une date pour voir les créneaux disponibles</p>'
  updateConfirmBtn()
}

function nextWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7)
  selectedDate = null
  selectedTime = null
  renderCalendar()
  const ts = document.getElementById("timeSlots")
  if (ts) ts.innerHTML = '<p class="placeholder">Sélectionnez une date pour voir les créneaux disponibles</p>'
  updateConfirmBtn()
}

// ========================================
// Step 4: Confirmation
// ========================================
function renderConfirmation() {
  const container = document.getElementById("confirmationDetails")
  if (!container) return

  const dateStr = selectedDate ? formatDateFull(selectedDate) : ""

  container.innerHTML = `
    <div class="detail-row">
      <span class="detail-label">Spécialité</span>
      <span class="detail-value">${escapeHtml(selectedSpecialty || "")}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Médecin</span>
      <span class="detail-value">${escapeHtml(selectedDoctor?.fullName || "")}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Date</span>
      <span class="detail-value">${dateStr}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Heure</span>
      <span class="detail-value">${selectedTime || ""}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Durée</span>
      <span class="detail-value">${APPOINTMENT_DURATION} minutes</span>
    </div>
  `

  document.getElementById("finalDoctorId").value = selectedDoctor?.id || ""
  document.getElementById("finalDate").value = formatDateISO(selectedDate)
  document.getElementById("finalStartTime").value = selectedTime || ""
}

// ========================================
// Step Navigation
// ========================================
function nextStep() {
  if (currentStep === 1 && !selectedSpecialty) {
    alert("Veuillez sélectionner une spécialité")
    return
  }

  if (currentStep === 3 && !selectedTime) {
    alert("Veuillez sélectionner une date et une heure")
    return
  }

  if (currentStep < 4) {
    setStep(currentStep + 1)
  }
}

function previousStep() {
  if (currentStep > 1) {
    setStep(currentStep - 1)
  }
}

function setStep(step) {
  currentStep = step

  document.querySelectorAll(".step").forEach((el, index) => {
    el.classList.remove("active", "completed")
    if (index + 1 < currentStep) {
      el.classList.add("completed")
    } else if (index + 1 === currentStep) {
      el.classList.add("active")
    }
  })

  document.querySelectorAll(".step-content").forEach((el, index) => {
    el.classList.remove("active")
    if (index + 1 === currentStep) {
      el.classList.add("active")
    }
  })

  if (currentStep === 2) {
    renderSelectedDoctor()
  } else if (currentStep === 3) {
    renderCalendar()
    renderTimeSlots()
    updateConfirmBtn()
  } else if (currentStep === 4) {
    renderConfirmation()
  }

  window.scrollTo({ top: 0, behavior: "smooth" })
}

// ========================================
// Utility Functions
// ========================================
function formatDateFull(date) {
  if (!date) return ""
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString("fr-FR", options)
}

function showToast(message, type = "info") {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === "error" ? "#ef4444" : type === "success" ? "#10b981" : "#3b82f6"};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease"
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

function formatDateISO(date) {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function escapeHtml(text) {
  if (!text) return ""
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// ========================================
// Edit Mode - Load appointment for editing
// ========================================
function loadEditMode(appointment) {
  let doctor = doctors.find((d) => d.id === appointment.doctorId)

  // Step 1: Select specialty
  selectedSpecialty = appointment.specialty || appointment.doctorSpecialty

  // Step 2: Select doctor (fallback to same specialty or synthetic)
  if (!doctor) {
    let sameSpecialtyDoctor = doctors.find((d) => d.specialty === selectedSpecialty)
    if (!sameSpecialtyDoctor) {
      sameSpecialtyDoctor = doctors.find((d) => d.specialty &&
        d.specialty.toLowerCase().trim() === selectedSpecialty.toLowerCase().trim())
    }
    if (!sameSpecialtyDoctor) {
      sameSpecialtyDoctor = doctors.find((d) => d.specialty &&
        d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase()))
    }

    if (sameSpecialtyDoctor) {
      selectedDoctor = sameSpecialtyDoctor
    } else {
      selectedDoctor = {
        id: appointment.doctorId,
        fullName: appointment.doctorName || "Médecin",
        specialty: selectedSpecialty,
        initials: (appointment.doctorName || "M").split(" ").map(n => n.charAt(0).toUpperCase()).join(""),
        color: "#10b981"
      }
    }
  } else {
    selectedDoctor = doctor
  }

  // Step 3: Date/Time
  if (selectedDoctor) {
    selectedDate = new Date(appointment.appointmentDate + "T00:00:00")
    selectedTime = appointment.startTime

    // Mémoriser la date/heure originales (pour préserver la sélection si on reclique sur le même jour)
    originalEditDateISO = formatDateISO(selectedDate)
    originalEditTime = selectedTime

    // In edit mode, always start with the appointment date
    // The backend will generate availabilities for this date
    console.log("Edit mode: Setting date to appointment date", originalEditDateISO)
    console.log("Edit mode: Setting time to appointment time", originalEditTime)

    // Pre-fill notes if available
    if (appointment.notes) {
      setTimeout(() => {
        const notesField = document.getElementById("notes")
        if (notesField) notesField.value = appointment.notes
      }, 300)
    }

    // UI edit mode
    const formTitle = document.querySelector("#step4 h2")
    if (formTitle) formTitle.textContent = "Modifier votre rendez-vous"

    const finalForm = document.getElementById("finalForm")
    if (finalForm) {
      let editIdInput = document.getElementById("editAppointmentId")
      if (!editIdInput) {
        editIdInput = document.createElement("input")
        editIdInput.type = "hidden"
        editIdInput.name = "editAppointmentId"
        editIdInput.id = "editAppointmentId"
        finalForm.appendChild(editIdInput)
      }
      editIdInput.value = appointment.id

      const submitButton = finalForm.querySelector('button[type="submit"]')
      if (submitButton) {
        submitButton.textContent = "Confirmer la modification"
        submitButton.classList.remove("btn-success")
        submitButton.classList.add("btn-primary")
      }
    }

    // Re-initialize calendar for the appointment date
    initializeCalendar()
    
    setStep(3)
    setTimeout(() => {
      renderCalendar()
      renderTimeSlots()
      updateConfirmBtn()
      const el = document.getElementById("timeSlots")
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 300)
  }
}