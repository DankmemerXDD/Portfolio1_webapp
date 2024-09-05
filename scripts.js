async function fetchAndDisplayProjects() {
  try {
    const response = await fetch("http://localhost:3000/projects");
    if (!response.ok) {
      throw new Error("Nettverksfeil: " + response.status);
    }

    const projects = await response.json();

    const projectList = document.querySelector(".prosjekt-liste");
    projectList.innerHTML = ""; 


    projects.forEach((project, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <h3>${project.prosjektnavn}</h3>
        <p>${project.beskrivelse}</p>
        <button class="delete-btn" data-index="${index}">Slett</button>
      `;
      projectList.appendChild(listItem);
    });

    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
        const projectIndex = this.getAttribute('data-index');
        deleteProject(projectIndex);
      });
    });
  } catch (error) {
    console.error("Feil ved henting av prosjekter:", error);
  }
}

function deleteProject(index) {
  fetch(`http://localhost:3000/projects/${index}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log('Project deleted:', data);
      fetchAndDisplayProjects();
    })
    .catch(error => {
      console.error('Feil ved sletting av prosjekt:', error);
    });
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayProjects);

function addNewProject(event) {
  event.preventDefault();

  const projectNameInput = document.querySelector(
    'input[placeholder="Prosjektnavn"]'
  );
  const projectDescriptionInput = document.querySelector(
    'input[placeholder="Beskrivelse"]'
  );

  const newProject = {
    prosjektnavn: projectNameInput.value,
    beskrivelse: projectDescriptionInput.value,
  };

  fetch("http://localhost:3000/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProject),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Prosjekt lagt til på serveren:", data);
      fetchAndDisplayProjects();
    })
    .catch((error) => {
      console.error("Feil ved sending av prosjekt til serveren:", error);
    });

  projectNameInput.value = "";
  projectDescriptionInput.value = "";
}

document
  .querySelector(".nye-prosjekter form")
  .addEventListener("submit", addNewProject);
