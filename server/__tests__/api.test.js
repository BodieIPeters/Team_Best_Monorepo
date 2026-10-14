
const request = require("supertest");
const app = require("../src/app");
const { items, resetItems } = require("../src/mockData");

// Reset mock database before every test
beforeEach(() => {
  resetItems();
});

// GROUP 1: SERVER HEALTH TESTS

describe("Server Health Tests", () => {

  // TEST 1
  test("Server returns status 200", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
  });

  // TEST 2
  test("Server returns correct health message", async () => {
    const res = await request(app).get("/api/health");

    expect(res.body).toEqual({
      status: "ok"
    });
  });

});

// GROUP 2: GET ALL ITEMS

describe("GET /api/items", () => {

  // TEST 3
  test("Returns status 200", async () => {
    const res = await request(app).get("/api/items");

    expect(res.status).toBe(200);
  });

  // TEST 4
  test("Returns an array", async () => {
    const res = await request(app).get("/api/items");

    expect(Array.isArray(res.body)).toBe(true);
  });

  // TEST 5
  test("Returns all 3 mock items", async () => {
    const res = await request(app).get("/api/items");

    expect(res.body).toHaveLength(3);
  });

  // TEST 6
  test("Items contain required properties", async () => {
    const res = await request(app).get("/api/items");

    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("description");
  });

});

// GROUP 3: SEARCH ITEMS

describe("GET /api/items Search", () => {

  // TEST 7
  test("Search finds matching item", async () => {
    const res = await request(app)
      .get("/api/items?search=One");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Item One");
  });

  // TEST 8
  test("Search is case insensitive", async () => {
    const res = await request(app)
      .get("/api/items?search=one");

    expect(res.body[0].name).toBe("Item One");
  });

  // TEST 9
  test("Search returns empty array when no match", async () => {
    const res = await request(app)
      .get("/api/items?search=Unknown");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  // TEST 10
  test("Empty search returns all items", async () => {
    const res = await request(app)
      .get("/api/items?search=");

    expect(res.body).toHaveLength(3);
  });

  // TEST 11
  test("Rejects search query with array values", async () => {
    const res = await request(app)
      .get("/api/items")
      .query({ search: ["One", "Two"] });

    expect(res.status).toBe(400);
  });

});

// GROUP 4: GET ITEM BY ID

describe("GET /api/items/:id", () => {

  // TEST 12
  test("Returns item with ID 1", async () => {
    const res = await request(app)
      .get("/api/items/1");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  // TEST 13
  test("Returns correct item name", async () => {
    const res = await request(app)
      .get("/api/items/2");

    expect(res.body.name).toBe("Item Two");
  });

  // TEST 14
  test("Returns 404 for nonexistent ID", async () => {
    const res = await request(app)
      .get("/api/items/999");

    expect(res.status).toBe(404);
  });

  // TEST 15
  test("Returns 404 for invalid ID", async () => {
    const res = await request(app)
      .get("/api/items/abc");

    expect(res.status).toBe(404);
  });

});

// GROUP 5: CREATE ITEMS

describe("POST /api/items", () => {

  // TEST 16
  test("Creates a new item", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        name: "New Item",
        description: "New description"
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("New Item");
  });

  // TEST 17
  test("Assigns new item a unique ID", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        name: "Fourth Item",
        description: "Test"
      });

    expect(res.body.id).toBe(4);
  });

  // TEST 18
  test("New item increases total count", async () => {
    await request(app)
      .post("/api/items")
      .send({
        name: "Added",
        description: "Test"
      });

    const res = await request(app).get("/api/items");

    expect(res.body).toHaveLength(4);
  });

  // TEST 19
  test("Trims whitespace from item name", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        name: "  Example  ",
        description: "Test"
      });

    expect(res.body.name).toBe("Example");
  });

  // TEST 20
  test("Uses empty description by default", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        name: "Without Description"
      });

    expect(res.status).toBe(201);
    expect(res.body.description).toBe("");
  });

  // TEST 21
  test("Rejects missing name", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        description: "Missing name"
      });

    expect(res.status).toBe(400);
  });

  // TEST 22
  test("Rejects empty name", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        name: "",
        description: "Test"
      });

    expect(res.status).toBe(400);
  });

  // TEST 23
  test("Rejects numeric name", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        name: 123,
        description: "Test"
      });

    expect(res.status).toBe(400);
  });

  // TEST 24
  test("Rejects invalid description", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({
        name: "Example",
        description: 500
      });

    expect(res.status).toBe(400);
  });

});

// UPDATE ITEMS

describe("PUT /api/items/:id", () => {

  // TEST 25
  test("Updates item successfully", async () => {
    const res = await request(app)
      .put("/api/items/1")
      .send({
        name: "Updated Item",
        description: "Updated description"
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated Item");
    expect(res.body.description).toBe(
      "Updated description"
    );
  });

  // TEST 26
  test("Updating preserves the item ID", async () => {
    const res = await request(app)
      .put("/api/items/1")
      .send({
        name: "Changed",
        description: "Changed description"
      });

    expect(res.body.id).toBe(1);
  });

  // TEST 27
  test("Returns 404 when updating missing item", async () => {
    const res = await request(app)
      .put("/api/items/999")
      .send({
        name: "Missing",
        description: "Test"
      });

    expect(res.status).toBe(404);
  });

  // TEST 28
  test("Rejects update with empty name", async () => {
    const res = await request(app)
      .put("/api/items/1")
      .send({
        name: "",
        description: "Test"
      });

    expect(res.status).toBe(400);
  });

});

// GROUP 7: DELETE ITEMS

describe("DELETE /api/items/:id", () => {

  // TEST 29
  test("Deletes an existing item", async () => {
    const res = await request(app)
      .delete("/api/items/1");

    expect(res.status).toBe(204);

    const remaining = await request(app)
      .get("/api/items");

    expect(remaining.body).toHaveLength(2);
  });

  // TEST 30
  test("Returns 404 when deleting missing item", async () => {
    const res = await request(app)
      .delete("/api/items/999");

    expect(res.status).toBe(404);
  });

});
