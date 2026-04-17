const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let products = [
  { id: 1, name: "Laptop", category: "Electronics", price: 45000, stock: 10 },
  { id: 2, name: "Mouse", category: "Accessories", price: 500, stock: 50 },
  { id: 3, name: "Keyboard", category: "Accessories", price: 1200, stock: 30 },
  { id: 4, name: "Monitor", category: "Electronics", price: 8000, stock: 15 },
];

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

// GET ALL
app.get('/products', (req, res) => res.json(products));

// FILTER CATEGORY
app.get('/products/category/:category', (req, res) =>
  res.json(products.filter(p =>
    p.category.toLowerCase() === req.params.category.toLowerCase()
  ))
);

// GET ONE
app.get('/products/:id', (req, res) => {
  const item = products.find(p => p.id == req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// CREATE
app.post('/products', (req, res) => {
  const { name, category, price, stock } = req.body;

  if (!name || !category || price == null || stock == null)
    return res.status(400).json({ message: "Missing fields" });

  const newProduct = {
    id: Date.now(),
    name,
    category,
    price: +price,
    stock: +stock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// UPDATE
app.put('/products/:id', (req, res) => {
  const item = products.find(p => p.id == req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });

  Object.assign(item, req.body);

  res.json(item);
});

// DELETE
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  products.splice(index, 1);
  res.json({ message: "Deleted" });
});

// SEARCH
app.get('/search', (req, res) => {
  const q = (req.query.name || "").toLowerCase();
  res.json(products.filter(p => p.name.toLowerCase().includes(q)));
});

// EXTRA FEATURES
app.get('/low-stock', (req, res) =>
  res.json(products.filter(p => p.stock < 10))
);

app.get('/inventory-value', (req, res) =>
  res.json({
    totalValue: products.reduce((s, p) => s + p.price * p.stock, 0)
  })
);

app.get('/random', (req, res) =>
  res.json(products[Math.floor(Math.random() * products.length)])
);

app.get('/top-products', (req, res) =>
  res.json([...products].sort((a, b) => b.price - a.price).slice(0, 3))
);

app.get('/health', (req, res) =>
  res.json({ status: "API running" })
);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);