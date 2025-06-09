// Give Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize giving page functionality
  initGivingTabs()
  initGivingForm()
  initFAQ()
  initScrollAnimations()
})

// Giving Tabs
function initGivingTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabPanels = document.querySelectorAll(".tab-panel")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab")

      // Remove active class from all buttons and panels
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabPanels.forEach((panel) => panel.classList.remove("active"))

      // Add active class to clicked button and corresponding panel
      button.classList.add("active")
      document.getElementById(targetTab).classList.add("active")
    })
  })
}

// Giving Form
function initGivingForm() {
  const form = document.getElementById("giving-form")
  const customAmountRadio = document.querySelector('input[name="amount"][value="custom"]')
  const customAmountInput = document.getElementById("custom-amount-input")
  const amountRadios = document.querySelectorAll('input[name="amount"]')

  // Show/hide custom amount input
  amountRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "custom") {
        customAmountInput.style.display = "block"
        document.getElementById("custom-amount-value").focus()
      } else {
        customAmountInput.style.display = "none"
      }
    })
  })

  // Form submission
  form.addEventListener("submit", handleGivingFormSubmit)
}

function handleGivingFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const submitBtn = e.target.querySelector('button[type="submit"]')

  // Get form values
  const givingType = formData.get("giving-type")
  const amount = formData.get("amount")
  const customAmount = formData.get("custom-amount")
  const fullName = formData.get("full-name")
  const email = formData.get("email")
  const phone = formData.get("phone")

  // Validation
  if (!givingType) {
    showMessage("Please select a giving type.", "error")
    return
  }

  if (!amount) {
    showMessage("Please select an amount.", "error")
    return
  }

  if (amount === "custom" && (!customAmount || Number.parseFloat(customAmount) < 100)) {
    showMessage("Please enter a custom amount of at least ₦100.", "error")
    return
  }

  if (!fullName || !email || !phone) {
    showMessage("Please fill in all required fields.", "error")
    return
  }

  if (!validateEmail(email)) {
    showMessage("Please enter a valid email address.", "error")
    return
  }

  // Calculate final amount
  const finalAmount = amount === "custom" ? customAmount : amount

  // Show loading state
  submitBtn.textContent = "Processing..."
  submitBtn.disabled = true

  // Simulate payment processing (in real app, integrate with Paystack)
  setTimeout(() => {
    // In a real application, you would integrate with Paystack here
    // For demo purposes, we'll just show a success message
    showMessage(
      `Thank you for your generous ${givingType} of ₦${Number.parseInt(finalAmount).toLocaleString()}! Redirecting to payment...`,
      "success",
    )

    // Reset form after successful submission
    setTimeout(() => {
      e.target.reset()
      customAmountInput.style.display = "none"
      submitBtn.textContent = "Proceed to Payment"
      submitBtn.disabled = false
    }, 3000)
  }, 2000)
}

// FAQ Functionality
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active")

      // Close all FAQ items
      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active")
      })

      // Open clicked item if it wasn't already active
      if (!isActive) {
        item.classList.add("active")
      }
    })
  })
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
  const animatedElements = document.querySelectorAll(".principle, .method-card, .impact-stat, .tab-content, .faq-item")

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

// Paystack Integration (placeholder)
function initializePaystack(amount, email, name, phone, givingType) {
  // This is where you would integrate with Paystack
  // Example Paystack integration:
  /*
    const handler = PaystackPop.setup({
        key: 'your-paystack-public-key',
        email: email,
        amount: amount * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        ref: 'nest-church-' + Math.floor((Math.random() * 1000000000) + 1),
        metadata: {
            custom_fields: [
                {
                    display_name: "Giving Type",
                    variable_name: "giving_type",
                    value: givingType
                },
                {
                    display_name: "Full Name",
                    variable_name: "full_name",
                    value: name
                },
                {
                    display_name: "Phone",
                    variable_name: "phone",
                    value: phone
                }
            ]
        },
        callback: function(response) {
            // Payment successful
            showMessage('Payment successful! Reference: ' + response.reference, 'success');
            // Send payment details to your server for verification
        },
        onClose: function() {
            // Payment cancelled
            showMessage('Payment cancelled.', 'error');
        }
    });
    
    handler.openIframe();
    */

  console.log("Paystack integration would be initialized here", {
    amount,
    email,
    name,
    phone,
    givingType,
  })
}
