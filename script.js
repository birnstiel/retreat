// Configuration
const AGENDA_MARKDOWN_URL = "agenda.md";
const PARTICIPANTS_MARKDOWN_URL = "participants.md";
const SORT_PARTICIPANTS = true; // Set to false to disable automatic sorting

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadAgenda();
  loadParticipants();
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

    let markdown = await response.text();

    // Sort participants if enabled
    if (SORT_PARTICIPANTS) {
      markdown = sortParticipantsInMarkdown(markdown);
    }

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

// Sort participants in markdown table by lastname (last word of first column)
function sortParticipantsInMarkdown(markdown) {
  const lines = markdown.split("\n");

  // Find the separator line (---)
  let separatorIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("---")) {
      separatorIndex = i;
      break;
    }
  }

  if (separatorIndex === -1) {
    return markdown; // No separator found, return as-is
  }

  // Extract header, separator, and data rows
  const header = lines.slice(0, separatorIndex);
  const separator = [lines[separatorIndex]];
  const dataRows = [];
  const footerRows = [];

  let foundNonDataRow = false;
  for (let i = separatorIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Stop processing data rows at empty lines or non-table lines
    if (!line || (!line.includes("|") && !foundNonDataRow)) {
      foundNonDataRow = true;
    }

    if (foundNonDataRow || !line || !line.includes("|")) {
      footerRows.push(lines[i]);
    } else if (line && line.includes("|")) {
      dataRows.push(lines[i]);
    }
  }

  // Parse and sort data rows
  const parsedRows = dataRows.map((row) => {
    const parts = row.split("|").map((part) => part.trim());
    const cells = parts.filter((cell) => cell.length > 0);
    const name = cells[0] || "";
    const lastName = name.split(" ").pop();
    return { name, lastName, originalRow: row };
  });

  parsedRows.sort((a, b) => a.lastName.localeCompare(b.lastName));

  // Reconstruct markdown
  const sortedLines = [
    ...header,
    ...separator,
    ...parsedRows.map((p) => p.originalRow),
    ...footerRows,
  ];

  return sortedLines.join("\n");
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
