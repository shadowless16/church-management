// Blog Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Blog data
    const blogPosts = [
        {
            id: 1,
            title: "Walking in Faith Through Difficult Times",
            excerpt: "Discover how to maintain your faith when life gets challenging and find strength in God's promises.",
            category: "faith",
            author: "Pastor John Adebayo",
            date: "2025-06-05",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            views: 245,
            likes: 18
        },
        {
            id: 2,
            title: "Building Strong Family Foundations",
            excerpt: "Learn biblical principles for creating a loving, Christ-centered home that honors God.",
            category: "family",
            author: "Pastor Grace Adebayo",
            date: "2025-06-03",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            views: 189,
            likes: 24
        },
        {
            id: 3,
            title: "The Power of Corporate Prayer",
            excerpt: "Understanding the importance of praying together as a church community and its impact.",
            category: "prayer",
            author: "Minister David Okafor",
            date: "2025-06-01",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            views: 156,
            likes: 31
        },
        {
            id: 4,
            title: "Serving in Your Local Community",
            excerpt: "Practical ways to be the hands and feet of Jesus in your neighborhood and beyond.",
            category: "community",
            author: "Sister Mary Okonkwo",
            date: "2025-05-30",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            views: 203,
            likes: 15
        },
        {
            id: 5,
            title: "Daily Devotions: Starting Your Day with God",
            excerpt: "Establish a meaningful morning routine that centers your heart on God's word and presence.",
            category: "devotional",
            author: "Pastor John Adebayo",
            date: "2025-05-28",
            readTime: "3 min read",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            views: 312,
            likes: 42
        },
        {
            id: 6,
            title: "Youth Ministry: Reaching the Next Generation",
            excerpt: "Innovative approaches to engaging young people in meaningful faith experiences.",
            category: "youth",
            author: "Brother Samuel Eze",
            date: "2025-05-26",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            views: 178,
            likes: 27
        }
    ];

    let currentPosts = [...blogPosts];
    let postsPerPage = 6;
    let currentPage = 1;

    // DOM elements
    const postsGrid = document.getElementById('posts-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('blog-search');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const newsletterForm = document.getElementById('newsletter-form');

    // Initialize
    renderPosts();
    setupEventListeners();

    function setupEventListeners() {
        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.dataset.category;
                filterPosts(category);
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchPosts(searchTerm);
        });

        // Load more button
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            renderPosts(true);
        });

        // Newsletter form
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSignup();
        });
    }

    function filterPosts(category) {
        if (category === 'all') {
            currentPosts = [...blogPosts];
        } else {
            currentPosts = blogPosts.filter(post => post.category === category);
        }
        currentPage = 1;
        renderPosts();
    }

    function searchPosts(searchTerm) {
        if (searchTerm === '') {
            currentPosts = [...blogPosts];
        } else {
            currentPosts = blogPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.excerpt.toLowerCase().includes(searchTerm) ||
                post.author.toLowerCase().includes(searchTerm)
            );
        }
        currentPage = 1;
        renderPosts();
    }

    function renderPosts(append = false) {
        const startIndex = append ? (currentPage - 1) * postsPerPage : 0;
        const endIndex = currentPage * postsPerPage;
        const postsToShow = currentPosts.slice(startIndex, endIndex);

        if (!append) {
            postsGrid.innerHTML = '';
        }

        postsToShow.forEach(post => {
            const postCard = createPostCard(post);
            postsGrid.appendChild(postCard);
        });

        // Update load more button visibility
        if (endIndex >= currentPosts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }

        // Add animation to new posts
        if (append) {
            const newPosts = postsGrid.querySelectorAll('.post-card:nth-last-child(-n+' + postsToShow.length + ')');
            newPosts.forEach((post, index) => {
                setTimeout(() => {
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(20px)';
                    post.offsetHeight; // Trigger reflow
                    post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    }

    function createPostCard(post) {
        const card = document.createElement('article');
        card.className = 'post-card';
        
        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        card.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="post-category">${getCategoryName(post.category)}</div>
            </div>
            <div class="post-content">
                <div class="post-date">${formattedDate}</div>
                <h3>${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-footer">
                    <a href="blog-post.html?id=${post.id}" class="read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                    <div class="post-stats">
                        <span><i class="fas fa-eye"></i> ${post.views}</span>
                        <span><i class="fas fa-heart"></i> ${post.likes}</span>
                    </div>
                </div>
            </div>
        `;

        // Add click handler for the entire card
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.read-more')) {
                window.location.href = `blog-post.html?id=${post.id}`;
            }
        });

        return card;
    }

    function getCategoryName(category) {
        const categoryNames = {
            'faith': 'Faith',
            'family': 'Family',
            'prayer': 'Prayer',
            'community': 'Community',
            'devotional': 'Devotional',
            'youth': 'Youth'
        };
        return categoryNames[category] || category;
    }

    function handleNewsletterSignup() {
        const email = document.getElementById('newsletter-email').value;
        
        // Show loading state
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Show success message
            showNotification('Thank you for subscribing! You\'ll receive our weekly devotional in your inbox.', 'success');
            
            // Reset form
            newsletterForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

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
        }
        
        .notification-success {
            border-left: 4px solid #28a745;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
        }
        
        .notification-content i {
            color: #28a745;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            margin-left: auto;
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
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
});
