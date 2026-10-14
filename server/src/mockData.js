const initialItems = [
  { id: 1, name: "Item One", description: "First example item" },
  { id: 2, name: "Item Two", description: "Second example item" },
  { id: 3, name: "Item Three", description: "Third example item" }
];

const items = initialItems.map(item => ({ ...item }));

function resetItems() {
  items.splice(
    0,
    items.length,
    ...initialItems.map(item => ({ ...item }))
  );
}

module.exports = { items, resetItems };