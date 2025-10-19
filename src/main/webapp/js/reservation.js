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

const shortDayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

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
    // Load appointment data from sessionStorage
    const editData = sessionStorage.getItem("editingAppointment")
    if (editData) {
      const appointment = JSON.parse(editData)
      setTimeout(() => {
        loadEditMode(appointment)
      }, 100)
    }
  } else {
    // Check for URL parameters to pre-select doctor
    const doctorId = urlParams.get("doctorId")
    const specialty = urlParams.get("specialty")

    if (doctorId && specialty) {
      // Auto-select specialty and doctor from URL parameters
      setTimeout(() => {
        autoSelectFromUrl(specialty, Number.parseInt(doctorId))
      }, 100)
    }
  }

  // Check if we have a success message (appointment was updated)
  const successMessage = document.querySelector(".success-message, .alert-success")
  if (successMessage && successMessage.textContent.includes("modifié")) {
    // Appointment was successfully updated, reset form after a delay
    setTimeout(() => {
      resetToCreationMode()
    }, 3000)
  }
})

// ========================================
// Auto-select Specialty and Doctor from URL
// ========================================
function autoSelectFromUrl(specialtyName, doctorId) {
  // Step 1: Select specialty
  selectedSpecialty = specialtyName

  // Step 2: Select doctor
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

// Function to reset form to creation mode
function resetToCreationMode() {
  // Clear edit appointment ID
  const editIdInput = document.getElementById("editAppointmentId")
  if (editIdInput) {
    editIdInput.remove()
  }

  // Reset form title
  const formTitle = document.querySelector("#step4 h2")
  if (formTitle) {
    formTitle.textContent = "Récapitulatif de votre rendez-vous"
  }

  // Reset submit button
  const finalForm = document.getElementById("finalForm")
  if (finalForm) {
    const submitButton = finalForm.querySelector('button[type="submit"]')
    if (submitButton) {
      submitButton.textContent = "Confirmer la réservation"
      submitButton.classList.remove("btn-primary")
      submitButton.classList.add("btn-success")
    }
  }

  // Clear session storage
  sessionStorage.removeItem("editingAppointment")

  // Reset selections
  selectedSpecialty = null
  selectedDoctor = null
  selectedDate = null
  selectedTime = null

  // Go back to step 1
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
    const availabilityTimeSlotsEl = document.getElementById("availabilityTimeSlotsData")

    if (doctorsEl && doctorsEl.textContent.trim()) {
      doctors = JSON.parse(doctorsEl.textContent.trim())
    }

    if (availabilityEl && availabilityEl.textContent.trim()) {
      availabilities = JSON.parse(availabilityEl.textContent.trim())
    }

    if (appointmentsEl && appointmentsEl.textContent.trim()) {
      appointments = JSON.parse(appointmentsEl.textContent.trim())
    }

    if (nextAvailabilitiesEl && nextAvailabilitiesEl.textContent.trim()) {
      nextAvailabilitiesWithSlots = JSON.parse(nextAvailabilitiesEl.textContent.trim())
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

  const specialties = [...new Set(doctors.map((d) => d.specialty))].sort()

  if (specialties.length === 0) {
    container.innerHTML = '<p class="placeholder">Aucune spécialité disponible</p>'
    return
  }

  container.innerHTML = specialties
    .map(
      (specialty) => `
    <div class="specialty-card" onclick="selectSpecialty('${escapeHtml(specialty)}')">
      <div class="specialty-icon">${specialtyIcons[specialty] || "🏥"}</div>
      <div class="specialty-name">${escapeHtml(specialty)}</div>
    </div>
  `,
    )
    .join("")
}

function selectSpecialty(specialty) {
  selectedSpecialty = specialty

  const filteredDoctors = doctors.filter((d) => d.specialty === specialty)

  if (filteredDoctors.length === 0) {
    alert("Aucun médecin disponible pour cette spécialité")
    return
  }

  // Random selection
  selectedDoctor = filteredDoctors[Math.floor(Math.random() * filteredDoctors.length)]
  nextStep()
}

// ========================================
// Step 2: Display Selected Doctor
// ========================================
function renderSelectedDoctor() {
  const container = document.getElementById("selectedDoctor")
  if (!container || !selectedDoctor) return

  const initials = getInitials(selectedDoctor.firstName, selectedDoctor.lastName)

  container.innerHTML = `
    <div class="doctor-avatar">${escapeHtml(initials)}</div>
    <div class="doctor-info">
      <h3>${escapeHtml(selectedDoctor.fullName)}</h3>
      <p>${escapeHtml(selectedDoctor.specialty)}</p>
    </div>
  `
}

function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : ""
  const last = lastName ? lastName.charAt(0).toUpperCase() : ""
  return first + last
}

// ========================================
// Step 3: Calendar & Time Slots
// ========================================
function initializeCalendar() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dayOfWeek = today.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  currentWeekStart = new Date(today)
  currentWeekStart.setDate(today.getDate() + diff)
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

  let html = ""
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart)
    date.setDate(currentWeekStart.getDate() + i)

    const dayOfWeek = date.getDay()
    const isPast = date < today
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Vérifier si le patient a déjà un RDV ce jour-là dans la MÊME spécialité
    const dateISO = formatDateISO(date)
    const hasAppointmentInSameSpecialty = selectedDoctor
      ? appointments.some((apt) => {
          if (apt.status === "CANCELED") return false
          const aptDate = apt.start ? apt.start.split("T")[0] : null
          // Bloquer seulement si c'est la même spécialité que le médecin sélectionné
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
  selectedDate = new Date(dateStr)
  selectedTime = null

  renderCalendar()
  renderTimeSlots()

  document.getElementById("confirmTimeBtn").disabled = true
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

  // Check if we're in edit mode
  const urlParams = new URLSearchParams(window.location.search)
  const editId = urlParams.get("edit")

  if (editId) {
    const defaultSlots = generateDefaultTimeSlots()
    if (defaultSlots.length > 0) {
      renderTimeSlotsGrid(defaultSlots, container)
      return
    }
  }

  // Vérifier si le patient a déjà un rendez-vous sur cette date dans la MÊME spécialité
  const hasAppointmentInSameSpecialty = appointments.some((apt) => {
    if (apt.status === "CANCELED") return false
    const aptDate = apt.start ? apt.start.split("T")[0] : null
    return aptDate === selectedDateISO && apt.doctorSpecialty === selectedDoctor.specialty
  })

  // Si le patient a déjà un RDV dans la même spécialité, afficher un message
  if (hasAppointmentInSameSpecialty) {
    container.innerHTML = `<p class="placeholder">Vous avez déjà un rendez-vous en ${selectedDoctor.specialty} prévu ce jour-là</p>`
    return
  }

  // Chercher les time slots depuis le backend pour ce médecin et cette date
  const availabilityData = nextAvailabilitiesWithSlots.find((avail) => {
    return String(avail.doctorId) === String(selectedDoctor.id) && avail.availabilityDate === selectedDateISO
  })

  if (!availabilityData || !availabilityData.timeSlots || availabilityData.timeSlots.length === 0) {
    container.innerHTML = '<p class="placeholder">Aucun créneau disponible pour cette date</p>'
    return
  }

  // Filtrer les créneaux déjà réservés
  const availableSlots = availabilityData.timeSlots.filter((timeSlot) => {
    return !isTimeSlotBooked(selectedDate, timeSlot)
  })

  if (availableSlots.length === 0) {
    container.innerHTML = '<p class="placeholder">Tous les créneaux sont réservés pour cette date</p>'
    return
  }

  renderTimeSlotsGrid(availableSlots, container)
}

function generateDefaultTimeSlots() {
  const slots = []
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      slots.push(timeString)
    }
  }
  return slots
}

function renderTimeSlotsGrid(timeSlots, container) {
  container.innerHTML = `
    <div class="time-slots-grid">
      ${timeSlots
        .map((timeSlot) => {
          const classes = ["time-slot"]
          if (selectedTime === timeSlot) classes.push("selected")

          return `
          <div class="${classes.join(" ")}" onclick="selectTime('${timeSlot}')">
            ${timeSlot}
          </div>
        `
        })
        .join("")}
    </div>
  `
}

function isWithinBookingWindow(date, time) {
  const now = new Date()
  const slotDateTime = new Date(date)
  const [hours, minutes] = time.split(":").map(Number)
  slotDateTime.setHours(hours, minutes, 0, 0)

  // Vérifier seulement si le créneau est dans le futur
  return slotDateTime > now
}

function isTimeSlotBooked(date, time) {
  const dateStr = formatDateISO(date)

  return appointments.some((apt) => {
    if (String(apt.doctorId) !== String(selectedDoctor.id)) return false
    if (apt.status === "CANCELED") return false

    const aptStart = apt.start ? apt.start.substring(0, 10) : ""
    const aptTime = apt.start ? apt.start.substring(11, 16) : ""

    // Check if appointment overlaps with slot (including 5-minute break)
    if (aptStart === dateStr) {
      const [aptHour, aptMin] = aptTime.split(":").map(Number)
      const [slotHour, slotMin] = time.split(":").map(Number)

      const aptStartMinutes = aptHour * 60 + aptMin
      const slotStartMinutes = slotHour * 60 + slotMin
      const slotEndMinutes = slotStartMinutes + APPOINTMENT_DURATION

      // Check overlap
      return slotStartMinutes < aptStartMinutes + APPOINTMENT_DURATION && slotEndMinutes > aptStartMinutes
    }

    return false
  })
}

function selectTime(time) {
  selectedTime = time
  renderTimeSlots()

  document.getElementById("confirmTimeBtn").disabled = false
}

function previousWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7)
  selectedDate = null
  selectedTime = null
  renderCalendar()
  document.getElementById("timeSlots").innerHTML =
    '<p class="placeholder">Sélectionnez une date pour voir les créneaux disponibles</p>'
  document.getElementById("confirmTimeBtn").disabled = true
}

function nextWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7)
  selectedDate = null
  selectedTime = null
  renderCalendar()
  document.getElementById("timeSlots").innerHTML =
    '<p class="placeholder">Sélectionnez une date pour voir les créneaux disponibles</p>'
  document.getElementById("confirmTimeBtn").disabled = true
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
      <span class="detail-value">Dr. ${escapeHtml(selectedDoctor?.firstName || "")} ${escapeHtml(selectedDoctor?.lastName || "")}</span>
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

// ========================================
// Edit Mode - Load appointment for editing
// ========================================
function loadEditMode(appointment) {
  // This ensures the doctor is always available for editing, even if inactive
  let doctor = doctors.find((d) => d.id === appointment.doctorId)

  if (!doctor && appointment.doctorName && appointment.doctorSpecialty) {
    // Create a synthetic doctor entry from appointment data
    doctor = {
      id: appointment.doctorId,
      fullName: appointment.doctorName,
      firstName: appointment.doctorName.split(" ")[0] || "",
      lastName: appointment.doctorName.split(" ").slice(1).join(" ") || "",
      specialty: appointment.doctorSpecialty,
      initials: appointment.doctorName
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .join(""),
      color: "#10b981", // Default color
    }
    // Add the synthetic doctor to the list
    doctors.push(doctor)
    renderSpecialties()
  }

  // Step 1: Select specialty
  selectedSpecialty = appointment.specialty || appointment.doctorSpecialty

  // Step 2: Select doctor
  if (!doctor) {
    const sameSpecialtyDoctor = doctors.find((d) => d.specialty === selectedSpecialty)
    if (sameSpecialtyDoctor) {
      selectedDoctor = sameSpecialtyDoctor
      showToast(
        "Le médecin original n'est plus disponible. Un médecin de la même spécialité a été sélectionné.",
        "warning",
      )
    } else {
      showToast(
        "Aucun médecin disponible pour cette spécialité. Veuillez sélectionner une nouvelle spécialité.",
        "error",
      )
      // Go back to step 1 to let user select specialty and doctor
      setStep(1)
      return
    }
  } else {
    selectedDoctor = doctor
  }

  // Step 3: Select date and time (only if we have a valid doctor)
  if (selectedDoctor) {
    selectedDate = new Date(appointment.appointmentDate + "T00:00:00")
    selectedTime = appointment.startTime

    // Pre-fill notes if available
    if (appointment.notes) {
      setTimeout(() => {
        const notesField = document.getElementById("notes")
        if (notesField) {
          notesField.value = appointment.notes
        }
      }, 500)
    }

    // Update form to show we're editing
    const formTitle = document.querySelector("#step4 h2")
    if (formTitle) {
      formTitle.textContent = "Modifier votre rendez-vous"
    }

    // Add hidden field for appointment ID to track editing
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

      // Update submit button text for editing mode
      const submitButton = finalForm.querySelector('button[type="submit"]')
      if (submitButton) {
        submitButton.textContent = "Confirmer la modification"
        submitButton.classList.remove("btn-success")
        submitButton.classList.add("btn-primary")
      }
    }

    // Go to step 3 (calendar) to allow changing date/time
    setStep(3)

    setTimeout(() => {
      const el = document.getElementById("timeSlots")
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 300)
  }
}

function showToast(message, type = "info") {
  // Create toast notification
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
