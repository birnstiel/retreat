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

// Load and render Markdown agenda with tabs
async function loadAgenda() {
  try {
    const response = await fetch(AGENDA_MARKDOWN_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const markdown = await response.text();

    // Extract and display heading (e.g., "### PRELIMINARY") and any following note
    const headingMatch = markdown.match(/^###\s+(.+)$/m);
    const noteMatch = markdown.match(/^\*(.+?)\*\s*$/m);

    if (headingMatch) {
      const noticeElement = document.getElementById('agenda-notice');
      if (noticeElement) {
        let noticeHTML = `<strong>${headingMatch[1]}</strong>`;

        // Add note if found
        if (noteMatch) {
          noticeHTML += `
            <br>
            <span style="margin-top: 5px; display: inline-block;">
              ${noteMatch[1].trim()}
            </span>
          `;
        }

        noticeElement.innerHTML = noticeHTML;
        noticeElement.style.display = 'block';
      }
    }

    // Parse the agenda by days
    const dayData = parseAgendaByDays(markdown);

    // Populate each tab panel
    dayData.forEach(day => {
      const panel = document.getElementById(day.id);
      if (panel) {
        // Sunday doesn't need Speaker column
        const isSunday = day.id === 'sunday';

        panel.innerHTML = `
          <h3>${day.title}</h3>
          <table>
            <thead>
              <tr>
                <th class="col-time">Time</th>
                ${isSunday ? '' : '<th class="col-speaker">Speaker</th>'}
                <th class="col-details">Details</th>
              </tr>
            </thead>
            <tbody>
              ${day.rows.join('')}
            </tbody>
          </table>
        `;
      }
    });

    // Setup tab functionality
    setupTabs();

  } catch (error) {
    console.error("Error loading agenda:", error);
    const sundayPanel = document.getElementById("sunday");
    if (sundayPanel) {
      sundayPanel.innerHTML = `
        <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px;">
          <p style="color: #991b1b; margin: 0;">
            <strong>⚠️ Error loading agenda</strong><br>
            Error: ${error.message}
          </p>
        </div>
      `;
    }
  }
}

// Parse markdown agenda into structured day data
function parseAgendaByDays(markdown) {
  const lines = markdown.split('\n');
  const days = [];
  let currentDay = null;

  const dayMap = {
    'Sunday, April 26': { id: 'sunday', title: 'Sunday, April 26' },
    'Monday, April 27': { id: 'monday', title: 'Monday, April 27' },
    'Tuesday, April 28': { id: 'tuesday', title: 'Tuesday, April 28' },
    'Wednesday, April 29': { id: 'wednesday', title: 'Wednesday, April 29' },
    'Thursday, April 30': { id: 'thursday', title: 'Thursday, April 30' }
  };

  // Helper function to convert markdown bold and italics to HTML
  function parseInlineMarkdown(text) {
    if (!text) return text;
    // Convert **text** to <strong>text</strong> (must be before single *)
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Convert *text* to <em>text</em>
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return text;
  }

  for (const line of lines) {
    // Check if line contains a day header
    const dayMatch = line.match(/\*\*(Sunday|Monday|Tuesday|Wednesday|Thursday), April \d+\*\*/);

    if (dayMatch) {
      const dayKey = dayMatch[0].replace(/\*\*/g, '');
      if (dayMap[dayKey]) {
        if (currentDay) {
          days.push(currentDay);
        }
        currentDay = {
          id: dayMap[dayKey].id,
          title: dayMap[dayKey].title,
          rows: []
        };

        // Extract the time, speaker, and details from the same line
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 4 && parts[2]) {
          // Sunday doesn't need Speaker column
          if (currentDay.id === 'sunday') {
            currentDay.rows.push(`
              <tr>
                <td class="col-time">${parseInlineMarkdown(parts[2])}</td>
                <td class="col-details">${parseInlineMarkdown(parts[4] || '')}</td>
              </tr>
            `);
          } else {
            currentDay.rows.push(`
              <tr>
                <td class="col-time">${parseInlineMarkdown(parts[2])}</td>
                <td class="col-speaker">${parseInlineMarkdown(parts[3] || '')}</td>
                <td class="col-details">${parseInlineMarkdown(parts[4] || '')}</td>
              </tr>
            `);
          }
        }
      }
    } else if (currentDay && line.includes('|')) {
      // Parse regular table rows
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 4 && parts[2] && !line.includes('---')) {
        // Sunday doesn't need Speaker column
        if (currentDay.id === 'sunday') {
          currentDay.rows.push(`
            <tr>
              <td class="col-time">${parseInlineMarkdown(parts[2] || '')}</td>
              <td class="col-details">${parseInlineMarkdown(parts[4] || '')}</td>
            </tr>
          `);
        } else {
          currentDay.rows.push(`
            <tr>
              <td class="col-time">${parseInlineMarkdown(parts[2] || '')}</td>
              <td class="col-speaker">${parseInlineMarkdown(parts[3] || '')}</td>
              <td class="col-details">${parseInlineMarkdown(parts[4] || '')}</td>
            </tr>
          `);
        }
      }
    }
  }

  if (currentDay) {
    days.push(currentDay);
  }

  return days;
}

// Setup tab switching functionality
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetDay = button.getAttribute('data-day');

      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));

      // Add active class to clicked button and corresponding panel
      button.classList.add('active');
      document.getElementById(targetDay).classList.add('active');
    });
  });
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
