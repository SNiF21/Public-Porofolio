const DEFAULT_USER = "SNiF21";
const FALLBACK_URL = "./data/projects.json";
const MIN_PROJECTS = 5;

const container = document.getElementById("portfolio-container");
const statusBanner = document.createElement("div");
const statusBaseClasses = "mb-4 rounded-2xl border px-4 py-3 text-sm font-medium";
const statusStyles = {
  info: "border-stone-200 bg-white/90 text-stone-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800"
};

function setStatus(message, tone) {
  if (!message) {
    statusBanner.className = "hidden";
    statusBanner.textContent = "";
    return;
  }

  statusBanner.className = `${statusBaseClasses} ${statusStyles[tone] || statusStyles.info}`;
  statusBanner.textContent = message;
}

function ensureStatusBanner() {
  if (!container || container.dataset.statusReady === "true") {
    return;
  }

  container.parentElement.insertBefore(statusBanner, container);
  container.dataset.statusReady = "true";
}

function createMetaBadge(text, classes) {
  const badge = document.createElement("span");
  badge.className = `rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${classes}`;
  badge.textContent = text;
  return badge;
}

function createCard(project) {
  const card = document.createElement("article");
  card.className =
    "group rounded-2xl border border-amber-200/70 bg-white/90 p-6 shadow-xl ring-1 ring-amber-100 transition hover:-translate-y-1 hover:shadow-2xl";

  const header = document.createElement("div");
  header.className = "flex items-start justify-between gap-4";

  const title = document.createElement("h3");
  title.className = "text-xl font-semibold text-stone-900";
  title.textContent = project.name || "Untitled project";

  const link = document.createElement("a");
  link.className =
    "inline-flex items-center justify-center rounded-full border border-amber-300 bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-800 transition hover:bg-amber-200";
  link.href = project.html_url || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View repo";

  header.appendChild(title);
  header.appendChild(link);

  const description = document.createElement("p");
  description.className = "mt-4 text-sm text-stone-600";
  description.textContent = project.description || "No description available";

  const meta = document.createElement("div");
  meta.className = "mt-4 flex flex-wrap gap-2";

  meta.appendChild(
    createMetaBadge(`Language: ${project.language || "N/A"}`, "bg-stone-100 text-stone-700")
  );
  meta.appendChild(
    createMetaBadge(`Stars: ${project.stargazers_count ?? 0}`, "bg-amber-100 text-amber-700")
  );
  meta.appendChild(
    createMetaBadge(`Forks: ${project.forks_count ?? 0}`, "bg-orange-100 text-orange-700")
  );

  card.appendChild(header);
  card.appendChild(description);
  card.appendChild(meta);

  return card;
}

function renderProjects(projects) {
  container.innerHTML = "";
  projects.forEach((project) => container.appendChild(createCard(project)));
}

async function loadFallbackProjects() {
  const response = await fetch(FALLBACK_URL);
  if (!response.ok) {
    throw new Error("Fallback JSON unavailable");
  }

  const fallbackProjects = await response.json();
  if (!Array.isArray(fallbackProjects) || fallbackProjects.length === 0) {
    throw new Error("No fallback projects found");
  }

  return fallbackProjects;
}

function mergeProjects(primary, fallback, minimum) {
  const combined = [...primary];
  const seen = new Set(
    combined.map((project) => project.html_url || project.name || "unknown")
  );

  for (const project of fallback) {
    const key = project.html_url || project.name || "unknown";
    if (seen.has(key)) {
      continue;
    }

    combined.push(project);
    seen.add(key);

    if (combined.length >= minimum) {
      break;
    }
  }

  return combined;
}

async function loadProjects() {
  if (!container) {
    return;
  }

  const username = container.dataset.githubUser || DEFAULT_USER;
  const apiUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

  ensureStatusBanner();
  setStatus("Loading projects...", "info");
  container.setAttribute("aria-busy", "true");

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`GitHub request failed (${response.status})`);
    }

    const projects = await response.json();
    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error("No projects returned from GitHub");
    }

    let selection = projects.slice(0, 6);

    if (selection.length < MIN_PROJECTS) {
      const fallbackProjects = await loadFallbackProjects();
      selection = mergeProjects(selection, fallbackProjects, MIN_PROJECTS);
      setStatus(
        `Showing live projects from GitHub (${username}) with local extras.`,
        "warning"
      );
    } else {
      setStatus(`Showing live projects from GitHub (${username}).`, "success");
    }

    renderProjects(selection);
  } catch (error) {
    setStatus("Live projects unavailable. Loading local projects...", "warning");
    try {
      const fallbackProjects = await loadFallbackProjects();
      renderProjects(fallbackProjects.slice(0, Math.max(MIN_PROJECTS, fallbackProjects.length)));
    } catch (fallbackError) {
      setStatus("Unable to load projects right now.", "warning");
      container.innerHTML =
        "<p class=\"text-sm text-stone-600\">No projects available at the moment.</p>";
    }
  } finally {
    container.removeAttribute("aria-busy");
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);
