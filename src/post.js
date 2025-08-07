document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  const projectSearch = document.querySelector('#projectSearch');
  const disciplineFilter = document.querySelector('#disciplineFilter');
  const projectSection = document.querySelector('.project-section');
  const uploadProjectButton = document.querySelector('#uploadProjectButton');
  const uploadProjectModal = document.querySelector('#uploadProjectModal');
  const uploadProjectForm = document.querySelector('#uploadProjectForm');
  const closeUploadModal = document.querySelector('#closeUploadModal');
  const darkModeToggle = document.querySelector('#darkModeToggle');

  let projects = JSON.parse(localStorage.getItem('projects')) || [
    { id: 101, title: "AI-Powered Chatbot for Student Queries", discipline: "Computer Science", subDiscipline: "Artificial Intelligence", description: "A chatbot that answers student questions about courses and campus life using NLP.", comments: 5 },
    { id: 102, title: "Autonomous Delivery Robot", discipline: "Mechanical Engineering", subDiscipline: "Robotics", description: "A robot designed to deliver food and packages across campus autonomously.", comments: 8 }
  ];
  localStorage.setItem('projects', JSON.stringify(projects));

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

  function renderProjects(filteredProjects) {
    projectSection.innerHTML = '';
    filteredProjects.forEach(project => {
      const projectElement = document.createElement('article');
      projectElement.classList.add('project');
      projectElement.innerHTML = `
        <div class="project-content">
          <div class="project-text">
            <h2 class="project-title"><a href="post.html?id=${project.id}">${project.title}</a></h2>
            <div class="project-meta">
              <span>Discipline: ${project.discipline}</span> •
              <span>Sub-discipline: ${project.subDiscipline}</span> •
              <a href="#" class="comments-link">💬 ${project.comments} Comments</a>
            </div>
            <p class="project-description">${project.description}</p>
          </div>
        </div>
      `;
      projectSection.appendChild(projectElement);
    });
  }

  function filterProjects() {
    const query = projectSearch ? projectSearch.value : '';
    const discipline = disciplineFilter ? disciplineFilter.value : '';
    let filteredProjects = projects;
    if (query) {
      filteredProjects = filteredProjects.filter(project =>
        fuzzySearch(query, project.title) || fuzzySearch(query, project.description)
      );
    }
    if (discipline) {
      filteredProjects = filteredProjects.filter(project => project.discipline === discipline);
    }
    renderProjects(filteredProjects);
  }

  if (projectSearch) {
    projectSearch.addEventListener('input', filterProjects);
  }

  if (disciplineFilter) {
    disciplineFilter.addEventListener('change', filterProjects);
  }

  if (uploadProjectButton) {
    uploadProjectButton.addEventListener('click', () => {
      uploadProjectModal.style.display = 'block';
    });
  }

  if (closeUploadModal) {
    closeUploadModal.addEventListener('click', () => {
      uploadProjectModal.style.display = 'none';
    });
  }

  if (uploadProjectForm) {
    const previewModal = document.createElement('div');
    previewModal.id = 'previewModal';
    previewModal.className = 'modal';
    previewModal.innerHTML = `
      <div class="modal-content">
        <span id="closePreviewModal" class="close">&times;</span>
        <h2>Project Preview</h2>
        <div id="previewContent"></div>
        <button id="confirmUpload" class="submit-button">Confirm Upload</button>
        <button id="editProject" class="submit-button">Edit</button>
      </div>
    `;
    document.body.appendChild(previewModal);

    const closePreviewModal = previewModal.querySelector('#closePreviewModal');
    const confirmUpload = previewModal.querySelector('#confirmUpload');
    const editProject = previewModal.querySelector('#editProject');
    const previewContent = previewModal.querySelector('#previewContent');

    uploadProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectData = {
        title: document.querySelector('#projectTitle').value,
        discipline: document.querySelector('#projectDiscipline').value,
        subDiscipline: document.querySelector('#projectSubDiscipline').value,
        description: document.querySelector('#projectDescription').value,
        file: document.querySelector('#projectFile').files[0]
      };

      previewContent.innerHTML = `
        <h3>${projectData.title}</h3>
        <p><strong>Discipline:</strong> ${projectData.discipline}</p>
        <p><strong>Sub-discipline:</strong> ${projectData.subDiscipline}</p>
        <p><strong>Description:</strong> ${projectData.description}</p>
        <p><strong>File:</strong> ${projectData.file ? projectData.file.name : 'No file uploaded'}</p>
      `;
      uploadProjectModal.style.display = 'none';
      previewModal.style.display = 'block';
    });

    closePreviewModal.addEventListener('click', () => {
      previewModal.style.display = 'none';
    });

    editProject.addEventListener('click', () => {
      previewModal.style.display = 'none';
      uploadProjectModal.style.display = 'block';
    });

    confirmUpload.addEventListener('click', () => {
      const newProject = {
        id: projects.length + 101,
        title: document.querySelector('#projectTitle').value,
        discipline: document.querySelector('#projectDiscipline').value,
        subDiscipline: document.querySelector('#projectSubDiscipline').value,
        description: document.querySelector('#projectDescription').value,
        comments: 0
      };
      projects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(projects));
      previewModal.style.display = 'none';
      uploadProjectForm.reset();
      filterProjects();
    });
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light');
      document.documentElement.classList.toggle('dark');
      darkModeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
    });
  }

  if (postId) {
    const allItems = [...JSON.parse(localStorage.getItem('posts') || '[]'), ...projects];
    const item = allItems.find(i => i.id == postId);
    if (item) {
      document.querySelector('main').innerHTML = `
        <article class="post">
          <div class="post-content">
            <div class="post-text">
              <h2 class="post-title">${item.title}</h2>
              <div class="post-meta">
                <span>${new Date().toLocaleString()}</span> •
                <span>${item.category || item.discipline}</span> •
                <a href="#" class="comments-link">💬 ${item.comments} Comments</a>
              </div>
              <p>${item.content || item.description}</p>
            </div>
          </div>
        </article>
      `;
    }
  }
});