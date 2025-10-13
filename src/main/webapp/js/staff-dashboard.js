// DOM Elements
const sidebar = document.getElementById("sidebar")
const sidebarToggle = document.getElementById("sidebarToggle")
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const navItems = document.querySelectorAll(".nav-item[data-section]")
const contentSections = document.querySelectorAll(".content-section")
const notificationBtn = document.getElementById("notificationBtn")
const notificationDropdown = document.getElementById("notificationDropdown")
const searchInput = document.getElementById("searchInput")

// Navigation
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault()
    const sectionId = item.dataset.section

    // Update active nav item
    navItems.forEach((nav) => nav.classList.remove("active"))
    item.classList.add("active")

    // Show corresponding section
    contentSections.forEach((section) => {
      section.classList.remove("active")
      if (section.id === `section-${sectionId}`) {
        section.classList.add("active")
      }
    })

    // Close mobile menu
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active")
    }
  })
})

// Mobile Menu Toggle
mobileMenuBtn?.addEventListener("click", () => {
  sidebar.classList.toggle("active")
})

// Sidebar Toggle
sidebarToggle?.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed")
})

// Notification Dropdown
notificationBtn?.addEventListener("click", (e) => {
  e.stopPropagation()
  notificationDropdown.classList.toggle("active")
})

document.addEventListener("click", (e) => {
  if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
    notificationDropdown.classList.remove("active")
  }
})

// Animated Counter
function animateCounter(element) {
  const target = Number.parseInt(element.dataset.target)
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

// Initialize counters
document.querySelectorAll(".stat-value[data-target]").forEach(animateCounter)

// Today's Schedule Data
const scheduleData = [
  { time: "09:00", patient: "Marie Dubois", type: "Consultation générale", status: "confirmed" },
  { time: "10:30", patient: "Jean Martin", type: "Suivi médical", status: "confirmed" },
  { time: "11:00", patient: "Sophie Laurent", type: "Urgence", status: "pending" },
  { time: "14:00", patient: "Pierre Durand", type: "Consultation spécialisée", status: "confirmed" },
  { time: "15:30", patient: "Claire Bernard", type: "Contrôle", status: "confirmed" },
]

function renderSchedule() {
  const container = document.getElementById("todaySchedule")
  if (!container) return

  container.innerHTML = scheduleData
    .map(
      (item) => `
        <div class="schedule-item">
            <div class="schedule-time">
                <div class="schedule-time-hour">${item.time.split(":")[0]}:${item.time.split(":")[1]}</div>
            </div>
            <div class="schedule-details">
                <div class="schedule-patient">${item.patient}</div>
                <div class="schedule-type">${item.type}</div>
            </div>
            <span class="schedule-status ${item.status}">
                ${item.status === "confirmed" ? "Confirmé" : "En attente"}
            </span>
        </div>
    `,
    )
    .join("")
}

// Waiting Patients Data
const waitingData = [
  { name: "Alice Moreau", time: "15 min", priority: "normal" },
  { name: "Thomas Petit", time: "8 min", priority: "urgent" },
  { name: "Emma Rousseau", time: "22 min", priority: "normal" },
  { name: "Lucas Simon", time: "5 min", priority: "urgent" },
  { name: "Léa Lefebvre", time: "18 min", priority: "normal" },
]

function renderWaitingPatients() {
  const container = document.getElementById("waitingPatients")
  if (!container) return

  container.innerHTML = waitingData
    .map(
      (patient) => `
        <div class="waiting-item">
            <div class="waiting-avatar">${patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}</div>
            <div class="waiting-info">
                <div class="waiting-name">${patient.name}</div>
                <div class="waiting-time">En attente depuis ${patient.time}</div>
            </div>
            <span class="waiting-priority ${patient.priority}">
                ${patient.priority === "urgent" ? "Urgent" : "Normal"}
            </span>
        </div>
    `,
    )
    .join("")
}

// Activity Feed Data
const activityData = [
  { type: "appointment", icon: "appointment", text: "Rendez-vous confirmé avec Marie Dubois", time: "Il y a 5 min" },
  { type: "patient", icon: "patient", text: "Nouveau patient enregistré: Thomas Petit", time: "Il y a 12 min" },
  { type: "call", icon: "call", text: "Appel entrant traité - Demande de RDV", time: "Il y a 25 min" },
  { type: "appointment", icon: "appointment", text: "Rendez-vous annulé par Sophie Laurent", time: "Il y a 1 heure" },
  { type: "patient", icon: "patient", text: "Patient orienté vers le Dr. Martin", time: "Il y a 2 heures" },
]

function renderActivityFeed() {
  const container = document.getElementById("activityFeed")
  if (!container) return

  container.innerHTML = activityData
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

function getActivityIcon(type) {
  const icons = {
    appointment:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>',
    patient:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    call: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
  }
  return icons[type] || ""
}

// Appointments Section Content
function renderAppointmentsSection() {
  const container = document.getElementById("appointmentsContent")
  if (!container) return

  container.innerHTML = `
        <div class="appointments-grid">
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title">
                        <h3>Rendez-vous du Jour</h3>
                    </div>
                    <span class="badge badge-warning">${scheduleData.length} rendez-vous</span>
                </div>
                <div class="schedule-list">
                    ${scheduleData
                      .map(
                        (item) => `
                        <div class="schedule-item">
                            <div class="schedule-time">
                                <div class="schedule-time-hour">${item.time}</div>
                            </div>
                            <div class="schedule-details">
                                <div class="schedule-patient">${item.patient}</div>
                                <div class="schedule-type">${item.type}</div>
                            </div>
                            <span class="schedule-status ${item.status}">
                                ${item.status === "confirmed" ? "Confirmé" : "En attente"}
                            </span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `
}

// Reception Section Content
function renderReceptionSection() {
  const container = document.getElementById("receptionContent")
  if (!container) return

  container.innerHTML = `
        <div class="reception-grid">
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title">
                        <h3>File d'Attente</h3>
                    </div>
                    <span class="badge badge-warning">${waitingData.length} patients</span>
                </div>
                <div class="waiting-list">
                    ${waitingData
                      .map(
                        (patient) => `
                        <div class="waiting-item">
                            <div class="waiting-avatar">${patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}</div>
                            <div class="waiting-info">
                                <div class="waiting-name">${patient.name}</div>
                                <div class="waiting-time">En attente depuis ${patient.time}</div>
                            </div>
                            <span class="waiting-priority ${patient.priority}">
                                ${patient.priority === "urgent" ? "Urgent" : "Normal"}
                            </span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `
}

// Communication Section Content
function renderCommunicationSection() {
  const container = document.getElementById("communicationContent")
  if (!container) return

  container.innerHTML = `
        <div class="communication-grid">
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title">
                        <h3>Messages Récents</h3>
                    </div>
                </div>
                <div class="activity-feed">
                    ${activityData
                      .filter((a) => a.type === "call")
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
                      .join("")}
                </div>
            </div>
        </div>
    `
}

// Support Section Content
function renderSupportSection() {
  const container = document.getElementById("supportContent")
  if (!container) return

  container.innerHTML = `
        <div class="support-grid">
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title">
                        <h3>Ressources Disponibles</h3>
                    </div>
                </div>
                <div style="padding: 24px;">
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">
                        Accédez aux ressources et outils de support pour faciliter votre travail.
                    </p>
                    <div style="display: grid; gap: 12px;">
                        <button class="btn btn-secondary" style="justify-content: flex-start;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                            </svg>
                            Liste des Médecins
                        </button>
                        <button class="btn btn-secondary" style="justify-content: flex-start;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            </svg>
                            Disponibilité des Salles
                        </button>
                        <button class="btn btn-secondary" style="justify-content: flex-start;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            </svg>
                            Centre d'Aide
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Reports Section Content
function renderReportsSection() {
  const container = document.getElementById("reportsContent")
  if (!container) return

  container.innerHTML = `
        <div class="reports-grid">
            <div class="dashboard-card">
                <div class="card-header">
                    <div class="card-title">
                        <h3>Rapports Disponibles</h3>
                    </div>
                </div>
                <div style="padding: 24px;">
                    <div style="display: grid; gap: 12px;">
                        <button class="btn btn-secondary" style="justify-content: flex-start;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            Rapport Quotidien
                        </button>
                        <button class="btn btn-secondary" style="justify-content: flex-start;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="20" x2="12" y2="10"></line>
                                <line x1="18" y1="20" x2="18" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="16"></line>
                            </svg>
                            Statistiques Hebdomadaires
                        </button>
                        <button class="btn btn-secondary" style="justify-content: flex-start;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                            </svg>
                            Rapport Mensuel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Initialize all sections
function initializeSections() {
  renderSchedule()
  renderWaitingPatients()
  renderActivityFeed()
  renderAppointmentsSection()
  renderReceptionSection()
  renderCommunicationSection()
  renderSupportSection()
  renderReportsSection()
}

// Search functionality
searchInput?.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase()
  console.log("[v0] Search query:", query)
  // Implement search logic here
})

// Auto-refresh data every 30 seconds
setInterval(() => {
  console.log("[v0] Auto-refreshing dashboard data")
  initializeSections()
}, 30000)

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeSections()
  console.log("[v0] Staff dashboard initialized")
})

// Toast notification system
function showToast(message, type = "info") {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.textContent = message
  toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--surface);
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px var(--shadow);
        border-left: 4px solid var(--${type === "success" ? "success" : type === "error" ? "danger" : "primary"});
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
    searchInput?.focus()
  }

  // Ctrl/Cmd + N for notifications
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault()
    notificationDropdown?.classList.toggle("active")
  }
})
