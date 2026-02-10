// Configuration
const AGENDA_MARKDOWN_URL = "agenda.md";
const PARTICIPANTS_MARKDOWN_URL = "participants.md";

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

    // Update link to point to local file
    if (agendaSourceLink) {
      agendaSourceLink.href = AGENDA_MARKDOWN_URL;
    }
  } catch (error) {
    console.error("Error loading agenda:", error);
    agendaContent.innerHTML = `
            <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px;">
                <p style="color: #991b1b; margin: 0;">
                    <strong>⚠️ Error loading agenda</strong><br>
                    Error: ${error.message}
                    <br><br>
                    Current URL: <code>${AGENDA_MARKDOWN_URL}</code>
                </p>
            </div>
        `;
  }
}

// Load and render Markdown participants
async function loadParticipants() {
  const participantsContent = document.getElementById("participants-content");

  try {
    const response = await fetch(PARTICIPANTS_MARKDOWN_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const markdown = await response.text();
    const htmlContent = marked.parse(markdown);
    participantsContent.innerHTML = htmlContent;
  } catch (error) {
    console.error("Error loading participants:", error);
    participantsContent.innerHTML = `
            <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px;">
                <p style="color: #991b1b; margin: 0;">
                    <strong>⚠️ Error loading participants</strong><br>
                    Please make sure participants.md exists in the same directory.
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
