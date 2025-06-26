// Testimonies Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Testimonies data
  const testimonies = [
    {
      id: 1,
      title: "God Healed My Marriage",
      content:
        "After 15 years of marriage, my husband and I were on the brink of divorce. Through the prayers of this church family and God's grace, our marriage was completely restored. We now serve together in ministry and our love is stronger than ever.",
      category: "family",
      author: "Sarah M.",
      date: "2025-05-20",
      featured: true,
    },
    {
      id: 2,
      title: "Delivered from Addiction",
      content:
        "I struggled with alcohol addiction for over 10 years. When I came to The Nest Church, broken and hopeless, the love of God through this community set me free. I've been sober for 2 years now and serving in the recovery ministry.",
      category: "deliverance",
      author: "Michael K.",
      date: "2025-05-15",
      featured: false,
    },
    {
      id: 3,
      title: "Financial Breakthrough",
      content:
        "After losing my job during the pandemic, I was struggling to provide for my family. Through faithful tithing and the church's support, God opened doors I never imagined. I now own my own business and employ 5 people.",
      category: "financial",
      author: "David O.",
      date: "2025-05-10",
      featured: false,
    },
    {
      id: 4,
      title: "Miraculous Healing from Cancer",
      content:
        "When doctors gave me 6 months to live, this church rallied around me in prayer. Through God's miraculous power and the support of my church family, I am now cancer-free for 3 years. God is still in the healing business!",
      category: "healing",
      author: "Grace A.",
      date: "2025-05-05",
      featured: true,
    },
    {
      id: 5,
      title: "Found My Purpose in Christ",
      content:
        "I was living a successful but empty life until I encountered Jesus at The Nest Church. God revealed His purpose for my life, and I now serve as a youth pastor, impacting the next generation for Christ.",
      category: "career",
      author: "Samuel E.",
      date: "2025-04-28",
      featured: false,
    },
    {
      id: 6,
      title: "Salvation Story",
      content:
        "I grew up in church but never truly knew Jesus personally. During a Sunday service at The Nest Church, I gave my heart to Christ and my life was completely transformed. I now live with purpose and joy.",
      category: "salvation",
      author: "Mary O.",
      date: "2025-04-25",
      featured: false,
    },
  ]

  let currentTestimonies = [...testimonies]
  const testimoniesPerPage = 6
  let currentPage = 1

  // DOM elements
  const testimoniesContainer = document.getElementById("testimonies-container")
  const filterBtns = document.querySelectorAll(".filter-btn")
  const searchInput = document.getElementById("testimony-search")
  const loadMoreBtn = document.getElementById("load-more-testimonies")
  const categoryCards = document.querySelectorAll(".category-card")

  // Modal elements
  const modal = document.getElementById("testimony-modal")
  const testimonyForm = document.getElementById("testimony-form")
  const successMessage = document.getElementById("testimony-success")
  const shareTestimonyBtns = document.querySelectorAll("#share-testimony-btn, #open-testimony-form")
  const closeModalBtn = document.getElementById("close-modal")
  const cancelBtn = document.getElementById("cancel-testimony")
  const closeSuccessBtn = document.getElementById("close-success")

  // Initialize
  renderTestimonies()
  setupEventListeners()

  function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const category = this.dataset.category
        filterTestimonies(category)

        // Update active button
        filterBtns.forEach((b) => b.classList.remove("active"))
        this.classList.add("active")
      })
    })

    // Category cards
    categoryCards.forEach((card) => {
      card.addEventListener("click", function () {
        const category = this.dataset.category
        filterTestimonies(category)

        // Update filter button
        filterBtns.forEach((b) => b.classList.remove("active"))
        const targetBtn = document.querySelector(`[data-category="${category}"]`)
        if (targetBtn) targetBtn.classList.add("active")

        // Scroll to testimonies section
        document.querySelector(".testimonies-grid").scrollIntoView({
          behavior: "smooth",
        })
      })
    })

    // Search functionality
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      searchTestimonies(searchTerm)
    })

    // Load more button
    loadMoreBtn.addEventListener("click", () => {
      currentPage++
      renderTestimonies(true)
    })

    // Modal controls
    shareTestimonyBtns.forEach((btn) => {
      btn.addEventListener("click", openModal)
    })

    closeModalBtn.addEventListener("click", closeModal)
    cancelBtn.addEventListener("click", closeModal)
    closeSuccessBtn.addEventListener("click", closeModal)

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal()
      }
    })

    // Testimony form submission
    testimonyForm.addEventListener("submit", handleTestimonySubmission)

    // Character counter for testimony content
    const testimonyContent = document.getElementById("testimony-content")
    const charCount = document.getElementById("char-count")

    testimonyContent.addEventListener("input", function () {
      const count = this.value.length
      charCount.textContent = count

      if (count > 1800) {
        charCount.style.color = "#dc3545"
      } else if (count > 1500) {
        charCount.style.color = "#ffc107"
      } else {
        charCount.style.color = "#6c757d"
      }
    })
  }

  function filterTestimonies(category) {
    if (category === "all") {
      currentTestimonies = [...testimonies]
    } else {
      currentTestimonies = testimonies.filter((testimony) => testimony.category === category)
    }
    currentPage = 1
    renderTestimonies()
  }

  function searchTestimonies(searchTerm) {
    if (searchTerm === "") {
      currentTestimonies = [...testimonies]
    } else {
      currentTestimonies = testimonies.filter(
        (testimony) =>
          testimony.title.toLowerCase().includes(searchTerm) ||
          testimony.content.toLowerCase().includes(searchTerm) ||
          testimony.author.toLowerCase().includes(searchTerm),
      )
    }
    currentPage = 1
    renderTestimonies()
  }

  function renderTestimonies(append = false) {
    const startIndex = append ? (currentPage - 1) * testimoniesPerPage : 0
    const endIndex = currentPage * testimoniesPerPage
    const testimoniesToShow = currentTestimonies.slice(startIndex, endIndex)

    if (!append) {
      testimoniesContainer.innerHTML = ""
    }

    testimoniesToShow.forEach((testimony) => {
      const testimonyCard = createTestimonyCard(testimony)
      testimoniesContainer.appendChild(testimonyCard)
    })

    // Update load more button visibility
    if (endIndex >= currentTestimonies.length) {
      loadMoreBtn.style.display = "none"
    } else {
      loadMoreBtn.style.display = "block"
    }

    // Add animation to new testimonies
    if (append) {
      const newTestimonies = testimoniesContainer.querySelectorAll(
        ".testimony-card:nth-last-child(-n+" + testimoniesToShow.length + ")",
      )
      newTestimonies.forEach((testimony, index) => {
        setTimeout(() => {
          testimony.style.opacity = "0"
          testimony.style.transform = "translateY(20px)"
          testimony.offsetHeight // Trigger reflow
          testimony.style.transition = "opacity 0.5s ease, transform 0.5s ease"
          testimony.style.opacity = "1"
          testimony.style.transform = "translateY(0)"
        }, index * 100)
      })
    }
  }

  function createTestimonyCard(testimony) {
    const card = document.createElement("article")
    card.className = "testimony-card"

    const formattedDate = new Date(testimony.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    card.innerHTML = `
            <div class="testimony-header">
                <div class="testimony-category">${getCategoryName(testimony.category)}</div>
                <h3 class="testimony-title">${testimony.title}</h3>
            </div>
            <div class="testimony-content">
                ${testimony.content}
            </div>
            <div class="testimony-footer">
                <span class="testimony-author">${testimony.author}</span>
                <span class="testimony-date">${formattedDate}</span>
            </div>
        `

    return card
  }

  function getCategoryName(category) {
    const categoryNames = {
      healing: "Healing & Miracles",
      financial: "Financial Breakthrough",
      family: "Family Restoration",
      deliverance: "Deliverance & Freedom",
      salvation: "Salvation Story",
      career: "Career & Purpose",
    }
    return categoryNames[category] || category
  }

  function openModal() {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"

    // Reset form and show form section
    testimonyForm.style.display = "block"
    successMessage.style.display = "none"
    testimonyForm.reset()
    document.getElementById("char-count").textContent = "0"
  }

  function closeModal() {
    modal.classList.remove("active")
    document.body.style.overflow = ""
  }

  function handleTestimonySubmission(e) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(testimonyForm)
    const testimonyData = {
      name: formData.get("name") || "Anonymous",
      email: formData.get("email"),
      category: formData.get("category"),
      title: formData.get("title"),
      content: formData.get("content"),
      scripture: formData.get("scripture"),
      allowPublication: formData.get("allow_publication") === "on",
      contactPermission: formData.get("contact_permission") === "on",
    }

    // Show loading state
    const submitBtn = testimonyForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.textContent = "Submitting..."
    submitBtn.disabled = true

    // Simulate API call
    setTimeout(() => {
      // Hide form and show success message
      testimonyForm.style.display = "none"
      successMessage.style.display = "block"

      // Reset submit button
      submitBtn.textContent = originalText
      submitBtn.disabled = false

      console.log("Testimony submitted:", testimonyData)
    }, 2000)
  }

  // Add some interactive animations
  function addInteractiveAnimations() {
    // Animate category cards on scroll
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

    // Observe category cards
    categoryCards.forEach((card, index) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(30px)"
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
      observer.observe(card)
    })
  }

  // Initialize animations
  addInteractiveAnimations()
})
