const DEFAULT_USER = "BraicuDragos";

const container = document.getElementById("portfolio-container");

function createCard(project) {
  const card = document.createElement("article");
  card.className = "rounded-lg border border-stone-200 bg-white p-4";

  const title = document.createElement("h3");
  title.className = "text-base font-medium text-stone-900";
  title.textContent = project.name || "Untitled project";

  const description = document.createElement("p");
  description.className = "mt-2 text-sm text-stone-600";
  description.textContent = project.description || "No description available";

  const meta = document.createElement("div");
  meta.className = "mt-3 space-y-1 text-xs text-stone-500";

  const language = document.createElement("span");
  language.style.display = "block";
  language.textContent = project.language ? `Language: ${project.language}` : "Language: N/A";

  const stars = document.createElement("span");
  stars.style.display = "block";
  stars.textContent = `Stars: ${project.stargazers_count ?? 0}`;

  const link = document.createElement("a");
  link.className = "text-xs font-semibold text-stone-700 underline hover:text-stone-900";
  link.style.display = "block";
  link.href = project.html_url || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View repo";

  meta.appendChild(language);
  meta.appendChild(stars);
  meta.appendChild(link);

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(meta);

  return card;
}

function renderProjects(projects) {
  container.innerHTML = "";
  projects.forEach((project) => container.appendChild(createCard(project)));
}

function showEmptyState() {
  container.innerHTML =
    "<p class=\"text-sm text-stone-600\">No projects available at the moment.</p>";
}

async function loadProjects() {
  if (!container) {
    return;
  }

  const username = container.dataset.githubUser || DEFAULT_USER;
  const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      showEmptyState();
      return;
    }

    const projects = await response.json();
    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error("No projects returned");
    }

    renderProjects(projects.slice(0, 6));
  } catch (error) {
    showEmptyState();
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);
