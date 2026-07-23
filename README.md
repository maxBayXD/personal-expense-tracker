# Personal Expense Tracker

> **An offline-first, browser-based personal expense tracker designed to replace complex Excel cash flow workbooks.**

This application automates monthly cash flow management, balance carry-forwards, and recurring debt EMI deductions without requiring any backend, server, cloud sync, or external database.

---

## 🚀 Key Features

* **Monthly Cash Flow Ledger**:
  $$\text{Closing Balance} = \text{Opening Balance} + \text{Income} - \text{Expenses}$$
* **Automatic Carry-Forward**:
  Closing balance of the current month automatically becomes the opening balance of the newly created month.
* **Automated Debt EMI Engine**:
  Active debts generate an automatic EMI expense entry every month and reduce remaining debt balances and duration until fully paid off.
* **100% Offline-First**:
  All financial records are safely stored locally in your browser (`localStorage`). No tracking, no backend, and no internet required.
* **Backup & Restore**:
  Full JSON export and import capabilities to backup your data locally or transfer across devices.

---

## 🌐 How to Host & Deploy

Since this app is built with **React (Vite) + TypeScript** and runs entirely in the browser, you can host it for free on multiple web platforms.

### Option 1: Host on GitHub Pages (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy via GitHub Actions**:
   * Go to your repository on GitHub.
   * Navigate to **Settings** > **Pages**.
   * Under **Build and deployment** > **Source**, select **GitHub Actions**.
   * Choose the **Static HTML** or **Vite** starter workflow to deploy automatically on push.

3. **Deploy via `gh-pages` package (Alternative)**:
   * Install `gh-pages`:
     ```bash
     npm install -D gh-pages
     ```
   * Add scripts to `package.json`:
     ```json
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
     ```
   * Set `base: "/YOUR_REPO_NAME/"` in `vite.config.ts`.
   * Run:
     ```bash
     npm run deploy
     ```

---

### Option 2: Deploy on Vercel or Netlify

1. Push your code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Import your GitHub repository.
4. Set build settings:
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Click **Deploy**. Your site will be live on a custom `.vercel.app` or `.netlify.app` domain.

---

### Option 3: Export from AI Studio

In Google AI Studio Build:
* Click the **Settings** menu at the top right of the editor.
* Select **Export to GitHub** or **Download ZIP** to take your codebase anywhere.

---

## 🛠️ Local Development

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local dev server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📜 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.
