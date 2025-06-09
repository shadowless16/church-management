// Live Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Live stream state
  const isLive = true // Set to false to show offline state
  let viewerCount = 234
  const chatUsers = 234

  // Chat messages data
  const chatMessages = [
    { username: "Sarah M.", message: "Praise God! This message is so powerful!", timestamp: new Date() },
    { username: "David K.", message: "Amen! God is speaking to my heart", timestamp: new Date() },
    { username: "Grace A.", message: "Thank you Pastor for this word", timestamp: new Date() },
    { username: "Michael O.", message: "Praying for everyone watching", timestamp: new Date() },
  ]

  // DOM elements
  const liveStatus = document.getElementById("live-status")
  const offlineMessage = document.getElementById("offline-message")
  const viewerCountElement = document.getElementById("viewer-count")
  const chatUsersElement = document.getElementById("chat-users")
  const chatMessagesContainer = document.getElementById("chat-messages")
  const chatForm = document.getElementById("chat-form")
  const chatMessageInput = document.getElementById("chat-message")
  const currentDateElement = document.getElementById("current-date")
  const currentTimeElement = document.getElementById("current-time")

  // Video controls
  const playPauseBtn = document.getElementById("play-pause-btn")
  const volumeBtn = document.getElementById("volume-btn")
  const volumeRange = document.getElementById("volume-range")
  const fullscreenBtn = document.getElementById("fullscreen-btn")

  // Tabs
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")
  const archiveTabBtns = document.querySelectorAll(".archive-tab-btn")
  const archiveTabContents = document.querySelectorAll(".archive-tab-content")

  // Notes
  const sermonNotes = document.getElementById("sermon-notes")
  const saveNotesBtn = document.getElementById("save-notes")
  const downloadNotesBtn = document.getElementById("download-notes")

  // Action buttons
  const likeBtn = document.getElementById("like-btn")
  const shareBtn = document.getElementById("share-btn")
  const prayerBtn = document.getElementById("prayer-btn")
  const giveBtn = document.getElementById("give-btn")

  // Countdown elements
  const countdownElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  }

  // Initialize
  setupEventListeners()
  updateLiveStatus()
  updateDateTime()
  renderChatMessages()
  startCountdown()

  // Update time every second
  setInterval(updateDateTime, 1000)

  // Simulate viewer count changes
  setInterval(updateViewerCount, 30000)

  // Simulate new chat messages
  setInterval(addRandomChatMessage, 15000)

  function setupEventListeners() {
    // Chat form
    chatForm.addEventListener("submit", handleChatSubmission)

    // Video controls
    playPauseBtn.addEventListener("click", togglePlayPause)
    volumeBtn.addEventListener("click", toggleMute)
    volumeRange.addEventListener("input", updateVolume)
    fullscreenBtn.addEventListener("click", toggleFullscreen)

    // Tabs
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const tabName = this.dataset.tab
        switchTab(tabName)
      })
    })

    archiveTabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const tabName = this.dataset.tab
        switchArchiveTab(tabName)
      })
    })

    // Notes functionality
    saveNotesBtn.addEventListener("click", saveNotes)
    downloadNotesBtn.addEventListener("click", downloadNotes)

    // Action buttons
    likeBtn.addEventListener("click", handleLike)
    shareBtn.addEventListener("click", handleShare)
    prayerBtn.addEventListener("click", () => window.open("prayer.html", "_blank"))
    giveBtn.addEventListener("click", () => window.open("give.html", "_blank"))

    // Notification button
    const notifyBtn = document.getElementById("notify-me")
    if (notifyBtn) {
      notifyBtn.addEventListener("click", handleNotifyMe)
    }
  }

  function updateLiveStatus() {
    if (isLive) {
      liveStatus.style.display = "block"
      offlineMessage.style.display = "none"
      document.querySelector(".video-section").style.display = "block"
      document.querySelector(".service-archive").style.display = "block"
    } else {
      liveStatus.style.display = "none"
      offlineMessage.style.display = "block"
      document.querySelector(".video-section").style.display = "none"
      document.querySelector(".service-archive").style.display = "none"
    }
  }

  function updateDateTime() {
    const now = new Date()

    if (currentDateElement) {
      const dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      currentDateElement.textContent = now.toLocaleDateString("en-US", dateOptions)
    }

    if (currentTimeElement) {
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Lagos",
      }
      currentTimeElement.textContent = now.toLocaleTimeString("en-US", timeOptions)
    }
  }

  function updateViewerCount() {
    // Simulate viewer count changes
    const change = Math.floor(Math.random() * 20) - 10
    viewerCount = Math.max(100, viewerCount + change)

    if (viewerCountElement) {
      viewerCountElement.textContent = `${viewerCount} viewers`
    }

    if (chatUsersElement) {
      chatUsersElement.textContent = viewerCount
    }
  }

  function renderChatMessages() {
    if (!chatMessagesContainer) return

    chatMessagesContainer.innerHTML = ""

    chatMessages.forEach((msg) => {
      const messageElement = createChatMessage(msg)
      chatMessagesContainer.appendChild(messageElement)
    })

    // Scroll to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
  }

  function createChatMessage(msg) {
    const messageDiv = document.createElement("div")
    messageDiv.className = "chat-message"
    messageDiv.innerHTML = `
            <span class="username">${msg.username}:</span>
            <span class="message">${msg.message}</span>
        `
    return messageDiv
  }

  function handleChatSubmission(e) {
    e.preventDefault()

    const message = chatMessageInput.value.trim()
    if (!message) return

    // Add user message to chat
    const userMessage = {
      username: "You",
      message: message,
      timestamp: new Date(),
    }

    chatMessages.push(userMessage)
    renderChatMessages()

    // Clear input
    chatMessageInput.value = ""

    // Show confirmation
    showNotification("Message sent to live chat!", "success")
  }

  function addRandomChatMessage() {
    if (!isLive) return

    const randomMessages = [
      "Amen to that!",
      "God bless this ministry",
      "Powerful word Pastor!",
      "Praying for everyone here",
      "Thank you for this message",
      "God is good all the time!",
      "Hallelujah!",
      "This is exactly what I needed to hear",
    ]

    const randomUsers = ["John D.", "Mary K.", "Peter O.", "Ruth A.", "James M.", "Faith N.", "Hope E.", "Joy B."]

    const randomMessage = {
      username: randomUsers[Math.floor(Math.random() * randomUsers.length)],
      message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
      timestamp: new Date(),
    }

    chatMessages.push(randomMessage)

    // Keep only the last 50 messages
    if (chatMessages.length > 50) {
      chatMessages.shift()
    }

    renderChatMessages()
  }

  function togglePlayPause() {
    const icon = playPauseBtn.querySelector("i")
    if (icon.classList.contains("fa-pause")) {
      icon.classList.remove("fa-pause")
      icon.classList.add("fa-play")
      showNotification("Video paused", "info")
    } else {
      icon.classList.remove("fa-play")
      icon.classList.add("fa-pause")
      showNotification("Video playing", "info")
    }
  }

  function toggleMute() {
    const icon = volumeBtn.querySelector("i")
    if (icon.classList.contains("fa-volume-up")) {
      icon.classList.remove("fa-volume-up")
      icon.classList.add("fa-volume-mute")
      volumeRange.value = 0
      showNotification("Audio muted", "info")
    } else {
      icon.classList.remove("fa-volume-mute")
      icon.classList.add("fa-volume-up")
      volumeRange.value = 50
      showNotification("Audio unmuted", "info")
    }
  }

  function updateVolume() {
    const value = volumeRange.value
    const icon = volumeBtn.querySelector("i")

    if (value == 0) {
      icon.className = "fas fa-volume-mute"
    } else if (value < 50) {
      icon.className = "fas fa-volume-down"
    } else {
      icon.className = "fas fa-volume-up"
    }
  }

  function toggleFullscreen() {
    const videoContainer = document.querySelector(".video-container")

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch((err) => {
        showNotification("Error attempting to enable fullscreen mode", "error")
      })
    } else {
      document.exitFullscreen()
    }
  }

  function switchTab(tabName) {
    tabBtns.forEach((btn) => {
      btn.classList.remove("active")
    })

    tabContents.forEach((content) => {
      content.classList.remove("active")
    })

    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")
    document.getElementById(`${tabName}-tab`).classList.add("active")
  }

  function switchArchiveTab(tabName) {
    archiveTabBtns.forEach((btn) => {
      btn.classList.remove("active")
    })

    archiveTabContents.forEach((content) => {
      content.classList.remove("active")
    })

    document.querySelector(`.archive-tab-btn[data-tab="${tabName}"]`).classList.add("active")
    document.getElementById(`${tabName}-archive`).classList.add("active")
  }

  function saveNotes() {
    const notes = sermonNotes.value

    if (!notes.trim()) {
      showNotification("Please write some notes before saving", "warning")
      return
    }

    // Save to localStorage
    localStorage.setItem("sermon_notes", notes)
    showNotification("Notes saved successfully!", "success")
  }

  function downloadNotes() {
    const notes = sermonNotes.value

    if (!notes.trim()) {
      showNotification("Please write some notes before downloading", "warning")
      return
    }

    // Create a blob and download
    const blob = new Blob([notes], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")

    const now = new Date()
    const dateStr = now.toISOString().split("T")[0]

    a.href = url
    a.download = `Sermon_Notes_${dateStr}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showNotification("Notes downloaded successfully!", "success")
  }

  function handleLike() {
    const likeIcon = likeBtn.querySelector("i")

    if (likeBtn.classList.contains("liked")) {
      likeBtn.classList.remove("liked")
      showNotification("You unliked this service", "info")
    } else {
      likeBtn.classList.add("liked")
      showNotification("You liked this service!", "success")

      // Add animation
      likeIcon.classList.add("pulse-animation")
      setTimeout(() => {
        likeIcon.classList.remove("pulse-animation")
      }, 1000)
    }
  }

  function handleShare() {
    // Create a share dialog
    const shareDialog = document.createElement("div")
    shareDialog.className = "share-dialog"
    shareDialog.innerHTML = `
            <div class="share-dialog-content">
                <div class="share-dialog-header">
                    <h3>Share This Service</h3>
                    <button class="close-dialog">&times;</button>
                </div>
                <div class="share-dialog-body">
                    <p>Share this service with your friends and family:</p>
                    <div class="share-link">
                        <input type="text" value="https://thenestchurch.org/live" readonly>
                        <button class="copy-link">Copy</button>
                    </div>
                    <div class="share-social">
                        <button class="social-btn facebook"><i class="fab fa-facebook-f"></i> Facebook</button>
                        <button class="social-btn twitter"><i class="fab fa-twitter"></i> Twitter</button>
                        <button class="social-btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</button>
                        <button class="social-btn email"><i class="fas fa-envelope"></i> Email</button>
                    </div>
                </div>
            </div>
        `

    document.body.appendChild(shareDialog)

    // Add event listeners
    const closeBtn = shareDialog.querySelector(".close-dialog")
    closeBtn.addEventListener("click", () => {
      shareDialog.remove()
    })

    const copyBtn = shareDialog.querySelector(".copy-link")
    copyBtn.addEventListener("click", () => {
      const linkInput = shareDialog.querySelector(".share-link input")
      linkInput.select()
      document.execCommand("copy")
      showNotification("Link copied to clipboard!", "success")
    })

    // Social share buttons
    const socialBtns = shareDialog.querySelectorAll(".social-btn")
    socialBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        shareDialog.remove()
        showNotification(`Sharing via ${btn.textContent.trim()}...`, "info")
      })
    })

    // Close when clicking outside
    shareDialog.addEventListener("click", (e) => {
      if (e.target === shareDialog) {
        shareDialog.remove()
      }
    })

    // Add share dialog styles
    const shareDialogStyles = `
            .share-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            .share-dialog-content {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            }
            
            .share-dialog-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #eee;
            }
            
            .share-dialog-header h3 {
                margin: 0;
                color: var(--primary-color);
            }
            
            .close-dialog {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            
            .share-dialog-body {
                padding: 20px;
            }
            
            .share-link {
                display: flex;
                margin-bottom: 20px;
            }
            
            .share-link input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px 0 0 4px;
            }
            
            .copy-link {
                background-color: var(--primary-color);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 0 4px 4px 0;
                cursor: pointer;
            }
            
            .share-social {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            
            .social-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 10px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                color: white;
            }
            
            .facebook {
                background-color: #3b5998;
            }
            
            .twitter {
                background-color: #1da1f2;
            }
            
            .whatsapp {
                background-color: #25d366;
            }
            
            .email {
                background-color: #ea4335;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @media (max-width: 480px) {
                .share-social {
                    grid-template-columns: 1fr;
                }
            }
        `

    const styleSheet = document.createElement("style")
    styleSheet.textContent = shareDialogStyles
    document.head.appendChild(styleSheet)
  }

  function handleNotifyMe() {
    showNotification("We'll notify you when we go live!", "success")
  }

  function startCountdown() {
    if (!countdownElements.days) return

    // Set the target date (next Sunday at 2:00 PM)
    const now = new Date()
    const targetDate = new Date()

    // Set to next Sunday
    targetDate.setDate(now.getDate() + ((7 - now.getDay()) % 7))

    // Set time to 2:00 PM
    targetDate.setHours(14, 0, 0, 0)

    // If today is Sunday and it's before 2:00 PM, use today
    if (now.getDay() === 0 && now.getHours() < 14) {
      targetDate.setDate(now.getDate())
    }

    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000)

    function updateCountdown() {
      const now = new Date()
      const diff = targetDate - now

      if (diff <= 0) {
        clearInterval(countdownInterval)

        // Reset countdown for next week
        targetDate.setDate(targetDate.getDate() + 7)
        startCountdown()
        return
      }

      // Calculate time units
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      // Update DOM
      countdownElements.days.textContent = days
      countdownElements.hours.textContent = hours
      countdownElements.minutes.textContent = minutes
      countdownElements.seconds.textContent = seconds
    }

    // Initial update
    updateCountdown()
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `

    document.body.appendChild(notification)

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove()
    }, 5000)

    // Close button handler
    notification.querySelector(".notification-close").addEventListener("click", () => {
      notification.remove()
    })
  }

  function getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    }
    return icons[type] || "info-circle"
  }

  // Add notification and animation styles
  const additionalStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            min-width: 300px;
        }
        
        .notification-success {
            border-left: 4px solid #28a745;
        }
        
        .notification-error {
            border-left: 4px solid #dc3545;
        }
        
        .notification-warning {
            border-left: 4px solid #ffc107;
        }
        
        .notification-info {
            border-left: 4px solid #17a2b8;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
        }
        
        .notification-content i {
            flex-shrink: 0;
        }
        
        .notification-success .notification-content i {
            color: #28a745;
        }
        
        .notification-error .notification-content i {
            color: #dc3545;
        }
        
        .notification-warning .notification-content i {
            color: #ffc107;
        }
        
        .notification-info .notification-content i {
            color: #17a2b8;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            margin-left: auto;
            flex-shrink: 0;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .action-btn.liked {
            background-color: #dc3545;
            color: white;
        }
        
        .pulse-animation {
            animation: pulse 0.5s ease;
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.5);
            }
            100% {
                transform: scale(1);
            }
        }
    `

  const styleSheet = document.createElement("style")
  styleSheet.textContent = additionalStyles
  document.head.appendChild(styleSheet)

  // Load saved notes if available
  if (sermonNotes) {
    const savedNotes = localStorage.getItem("sermon_notes")
    if (savedNotes) {
      sermonNotes.value = savedNotes
    }
  }
})
