const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const https = require("https");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// ─── DATABASE ─────────────────────────────────────────────────────────────────
const DB_FILE = path.join(__dirname, "database.json");

function readDB() {
  if (!fs.existsSync(DB_FILE)) return { users: [], issues: [] };
  try { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); }
  catch { return { users: [], issues: [] }; }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function randomId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Seed default data
if (!fs.existsSync(DB_FILE)) {
  writeDB({
    users: [
      { id: randomId(), name: "Ravi Kumar",  email: "ravi@eco.com",  password: "pass123",  role: "citizen",   points: 120, createdAt: new Date().toISOString() },
      { id: randomId(), name: "Meena S",     email: "meena@eco.com", password: "pass123",  role: "citizen",   points: 85,  createdAt: new Date().toISOString() },
      { id: randomId(), name: "Admin User",  email: "admin@eco.com", password: "admin123", role: "authority", points: 0,   createdAt: new Date().toISOString() },
    ],
    issues: [
      { id: randomId(), title: "Illegal Dumping at River Bank", description: "Large pile of construction waste dumped near the riverbank.", type: "Illegal Dumping", severity: "High", status: "Reported", location: "Anna Nagar, Chennai", reporter: "Ravi Kumar", votes: 12, image: null, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: randomId(), title: "Polluted Drain Near School", description: "Open drain overflowing with sewage near Government School.", type: "Water Pollution", severity: "High", status: "In Progress", location: "Tambaram, Chennai", reporter: "Meena S", votes: 8, image: null, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: randomId(), title: "Burning Plastic Waste", description: "Residents burning plastic near residential area.", type: "Air Pollution", severity: "Medium", status: "Resolved", location: "Velachery, Chennai", reporter: "Ravi Kumar", votes: 5, image: null, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: randomId(), title: "Garbage Overflow at Market", description: "Municipality bins overflowing at the weekly market for 3 days.", type: "Waste Management", severity: "Medium", status: "Reported", location: "T.Nagar, Chennai", reporter: "Meena S", votes: 19, image: null, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
    ],
  });
  console.log("✅ Fresh database created");
}

// ─── FILE UPLOAD ──────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid email or password" });
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, token: "token_" + safeUser.id });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
  if (password.length < 4) return res.status(400).json({ message: "Password must be at least 4 characters" });
  const db = readDB();
  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(400).json({ message: "This email is already registered. Please login instead." });
  const newUser = { id: randomId(), name, email, password, role: "citizen", points: 0, createdAt: new Date().toISOString() };
  db.users.push(newUser);
  writeDB(db);
  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser, token: "token_" + safeUser.id });
});

// ─── ISSUES ───────────────────────────────────────────────────────────────────
app.get("/api/issues", (req, res) => {
  const { status, type } = req.query;
  const db = readDB();
  let result = [...db.issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (status && status !== "All") result = result.filter(i => i.status === status);
  if (type   && type   !== "All") result = result.filter(i => i.type === type);
  res.json(result);
});

app.post("/api/issues", upload.single("image"), (req, res) => {
  const { title, description, type, severity, location, reporter } = req.body;
  if (!title || !location) return res.status(400).json({ message: "Title and location are required" });
  const db = readDB();
  const newIssue = {
    id: randomId(), title, description, type, severity, location, reporter,
    status: "Reported", votes: 0,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date().toISOString(),
  };
  db.issues.unshift(newIssue);
  const user = db.users.find(u => u.name === reporter);
  if (user) user.points += 10;
  writeDB(db);
  res.status(201).json(newIssue);
});

app.patch("/api/issues/:id/status", (req, res) => {
  const db = readDB();
  const issue = db.issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ message: "Issue not found" });
  issue.status = req.body.status;
  if (req.body.status === "Resolved") {
    const user = db.users.find(u => u.name === issue.reporter);
    if (user) user.points += 20;
  }
  writeDB(db);
  // Return reporter email so frontend can send email via EmailJS
  const reporter = db.users.find(u => u.name === issue.reporter);
  res.json({ ...issue, reporterEmail: reporter?.email });
});

app.patch("/api/issues/:id/vote", (req, res) => {
  const db = readDB();
  const issue = db.issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ message: "Issue not found" });
  issue.votes += 1;
  writeDB(db);
  res.json(issue);
});

app.delete("/api/issues/:id", (req, res) => {
  const db = readDB();
  const idx = db.issues.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Issue not found" });
  db.issues.splice(idx, 1);
  writeDB(db);
  res.json({ message: "Deleted" });
});

// ─── STATS ────────────────────────────────────────────────────────────────────
app.get("/api/stats", (req, res) => {
  const db = readDB();
  const byType = {};
  db.issues.forEach(i => { byType[i.type] = (byType[i.type] || 0) + 1; });
  res.json({
    total:      db.issues.length,
    reported:   db.issues.filter(i => i.status === "Reported").length,
    inProgress: db.issues.filter(i => i.status === "In Progress").length,
    resolved:   db.issues.filter(i => i.status === "Resolved").length,
    byType,
  });
});

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
app.get("/api/leaderboard", (req, res) => {
  const db = readDB();
  res.json(db.users.filter(u => u.role === "citizen").map(({ password, ...u }) => u).sort((a, b) => b.points - a.points));
});

app.listen(PORT, () => {
  console.log(`🌿 EcoTrack running on http://localhost:${PORT}`);
  console.log(`💾 Database: database.json`);
});
