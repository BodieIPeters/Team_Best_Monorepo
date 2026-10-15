
const API_URL = "http://localhost:3000/api";

export interface Item {
  id: number;
  name: string;
  description: string;
}

// GET all items
export async function getItems(): Promise<Item[]> {
  const response = await fetch(`${API_URL}/items`);

  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }

  return response.json();
}

// GET one item
export async function getItemById(
  id: number
): Promise<Item> {
  const response = await fetch(`${API_URL}/items/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch item");
  }

  return response.json();
}

// POST create item
export async function createItem(
  item: Omit<Item, "id">
): Promise<Item> {
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  });

  if (!response.ok) {
    throw new Error("Failed to create item");
  }

  return response.json();
}

// PUT update item
export async function updateItem(
  id: number,
  item: Omit<Item, "id">
): Promise<Item> {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  });

  if (!response.ok) {
    throw new Error("Failed to update item");
  }

  return response.json();
}

// DELETE item
export async function deleteItem(
  id: number
): Promise<void> {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete item");
  }
}
