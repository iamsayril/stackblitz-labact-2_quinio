const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// =====================
// DATA
// =====================
const heroes = [
  {
    id: 1,
    name: "Layla",
    role: "Marksman",
    difficulty: "Easy",
  },
  {
    id: 2,
    name: "Alucard",
    role: "Fighter",
    difficulty: "Medium",
  },
  {
    id: 3,
    name: "Tigreal",
    role: "Tank",
    difficulty: "Easy",
  },
  {
    id: 4,
    name: "Eudora",
    role: "Mage",
    difficulty: "Easy",
  },
  {
    id: 5,
    name: "Gusion",
    role: "Assassin",
    difficulty: "Hard",
  },
];

// =====================
// ROUTES
// =====================

// GET all heroes
app.get('/heroes', (req, res) => {
  res.json(heroes);
});

// FILTER by role (must come before /:id)
app.get('/heroes/role/:role', (req, res) => {
  const result = heroes.filter(
    h => h.role.toLowerCase() === req.params.role.toLowerCase()
  );
  res.json(result);
});

// GET by id
app.get('/heroes/:id', (req, res) => {
  const hero = heroes.find(h => h.id === Number(req.params.id));
  if (!hero) return res.status(404).json({ message: "Not found" });
  res.json(hero);
});

// SEARCH by name
app.get('/search', (req, res) => {
  const name = (req.query.name || "").toLowerCase();

  const result = heroes.filter(h =>
    h.name.toLowerCase().includes(name)
  );

  res.json(result);
});

// RANDOM hero
app.get('/random', (req, res) => {
  const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
  res.json(randomHero);
});

// STATS (count per role)
app.get('/stats', (req, res) => {
  const stats = {};

  heroes.forEach(h => {
    stats[h.role] = (stats[h.role] || 0) + 1;
  });

  res.json(stats);
});

// TOP 3 heroes
app.get('/top-heroes', (req, res) => {
  res.json(heroes.slice(0, 3));
});

// CREATE hero
app.post('/heroes', (req, res) => {
  const { name, role, difficulty } = req.body;

  if (!name || !role || !difficulty) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newHero = {
    id: Date.now(),
    name,
    role,
    difficulty,
  };

  heroes.push(newHero);
  res.status(201).json(newHero);
});

// UPDATE hero
app.put('/heroes/:id', (req, res) => {
  const hero = heroes.find(h => h.id === Number(req.params.id));

  if (!hero) {
    return res.status(404).json({ message: "Not found" });
  }

  Object.assign(hero, req.body);
  res.json(hero);
});

// DELETE hero
app.delete('/heroes/:id', (req, res) => {
  const index = heroes.findIndex(
    h => h.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  heroes.splice(index, 1);
  res.json({ message: "Deleted" });
});

// =====================
// SERVER
// =====================
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});