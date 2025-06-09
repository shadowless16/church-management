// Prayer Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize prayer page functionality
  initPrayerForm()
  initCharacterCount()
  initScrollAnimations()
})

// Prayer Form
function initPrayerForm() {
  const form = document.getElementById("prayer-form")
  const formSection = document.querySelector(".prayer-form-section")
  const successSection = document.getElementById("success-section")

  form.addEventListener("submit", handlePrayerFormSubmit)
}

function handlePrayerFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const submitBtn = e.target.querySelector('button[type="submit"]')

  // Get form values
  const email = formData.get("email")
  const prayerRequest = formData.get("prayer-request")
  // const privacy = formData.get("privacy")

  // Validation
  if (!email) {
    showMessage("Please enter your email address.", "error")
    return
  }

  if (!validateEmail(email)) {
    showMessage("Please enter a valid email address.", "error")
    return
  }

  if (!prayerRequest || prayerRequest.trim().length < 10) {
    showMessage("Please enter a prayer request with at least 10 characters.", "error")
    return
  }

  // if (!privacy) {
  //   showMessage("Please select a privacy option for your prayer request.", "error")
  //   return
  // }

  // Show loading state
  submitBtn.textContent = "Submitting..."
  submitBtn.disabled = true

  // Simulate form submission
  setTimeout(() => {
    // Hide form section and show success section
    document.querySelector(".prayer-form-section").style.display = "none"
    document.getElementById("success-section").style.display = "block"

    // Scroll to success section
    document.getElementById("success-section").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })

    // Send confirmation email (in real app)
    sendPrayerConfirmation(email, prayerRequest/*, privacy*/)
  }, 2000)
}

// Character count for prayer request
function initCharacterCount() {
  const textarea = document.getElementById("prayer-request")
  const charCount = document.getElementById("char-count")
  const maxLength = 1000

  if (textarea && charCount) {
    textarea.addEventListener("input", () => {
      const currentLength = textarea.value.length
      charCount.textContent = currentLength

      // Change color based on character count
      if (currentLength > maxLength * 0.9) {
        charCount.style.color = "#dc3545" // Red
      } else if (currentLength > maxLength * 0.7) {
        charCount.style.color = "#ffc107" // Yellow
      } else {
        charCount.style.color = "#6c757d" // Gray
      }

      // Prevent exceeding max length
      if (currentLength > maxLength) {
        textarea.value = textarea.value.substring(0, maxLength)
        charCount.textContent = maxLength
      }
    })
  }
}

// Reset form function (called from success section)
function resetForm() {
  const form = document.getElementById("prayer-form")
  const formSection = document.querySelector(".prayer-form-section")
  const successSection = document.getElementById("success-section")
  const submitBtn = form.querySelector('button[type="submit"]')

  // Reset form
  form.reset()

  // Reset character count
  const charCount = document.getElementById("char-count")
  if (charCount) {
    charCount.textContent = "0"
    charCount.style.color = "#6c757d"
  }

  // Reset submit button
  submitBtn.textContent = "Submit Prayer Request"
  submitBtn.disabled = false

  // Show form section and hide success section
  formSection.style.display = "block"
  successSection.style.display = "none"

  // Scroll to form
  formSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

// Send prayer confirmation (placeholder)
function sendPrayerConfirmation(email, prayerRequest/*, privacy*/) {
  // In a real application, this would send the prayer request to your server
  // and trigger email notifications to the prayer team
  console.log("Prayer request submitted:", {
    email,
    prayerRequest: prayerRequest.substring(0, 50) + "...", // Log only first 50 chars for privacy
    // privacy,
    timestamp: new Date().toISOString(),
  })

  // You would also:
  // 1. Save to database
  // 2. Send confirmation email to user
  // 3. Notify prayer team based on privacy settings
  // 4. Set up follow-up reminders
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
        max-width: 350px;
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

// Scroll Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".promise-card, .ministry-card, .resource-card, .contact-option, .form-section",
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  animatedElements.forEach((el) => {
    el.classList.add("animate-in")
    observer.observe(el)
  })
}

// Prayer request categories data (for future enhancements)
const prayerCategories = {
  healing: {
    title: "Healing & Health",
    description: "Physical, emotional, or mental healing needs",
    scriptures: ["James 5:14-15", "Psalm 103:2-3", "1 Peter 2:24"],
  },
  family: {
    title: "Family & Relationships",
    description: "Marriage, children, family conflicts, relationships",
    scriptures: ["Ephesians 5:25", "Proverbs 22:6", "1 Corinthians 13:4-7"],
  },
  financial: {
    title: "Financial Provision",
    description: "Job loss, debt, financial struggles, provision needs",
    scriptures: ["Philippians 4:19", "Matthew 6:26", "Malachi 3:10"],
  },
  employment: {
    title: "Employment & Career",
    description: "Job search, career decisions, workplace issues",
    scriptures: ["Proverbs 16:3", "Ecclesiastes 3:1", "Colossians 3:23"],
  },
  spiritual: {
    title: "Spiritual Growth",
    description: "Faith struggles, spiritual dryness, growth in Christ",
    scriptures: ["2 Peter 3:18", "Philippians 1:6", "Ephesians 4:15"],
  },
  guidance: {
    title: "Guidance & Direction",
    description: "Life decisions, God's will, future direction",
    scriptures: ["Proverbs 3:5-6", "Psalm 32:8", "Isaiah 30:21"],
  },
  salvation: {
    title: "Salvation of Loved Ones",
    description: "Unsaved family members, friends, evangelism",
    scriptures: ["Romans 10:9", "2 Peter 3:9", "1 Timothy 2:4"],
  },
  protection: {
    title: "Protection & Safety",
    description: "Physical safety, spiritual protection, travel",
    scriptures: ["Psalm 91:11", "Proverbs 18:10", "2 Thessalonians 3:3"],
  },
  grief: {
    title: "Grief & Loss",
    description: "Death of loved ones, loss, comfort needed",
    scriptures: ["Psalm 23:4", "2 Corinthians 1:3-4", "Revelation 21:4"],
  },
  thanksgiving: {
    title: "Thanksgiving & Praise",
    description: "Gratitude, praise reports, celebrating God's goodness",
    scriptures: ["1 Thessalonians 5:18", "Psalm 100:4", "Ephesians 5:20"],
  },
}

// Function to get category info (for future use)
function getCategoryInfo(categoryKey) {
  return prayerCategories[categoryKey] || null
}
