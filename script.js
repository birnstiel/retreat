// Configuration
const AGENDA_MARKDOWN_URL =
  "https://raw.githubusercontent.com/birnstiel/retreat/main/agenda.md";
const PARTICIPANTS_MARKDOWN_URL =
  "https://raw.githubusercontent.com/birnstiel/retreat/main/participants.md";

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadAgenda();
  loadParticipants();
  updateLastModified();
  setupNavigation();
});

// Load and render Markdown agenda
async function loadAgenda() {
  const agendaContent = document.getElementById("agenda-content");
  const agendaSourceLink = document.getElementById("agenda-source-link");

  try {
    const response = await fetch(AGENDA_MARKDOWN_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const markdown = await response.text();
    const htmlContent = marked.parse(markdown);
    agendaContent.innerHTML = htmlContent;

    agendaSourceLink.href = AGENDA_MARKDOWN_URL.replace(
      "raw.githubusercontent.com",
      "github.com",
    ).replace("/main/", "/blob/main/");
  } catch (error) {
    console.error("Error loading agenda:", error);
    agendaContent.innerHTML = `
            <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px;">
                <p style="color: #991b1b; margin: 0;">
                    <strong>⚠️ Error loading agenda</strong><br>
                    Please make sure the GitHub URL in script.js is configured correctly.
                    <br><br>
                    Current URL: <code>${AGENDA_MARKDOWN_URL}</code>
                </p>
            </div>
        `;
  }
}

// Load and render Markdown participants as alphabetical list
async function loadParticipants() {
  const participantsContent = document.getElementById("participants-content");

  try {
    const response = await fetch(PARTICIPANTS_MARKDOWN_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const markdown = await response.text();

    // Parse markdown to extract participants (lines starting with "- ")
    const lines = markdown
      .split("\n")
      .filter((line) => line.trim().startsWith("- "));
    const participants = lines
      .map((line) => line.replace("- ", "").trim())
      .sort();

    if (participants.length === 0) {
      throw new Error("No participants found");
    }

    // Create alphabetical list
    const html = `
            <ul class="participants-alphabetical">
                ${participants.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}
            </ul>
        `;

    participantsContent.innerHTML = html;
  } catch (error) {
    console.error("Error loading participants:", error);
    participantsContent.innerHTML = `
            <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px;">
                <p style="color: #991b1b; margin: 0;">
                    <strong>⚠️ Error loading participants</strong><br>
                    Please make sure the GitHub URL in script.js is correct and participants.md exists.
                    <br><br>
                    Current URL: <code>${PARTICIPANTS_MARKDOWN_URL}</code>
                </p>
            </div>
        `;
  }
}

// Escape HTML special characters
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Update last modified timestamp
function updateLastModified() {
  const lastUpdated = document.getElementById("last-updated");
  if (lastUpdated) {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    lastUpdated.textContent = now.toLocaleDateString("en-US", options);
  }
}

// Smooth scrolling for navigation links
function setupNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}
