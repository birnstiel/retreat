# Team Retreat Website

A modern, responsive website for your team retreat with automatic Markdown rendering for the agenda.

## 🚀 Quick Start

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click **+** → **New repository**
3. Name it `retreat`
4. Set it to **Public** (so the Markdown file can be accessed)
5. Click **Create repository**

### 2. Push Files to GitHub

```bash
# Run in your retreat directory
git init
git add .
git commit -m "Initial commit: Retreat website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/retreat.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Select **Pages** from the left menu
4. Under "Source," select **main** branch and **/ (root)** directory
5. Click **Save**
6. Your site will be live at: `https://YOUR-USERNAME.github.io/retreat`

### 4. Update the Agenda URL

Edit `script.js` and replace `YOUR-USERNAME` with your actual GitHub username in:

```javascript
const AGENDA_MARKDOWN_URL = 'https://raw.githubusercontent.com/YOUR-USERNAME/retreat/main/agenda.md';
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

In `index.html`, find the Participants section and add:

```html
<div class="participant-card">
    <div class="participant-avatar">X</div>
    <h3>Person's Name</h3>
    <p class="participant-role">Their Role</p>
</div>
```

### Update Website Content

Edit the card content in `index.html`:
- **Location**: How to get there section
- **Local Info**: Hotels, restaurants, attractions
- Any other text sections

### Update the Agenda

Simply edit `agenda.md` - the website automatically loads and displays your changes!

---

## 📤 Publishing Changes

After making any changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Your website updates automatically within seconds.

---

## ✨ Features

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

- **Website**: `https://YOUR-USERNAME.github.io/retreat`
- **Repository**: `https://github.com/YOUR-USERNAME/retreat`
- **Raw Agenda**: `https://raw.githubusercontent.com/YOUR-USERNAME/retreat/main/agenda.md`

---

**Enjoy your retreat! 🎉**
