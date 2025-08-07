document.addEventListener('DOMContentLoaded', () => {
  const projectSearch = document.querySelector('#projectSearch');
  const disciplineFilter = document.querySelector('#disciplineFilter');
  const projectSection = document.querySelector('.project-section');
  const uploadProjectButton = document.querySelector('#uploadProjectButton');
  const uploadProjectModal = document.querySelector('#uploadProjectModal');
  const uploadProjectForm = document.querySelector('#uploadProjectForm');
  const closeUploadModal = document.querySelector('#closeUploadModal');
  const darkModeToggle = document.querySelector('#darkModeToggle');

  let projects = JSON.parse(localStorage.getItem('projects')) || [
    { id: 101, title: "AI-Powered Chatbot for Student Queries", author: "Ada Obi", discipline: "Computer Science", subDiscipline: "Artificial Intelligence", description: "A chatbot that answers student questions about courses and campus life using NLP. It leverages advanced natural language processing techniques to provide accurate and context-aware responses. The system is designed to integrate with university databases and provide real-time updates on course schedules, campus events, and student services. The project aims to improve student engagement and reduce administrative workload.", likes: 0, fileData: null },
    { id: 102, title: "Autonomous Delivery Robot", author: "Tunde Ade", discipline: "Mechanical Engineering", subDiscipline: "Robotics", description: "A robot designed to deliver food and packages across campus autonomously. It uses a combination of LIDAR, GPS, and computer vision to navigate complex environments. The robot is equipped with a secure compartment to ensure safe delivery and can handle various weather conditions. The project focuses on improving campus logistics and reducing delivery times.", likes: 0, fileData: null }
  ];
  localStorage.setItem('projects', JSON.stringify(projects));

  function getFirst20Lines(text) {
    const lines = text.split('\n').slice(0, 20).join('\n');
    return lines || text.substring(0, 500) + (text.length > 500 ? '...' : '');
  }

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
            <h2 class="project-title" data-id="${project.id}">${project.title}</h2>
            <div class="project-meta">
              <span>Author: ${project.author}</span> •
              <span>Discipline: ${project.discipline}</span> •
              <span>❤️ ${project.likes} Likes</span>
            </div>
            <p class="project-description">${project.description}</p>
          </div>
        </div>
      `;
      projectSection.appendChild(projectElement);

      const title = projectElement.querySelector('.project-title');
      title.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.id = 'projectPreviewModal';
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${project.title}</h2>
            <div class="project-meta">
              <span>Author: ${project.author}</span> •
              <span>Discipline: ${project.discipline}</span> •
              <span>Sub-discipline: ${project.subDiscipline}</span> •
              <span>❤️ ${project.likes} Likes</span>
            </div>
            <div id="projectPreviewContent">${getFirst20Lines(project.description)}</div>
            <div>
              ${project.fileData ? `<button class="download-button" data-file="${project.fileData}" data-title="${project.title}">Download PDF</button>` : ''}
              <button class="like-button ${JSON.parse(localStorage.getItem('likes') || '{}')[`guest_${project.id}`] ? 'liked' : ''}" data-id="${project.id}">❤️ ${project.likes} Likes</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';

        const closeModal = modal.querySelector('.close');
        closeModal.addEventListener('click', () => {
          modal.remove();
        });

        const downloadButton = modal.querySelector('.download-button');
        if (downloadButton) {
          downloadButton.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = project.fileData;
            link.download = `${project.title}.pdf`;
            link.click();
          });
        }

        const likeButton = modal.querySelector('.like-button');
        if (likeButton) {
          likeButton.addEventListener('click', () => {
            const userId = localStorage.getItem('userId') || 'guest';
            const likes = JSON.parse(localStorage.getItem('likes') || '{}');
            const liked = likes[`${userId}_${project.id}`] || false;
            project.likes = liked ? project.likes - 1 : project.likes + 1;
            likes[`${userId}_${project.id}`] = !liked;
            localStorage.setItem('likes', JSON.stringify(likes));
            localStorage.setItem('projects', JSON.stringify(projects));
            likeButton.classList.toggle('liked');
            likeButton.textContent = `❤️ ${project.likes} Likes`;
            filterProjects(); // Update likes in listing
          });
        }
      });
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

  // Initialize preview modal but keep it hidden
  const previewModal = document.createElement('div');
  previewModal.id = 'previewModal';
  previewModal.className = 'modal';
  previewModal.style.display = 'none'; // Ensure hidden on load
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

  if (uploadProjectForm) {
    const closePreviewModal = previewModal.querySelector('#closePreviewModal');
    const confirmUpload = previewModal.querySelector('#confirmUpload');
    const editProject = previewModal.querySelector('#editProject');
    const previewContent = previewModal.querySelector('#previewContent');

    uploadProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fileInput = document.querySelector('#projectFile');
      const file = fileInput.files[0];
      const projectData = {
        title: document.querySelector('#projectTitle').value,
        discipline: document.querySelector('#projectDiscipline').value,
        subDiscipline: document.querySelector('#projectSubDiscipline').value,
        description: document.querySelector('#projectDescription').value,
        fileName: file ? file.name : 'No file uploaded'
      };

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          projectData.fileData = e.target.result;
          previewContent.innerHTML = `
            <h3>${projectData.title}</h3>
            <p><strong>Author:</strong> ${localStorage.getItem('userId') || 'Guest'}</p>
            <p><strong>Discipline:</strong> ${projectData.discipline}</p>
            <p><strong>Sub-discipline:</strong> ${projectData.subDiscipline}</p>
            <p><strong>Description:</strong> ${getFirst20Lines(projectData.description)}</p>
            <p><strong>File:</strong> ${projectData.fileName}</p>
          `;
          previewContent.dataset.fileData = e.target.result; // Store fileData for confirm
          uploadProjectModal.style.display = 'none';
          previewModal.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        projectData.fileData = null;
        previewContent.innerHTML = `
          <h3>${projectData.title}</h3>
          <p><strong>Author:</strong> ${localStorage.getItem('userId') || 'Guest'}</p>
          <p><strong>Discipline:</strong> ${projectData.discipline}</p>
          <p><strong>Sub-discipline:</strong> ${projectData.subDiscipline}</p>
          <p><strong>Description:</strong> ${getFirst20Lines(projectData.description)}</p>
          <p><strong>File:</strong> ${projectData.fileName}</p>
        `;
        previewContent.dataset.fileData = null;
        uploadProjectModal.style.display = 'none';
        previewModal.style.display = 'block';
      }
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
        author: localStorage.getItem('userId') || 'Guest',
        discipline: document.querySelector('#projectDiscipline').value,
        subDiscipline: document.querySelector('#projectSubDiscipline').value,
        description: document.querySelector('#projectDescription').value,
        likes: 0,
        fileData: previewContent.dataset.fileData || null
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
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  // Ensure upload modal is hidden on load
  if (uploadProjectModal) {
    uploadProjectModal.style.display = 'none';
  }

  filterProjects();
});