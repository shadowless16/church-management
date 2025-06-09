// Contact Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const contactForm = document.getElementById("contact-form")
  const successMessage = document.getElementById("contact-success")
  const messageTextarea = document.getElementById("message")
  const charCount = document.getElementById("message-char-count")
  const faqItems = document.querySelectorAll(".faq-item")

  // Initialize
  setupEventListeners()
  updateDateTime()
  setInterval(updateDateTime, 1000) // Update time every second

  function setupEventListeners() {
    // Contact form submission
    contactForm.addEventListener("submit", handleFormSubmission)

    // Character counter for message
    messageTextarea.addEventListener("input", function () {
      const count = this.value.length
      charCount.textContent = count

      if (count > 900) {
        charCount.style.color = "#dc3545"
      } else if (count > 750) {
        charCount.style.color = "#ffc107"
      } else {
        charCount.style.color = "#6c757d"
      }
    })

    // FAQ accordion
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active")

        // Close all FAQ items
        faqItems.forEach((faqItem) => {
          faqItem.classList.remove("active")
        })

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add("active")
        }
      })
    })

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })

    // Form validation
    setupFormValidation()
  }

  function setupFormValidation() {
    const requiredFields = contactForm.querySelectorAll("[required]")

    requiredFields.forEach((field) => {
      field.addEventListener("blur", function () {
        validateField(this)
      })

      field.addEventListener("input", function () {
        if (this.classList.contains("error")) {
          validateField(this)
        }
      })
    })
  }

  function validateField(field) {
    const value = field.value.trim()
    let isValid = true
    let errorMessage = ""

    // Remove existing error styling
    field.classList.remove("error")
    const existingError = field.parentNode.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }

    // Check if required field is empty
    if (field.hasAttribute("required") && !value) {
      isValid = false
      errorMessage = "This field is required"
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address"
      }
    }

    // Phone validation (optional)
    if (field.type === "tel" && value) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(value.replace(/[\s\-$$$$]/g, ""))) {
        isValid = false
        errorMessage = "Please enter a valid phone number"
      }
    }

    // Message length validation
    if (field.id === "message" && value.length > 1000) {
      isValid = false
      errorMessage = "Message must be less than 1000 characters"
    }

    if (!isValid) {
      field.classList.add("error")
      const errorElement = document.createElement("div")
      errorElement.className = "error-message"
      errorElement.textContent = errorMessage
      field.parentNode.appendChild(errorElement)
    }

    return isValid
  }

  function handleFormSubmission(e) {
    e.preventDefault()

    // Validate all fields
    const requiredFields = contactForm.querySelectorAll("[required]")
    let isFormValid = true

    requiredFields.forEach((field) => {
      if (!validateField(field)) {
        isFormValid = false
      }
    })

    if (!isFormValid) {
      showNotification("Please correct the errors in the form", "error")
      return
    }

    // Get form data
    const formData = new FormData(contactForm)
    const contactData = {
      firstName: formData.get("first_name"),
      lastName: formData.get("last_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      newsletter: formData.get("newsletter") === "on",
      prayerList: formData.get("prayer_list") === "on",
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.textContent = "Sending Message..."
    submitBtn.disabled = true

    // Simulate API call
    setTimeout(() => {
      // Hide form and show success message
      contactForm.style.display = "none"
      successMessage.style.display = "block"

      // Reset submit button (in case user goes back)
      submitBtn.textContent = originalText
      submitBtn.disabled = false

      console.log("Contact form submitted:", contactData)

      // Scroll to success message
      successMessage.scrollIntoView({ behavior: "smooth" })
    }, 2000)
  }

  function updateDateTime() {
    const now = new Date()
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Lagos",
    }

    const dateTimeString = now.toLocaleDateString("en-US", options)

    // Update any datetime displays
    const dateTimeElements = document.querySelectorAll(".current-datetime")
    dateTimeElements.forEach((element) => {
      element.textContent = dateTimeString
    })
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

  // Add interactive animations
  function addInteractiveAnimations() {
    // Animate contact cards on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe contact cards
    const contactCards = document.querySelectorAll(".contact-card")
    contactCards.forEach((card, index) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(30px)"
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
      observer.observe(card)
    })

    // Observe info cards
    const infoCards = document.querySelectorAll(".info-card")
    infoCards.forEach((card, index) => {
      card.style.opacity = "0"
      card.style.transform = "translateX(30px)"
      card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`
      observer.observe(card)
    })
  }

  // Initialize animations
  addInteractiveAnimations()

  // Add notification styles
  const notificationStyles = `
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
        
        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 4px;
        }
        
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #dc3545;
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
    `

  const styleSheet = document.createElement("style")
  styleSheet.textContent = notificationStyles
  document.head.appendChild(styleSheet)
})
