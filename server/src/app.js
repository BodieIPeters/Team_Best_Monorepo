
const express = require("express");
const cors = require("cors");
const { items } = require("./mockData");

const app = express();

app.use(cors());
app.use(express.json());

// Check if server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET all items or search items
app.get("/api/items", (req, res) => {
  const search = req.query.search;

  if (
    search !== undefined &&
    typeof search !== "string"
  ) {
    return res.status(400).json({
      error: "search must be text"
    });
  }

  const result = search
    ? items.filter(item =>
        item.name.toLowerCase()
          .includes(search.toLowerCase())
      )
    : items;

  res.json(result);
});

// GET one item by its ID
app.get("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const item = items.find(
    item => item.id === id
  );

  if (!item) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  res.json(item);
});

// POST create a new item
app.post("/api/items", (req, res) => {
  const {
    name,
    description = ""
  } = req.body ?? {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof description !== "string"
  ) {
    return res.status(400).json({
      error: "A nonempty name and text description are required"
    });
  }

  const item = {
    id: Math.max(
      0,
      ...items.map(item => item.id)
    ) + 1,
    name: name.trim(),
    description
  };

  items.push(item);

  res.status(201).json(item);
});

// PUT update an existing item
app.put("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const item = items.find(
    item => item.id === id
  );

  if (!item) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  const { name, description } = req.body ?? {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof description !== "string"
  ) {
    return res.status(400).json({
      error: "A nonempty name and text description are required"
    });
  }

  item.name = name.trim();
  item.description = description;

  res.json(item);
});

// DELETE an item
app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = items.findIndex(
    item => item.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Item not found"
    });
  }

  items.splice(index, 1);

  res.status(204).send();
});

// Handle server errors
app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      error: "Invalid JSON"
    });
  }

  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

module.exports = app;
