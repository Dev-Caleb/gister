document.addEventListener('DOMContentLoaded', () => {
  let posts = JSON.parse(localStorage.getItem('posts')) || [
    { id: 1, title: "Who else noticed this in Abuja?", content: "Observations about recent changes in Abuja.", category: "News", time: "2025-08-06T09:00:00Z", comments: 12, likes: 0, image: "https://via.placeholder.com/80x60?text=Abuja" },
    { id: 2, title: "Best Phones under ₦150k (2025)", content: "Top budget smartphones in Nigeria.", category: "Technology", time: "2025-08-06T08:00:00Z", comments: 8, likes: 0, image: "https://via.placeholder.com/80x60?text=Phones" },
    { id: 3, title: "Lagos Foodies, where’s the best amala spot?", content: "Recommendations for the best amala spots in Lagos.", category: "Food", time: "2025-08-06T07:00:00Z", comments: 20, likes: 0, image: "https://via.placeholder.com/80x60?text=Food" },
    { id: 4, title: "New Tech Startups to Watch in Nigeria", content: "Promising tech startups emerging in Nigeria.", category: "Startups", time: "2025-08-06T06:00:00Z", comments: 15, likes: 0, image: "https://via.placeholder.com/80x60?text=Startups" },
    { id: 5, title: "Election Updates: What’s Happening?", content: "Latest updates on Nigerian elections.", category: "Politics", time: "2025-08-06T05:00:00Z", comments: 25, likes: 0, image: "https://via.placeholder.com/80x60?text=Election" },
    { id: 6, title: "Top 5 Beaches for a Weekend Getaway", content: "Best beaches for a quick getaway in Nigeria.", category: "Travel", time: "2025-08-06T04:00:00Z", comments: 10, likes: 0, image: "https://via.placeholder.com/80x60?text=Beaches" },
    { id: 7, title: "Crypto Trends in Nigeria 2025", content: "Emerging cryptocurrency trends in Nigeria.", category: "Economy", time: "2025-08-06T03:00:00Z", comments: 18, likes: 0, image: "https://via.placeholder.com/80x60?text=Crypto" },
    { id: 8, title: "Why Lagos Traffic is Getting Worse", content: "Analysis of worsening traffic in Lagos.", category: "News", time: "2025-08-06T02:00:00Z", comments: 30, likes: 0, image: "https://via.placeholder.com/80x60?text=Traffic" },
    { id: 9, title: "Latest Nollywood Movies to Watch", content: "New Nollywood releases for 2025.", category: "Entertainment", time: "2025-08-06T01:00:00Z", comments: 14, likes: 0, image: "https://via.placeholder.com/80x60?text=Movies" },
    { id: 10, title: "Tips for Starting a Side Hustle", content: "Practical tips for launching a side hustle.", category: "Business", time: "2025-08-05T23:00:00Z", comments: 22, likes: 0, image: "https://via.placeholder.com/80x60?text=Hustle" },
    { id: 11, title: "Power Outages: What’s the Solution?", content: "Proposed solutions for Nigeria’s power outages.", category: "News", time: "2025-08-05T22:00:00Z", comments: 28, likes: 0, image: "https://via.placeholder.com/80x60?text=Power" },
    { id: 12, title: "Fitness Trends Gaining Traction", content: "Popular fitness trends in Nigeria.", category: "Lifestyle Trends", time: "2025-08-05T21:00:00Z", comments: 16, likes: 0, image: "https://via.placeholder.com/80x60?text=Fitness" }
  ];
  localStorage.setItem('posts', JSON.stringify(posts));

  const postList = document.querySelector('.news-section');
  const categories = document.querySelectorAll('.category-link');
  const loadMoreButton = document.querySelector('.load-more-button');
  const postSearch = document.querySelector('#postSearch');
  let displayedPosts = 0;
  const postsPerPage = 10;

  function fuzzySearch(query, text) {
    query = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    text = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    let i = 0, j = 0;
    while (i < query.length && j < text.length) {
      if (query[i] === text[j]) i++;
      j++;
    }
    return i === query.length;
  }

  function renderPosts(postsToRender) {
    postList.innerHTML = '';
    postsToRender.slice(0, displayedPosts + postsPerPage).forEach(post => {
      const postElement = document.createElement('article');
      postElement.classList.add('post');
      postElement.dataset.id = post.id;
      postElement.innerHTML = `
        <div class="post-content">
          <div class="post-text">
            <h2 class="post-title"><a href="post.html?id=${post.id}">${post.title}</a></h2>
            <div class="post-meta">
              <span class="post-time">${new Date(post.time).toLocaleString()}</span> •
              <a href="#" class="comments-link">💬 ${post.comments} Comments</a> • ${post.category}
            </div>
          </div>
          <img src="${post.image}" alt="Cover photo" class="post-image">
        </div>
      `;
      postList.appendChild(postElement);
    });
    loadMoreButton.style.display = displayedPosts + postsPerPage >= postsToRender.length ? 'none' : 'block';
  }

  function filterPosts() {
    const query = postSearch.value;
    const selectedCategory = document.querySelector('.category-link--active').dataset.category;
    let filteredPosts = selectedCategory === 'all' ? posts : posts.filter(post => post.category === selectedCategory);
    if (query) {
      filteredPosts = filteredPosts.filter(post =>
        fuzzySearch(query, post.title) || fuzzySearch(query, post.content)
      );
    }
    displayedPosts = 0;
    renderPosts(filteredPosts);
  }

  categories.forEach(category => {
    category.addEventListener('click', (e) => {
      if (category.dataset.category === 'Campus Projects') {
        return; // Allow navigation to campus-projects.html
      }
      e.preventDefault();
      categories.forEach(c => c.classList.remove('category-link--active'));
      category.classList.add('category-link--active');
      displayedPosts = 0;
      filterPosts();
    });
  });

  loadMoreButton.addEventListener('click', () => {
    displayedPosts += postsPerPage;
    filterPosts();
  });

  if (postSearch) {
    postSearch.addEventListener('input', filterPosts);
  }

  renderPosts(posts);

  const quickPostButton = document.querySelector('#quickPostButton');
  const quickPostModal = document.querySelector('#quickPostModal');
  const quickPostForm = document.querySelector('#quickPostForm');
  const closeModal = document.querySelector('#closeModal');
  const postImage = document.querySelector('#postImage');
  const imagePreview = document.querySelector('#imagePreview');

  quickPostButton.addEventListener('click', () => {
    quickPostModal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    quickPostModal.style.display = 'none';
  });

  postImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      imagePreview.src = URL.createObjectURL(file);
      imagePreview.style.display = 'block';
    } else {
      imagePreview.style.display = 'none';
    }
  });

  quickPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPost = {
      id: posts.length + 1,
      title: document.querySelector('#postTitle').value,
      content: document.querySelector('#postContent').value,
      category: document.querySelector('#postCategory').value,
      time: new Date().toISOString(),
      comments: 0,
      likes: 0,
      image: postImage.files[0] ? URL.createObjectURL(postImage.files[0]) : 'https://via.placeholder.com/80x60'
    };
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    quickPostModal.style.display = 'none';
    quickPostForm.reset();
    imagePreview.style.display = 'none';
    filterPosts();
  });

  const darkModeToggle = document.querySelector('#darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light');
      document.documentElement.classList.toggle('dark');
      darkModeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      darkModeToggle.textContent = '☀️';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      darkModeToggle.textContent = '🌙';
    }
  }
});