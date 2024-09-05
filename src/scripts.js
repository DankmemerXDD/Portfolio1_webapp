async function fetchAndDisplayProjects() {
  try {
    // Hent prosjektene fra JSON-filen
    const response = await fetch("http://localhost:3000/projects");
    if (!response.ok) {
      throw new Error("Nettverksfeil: " + response.status);
    }

    const projects = await response.json();

    console.log(projects);

    const projectList = document.querySelector(".prosjekt-liste");
    projectList.innerHTML = ""; // Tøm prosjektlisten før den fylles på nytt

    // Gå gjennom hvert prosjekt og legg det til i HTML-listen
    projects.forEach((project) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <h3>${project.prosjektnavn}</h3>
                <p>${project.beskrivelse}</p>
            `;
      projectList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Feil ved henting av prosjekter:", error);
  }
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
  console.log("new project");
  console.log(newProject);

  // Send det nye prosjektet til JSON-filen med en POST-forespørsel
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

      // Oppdater prosjektlisten ved å hente fra serveren igjen
      fetchAndDisplayProjects();
    })
    .catch((error) => {
      console.error("Feil ved sending av prosjekt til serveren:", error);
    });

  // Tøm inputfeltene etter at prosjektet er lagt til
  projectNameInput.value = "";
  projectDescriptionInput.value = "";
}

document
  .querySelector(".nye-prosjekter form")
  .addEventListener("submit", addNewProject);
