const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const characters = [
  { id: 1, name: "Layla", role: "Marksman", difficulty: "Easy" },
  { id: 2, name: "Alucard", role: "Fighter", difficulty: "Medium" },
  { id: 3, name: "Tigreal", role: "Tank", difficulty: "Easy" },
  { id: 4, name: "Eudora", role: "Mage", difficulty: "Easy" },
  { id: 5, name: "Gusion", role: "Assassin", difficulty: "Hard" },
];

// GET all
app.get('/characters', (req, res) => {
  res.json(characters);
});

// GET by ID
app.get('/characters/:id', (req, res) => {
  const item = characters.find(c => c.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// POST
app.post('/characters', (req, res) => {
  const { name, role, difficulty } = req.body;

  if (!name || !role || !difficulty) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newChar = {
    id: Date.now(),
    name,
    role,
    difficulty
  };

  characters.push(newChar);
  res.status(201).json(newChar);
});

// PUT (FIXED SAFE UPDATE)
app.put('/characters/:id', (req, res) => {
  const item = characters.find(c => c.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: "Not found" });

  const { name, role, difficulty } = req.body;

  if (name) item.name = name;
  if (role) item.role = role;
  if (difficulty) item.difficulty = difficulty;

  res.json(item);
});

// DELETE
app.delete('/characters/:id', (req, res) => {
  const index = characters.findIndex(c => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Not found" });

  characters.splice(index, 1);
  res.json({ message: "Deleted" });
});

// FILTER
app.get('/characters/role/:role', (req, res) => {
  res.json(
    characters.filter(c =>
      c.role.toLowerCase() === req.params.role.toLowerCase()
    )
  );
});

// SEARCH
app.get('/search', (req, res) => {
  const name = (req.query.name || "").toLowerCase();
  res.json(
    characters.filter(c =>
      c.name.toLowerCase().includes(name)
    )
  );
});

// RANDOM
app.get('/random', (req, res) => {
  res.json(characters[Math.floor(Math.random() * characters.length)]);
});

// STATS
app.get('/stats', (req, res) => {
  const stats = {};
  characters.forEach(c => {
    stats[c.role] = (stats[c.role] || 0) + 1;
  });
  res.json(stats);
});

// TOP
app.get('/top-characters', (req, res) => {
  res.json(characters.slice(0, 3));
});

// HEALTH
app.get('/health', (req, res) => {
  res.json({ status: "API running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});