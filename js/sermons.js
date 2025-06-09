// Sermons Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize sermon functionality
  initSermonPlayer()
  initSermonSearch()
  initViewToggle()
  initSermonFilters()
  initScrollAnimations()
})

// Sermon Player Modal
function initSermonPlayer() {
  const modal = document.getElementById("sermon-modal")
  const closeModal = document.getElementById("close-modal")
  const playButtons = document.querySelectorAll(".play-btn, .sermon-watch")
  const videoFrame = document.getElementById("sermon-video-frame")

  // Sample sermon data (in a real application, this would come from a database)
  const sermonData = {
    "sermon-1": {
      title: "Walking in Faith During Uncertain Times",
      speaker: "Pastor John Adebayo",
      series: "Faith Foundations",
      date: "June 2, 2025",
      description:
        "Discover how to maintain unwavering faith when life's circumstances seem overwhelming. In this powerful message, Pastor John shares biblical principles and practical steps to help you stand firm in your faith regardless of what challenges you face.",
      scripture: "Hebrews 11:1",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    "sermon-2": {
      title: "The Power of Forgiveness",
      speaker: "Pastor Grace Adebayo",
      series: "Healing Hearts",
      date: "May 26, 2025",
      description:
        "Understanding God's forgiveness and learning to forgive others as Christ forgave us. Pastor Grace explores the transformative power of forgiveness and how it can bring healing to even the deepest wounds.",
      scripture: "Matthew 6:14-15",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    "sermon-3": {
      title: "Purpose-Driven Living",
      speaker: "Pastor John Adebayo",
      series: "Discovering Your Destiny",
      date: "May 19, 2025",
      description:
        "How to discover and walk in God's unique purpose for your life. This message will help you understand the specific calling God has placed on your life and how to fulfill it with passion and excellence.",
      scripture: "Jeremiah 29:11",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  }

  // Open modal when play button is clicked
  playButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sermonId = button.getAttribute("data-sermon-id")
      const sermon = sermonData[sermonId]

      if (sermon) {
        // Update modal content
        document.getElementById("modal-sermon-title").textContent = sermon.title
        document.getElementById("modal-speaker").textContent = sermon.speaker
        document.getElementById("modal-series").textContent = sermon.series
        document.getElementById("modal-date").textContent = sermon.date
        document.getElementById("modal-description").textContent = sermon.description
        document.getElementById("modal-scripture-text").textContent = sermon.scripture

        // Set video URL
        videoFrame.src = sermon.videoUrl

        // Show modal
        modal.classList.add("active")
        document.body.style.overflow = "hidden" // Prevent scrolling
      }
    })
  })

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.classList.remove("active")
    document.body.style.overflow = "" // Restore scrolling
    videoFrame.src = "" // Stop video
  })

  // Close modal when clicking outside content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active")
      document.body.style.overflow = "" // Restore scrolling
      videoFrame.src = "" // Stop video
    }
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      modal.classList.remove("active")
      document.body.style.overflow = "" // Restore scrolling
      videoFrame.src = "" // Stop video
    }
  })
}

// Sermon Search
function initSermonSearch() {
  const searchInput = document.getElementById("sermon-search-input")
  const sermonCards = document.querySelectorAll(".sermon-card")
  const emptyState = document.getElementById("empty-state")
  const clearFiltersBtn = document.getElementById("clear-filters")

  searchInput.addEventListener("input", filterSermons)

  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = ""
    document.getElementById("series-filter").value = "all"
    document.getElementById("sort-filter").value = "newest"
    filterSermons()
  })

  function filterSermons() {
    const searchTerm = searchInput.value.toLowerCase()
    const selectedSeries = document.getElementById("series-filter").value

    let visibleCount = 0

    sermonCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase()
      const speaker = card.querySelector(".sermon-speaker").textContent.toLowerCase()
      const description = card.querySelector(".sermon-description").textContent.toLowerCase()
      const series = card.getAttribute("data-series")

      const matchesSearch =
        title.includes(searchTerm) || speaker.includes(searchTerm) || description.includes(searchTerm)

      const matchesSeries = selectedSeries === "all" || series === selectedSeries

      if (matchesSearch && matchesSeries) {
        card.style.display = "flex"
        visibleCount++
      } else {
        card.style.display = "none"
      }
    })

    // Show/hide empty state
    if (visibleCount === 0) {
      emptyState.style.display = "block"
    } else {
      emptyState.style.display = "none"
    }
  }
}

// View Toggle (Grid/List)
function initViewToggle() {
  const viewButtons = document.querySelectorAll(".view-btn")
  const sermonsContainer = document.getElementById("sermons-container")

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.getAttribute("data-view")

      // Update active button
      viewButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Update view
      if (view === "grid") {
        sermonsContainer.classList.remove("list-view")
      } else {
        sermonsContainer.classList.add("list-view")
      }
    })
  })
}

// Sermon Filters
function initSermonFilters() {
  const seriesFilter = document.getElementById("series-filter")
  const sortFilter = document.getElementById("sort-filter")
  const sermonsContainer = document.getElementById("sermons-container")
  const sermonCards = document.querySelectorAll(".sermon-card")

  seriesFilter.addEventListener("change", filterSermons)
  sortFilter.addEventListener("change", sortSermons)

  function filterSermons() {
    const selectedSeries = seriesFilter.value
    const searchTerm = document.getElementById("sermon-search-input").value.toLowerCase()

    let visibleCount = 0

    sermonCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase()
      const speaker = card.querySelector(".sermon-speaker").textContent.toLowerCase()
      const description = card.querySelector(".sermon-description").textContent.toLowerCase()
      const series = card.getAttribute("data-series")

      const matchesSearch =
        title.includes(searchTerm) || speaker.includes(searchTerm) || description.includes(searchTerm)

      const matchesSeries = selectedSeries === "all" || series === selectedSeries

      if (matchesSearch && matchesSeries) {
        card.style.display = "flex"
        visibleCount++
      } else {
        card.style.display = "none"
      }
    })

    // Show/hide empty state
    if (visibleCount === 0) {
      document.getElementById("empty-state").style.display = "block"
    } else {
      document.getElementById("empty-state").style.display = "none"
    }

    // Re-sort after filtering
    sortSermons()
  }

  function sortSermons() {
    const sortBy = sortFilter.value
    const sermons = Array.from(sermonCards)

    sermons.sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = new Date(a.querySelector(".sermon-date span").textContent)
        const dateB = new Date(b.querySelector(".sermon-date span").textContent)
        return dateB - dateA
      } else if (sortBy === "oldest") {
        const dateA = new Date(a.querySelector(".sermon-date span").textContent)
        const dateB = new Date(b.querySelector(".sermon-date span").textContent)
        return dateA - dateB
      } else if (sortBy === "title") {
        const titleA = a.querySelector("h3").textContent
        const titleB = b.querySelector("h3").textContent
        return titleA.localeCompare(titleB)
      } else if (sortBy === "popular") {
        // In a real application, this would sort by view count or popularity
        // For this demo, we'll just use a random sort
        return Math.random() - 0.5
      }
    })

    // Re-append sorted sermons
    sermons.forEach((sermon) => {
      sermonsContainer.appendChild(sermon)
    })
  }
}

// Load More Button
document.getElementById("load-more-btn").addEventListener("click", function () {
  // In a real application, this would load more sermons from the server
  // For this demo, we'll just show a message
  this.textContent = "No more sermons to load"
  this.disabled = true

  setTimeout(() => {
    this.textContent = "Load More Sermons"
    this.disabled = false
  }, 3000)
})

// Newsletter Form
document.getElementById("sermon-newsletter-form").addEventListener("submit", function (e) {
  e.preventDefault()

  const emailInput = this.querySelector("input[type='email']")
  const submitBtn = this.querySelector("button[type='submit']")

  // Validate email
  if (!emailInput.value) {
    showMessage("Please enter your email address.", "error")
    return
  }

  // Show loading state
  submitBtn.textContent = "Subscribing..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    showMessage("Thank you for subscribing to our sermon updates!", "success")
    emailInput.value = ""
    submitBtn.textContent = "Subscribe"
    submitBtn.disabled = false
  }, 1500)
})

// Scroll Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".featured-sermon, .series-card, .sermon-card")

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

function showMessage(message, type) {
  // This is a placeholder for a real showMessage function
  // In a real application, this would display a message to the user
  console.log(`${type}: ${message}`)
}