// Live Markdown Preview
const mdInput = document.getElementById('markdown-input');
const mdPreview = document.getElementById('markdown-preview');
const blogTitle = document.getElementById('blog-title');
const saveBtn = document.getElementById('save-blog');
const blogsList = document.getElementById('blogs-list');
const modal = document.getElementById('blog-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-btn');

function renderPreview() {
  mdPreview.innerHTML = marked.parse(mdInput.value || '');
}
if (mdInput) {
  mdInput.addEventListener('input', renderPreview);
  renderPreview();
}

// Save Blog to localStorage
function getBlogs() {
  return JSON.parse(localStorage.getItem('markdown-blogs-v1') || '[]');
}
function saveBlogs(blogs) {
  localStorage.setItem('markdown-blogs-v1', JSON.stringify(blogs));
}
function getDateStr() {
  return new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
function renderBlogs() {
  const blogs = getBlogs();
  blogsList.innerHTML = '';
  if (!blogs.length) {
    blogsList.innerHTML = '<div style="color:#ffb347;text-align:center;opacity:0.7;">No blogs yet!</div>';
    return;
  }
  blogs.slice().reverse().forEach((blog, idx) => {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
      <div class="blog-title">${blog.title}</div>
      <div class="blog-date">${blog.date}</div>
      <div class="blog-snippet">${marked.parse(blog.markdown).replace(/<[^>]+>/g, '').slice(0, 100)}...</div>
    `;
    card.onclick = () => openModal(blog);
    blogsList.appendChild(card);
  });
}
function openModal(blog) {
  modalTitle.textContent = blog.title;
  modalBody.innerHTML = marked.parse(blog.markdown);
  modal.classList.add('active');
}
if (closeBtn) {
  closeBtn.onclick = () => modal.classList.remove('active');
}
window.addEventListener('click', function(e) {
  if (e.target === modal) modal.classList.remove('active');
});

if (saveBtn) {
  saveBtn.onclick = function() {
    const title = blogTitle.value.trim();
    const markdown = mdInput.value.trim();
    if (!title || !markdown) {
      alert('Please enter a title and some content!');
      return;
    }
    const blogs = getBlogs();
    blogs.push({ title, markdown, date: getDateStr() });
    saveBlogs(blogs);
    blogTitle.value = '';
    mdInput.value = '';
    renderPreview();
    renderBlogs();
    alert('Blog saved!');
  };
}

// Initial render
renderBlogs();

// Navbar active link
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});
