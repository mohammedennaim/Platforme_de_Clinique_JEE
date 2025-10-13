// Doctor Dashboard JavaScript - Dynamic Functionality

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard()
  initializeSidebar()
  initializeSearch()
  initializeNotifications()
  initializeTheme()
  initializeStatCounters()
  initializeAppointments()
  initializePatients()
  initializeTasks()
  initializeChart()
  initializeKeyboardShortcuts()
  startRealTimeUpdates()
})

// Dashboard Initialization
function initializeDashboard() {
  console.log("Doctor Dashboard initialized")
  initializeActivityFeed()
  initializeQuickStats()
  showToast("Bienvenue sur votre tableau de bord", "Vos données sont à jour", "success")
}

function initializeSidebar() {
  const sidebar = document.getElementById("sidebar")

  if (sidebar) {
    sidebar.classList.remove("collapsed")
  }

  try {
    localStorage.removeItem("sidebarCollapsed")
  } catch (error) {
    console.warn("Impossible de nettoyer l'état du menu latéral", error)
  }

  // Navigation items with section switching
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()

      // Remove active class from all nav items
      navItems.forEach((nav) => nav.classList.remove("active"))

      // Add active class to clicked item
      item.classList.add("active")

      // Get the section to show
      const section = item.dataset.section

      // Hide all content sections
      document.querySelectorAll(".content-section").forEach((sec) => {
        sec.classList.remove("active")
      })

      // Show the selected section
      const targetSection = document.getElementById(`section-${section}`)
      if (targetSection) {
        targetSection.classList.add("active")

        // Load section-specific data
        loadSectionData(section)

        showToast("Navigation", `Section ${getSectionName(section)} chargée`, "info")
      }
    })
  })
}

function getSectionName(section) {
  const names = {
    dashboard: "Tableau de bord",
    appointments: "Rendez-vous",
    patients: "Patients",
    prescriptions: "Ordonnances",
    consultations: "Consultations",
    schedule: "Emploi du temps",
  }
  return names[section] || section
}

function loadSectionData(section) {
  switch (section) {
    case "appointments":
      loadAllAppointments()
      break
    case "patients":
      loadAllPatients()
      break
    case "prescriptions":
      loadPrescriptions()
      break
    case "consultations":
      loadConsultations()
      break
    case "schedule":
      loadSchedule()
      break
    default:
      // Dashboard is already loaded
      break
  }
}

function loadAllAppointments() {
  const appointments = [
    {
      id: 1,
      time: "09:00",
      period: "AM",
      patient: "Marie Dubois",
      type: "Consultation générale",
      status: "confirmed",
      duration: "30 min",
    },
    {
      id: 2,
      time: "10:30",
      period: "AM",
      patient: "Jean Martin",
      type: "Suivi post-opératoire",
      status: "confirmed",
      duration: "45 min",
    },
    {
      id: 3,
      time: "14:00",
      period: "PM",
      patient: "Sophie Laurent",
      type: "Consultation spécialisée",
      status: "pending",
      duration: "60 min",
    },
    { id: 4, time: "15:30", period: "PM", patient: "Pierre Durand", type: "Contrôle de routine", status: "confirmed" },
    { id: 5, time: "16:30", period: "PM", patient: "Claire Moreau", type: "Consultation générale", status: "pending" },
  ]

  const list = document.getElementById("allAppointmentsList")
  if (!list) return

  list.innerHTML = appointments
    .map(
      (apt) => `
    <div class="appointment-item" data-id="${apt.id}">
      <div class="appointment-time">
        <div class="appointment-hour">${apt.time}</div>
        <div class="appointment-period">${apt.period}</div>
      </div>
      <div class="appointment-details">
        <div class="appointment-patient">${apt.patient}</div>
        <div class="appointment-type">${apt.type} • ${apt.duration}</div>
      </div>
      <span class="appointment-status ${apt.status}">
        ${apt.status === "confirmed" ? "Confirmé" : "En attente"}
      </span>
    </div>
  `,
    )
    .join("")
}

function loadAllPatients() {
  const patients = [
    { id: 1, name: "Marie Dubois", age: 45, lastVisit: "Il y a 2 jours", initials: "MD", condition: "Suivi régulier" },
    {
      id: 2,
      name: "Jean Martin",
      age: 62,
      lastVisit: "Il y a 1 semaine",
      initials: "JM",
      condition: "Post-opératoire",
    },
    { id: 3, name: "Sophie Laurent", age: 34, lastVisit: "Il y a 3 jours", initials: "SL", condition: "Consultation" },
    { id: 4, name: "Pierre Durand", age: 28, lastVisit: "Aujourd'hui", initials: "PD" },
    { id: 5, name: "Claire Moreau", age: 52, lastVisit: "Il y a 5 jours", initials: "CM" },
    { id: 6, name: "Thomas Bernard", age: 38, lastVisit: "Il y a 1 semaine", initials: "TB" },
  ]

  const list = document.getElementById("allPatientsList")
  if (!list) return

  list.innerHTML = patients
    .map(
      (patient) => `
    <div class="patient-item" data-id="${patient.id}">
      <div class="patient-avatar">${patient.initials}</div>
      <div class="patient-info">
        <div class="patient-name">${patient.name}</div>
        <div class="patient-meta">${patient.age} ans • Dernière visite: ${patient.lastVisit}</div>
      </div>
      <button class="patient-action">Voir dossier</button>
    </div>
  `,
    )
    .join("")
}

// Search Functionality
function initializeSearch() {
  const searchInput = document.getElementById("searchInput")
  let searchTimeout

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout)
    const query = e.target.value.trim()

    if (query.length > 0) {
      searchTimeout = setTimeout(() => {
        performSearch(query)
      }, 300)
    }
  })
}

function performSearch(query) {
  console.log(`Searching for: ${query}`)
  // Simulate search results
  showToast("Recherche", `Recherche de "${query}"...`, "info")
}

// Notifications System
function initializeNotifications() {
  const notificationBtn = document.getElementById("notificationBtn")
  const notificationDropdown = document.getElementById("notificationDropdown")
  const notificationList = document.getElementById("notificationList")

  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: "info",
      title: "Nouveau rendez-vous",
      message: "Marie Dubois a pris rendez-vous pour demain à 10h",
      time: "Il y a 5 minutes",
      unread: true,
    },
    {
      id: 2,
      type: "success",
      title: "Consultation terminée",
      message: "La consultation avec Jean Martin est terminée",
      time: "Il y a 1 heure",
      unread: true,
    },
    {
      id: 3,
      type: "warning",
      title: "Rappel",
      message: "N'oubliez pas de remplir le rapport médical",
      time: "Il y a 2 heures",
      unread: false,
    },
  ]

  renderNotifications(notifications)

  notificationBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    notificationDropdown.classList.toggle("active")
  })

  document.addEventListener("click", (e) => {
    if (!notificationDropdown.contains(e.target) && e.target !== notificationBtn) {
      notificationDropdown.classList.remove("active")
    }
  })
}

function renderNotifications(notifications) {
  const notificationList = document.getElementById("notificationList")
  const notificationBadge = document.getElementById("notificationBadge")

  const unreadCount = notifications.filter((n) => n.unread).length
  notificationBadge.textContent = unreadCount
  notificationBadge.style.display = unreadCount > 0 ? "block" : "none"

  notificationList.innerHTML = notifications
    .map(
      (notification) => `
        <div class="notification-item ${notification.unread ? "unread" : ""}" data-id="${notification.id}">
            <div class="notification-icon ${notification.type}">
                ${getNotificationIcon(notification.type)}
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        </div>
    `,
    )
    .join("")
}

function getNotificationIcon(type) {
  const icons = {
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    success:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    warning:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  }
  return icons[type] || icons.info
}

// Theme Toggle
function initializeTheme() {
  const themeToggle = document.getElementById("themeToggle")
  const currentTheme = localStorage.getItem("theme") || "light"

  document.documentElement.setAttribute("data-theme", currentTheme)

  themeToggle.addEventListener("click", () => {
    const theme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
    showToast("Thème", `Mode ${theme === "dark" ? "sombre" : "clair"} activé`, "info")
  })
}

// Animated Stat Counters
function initializeStatCounters() {
  const statValues = document.querySelectorAll(".stat-value")
  const progressBars = document.querySelectorAll(".stat-progress-bar")

  statValues.forEach((stat) => {
    const target = Number.parseInt(stat.dataset.target)
    animateCounter(stat, 0, target, 2000)
  })

  // Animate progress bars
  setTimeout(() => {
    progressBars.forEach((bar) => {
      const progress = bar.dataset.progress
      bar.style.width = `${progress}%`
    })
  }, 500)
}

function animateCounter(element, start, end, duration) {
  const range = end - start
  const increment = range / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= end) {
      element.textContent = end
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16)
}

// Appointments Management
function initializeAppointments() {
  const appointments = [
    {
      id: 1,
      time: "09:00",
      period: "AM",
      patient: "Marie Dubois",
      type: "Consultation générale",
      status: "confirmed",
      duration: "30 min",
    },
    {
      id: 2,
      time: "10:30",
      period: "AM",
      patient: "Jean Martin",
      type: "Suivi post-opératoire",
      status: "confirmed",
      duration: "45 min",
    },
    {
      id: 3,
      time: "14:00",
      period: "PM",
      patient: "Sophie Laurent",
      type: "Consultation spécialisée",
      status: "pending",
      duration: "60 min",
    },
  ]

  renderAppointments(appointments)
}

function renderAppointments(appointments) {
  const list = document.getElementById("appointmentsList")
  if (!list) return

  list.innerHTML = appointments
    .map(
      (apt) => `
    <div class="appointment-item" data-id="${apt.id}">
      <div class="appointment-time">
        <div class="appointment-hour">${apt.time}</div>
        <div class="appointment-period">${apt.period}</div>
      </div>
      <div class="appointment-details">
        <div class="appointment-patient">${apt.patient}</div>
        <div class="appointment-type">${apt.type} • ${apt.duration}</div>
      </div>
      <span class="appointment-status ${apt.status}">
        ${apt.status === "confirmed" ? "Confirmé" : "En attente"}
      </span>
    </div>
  `,
    )
    .join("")
}

// Patients Management
function initializePatients() {
  const patients = [
    { id: 1, name: "Marie Dubois", age: 45, lastVisit: "Il y a 2 jours", initials: "MD", condition: "Suivi régulier" },
    {
      id: 2,
      name: "Jean Martin",
      age: 62,
      lastVisit: "Il y a 1 semaine",
      initials: "JM",
      condition: "Post-opératoire",
    },
    {
      id: 3,
      name: "Sophie Laurent",
      age: 34,
      lastVisit: "Il y a 3 jours",
      initials: "SL",
      condition: "Consultation",
    },
  ]

  renderPatients(patients)
}

function renderPatients(patients) {
  const list = document.getElementById("patientsList")
  if (!list) return

  list.innerHTML = patients
    .map(
      (patient) => `
    <div class="patient-item" data-id="${patient.id}">
      <div class="patient-avatar">${patient.initials}</div>
      <div class="patient-info">
        <div class="patient-name">${patient.name}</div>
        <div class="patient-meta">${patient.age} ans • ${patient.lastVisit}</div>
      </div>
      <button class="patient-action">Voir dossier</button>
    </div>
  `,
    )
    .join("")
}

// Tasks Management
function initializeTasks() {
  const tasks = [
    {
      id: 1,
      title: "Remplir le rapport médical",
      description: "Patient: Marie Dubois",
    },
    {
      id: 2,
      title: "Renouveler l'ordonnance",
      description: "Patient: Jean Martin",
    },
    {
      id: 3,
      title: "Appeler le laboratoire",
      description: "Résultats d'analyses en attente",
    },
    {
      id: 4,
      title: "Préparer la présentation",
      description: "Conférence médicale vendredi",
    },
    {
      id: 5,
      title: "Vérifier les stocks",
      description: "Matériel médical à commander",
    },
  ]

  renderTasks(tasks)
}

function renderTasks(tasks) {
  const tasksList = document.getElementById("tasksList")
  const taskCount = document.getElementById("taskCount")

  taskCount.textContent = tasks.length

  tasksList.innerHTML = tasks
    .map(
      (task) => `
        <div class="task-item" data-id="${task.id}">
            <div class="task-checkbox"></div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Chart Initialization (Simple bar chart simulation)
function initializeChart() {
  const canvas = document.getElementById("activityChart")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  // Sample data
  const data = [8, 12, 10, 15, 9, 14, 11]
  const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
  const max = Math.max(...data)

  const barWidth = canvas.width / data.length
  const padding = 40

  // Draw bars
  data.forEach((value, index) => {
    const barHeight = (value / max) * (canvas.height - padding * 2)
    const x = index * barWidth + barWidth * 0.2
    const y = canvas.height - padding - barHeight

    // Gradient
    const gradient = ctx.createLinearGradient(0, y, 0, canvas.height - padding)
    gradient.addColorStop(0, "#3b82f6")
    gradient.addColorStop(1, "#8b5cf6")

    ctx.fillStyle = gradient
    ctx.fillRect(x, y, barWidth * 0.6, barHeight)

    // Labels
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(labels[index], x + barWidth * 0.3, canvas.height - 20)
    ctx.fillText(value, x + barWidth * 0.3, y - 10)
  })
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      document.getElementById("searchInput").focus()
    }

    // Ctrl/Cmd + N for notifications
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault()
      document.getElementById("notificationBtn").click()
    }
  })
}

// Real-time Updates
function startRealTimeUpdates() {
  // Simulate real-time updates every 30 seconds
  setInterval(() => {
    updateStatistics()
  }, 30000)
}

function updateStatistics() {
  const statValues = document.querySelectorAll(".stat-value")
  statValues.forEach((stat) => {
    const current = Number.parseInt(stat.textContent)
    const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
    const newValue = Math.max(0, current + change)

    if (change !== 0) {
      animateCounter(stat, current, newValue, 500)
    }
  })
}

// Toast Notification System
function showToast(title, message, type = "info") {
  const toastContainer = document.getElementById("toastContainer")
  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  const icon = getToastIcon(type)

  toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `

  toastContainer.appendChild(toast)

  // Close button
  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.remove()
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s ease reverse"
    setTimeout(() => toast.remove(), 300)
  }, 5000)
}

function getToastIcon(type) {
  const icons = {
    success:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="16 8 10 14 8 12"></polyline></svg>',
    error:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  }
  return icons[type] || icons.info
}

function loadPrescriptions() {
  const prescriptions = [
    { id: 1, patient: "Marie Dubois", date: "15 Jan 2025", medications: "Paracétamol 500mg, Ibuprofène 400mg" },
    { id: 2, patient: "Jean Martin", date: "14 Jan 2025", medications: "Amoxicilline 1g, Doliprane 1000mg" },
    { id: 3, patient: "Sophie Laurent", date: "13 Jan 2025", medications: "Aspirine 100mg" },
    { id: 4, patient: "Pierre Durand", date: "12 Jan 2025", medications: "Vitamine D, Calcium" },
  ]

  const list = document.getElementById("prescriptionsList")
  if (!list) return

  list.innerHTML = prescriptions
    .map(
      (presc) => `
    <div class="prescription-item" data-id="${presc.id}">
      <div class="prescription-info">
        <div class="prescription-patient">${presc.patient}</div>
        <div class="prescription-date">${presc.date}</div>
        <div class="prescription-medications">${presc.medications}</div>
      </div>
      <div class="prescription-actions">
        <button class="btn btn-secondary">Voir</button>
        <button class="btn btn-primary">Imprimer</button>
      </div>
    </div>
  `,
    )
    .join("")
}

function loadConsultations() {
  const consultations = [
    {
      id: 1,
      day: "15",
      month: "Jan",
      patient: "Marie Dubois",
      type: "Consultation générale",
      notes: "Contrôle de routine",
      status: "completed",
    },
    {
      id: 2,
      day: "14",
      month: "Jan",
      patient: "Jean Martin",
      type: "Suivi post-opératoire",
      notes: "Évolution favorable",
      status: "completed",
    },
    {
      id: 3,
      day: "13",
      month: "Jan",
      patient: "Sophie Laurent",
      type: "Consultation spécialisée",
      notes: "Examens complémentaires",
      status: "in-progress",
    },
    {
      id: 4,
      day: "12",
      month: "Jan",
      patient: "Pierre Durand",
      type: "Contrôle de routine",
      notes: "Bilan de santé",
      status: "completed",
    },
  ]

  const list = document.getElementById("consultationsList")
  if (!list) return

  list.innerHTML = consultations
    .map(
      (cons) => `
    <div class="consultation-item" data-id="${cons.id}">
      <div class="consultation-date">
        <div class="consultation-day">${cons.day}</div>
        <div class="consultation-month">${cons.month}</div>
      </div>
      <div class="consultation-details">
        <div class="consultation-patient">${cons.patient}</div>
        <div class="consultation-type">${cons.type}</div>
        <div class="consultation-notes">${cons.notes}</div>
      </div>
      <span class="consultation-status ${cons.status}">
        ${cons.status === "completed" ? "Terminée" : "En cours"}
      </span>
    </div>
  `,
    )
    .join("")
}

function loadSchedule() {
  const calendar = document.getElementById("scheduleCalendar")
  if (!calendar) return

  calendar.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 1rem; color: var(--primary);">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <h3 style="margin-bottom: 0.5rem;">Calendrier hebdomadaire</h3>
      <p style="color: var(--text-secondary);">Votre emploi du temps pour la semaine</p>
    </div>
  `
}

// Activity Feed Initialization
function initializeActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "consultation",
      icon: "👨‍⚕️",
      title: "Consultation terminée",
      description: "Marie Dubois - Consultation générale",
      time: "Il y a 15 minutes",
    },
    {
      id: 2,
      type: "patient",
      icon: "👤",
      title: "Nouveau patient enregistré",
      description: "Thomas Bernard ajouté au système",
      time: "Il y a 1 heure",
    },
    {
      id: 3,
      type: "prescription",
      icon: "💊",
      title: "Ordonnance créée",
      description: "Jean Martin - Antibiotiques prescrits",
      time: "Il y a 2 heures",
    },
    {
      id: 4,
      type: "appointment",
      icon: "📅",
      title: "Rendez-vous confirmé",
      description: "Sophie Laurent - Demain à 10h00",
      time: "Il y a 3 heures",
    },
    {
      id: 5,
      type: "consultation",
      icon: "👨‍⚕️",
      title: "Rapport médical complété",
      description: "Pierre Durand - Bilan de santé",
      time: "Il y a 4 heures",
    },
  ]

  renderActivityFeed(activities)
}

function renderActivityFeed(activities) {
  const list = document.getElementById("activityList")
  if (!list) return

  list.innerHTML = activities
    .map(
      (activity) => `
    <div class="activity-item" data-id="${activity.id}">
      <div class="activity-icon ${activity.type}">
        ${activity.icon}
      </div>
      <div class="activity-content">
        <div class="activity-title">${activity.title}</div>
        <div class="activity-description">${activity.description}</div>
        <div class="activity-time">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${activity.time}
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

// Quick Stats Initialization
function initializeQuickStats() {
  const stats = [
    {
      id: 1,
      icon: "blue",
      iconSvg:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      value: "98%",
      label: "Taux de satisfaction",
      trend: "up",
      trendValue: "+2%",
    },
    {
      id: 2,
      icon: "green",
      iconSvg:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg>',
      value: "156",
      label: "Consultations ce mois",
      trend: "up",
      trendValue: "+12%",
    },
    {
      id: 3,
      icon: "purple",
      iconSvg:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      value: "24.5k€",
      label: "Revenus ce mois",
      trend: "up",
      trendValue: "+8%",
    },
    {
      id: 4,
      icon: "orange",
      iconSvg:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
      value: "4.2",
      label: "Note moyenne",
      trend: "up",
      trendValue: "+0.3",
    },
  ]

  renderQuickStats(stats)
}

function renderQuickStats(stats) {
  const grid = document.getElementById("quickStatsGrid")
  if (!grid) return

  grid.innerHTML = stats
    .map(
      (stat) => `
    <div class="quick-stat-item" data-id="${stat.id}">
      <div class="quick-stat-header">
        <div class="quick-stat-icon ${stat.icon}">
          ${stat.iconSvg}
        </div>
        <span class="quick-stat-trend ${stat.trend}">
          ${stat.trendValue}
        </span>
      </div>
      <div class="quick-stat-value">${stat.value}</div>
      <div class="quick-stat-label">${stat.label}</div>
    </div>
  `,
    )
    .join("")
}
