# Group Retreat Website

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Select **Pages** from the left menu
4. Under "Source," select **main** branch and **/ (root)** directory
5. Click **Save**
6. Your site will be live at: <https://birnstiel.github.io/retreat>

### 2. Update the Agenda URL

Edit `script.js` and replace `birnstiel` with your actual GitHub username in:

```javascript
const AGENDA_MARKDOWN_URL = 'https://raw.githubusercontent.com/birnstiel/retreat/main/agenda.md';
```

---

## 📁 File Structure

- `index.html` - Main website with sections for location, participants, agenda, and local info
- `style.css` - Modern, responsive design (customize colors here)
- `script.js` - Automatically loads and renders agenda from GitHub
- `agenda.md` - Your agenda in Markdown format
- `.gitignore` - Standard git configuration

---

## 🎨 How to Customize

### Change Colors

Edit `style.css` at the top:

```css
:root {
    --primary-color: #2563eb;      /* Main color */
    --secondary-color: #1e40af;    /* Secondary color */
    --accent-color: #f59e0b;       /* Accent color */
}
```

### Add Participants

Just modify `participants.md` - the website automatically loads and displays your changes!


### Update the Agenda

Simply edit `agenda.md` - the website automatically loads and displays your changes!

### Update Website Content

Edit the card content in `index.html`:
- **Location**: How to get there section
- **Local Info**: Hotels, restaurants, attractions
- Any other text sections

## Features

✅ **Auto-Rendering Agenda** - Edit Markdown, website shows it instantly  
✅ **Responsive Design** - Looks great on mobile, tablet, and desktop  
✅ **No Build Required** - Just edit, commit, and push  
✅ **Free Hosting** - GitHub Pages at no cost  
✅ **Modern UI** - Clean, professional design with smooth interactions

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| Agenda not loading | Check the URL in `script.js` and ensure your repository is public |
| Changes not showing | Wait a few seconds and hard-refresh: Ctrl+Shift+R or Cmd+Shift+R |
| Site looks broken | Clear your browser cache or try incognito mode |
| Markdown not rendering | Make sure `agenda.md` is valid Markdown syntax |

---

## 📱 Important URLs

- **Website**: <https://birnstiel.github.io/retreat>
- **Repository**: <https://github.com/birnstiel/retreat>
- **Raw Agenda**: <https://raw.githubusercontent.com/birnstiel/retreat/main/agenda.md>
