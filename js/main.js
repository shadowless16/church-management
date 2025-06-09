// Main JavaScript file for The Nest Church website

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initNavigation()
  initTestimoniesCarousel()
  initForms()
  initScrollEffects()
  initLazyLoading()
})

// Navigation functionality
function initNavigation() {
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")
  const navbar = document.getElementById("navbar")

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })
  }

  // Navbar scroll effect
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    })
  }

  // Active navigation link
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (
      link.getAttribute("href") === currentPage ||
      (currentPage === "" && link.getAttribute("href") === "index.html")
    ) {
      link.classList.add("active")
    }
  })
}

// Testimonies carousel functionality
function initTestimoniesCarousel() {
  const testimoniesContainer = document.querySelector(".testimonies-container")
  const testimonies = document.querySelectorAll(".testimony")
  const prevBtn = document.getElementById("prev-testimony")
  const nextBtn = document.getElementById("next-testimony")

  if (!testimoniesContainer || testimonies.length === 0) return

  let currentTestimony = 0

  function showTestimony(index) {
    testimonies.forEach((testimony, i) => {
      testimony.classList.toggle("active", i === index)
    })
  }

  function nextTestimony() {
    currentTestimony = (currentTestimony + 1) % testimonies.length
    showTestimony(currentTestimony)
  }

  function prevTestimony() {
    currentTestimony = (currentTestimony - 1 + testimonies.length) % testimonies.length
    showTestimony(currentTestimony)
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener("click", nextTestimony)
  if (prevBtn) prevBtn.addEventListener("click", prevTestimony)

  // Auto-advance testimonies
  setInterval(nextTestimony, 5000)

  // Touch/swipe support for mobile
  let startX = 0
  let endX = 0

  testimoniesContainer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
  })

  testimoniesContainer.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX
    handleSwipe()
  })

  function handleSwipe() {
    const swipeThreshold = 50
    const diff = startX - endX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextTestimony()
      } else {
        prevTestimony()
      }
    }
  }
}

// Form handling
function initForms() {
  // Newsletter form
  const newsletterForm = document.getElementById("newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit)
  }

  // Contact form
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit)
  }

  // Prayer request form
  const prayerForm = document.getElementById("prayer-form")
  if (prayerForm) {
    prayerForm.addEventListener("submit", handlePrayerSubmit)
  }

  // Testimony form
  const testimonyForm = document.getElementById("testimony-form")
  if (testimonyForm) {
    testimonyForm.addEventListener("submit", handleTestimonySubmit)
  }

  // Give form
  const giveForm = document.getElementById("give-form")
  if (giveForm) {
    giveForm.addEventListener("submit", handleGiveSubmit)
  }
}

// Newsletter form submission
function handleNewsletterSubmit(e) {
  e.preventDefault()

  const form = e.target
  const email = form.querySelector("#newsletter-email").value
  const submitBtn = form.querySelector('button[type="submit"]')

  if (!validateEmail(email)) {
    showMessage("Please enter a valid email address.", "error")
    return
  }

  // Show loading state
  submitBtn.textContent = "Subscribing..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    showMessage("Thank you for subscribing to our newsletter!", "success")
    form.reset()
    submitBtn.textContent = "Subscribe"
    submitBtn.disabled = false
  }, 1000)
}

// Contact form submission
function handleContactSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const submitBtn = form.querySelector('button[type="submit"]')

  // Validate required fields
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  if (!name || !email || !message) {
    showMessage("Please fill in all required fields.", "error")
    return
  }

  if (!validateEmail(email)) {
    showMessage("Please enter a valid email address.", "error")
    return
  }

  // Show loading state
  submitBtn.textContent = "Sending..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    showMessage("Thank you for your message! We'll get back to you soon.", "success")
    form.reset()
    submitBtn.textContent = "Send Message"
    submitBtn.disabled = false
  }, 1000)
}

// Prayer request form submission
function handlePrayerSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const submitBtn = form.querySelector('button[type="submit"]')

  // Validate required fields
  const email = formData.get("email")
  const request = formData.get("request")

  if (!email || !request) {
    showMessage("Please fill in all required fields.", "error")
    return
  }

  if (!validateEmail(email)) {
    showMessage("Please enter a valid email address.", "error")
    return
  }

  // Show loading state
  submitBtn.textContent = "Submitting..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    showMessage("Your prayer request has been submitted. Our prayer team will be praying for you.", "success")
    form.reset()
    submitBtn.textContent = "Submit Prayer Request"
    submitBtn.disabled = false
  }, 1000)
}

// Testimony form submission
function handleTestimonySubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const submitBtn = form.querySelector('button[type="submit"]')

  // Validate required fields
  const title = formData.get("title")
  const testimony = formData.get("testimony")

  if (!title || !testimony) {
    showMessage("Please fill in all required fields.", "error")
    return
  }

  // Show loading state
  submitBtn.textContent = "Submitting..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    showMessage("Thank you for sharing your testimony! It will be reviewed and published soon.", "success")
    form.reset()
    submitBtn.textContent = "Submit Testimony"
    submitBtn.disabled = false
  }, 1000)
}

// Give form submission (Paystack integration placeholder)
function handleGiveSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const submitBtn = form.querySelector('button[type="submit"]')

  // Validate required fields
  const amount = formData.get("amount")
  const email = formData.get("email")
  const name = formData.get("name")

  if (!amount || !email || !name) {
    showMessage("Please fill in all required fields.", "error")
    return
  }

  if (!validateEmail(email)) {
    showMessage("Please enter a valid email address.", "error")
    return
  }

  if (Number.parseFloat(amount) < 100) {
    showMessage("Minimum donation amount is ₦100.", "error")
    return
  }

  // Show loading state
  submitBtn.textContent = "Processing..."
  submitBtn.disabled = true

  // Paystack integration would go here
  // For now, simulate payment processing
  setTimeout(() => {
    showMessage("Thank you for your generous donation! Your payment is being processed.", "success")
    submitBtn.textContent = "Proceed to Payment"
    submitBtn.disabled = false
  }, 2000)
}

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Show message function
function showMessage(message, type = "info") {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(".message")
  existingMessages.forEach((msg) => msg.remove())

  // Create message element
  const messageEl = document.createElement("div")
  messageEl.className = `message ${type}`
  messageEl.textContent = message

  // Style the message
  messageEl.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#007bff"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 300px;
        font-family: var(--font-body);
        font-size: 14px;
        line-height: 1.4;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `

  document.body.appendChild(messageEl)

  // Animate in
  setTimeout(() => {
    messageEl.style.transform = "translateX(0)"
  }, 100)

  // Remove after 5 seconds
  setTimeout(() => {
    messageEl.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl)
      }
    }, 300)
  }, 5000)
}

// Scroll effects
function initScrollEffects() {
  // Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]')

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70 // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".card, .blog-card, .service-time")
  animateElements.forEach((el) => {
    observer.observe(el)
  })
}

// Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]')

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => {
      imageObserver.observe(img)
    })
  }
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Performance optimization
window.addEventListener("load", () => {
  // Remove loading class from body if it exists
  document.body.classList.remove("loading")

  // Initialize any additional components that need the page to be fully loaded
  initAdditionalComponents()
})

function initAdditionalComponents() {
  // Initialize any components that require full page load
  // This could include video players, maps, etc.
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
  // You could send this to an error tracking service
})

// Service Worker registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful")
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed")
      })
  })
}
