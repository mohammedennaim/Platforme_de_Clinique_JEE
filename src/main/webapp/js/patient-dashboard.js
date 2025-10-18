// DOM Elements
const sidebar = document.getElementById("sidebar")
const sidebarToggle = document.getElementById("sidebarToggle")
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const navItems = document.querySelectorAll(".nav-item")
const contentSections = document.querySelectorAll(".content-section")
const pageTitle = document.querySelector(".page-title")
const notificationBtn = document.getElementById("notificationBtn")
const notificationDropdown = document.getElementById("notificationDropdown")
const searchInput = document.getElementById("searchInput")

// Navigation
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault()

    // Remove active class from all nav items
    navItems.forEach((nav) => nav.classList.remove("active"))

    // Add active class to clicked item
    item.classList.add("active")

    // Get section to show
    const sectionId = item.getAttribute("data-section")

    // Hide all sections
    contentSections.forEach((section) => section.classList.remove("active"))

    // Show selected section
    const targetSection = document.getElementById(`section-${sectionId}`)
    if (targetSection) {
      targetSection.classList.add("active")
    }

    // Update page title
    const sectionTitle = item.querySelector("span").textContent
    pageTitle.textContent = sectionTitle

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active")
    }
  })
})

// Mobile menu toggle
mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active")
})

// Sidebar toggle
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed")
})

// Notification dropdown
notificationBtn.addEventListener("click", (e) => {
  e.stopPropagation()
  notificationDropdown.classList.toggle("active")
})

// Close notification dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
    notificationDropdown.classList.remove("active")
  }
})

// Animated counter for stats
function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      element.textContent = target
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16)
}

// Update stats with real data
function updateStats() {
  // Count only PLANNED/CONFIRMED appointments for "Rendez-vous à venir"
  const upcomingCount = (window.appointmentsData || [])
    .filter(apt => apt.status === "PLANNED" || apt.status === "CONFIRMED")
    .length;
  
  // Count ALL appointments (PLANNED, CANCELED, DONE) for "Consultations totales"
  const totalCount = (window.appointmentsData || []).length;
  
  // Update stat cards with real counts
  const statValues = document.querySelectorAll(".stat-value");
  if (statValues.length > 0) {
    statValues[0].setAttribute("data-target", upcomingCount); // Rendez-vous à venir
  }
  if (statValues.length > 2) {
    statValues[2].setAttribute("data-target", totalCount); // Consultations totales
  }
}

// Animate all stat counters on page load
document.addEventListener("DOMContentLoaded", () => {
  // Update stats with real data first
  updateStats();
  
  const statValues = document.querySelectorAll(".stat-value")
  statValues.forEach((stat) => animateCounter(stat))

  // Load dynamic content
  loadUpcomingAppointments()
  loadRecentActivity()
  loadHealthMetrics()
  loadAppointments()
  loadMedicalRecords()
  loadPrescriptions()
  loadDoctors()
})

// Load upcoming appointments
function loadUpcomingAppointments() {
  const container = document.getElementById("upcomingAppointments")
  
  // Filter out cancelled appointments - show all upcoming appointments
  const appointments = (window.appointmentsData || [])
    .filter(apt => apt.status !== "CANCELED" && apt.status !== "CANCELLED")
    .map(apt => {
    const startDate = new Date(apt.start);
    const endDate = new Date(apt.end);
    
    // Déterminer le statut en français
    let statusText = "En attente";
    let statusClass = "pending";
    
    if (apt.status === "CONFIRMED") {
      statusText = "Confirmé";
      statusClass = "confirmed";
    } else if (apt.status === "COMPLETED" || apt.status === "DONE") {
      statusText = "Terminé";
      statusClass = "completed";
    } else if (apt.status === "PLANNED") {
      statusText = "Planifié";
      statusClass = "pending";
    }
    
    return {
      day: startDate.getDate().toString().padStart(2, '0'),
      month: startDate.toLocaleDateString('fr-FR', { month: 'short' }),
      title: apt.appointmentType || "Consultation",
      doctor: apt.doctorName || "Médecin",
      time: `${startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      status: apt.status || "PENDING",
      statusText: statusText,
      statusClass: statusClass
    };
  })

  container.innerHTML = appointments
    .map(
      (apt) => `
        <div class="appointment-item">
            <div class="appointment-date">
                <span class="appointment-day">${apt.day}</span>
                <span class="appointment-month">${apt.month}</span>
            </div>
            <div class="appointment-details">
                <div class="appointment-title">${apt.title}</div>
                <div class="appointment-doctor">${apt.doctor}</div>
                <div class="appointment-time">${apt.time}</div>
            </div>
            <span class="appointment-status ${apt.statusClass}">
                ${apt.statusText}
            </span>
        </div>
    `,
    )
    .join("")
}

// Load recent activity
function loadRecentActivity() {
  const container = document.getElementById("recentActivity")
  const activities = [
    {
      icon: "success",
      text: "Rendez-vous confirmé avec Dr. Martin",
      time: "Il y a 5 minutes",
    },
    {
      icon: "info",
      text: "Nouvelle ordonnance ajoutée",
      time: "Il y a 1 heure",
    },
    {
      icon: "warning",
      text: "Rappel: Rendez-vous demain",
      time: "Il y a 3 heures",
    },
    {
      icon: "success",
      text: "Résultats d'analyse disponibles",
      time: "Il y a 1 jour",
    },
  ]

  container.innerHTML = activities
    .map(
      (activity) => `
        <div class="activity-item">
            <div class="activity-icon ${activity.icon}">
                ${getActivityIcon(activity.icon)}
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Get activity icon SVG
function getActivityIcon(type) {
  const icons = {
    success:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    warning:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  }
  return icons[type] || icons.info
}

// Load health metrics
function loadHealthMetrics() {
  const container = document.getElementById("healthMetrics")
  const metrics = [
    {
      label: "Tension artérielle",
      value: "120/80",
      status: "normal",
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      label: "Fréquence cardiaque",
      value: "72 bpm",
      status: "normal",
      color: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    },
    {
      label: "Température",
      value: "36.8°C",
      status: "normal",
      color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      label: "Poids",
      value: "68 kg",
      status: "normal",
      color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
  ]

  container.innerHTML = metrics
    .map(
      (metric) => `
        <div class="health-metric-item">
            <div class="health-metric-info">
                <div class="health-metric-icon" style="background: ${metric.color};">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                </div>
                <div>
                    <div class="health-metric-label">${metric.label}</div>
                    <div class="health-metric-value">${metric.value}</div>
                </div>
            </div>
            <span class="health-metric-status ${metric.status}">Normal</span>
        </div>
    `,
    )
    .join("")
}

// Load appointments for appointments section
function loadAppointments() {
  const container = document.getElementById("appointmentsGrid")
  
  // Use real appointments data from backend
  const appointments = (window.appointmentsData || []).map(apt => {
    const startDate = new Date(apt.start);
    const endDate = new Date(apt.end);
    
    // Déterminer le statut en français
    let statusText = "En attente";
    let statusClass = "pending";
    
    if (apt.status === "CONFIRMED") {
      statusText = "Confirmé";
      statusClass = "confirmed";
    } else if (apt.status === "CANCELED") {
      statusText = "Annulé";
      statusClass = "cancelled";
    } else if (apt.status === "COMPLETED" || apt.status === "DONE") {
      statusText = "Terminé";
      statusClass = "completed";
    } else if (apt.status === "PLANNED") {
      statusText = "Planifié";
      statusClass = "pending";
    }
    
    return {
      day: startDate.getDate().toString().padStart(2, '0'),
      month: startDate.toLocaleDateString('fr-FR', { month: 'short' }),
      title: apt.appointmentType || "Consultation",
      doctor: apt.doctorName || "Médecin",
      specialty: apt.doctorSpecialty || "Spécialité",
      time: `${startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      status: apt.status || "PENDING",
      statusText: statusText,
      statusClass: statusClass
    };
  })

  container.innerHTML = appointments
    .map(
      (apt) => `
        <div class="dashboard-card">
            <div class="appointment-item">
                <div class="appointment-date">
                    <span class="appointment-day">${apt.day}</span>
                    <span class="appointment-month">${apt.month}</span>
                </div>
                <div class="appointment-details">
                    <div class="appointment-title">${apt.title}</div>
                    <div class="appointment-doctor">${apt.doctor} - ${apt.specialty}</div>
                    <div class="appointment-time">${apt.time}</div>
                </div>
                <span class="appointment-status ${apt.statusClass}">
                    ${apt.statusText}
                </span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Load medical records
function loadMedicalRecords() {
  const container = document.getElementById("medicalRecordsGrid")
  const records = [
    {
      title: "Analyse de sang",
      date: "10 Janvier 2025",
      content: "Résultats normaux. Tous les paramètres dans les normes.",
      color: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    },
    {
      title: "Radiographie thoracique",
      date: "5 Janvier 2025",
      content: "Aucune anomalie détectée. Poumons clairs.",
      color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    },
    {
      title: "ECG",
      date: "28 Décembre 2024",
      content: "Rythme cardiaque normal. Aucune arythmie.",
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
  ]

  container.innerHTML = records
    .map(
      (record) => `
        <div class="medical-record-card">
            <div class="medical-record-header">
                <div class="medical-record-icon" style="background: ${record.color};">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                </div>
                <div>
                    <div class="medical-record-title">${record.title}</div>
                    <div class="medical-record-date">${record.date}</div>
                </div>
            </div>
            <div class="medical-record-content">${record.content}</div>
        </div>
    `,
    )
    .join("")
}

// Load prescriptions
function loadPrescriptions() {
  const container = document.getElementById("prescriptionsGrid")
  
  // Sample prescriptions data (TODO: Replace with real data from backend)
  const prescriptions = [
    {
      doctor: "Dr. Sarah Martin",
      date: "10 Janvier 2025",
      status: "active",
      medications: [
        { name: "Paracétamol", dosage: "500mg - 3x/jour" },
        { name: "Vitamine D", dosage: "1000 UI - 1x/jour" }
      ]
    },
    {
      doctor: "Dr. Ahmed Benali",
      date: "5 Janvier 2025",
      status: "active",
      medications: [
        { name: "Aspirine", dosage: "100mg - 1x/jour" }
      ]
    }
  ]

  container.innerHTML = prescriptions
    .map(
      (prescription) => `
        <div class="prescription-card">
            <div class="prescription-header">
                <div>
                    <div class="prescription-doctor">${prescription.doctor}</div>
                    <div class="prescription-date">${prescription.date}</div>
                </div>
                <span class="prescription-status ${prescription.status}">
                    ${prescription.status === "active" ? "Active" : "Expirée"}
                </span>
            </div>
            <div class="prescription-medications">
                ${prescription.medications
                  .map(
                    (med) => `
                    <div class="medication-item">
                        <div class="medication-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                        </div>
                        <div>
                            <div class="medication-name">${med.name}</div>
                            <div class="medication-dosage">${med.dosage}</div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `,
    )
    .join("")
}

// Load doctors
function loadDoctors() {
  const container = document.getElementById("doctorsGrid")
  const doctors = [
    {
      name: "Dr. Sarah Martin",
      specialty: "Médecine générale",
      rating: 4.8,
      initials: "SM",
    },
    {
      name: "Dr. Ahmed Benali",
      specialty: "Cardiologie",
      rating: 4.9,
      initials: "AB",
    },
    {
      name: "Dr. Marie Dubois",
      specialty: "Pédiatrie",
      rating: 4.7,
      initials: "MD",
    },
    {
      name: "Dr. Hassan Alami",
      specialty: "Dermatologie",
      rating: 4.6,
      initials: "HA",
    },
    {
      name: "Dr. Fatima Zahra",
      specialty: "Gynécologie",
      rating: 4.9,
      initials: "FZ",
    },
    {
      name: "Dr. Karim Idrissi",
      specialty: "Orthopédie",
      rating: 4.8,
      initials: "KI",
    },
  ]

  container.innerHTML = doctors
    .map(
      (doctor) => `
        <div class="doctor-card">
            <div class="doctor-avatar">${doctor.initials}</div>
            <div class="doctor-name">${doctor.name}</div>
            <div class="doctor-specialty">${doctor.specialty}</div>
            <div class="doctor-rating">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>${doctor.rating}</span>
            </div>
            <div class="doctor-actions">
                <button class="doctor-btn">Profil</button>
                <button class="doctor-btn primary">Prendre RDV</button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Search functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase()
  // Implement search logic here
  console.log("[v0] Searching for:", searchTerm)
})

// Toast notification function
function showToast(message, type = "info") {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.textContent = message
  toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === "success" ? "var(--success-color)" : "var(--info-color)"};
        color: white;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease"
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault()
    searchInput.focus()
  }

  // Ctrl/Cmd + N for notifications
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault()
    notificationDropdown.classList.toggle("active")
  }
})
