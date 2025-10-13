// Admin Dashboard Dynamic JavaScript
// Author: Clinique Digitale
// Description: Handles all dynamic interactions and animations

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("[v0] Admin Dashboard initialized")
  
    // Initialize all features
    initializeCounters()
    initializeDateTime()
    initializeNotifications()
    initializeSearch()
    initializeActivityFeed()
    initializeTooltips()
    initializeAnimations()
  
    // Simulate real-time updates
    startRealTimeUpdates()
  })
  
  // ============================================
  // ANIMATED COUNTERS
  // ============================================
  
  function initializeCounters() {
    const counters = document.querySelectorAll("[data-target]")
  
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute("data-target"))
      const duration = 2000 // 2 seconds
      const increment = target / (duration / 16) // 60fps
      let current = 0
  
      const updateCounter = () => {
        current += increment
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString("fr-FR")
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target.toLocaleString("fr-FR")
        }
      }
  
      // Start animation when element is in viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              updateCounter()
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.5 },
      )
  
      observer.observe(counter)
    })
  }
  
  // ============================================
  // REAL-TIME DATE & TIME
  // ============================================
  
  function initializeDateTime() {
    const dateTimeElement = document.getElementById("currentDateTime")
  
    function updateDateTime() {
      const now = new Date()
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
      const formatted = now.toLocaleDateString("fr-FR", options)
      dateTimeElement.innerHTML = `<i class="fas fa-clock mr-2"></i>${formatted}`
    }
  
    // Update every minute
    setInterval(updateDateTime, 60000)
  }
  
  // ============================================
  // NOTIFICATIONS SYSTEM
  // ============================================
  
  const notifications = [
    {
      id: 1,
      type: "urgent",
      icon: "fa-exclamation-circle",
      color: "red",
      title: "Alerte urgente",
      message: "Patient en salle d'urgence nécessite une attention immédiate",
      time: "Il y a 2 min",
      read: false,
    },
    {
      id: 2,
      type: "appointment",
      icon: "fa-calendar-check",
      color: "blue",
      title: "Nouveau rendez-vous",
      message: "Dr. Ahmed a un nouveau rendez-vous à 14h30",
      time: "Il y a 10 min",
      read: false,
    },
    {
      id: 3,
      type: "patient",
      icon: "fa-user-plus",
      color: "green",
      title: "Nouveau patient",
      message: "Mohammed Hassan a été enregistré avec succès",
      time: "Il y a 25 min",
      read: false,
    },
    {
      id: 4,
      type: "system",
      icon: "fa-cog",
      color: "purple",
      title: "Mise à jour système",
      message: "Sauvegarde automatique effectuée avec succès",
      time: "Il y a 1 heure",
      read: true,
    },
    {
      id: 5,
      type: "report",
      icon: "fa-file-alt",
      color: "orange",
      title: "Rapport disponible",
      message: "Le rapport mensuel de janvier est prêt",
      time: "Il y a 2 heures",
      read: true,
    },
  ]
  
  function initializeNotifications() {
    const notificationBtn = document.getElementById("notificationBtn")
    const notificationPanel = document.getElementById("notificationPanel")
    const notificationBadge = document.getElementById("notificationBadge")
    const markAllReadBtn = document.getElementById("markAllRead")
  
    // Toggle notification panel
    notificationBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      notificationPanel.classList.toggle("hidden")
      renderNotifications()
    })
  
    // Close panel when clicking outside
    document.addEventListener("click", (e) => {
      if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationPanel.classList.add("hidden")
      }
    })
  
    // Mark all as read
    markAllReadBtn.addEventListener("click", () => {
      notifications.forEach((n) => (n.read = true))
      updateNotificationBadge()
      renderNotifications()
      showToast("Toutes les notifications ont été marquées comme lues", "success")
    })
  
    updateNotificationBadge()
  }
  
  function renderNotifications() {
    const notificationList = document.getElementById("notificationList")
  
    if (notifications.length === 0) {
      notificationList.innerHTML = `
              <div class="p-8 text-center text-gray-500">
                  <i class="fas fa-bell-slash text-4xl mb-2"></i>
                  <p>Aucune notification</p>
              </div>
          `
      return
    }
  
    notificationList.innerHTML = notifications
      .map(
        (notif) => `
          <div class="p-4 hover:bg-gray-50 transition-colors cursor-pointer ${notif.read ? "opacity-60" : ""}" 
               onclick="markNotificationRead(${notif.id})">
              <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 rounded-full bg-${notif.color}-100 flex items-center justify-center flex-shrink-0">
                      <i class="fas ${notif.icon} text-${notif.color}-600"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                      <p class="font-semibold text-gray-800 text-sm">${notif.title}</p>
                      <p class="text-gray-600 text-sm mt-1">${notif.message}</p>
                      <p class="text-gray-400 text-xs mt-1">${notif.time}</p>
                  </div>
                  ${!notif.read ? '<div class="w-2 h-2 bg-blue-600 rounded-full"></div>' : ""}
              </div>
          </div>
      `,
      )
      .join("")
  }
  
  function markNotificationRead(id) {
    const notification = notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      updateNotificationBadge()
      renderNotifications()
    }
  }
  
  function updateNotificationBadge() {
    const badge = document.getElementById("notificationBadge")
    const unreadCount = notifications.filter((n) => !n.read).length
  
    if (unreadCount > 0) {
      badge.textContent = unreadCount
      badge.classList.remove("hidden")
    } else {
      badge.classList.add("hidden")
    }
  }
  
  // ============================================
  // SEARCH FUNCTIONALITY
  // ============================================
  
  function initializeSearch() {
    const searchInput = document.getElementById("searchInput")
  
    if (!searchInput) return
  
    let searchTimeout
  
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout)
      const query = e.target.value.trim()
  
      if (query.length < 2) return
  
      searchTimeout = setTimeout(() => {
        performSearch(query)
      }, 300)
    })
  
    searchInput.addEventListener("focus", () => {
      searchInput.classList.add("ring-2", "ring-blue-500")
    })
  
    searchInput.addEventListener("blur", () => {
      searchInput.classList.remove("ring-2", "ring-blue-500")
    })
  }
  
  function performSearch(query) {
    console.log("[v0] Searching for:", query)
    showToast(`Recherche: "${query}"`, "info")
    // Here you would implement actual search logic
    // For now, just show a toast notification
  }
  
  // ============================================
  // ACTIVITY FEED
  // ============================================
  
  const activities = [
    {
      icon: "fa-user-plus",
      color: "green",
      title: "Nouveau patient enregistré",
      description: "Dr. Ahmed a ajouté un nouveau patient",
      time: "Il y a 5 min",
    },
    {
      icon: "fa-calendar-check",
      color: "blue",
      title: "Rendez-vous confirmé",
      description: "Patient Mohammed - Consultation cardiologie",
      time: "Il y a 15 min",
    },
    {
      icon: "fa-file-medical",
      color: "purple",
      title: "Rapport médical généré",
      description: "Dr. Fatima a créé un rapport pour Patient #1234",
      time: "Il y a 1 heure",
    },
    {
      icon: "fa-exclamation-circle",
      color: "orange",
      title: "Alerte système",
      description: "Sauvegarde automatique effectuée avec succès",
      time: "Il y a 2 heures",
    },
  ]
  
  function initializeActivityFeed() {
    const refreshBtn = document.getElementById("refreshActivity")
  
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        refreshActivityFeed()
      })
    }
  }
  
  function refreshActivityFeed() {
    const activityList = document.getElementById("activityList")
    const refreshBtn = document.getElementById("refreshActivity")
  
    // Animate refresh button
    refreshBtn.querySelector("i").classList.add("fa-spin")
  
    // Simulate loading
    setTimeout(() => {
      // Add a new random activity
      const newActivity = {
        icon: "fa-bell",
        color: "blue",
        title: "Nouvelle activité",
        description: "Activité mise à jour automatiquement",
        time: "À l'instant",
      }
  
      activities.unshift(newActivity)
      if (activities.length > 6) activities.pop()
  
      renderActivityFeed()
      refreshBtn.querySelector("i").classList.remove("fa-spin")
      showToast("Activités actualisées", "success")
    }, 1000)
  }
  
  function renderActivityFeed() {
    const activityList = document.getElementById("activityList")
  
    activityList.innerHTML = activities
      .map(
        (activity) => `
          <div class="activity-item">
              <div class="activity-icon bg-${activity.color}-100">
                  <i class="fas ${activity.icon} text-${activity.color}-600"></i>
              </div>
              <div class="flex-1">
                  <p class="text-gray-800 font-medium">${activity.title}</p>
                  <p class="text-gray-500 text-sm">${activity.description}</p>
              </div>
              <span class="text-gray-400 text-sm">${activity.time}</span>
          </div>
      `,
      )
      .join("")
  }
  
  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  
  function showToast(message, type = "info") {
    const toastContainer = document.getElementById("toastContainer")
    const toastId = "toast-" + Date.now()
  
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-orange-500",
      info: "bg-blue-500",
    }
  
    const icons = {
      success: "fa-check-circle",
      error: "fa-times-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle",
    }
  
    const toast = document.createElement("div")
    toast.id = toastId
    toast.className = `${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 transform translate-x-full transition-transform duration-300 min-w-[300px]`
    toast.innerHTML = `
          <i class="fas ${icons[type]} text-xl"></i>
          <span class="flex-1">${message}</span>
          <button onclick="closeToast('${toastId}')" class="text-white hover:text-gray-200">
              <i class="fas fa-times"></i>
          </button>
      `
  
    toastContainer.appendChild(toast)
  
    // Trigger animation
    setTimeout(() => {
      toast.classList.remove("translate-x-full")
    }, 10)
  
    // Auto remove after 5 seconds
    setTimeout(() => {
      closeToast(toastId)
    }, 5000)
  }
  
  function closeToast(toastId) {
    const toast = document.getElementById(toastId)
    if (toast) {
      toast.classList.add("translate-x-full")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }
  }
  
  // Make closeToast available globally
  window.closeToast = closeToast
  window.markNotificationRead = markNotificationRead
  
  // ============================================
  // TOOLTIPS
  // ============================================
  
  function initializeTooltips() {
    const elements = document.querySelectorAll("[data-tooltip]")
  
    elements.forEach((element) => {
      element.addEventListener("mouseenter", (e) => {
        const tooltip = document.createElement("div")
        tooltip.className = "tooltip"
        tooltip.textContent = element.getAttribute("data-tooltip")
        document.body.appendChild(tooltip)
  
        const rect = element.getBoundingClientRect()
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px"
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
      })
  
      element.addEventListener("mouseleave", () => {
        const tooltips = document.querySelectorAll(".tooltip")
        tooltips.forEach((t) => t.remove())
      })
    })
  }
  
  // ============================================
  // ANIMATIONS
  // ============================================
  
  function initializeAnimations() {
    // Animate cards on scroll
    const cards = document.querySelectorAll(".dashboard-card, .stat-card")
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = "1"
              entry.target.style.transform = "translateY(0)"
            }, index * 100)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )
  
    cards.forEach((card) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(20px)"
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease"
      observer.observe(card)
    })
  
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      })
    })
  }
  
  // ============================================
  // REAL-TIME UPDATES
  // ============================================
  
  function startRealTimeUpdates() {
    // Simulate real-time data updates every 30 seconds
    setInterval(() => {
      updateStatistics()
      checkNewNotifications()
    }, 30000)
  }
  
  function updateStatistics() {
    // Simulate random small changes in statistics
    const stats = [
      { id: "totalPatients", change: Math.floor(Math.random() * 5) },
      { id: "todayAppointments", change: Math.floor(Math.random() * 3) },
      { id: "pendingAppointments", change: Math.floor(Math.random() * 2) - 1 },
    ]
  
    stats.forEach((stat) => {
      const element = document.getElementById(stat.id)
      if (element && stat.change !== 0) {
        const currentValue = Number.parseInt(element.textContent.replace(/\s/g, ""))
        const newValue = currentValue + stat.change
  
        // Animate the change
        element.style.transform = "scale(1.1)"
        element.style.color = stat.change > 0 ? "#10b981" : "#ef4444"
  
        setTimeout(() => {
          element.textContent = newValue.toLocaleString("fr-FR")
          element.setAttribute("data-target", newValue)
        }, 200)
  
        setTimeout(() => {
          element.style.transform = "scale(1)"
          element.style.color = ""
        }, 400)
      }
    })
  }
  
  function checkNewNotifications() {
    // Simulate new notification
    const random = Math.random()
    if (random > 0.7) {
      const newNotification = {
        id: Date.now(),
        type: "info",
        icon: "fa-bell",
        color: "blue",
        title: "Nouvelle notification",
        message: "Vous avez une nouvelle mise à jour",
        time: "À l'instant",
        read: false,
      }
  
      notifications.unshift(newNotification)
      if (notifications.length > 10) notifications.pop()
  
      updateNotificationBadge()
      showToast("Nouvelle notification reçue", "info")
    }
  }
  
  // ============================================
  // LOADING OVERLAY
  // ============================================
  
  function showLoading() {
    document.getElementById("loadingOverlay").classList.remove("hidden")
  }
  
  function hideLoading() {
    document.getElementById("loadingOverlay").classList.add("hidden")
  }
  
  // Make functions available globally
  window.showLoading = showLoading
  window.hideLoading = hideLoading
  window.showToast = showToast
  
  // ============================================
  // KEYBOARD SHORTCUTS
  // ============================================
  
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      document.getElementById("searchInput")?.focus()
    }
  
    // Ctrl/Cmd + N for notifications
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault()
      document.getElementById("notificationBtn")?.click()
    }
  })
  
  console.log("[v0] Admin Dashboard fully loaded and interactive")
  