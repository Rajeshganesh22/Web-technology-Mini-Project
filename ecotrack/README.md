# 🌿 EcoTrack — Community Environmental Action Platform

A fullstack web app where citizens report environmental issues and authorities manage resolutions.

---

## 📁 Project Structure

```
ecotrack/
├── backend/          ← Express API (Port 5000)
│   ├── server.js
│   └── package.json
└── frontend/         ← React App (Port 3000)
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   ├── context/AuthContext.js
    │   └── pages/
    │       ├── Login.js
    │       ├── Dashboard.js
    │       ├── IssueList.js
    │       ├── ReportIssue.js
    │       ├── Leaderboard.js
    │       └── AdminPanel.js
    └── package.json
```

---

## 🚀 How to Run (VS Code)

### Step 1 — Open two terminals in VS Code
Press `Ctrl + `` ` to open terminal, then click `+` to open a second one.

### Step 2 — Start the Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```
You should see: `🌿 EcoTrack API running on http://localhost:5000`

### Step 3 — Start the Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```
Browser opens at: `http://localhost:3000`

---

## 🔑 Demo Login Accounts

| Role      | Email              | Password  |
|-----------|--------------------|-----------|
| Citizen   | ravi@eco.com       | pass123   |
| Citizen   | meena@eco.com      | pass123   |
| Authority | admin@eco.com      | admin123  |

Or click the demo buttons on the login page!

---

## ✨ Features

### Citizen
- Login / Register
- Dashboard with live stats
- Report issues with photo upload
- Browse & filter all issues
- Upvote issues
- Earn Green Points
- View leaderboard

### Authority (Admin)
- View all reports in a table
- Change issue status (Reported → In Progress → Resolved)
- Delete resolved/spam issues
- View stats overview

---

## 🛠️ Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 18, CSS3                |
| Backend  | Node.js, Express              |
| Storage  | In-memory (no DB setup needed)|
| Files    | Multer (local uploads)        |

> ⚠️ Data resets when backend restarts (no database). 
> To add persistence, replace the in-memory arrays with a SQLite or MongoDB connection.
