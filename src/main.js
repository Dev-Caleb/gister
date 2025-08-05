const darkModeToggle = document.getElementById('darkModeToggle');
const bodyElement = document.body;
const quickPostButton = document.getElementById('quickPostButton');
const quickPostModal = document.getElementById('quickPostModal');
const closeModal = document.getElementById('closeModal');
const quickPostForm = document.getElementById('quickPostForm');
const postImageInput = document.getElementById('postImage');
const imagePreview = document.getElementById('imagePreview');

darkModeToggle.addEventListener('click', () => {
  bodyElement.classList.toggle('dark');
  darkModeToggle.textContent = bodyElement.classList.contains('dark') ? '☀️' : '🌙';
  localStorage.setItem('theme', bodyElement.classList.contains('dark') ? 'dark' : 'light');
});

quickPostButton.addEventListener('click', () => {
  quickPostModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
  quickPostModal.style.display = 'none';
  quickPostForm.reset();
  imagePreview.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === quickPostModal) {
    quickPostModal.style.display = 'none';
    quickPostForm.reset();
    imagePreview.style.display = 'none';
  }
});

postImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    bodyElement.classList.add('dark');
    darkModeToggle.textContent = '☀️';
  } else {
    bodyElement.classList.remove('dark');
    darkModeToggle.textContent = '🌙';
  }

  // Load More Button
  const loadMoreButton = document.querySelector('.load-more-button');
  const newsSection = document.querySelector('.news-section');
  let postCount = 12;

  loadMoreButton.addEventListener('click', () => {
    const newPosts = [
      {
        title: `Post ${postCount + 1}: Tech Innovation in Nigeria`,
        time: `${postCount + 1}hrs ago`,
        comments: Math.floor(Math.random() * 30) + 5,
        image: `https://via.placeholder.com/80x60?text=Tech${postCount + 1}`
      },
      {
        title: `Post ${postCount + 2}: Political Debate Highlights`,
        time: `${postCount + 2}hrs ago`,
        comments: Math.floor(Math.random() * 30) + 5,
        image: `https://via.placeholder.com/80x60?text=Politics${postCount + 2}`
      },
      {
        title: `Post ${postCount + 3}: Best Local Restaurants`,
        time: `${postCount + 3}hrs ago`,
        comments: Math.floor(Math.random() * 30) + 5,
        image: `https://via.placeholder.com/80x60?text=Food${postCount + 3}`
      },
      {
        title: `Post ${postCount + 4}: Startup Funding Tips`,
        time: `${postCount + 4}hrs ago`,
        comments: Math.floor(Math.random() * 30) + 5,
        image: `https://via.placeholder.com/80x60?text=Startups${postCount + 4}`
      },
      {
        title: `Post ${postCount + 5}: Lifestyle Trends 2025`,
        time: `${postCount + 5}hrs ago`,
        comments: Math.floor(Math.random() * 30) + 5,
        image: `https://via.placeholder.com/80x60?text=Lifestyle${postCount + 5}`
      }
    ];

    newPosts.forEach(post => {
      const postElement = document.createElement('article');
      postElement.className = 'post';
      postElement.innerHTML = `
        <div class="post-content">
          <div class="post-text">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
              <span class="post-time">${post.time}</span> •
              <a href="#" class="comments-link">💬 ${post.comments} Comments</a>
            </div>
          </div>
          <img src="${post.image}" alt="Cover photo" class="post-image">
        </div>
      `;
      newsSection.appendChild(postElement);
    });

    postCount += 5;
    attachPostClickListeners();
  });

  // Quick Post Form Submission
  quickPostForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;
    const image = postImageInput.files[0];
    let imageUrl = `https://via.placeholder.com/80x60?text=${category}`;

    if (image) {
      imageUrl = URL.createObjectURL(image);
    }

    const postElement = document.createElement('article');
    postElement.className = 'post';
    postElement.innerHTML = `
      <div class="post-content">
        <div class="post-text">
          <h2 class="post-title">${title}</h2>
          <div class="post-meta">
            <span class="post-time">Just now</span> •
            <a href="#" class="comments-link">💬 0 Comments</a>
          </div>
        </div>
        <img src="${imageUrl}" alt="Cover photo" class="post-image">
      </div>
    `;
    newsSection.prepend(postElement);
    quickPostModal.style.display = 'none';
    quickPostForm.reset();
    imagePreview.style.display = 'none';
    attachPostClickListeners();
  });

  // Post Click Action
  function attachPostClickListeners() {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
      post.addEventListener('click', () => {
        posts.forEach(p => p.classList.remove('post--active'));
        post.classList.add('post--active');
        const title = post.querySelector('.post-title').textContent;
        console.log(`Clicked post: ${title}`);
      });
    });
  }

  // Initial attachment of click listeners
  attachPostClickListeners();
});