function renderBlog(content, headerActions) {
  // Blog Data
    const blogData = {
    posts: [
      {
        id: "B101",
        title: "The Power of Prayer",
        content: "<p>Prayer is a powerful tool for connecting with God...</p>",
        excerpt: "An exploration of the importance of prayer in our daily lives.",
        author: "Pastor Smith",
        date: "2024-01-29",
        category: "Faith",
        tags: ["prayer", "faith", "spirituality"],
        featuredImage: "https://static.independent.co.uk/2021/12/18/00/newFile.jpg",
        status: "published",
        views: 120,
      },
      {
        id: "B102",
        title: "Serving Our Community",
        content: "<p>Service to others is a cornerstone of our faith...</p>",
        excerpt: "A look at how we can serve our community and make a difference.",
        author: "David Wilson",
        date: "2024-01-25",
        category: "Community",
        tags: ["service", "community", "outreach"],
        featuredImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSng21QLM_cLbXkeMNdMOsE7y2N4qGLcNhUZQ&s",
        status: "published",
        views: 95,
      },
      {
        id: "B103",
        title: "Finding Joy in Giving",
        content: "<p>Giving is not just about money; it's about sharing our time and talents...</p>",
        excerpt: "Reflections on the joy and blessings that come from giving.",
        author: "Emily Brown",
        date: "2024-01-20",
        category: "Generosity",
        tags: ["giving", "generosity", "blessings"],
        featuredImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVilq-OuMkDjHHW7gOKVwyYyLd3F1HIeo3iA&s",
        status: "draft",
        views: 50,
      },
      {
        id: "B104",
        title: "The Importance of Forgiveness",
        content: "<p>Forgiveness is essential for healing and growth...</p>",
        excerpt: "Understanding the power and importance of forgiveness in our lives.",
        author: "Pastor Smith",
        date: "2024-01-15",
        category: "Faith",
        tags: ["forgiveness", "healing", "growth"],
        featuredImage: "https://trochia.org/wp-content/uploads/2012/09/blog91212.jpg",
        status: "published",
        views: 150,
      },
      {
        id: "B105",
        title: "Welcoming New Members",
        content: "<p>Welcoming new members into our church family is a vital part of our mission...</p>",
        excerpt: "How we can create a welcoming and inclusive environment for newcomers.",
        author: "Sarah Johnson",
        date: "2024-01-10",
        category: "Community",
        tags: ["welcome", "new members", "inclusion"],
        featuredImage: "https://images.ctfassets.net/hff6luki1ys4/7LDfs9AiXGaGRRh4LXvvka/72d594a44a5df312beb88c09d9c8ef2d/111323_Welcome_Message_to_New_Employee_Feature_Image.jpg",
        status: "scheduled",
        views: 75,
      },
    ],
    categories: [
        { id: "cat1", name: "announcements", count: 1 },
        { id: "cat2", name: "sermons", count: 0 },
        { id: "cat3", name: "events", count: 1 },
        { id: "cat4", name: "testimonies", count: 0 },
        { id: "cat5", name: "devotionals", count: 1 },
    ],
    stats: {
        totalPosts: 3,
        publishedPosts: 3,
        draftPosts: 0,
        totalViews: 564,
        popularCategories: ["announcements", "devotionals"],
    },
    };

    window.blogData = blogData;

    // Blog logic and rendering functions

    // Make editingPostId global so all blog functions can access it
window.editingPostId = null;
window.blogTags = [];
window.quillEditor = null;
let editingPostId = null;


  if (!content || !headerActions) return;
  headerActions.innerHTML = `
    <div class="blog-filters">
      <div class="filter-group">
        <label class="filter-label">Category:</label>
        <select class="filter-select" id="blog-category-filter">
          <option value="">All Categories</option>
          ${blogData.categories.map(cat => `<option value="${cat.name}">${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</option>`).join("")}
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Status:</label>
        <select class="filter-select" id="blog-status-filter">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>
    </div>
    <button class="btn btn-secondary btn-sm" onclick="openCategoryModal()">
      <i class="fas fa-tags"></i> Manage Categories
    </button>
    <button class="btn btn-success btn-sm" onclick="openBlogPostModal()">
      <i class="fas fa-plus"></i> New Post
    </button>
  `;

  const stats = blogData.stats;
  const posts = blogData.posts;
  content.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <h3>Total Posts</h3>
          <div class="stat-value">${stats.totalPosts}</div>
        </div>
        <div class="stat-icon blue"><i class="fas fa-blog"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <h3>Published</h3>
          <div class="stat-value">${stats.publishedPosts}</div>
        </div>
        <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <h3>Drafts</h3>
          <div class="stat-value">${stats.draftPosts}</div>
        </div>
        <div class="stat-icon orange"><i class="fas fa-edit"></i></div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <h3>Total Views</h3>
          <div class="stat-value">${stats.totalViews.toLocaleString()}</div>
        </div>
        <div class="stat-icon purple"><i class="fas fa-eye"></i></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Blog Posts</h2>
      </div>
      <div class="card-content">
        <div class="blog-grid">
          ${posts.map(post => `
            <div class="blog-card">
              ${post.featuredImage && !post.featuredImage.includes('placeholder') ? `<img src="${post.featuredImage}" alt="${post.title}" class="blog-image">` : `<div class="blog-image blog-image-placeholder">No Image</div>`}
              <div class="blog-content">
                <h3 class="blog-title">${post.title}</h3>
                <div class="blog-meta">
                  <span><i class="fas fa-user"></i> ${post.author}</span>
                  <span><i class="fas fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
                  <span><i class="fas fa-eye"></i> ${post.views} views</span>
                </div>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-actions">
                  <span class="blog-category badge ${post.status}">${post.category}</span>
                  <div class="action-buttons">
                    <button class="action-btn view" onclick="viewBlogPost('${post.id}')"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" onclick="editBlogPost('${post.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteBlogPost('${post.id}')"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.getElementById("blog-category-filter").addEventListener("change", filterBlogPosts);
    document.getElementById("blog-status-filter").addEventListener("change", filterBlogPosts);
  }, 100);
}

function openBlogPostModal(postId = null) {
  window.editingPostId = editingPostId = postId;
  const modal = document.getElementById("blog-post-modal");
  const title = document.getElementById("blog-modal-title");
  title.textContent = postId ? "Edit Blog Post" : "Create New Blog Post";
  resetBlogForm();
  modal.style.display = "block";
  setTimeout(() => {
    if (!window.quillEditor) {
      window.quillEditor = new Quill("#editor-container", {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });
    }
    if (postId) {
      const post = blogData.posts.find((p) => p.id === postId);
      window.quillEditor.root.innerHTML = post.content;
      populateBlogForm(post);
    } else {
      window.quillEditor.setText("");
    }
  }, 100);
}

function handleBlogPost(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const content = window.quillEditor.root.innerHTML;
  const postData = {
    id: window.editingPostId || editingPostId || `B${String(Date.now()).slice(-3)}`,
    title: formData.get("title"),
    content: content,
    excerpt: formData.get("excerpt"),
    author: "Admin User",
    date: new Date().toISOString().split("T")[0],
    category: formData.get("category"),
    tags: window.blogTags,
    featuredImage: document.getElementById("preview-img").src || "/placeholder.svg?height=180&width=300",
    status: formData.get("status"),
    views: editingPostId ? blogData.posts.find((p) => p.id === editingPostId).views : 0,
  };
  if (window.editingPostId || editingPostId) {
    const index = blogData.posts.findIndex((p) => p.id === editingPostId);
    if (index > -1) blogData.posts[index] = postData;
  } else {
    blogData.posts.unshift(postData);
    blogData.stats.totalPosts++;
    if (postData.status === "published") blogData.stats.publishedPosts++;
    else blogData.stats.draftPosts++;
  }
  document.getElementById("blog-post-modal").style.display = "none";
  renderBlog(document.getElementById("page-content"), document.getElementById("header-actions"));
}

function renderTags() {
  const container = document.getElementById("tags-container");
  container.innerHTML = window.blogTags
    .map(
      (tag) => `
        <span class="tag">
          ${tag}
          <span class="tag-remove" onclick="removeTag('${tag}')">&times;</span>
        </span>
      `
    )
    .join("");
  document.getElementById("post-tags").value = window.blogTags.join(",");
}

function viewBlogPost(postId) {
  const post = window.blogData.posts.find((p) => p.id === postId);
  if (!post) return;
  document.getElementById("view-blog-title").textContent = post.title;
  document.getElementById("blog-post-view").innerHTML = `
    <div class="blog-post-view">
      <div class="blog-post-header">
        <h1 class="blog-post-title">${post.title}</h1>
        <div class="blog-post-meta">
          <span><i class="fas fa-user"></i> ${post.author}</span>
          <span><i class="fas fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
          <span><i class="fas fa-folder"></i> ${post.category}</span>
          <span><i class="fas fa-eye"></i> ${post.views} views</span>
        </div>
        <div class="blog-post-tags" style="margin-top: 12px;">
          ${post.tags.map((tag) => `<span class="badge" style="margin-right: 8px;">${tag}</span>`).join("")}
        </div>
      </div>
      <img src="${post.featuredImage}" alt="${post.title}" class="blog-post-image">
      <div class="blog-post-content">${post.content}</div>
    </div>
  `;
  document.getElementById("edit-post-btn").onclick = () => {
    document.getElementById("view-blog-modal").style.display = "none";
    editBlogPost(postId);
  };
  document.getElementById("view-blog-modal").style.display = "block";
}

function editBlogPost(postId) {
  openBlogPostModal(postId);
}

function deleteBlogPost(postId) {
  if (confirm("Are you sure you want to delete this blog post?")) {
    const index = blogData.posts.findIndex((p) => p.id === postId);
    if (index > -1) {
      const post = blogData.posts[index];
      blogData.posts.splice(index, 1);
      blogData.stats.totalPosts--;
      if (post.status === "published") blogData.stats.publishedPosts--;
      else blogData.stats.draftPosts--;
      renderBlog(document.getElementById("page-content"), document.getElementById("header-actions"));
    }
  }
}

function addCategory() {
  const input = document.getElementById("new-category");
  const categoryName = input.value.trim().toLowerCase();
  if (categoryName && !blogData.categories.find((c) => c.name === categoryName)) {
    blogData.categories.push({
      id: `cat${Date.now()}`,
      name: categoryName,
      count: 0,
    });
    input.value = "";
    renderCategories();
    const categorySelect = document.getElementById("post-category");
    if (categorySelect) {
      const option = document.createElement("option");
      option.value = categoryName;
      option.textContent = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
      categorySelect.appendChild(option);
    }
  }
}

function renderCategories() {
  const container = document.getElementById("category-list");
  container.innerHTML = blogData.categories
    .map(
      (category) => `
        <div class="category-item">
          <div>
            <span class="category-name">${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
            <span style="color: #64748b; font-size: 12px;">(${category.count} posts)</span>
          </div>
          <div class="category-actions">
            <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `
    )
    .join("");
}

function deleteCategory(categoryId) {
  if (confirm("Are you sure you want to delete this category?")) {
    blogData.categories = blogData.categories.filter((c) => c.id !== categoryId);
    renderCategories();
  }
}

function filterBlogPosts() {
  const categoryFilter = document.getElementById("blog-category-filter").value;
  const statusFilter = document.getElementById("blog-status-filter").value;
  let filteredPosts = blogData.posts;
  if (categoryFilter) {
    filteredPosts = filteredPosts.filter((post) => post.category === categoryFilter);
  }
  if (statusFilter) {
    filteredPosts = filteredPosts.filter((post) => post.status === statusFilter);
  }
  const blogGrid = document.querySelector(".blog-grid");
  blogGrid.innerHTML = filteredPosts
    .map(
      (post) => `
        <div class="blog-card">
          <img src="${post.featuredImage}" alt="${post.title}" class="blog-image">
          <div class="blog-content">
            <h3 class="blog-title">${post.title}</h3>
            <div class="blog-meta">
              <span><i class="fas fa-user"></i> ${post.author}</span>
              <span><i class="fas fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
              <span><i class="fas fa-eye"></i> ${post.views} views</span>
            </div>
            <p class="blog-excerpt">${post.excerpt}</p>
            <div class="blog-actions">
              <span class="blog-category badge ${post.status}">${post.category}</span>
              <div class="action-buttons">
                <button class="action-btn view" onclick="viewBlogPost('${post.id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit" onclick="editBlogPost('${post.id}')"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteBlogPost('${post.id}')"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function populateBlogForm(post) {
  document.getElementById("post-title").value = post.title;
  document.getElementById("post-category").value = post.category;
  document.getElementById("post-status").value = post.status;
  document.getElementById("post-excerpt").value = post.excerpt;
  window.blogTags = [...post.tags];
  renderTags();
  if (post.featuredImage) {
    const preview = document.getElementById("image-preview");
    const img = document.getElementById("preview-img");
    img.src = post.featuredImage;
    preview.classList.remove("hidden");
  }
}

function resetBlogForm() {
  window.blogTags = [];
  renderTags();
  document.getElementById("blog-post-form").reset();
  document.getElementById("image-preview").classList.add("hidden");
  if (window.quillEditor) {
    window.quillEditor.setText("");
  }
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      const img = new window.Image();
      img.onload = function() {
        // Set max dimensions
        const maxW = 500;
        const maxH = 500;
        let { width, height } = img;
        let newW = width;
        let newH = height;
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          newW = Math.round(width * ratio);
          newH = Math.round(height * ratio);
        }
        // Draw to canvas
        const canvas = document.createElement('canvas');
        canvas.width = newW;
        canvas.height = newH;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, newW, newH);
        // Get resized data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        // Show preview
        const preview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');
        previewImg.src = dataUrl;
        preview.classList.remove('hidden');
        document.querySelector('.file-name').textContent = file.name;
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function addTag(tagText) {
  const tag = tagText.trim().toLowerCase();
  if (tag && !window.blogTags.includes(tag)) {
    window.blogTags.push(tag);
    renderTags();
  }
}

function removeTag(tag) {
  window.blogTags = window.blogTags.filter((t) => t !== tag);
  renderTags();
}

// Helper for opening category modal (if needed)
function openCategoryModal() {
  document.getElementById("category-modal").style.display = "block";
}

// Make blog functions globally available for inline onclick handlers
window.viewBlogPost = viewBlogPost;
window.editBlogPost = editBlogPost;
window.deleteBlogPost =
window.handleBlogPost = handleBlogPost;
window.renderTags = renderTags;
window.addCategory = addCategory;
window.renderCategories = renderCategories;
window.deleteCategory = deleteCategory;
window.filterBlogPosts = filterBlogPosts;
window.populateBlogForm = populateBlogForm;
window.resetBlogForm = resetBlogForm;
window.handleImageUpload = handleImageUpload;
window.addTag = addTag;
window.removeTag = removeTag;
window.openCategoryModal = openCategoryModal;
export { renderBlog, openBlogPostModal, handleBlogPost, renderTags, viewBlogPost, editBlogPost, deleteBlogPost, addCategory, renderCategories, deleteCategory, filterBlogPosts, populateBlogForm, resetBlogForm, handleImageUpload, addTag, removeTag, openCategoryModal };