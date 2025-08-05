const darkModeToggle = document.getElementById('darkModeToggle');
const bodyElement = document.body;

darkModeToggle.addEventListener('click', () => {
  bodyElement.classList.toggle('dark');
  darkModeToggle.textContent = bodyElement.classList.contains('dark') ? '☀️' : '🌙';
  localStorage.setItem('theme', bodyElement.classList.contains('dark') ? 'dark' : 'light');
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
  let postCount = 12; // Starting post count

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

    // Re-attach click event listeners to new posts
    attachPostClickListeners();
  });

  // Post Click Action
  function attachPostClickListeners() {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
      post.addEventListener('click', () => {
        // Remove active class from all posts
        posts.forEach(p => p.classList.remove('post--active'));
        // Add active class to clicked post
        post.classList.add('post--active');
        // Log post title to console (placeholder for future action)
        const title = post.querySelector('.post-title').textContent;
        console.log(`Clicked post: ${title}`);
      });
    });
  }

  // Initial attachment of click listeners
  attachPostClickListeners();
});