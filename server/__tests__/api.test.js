
const request = require("supertest");
const app = require("../src/app");
const { db, resetData } = require("../src/mockData");

beforeEach(() => {
  resetData();
});

const preferences = {
  denomination: "Baptist",
  worshipStyle: "Traditional",
  maxDistanceMiles: 4
};

const feedback = {
  studentId: 1,
  churchId: "1",
  rating: 5,
  comment: "Friendly people"
};

const commitment = {
  studentId: 1,
  churchId: "1"
};

// SERVER HEALTH TESTS

describe("Server Health Tests", () => {

  // TEST 1
  test("Server returns status 200", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
  });

  // TEST 2
  test("Server identifies Church Match", async () => {
    const res = await request(app).get("/api/health");

    expect(res.body).toEqual({
      status: "ok",
      app: "Church Match"
    });
  });

});

// GET ALL CHURCHES

describe("GET /api/churches", () => {

  // TEST 3
  test("Returns all six churches", async () => {
    const res = await request(app).get("/api/churches");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(6);
  });

  // TEST 4
  test("Churches contain required properties", async () => {
    const res = await request(app).get("/api/churches");

    const church = res.body[0];

    expect(church).toHaveProperty("id");
    expect(church).toHaveProperty("name");
    expect(church).toHaveProperty("address");
    expect(church).toHaveProperty("city");
    expect(church).toHaveProperty("state");
    expect(church).toHaveProperty("zipcode");
    expect(church).toHaveProperty("denomination");
    expect(church).toHaveProperty("serviceTimes");
    expect(church).toHaveProperty("worshipStyle");
    expect(church).toHaveProperty("distanceMiles");
    expect(church).toHaveProperty("rating");
    expect(church).toHaveProperty("description");
    expect(church).toHaveProperty("userFeedback");
  });

  // TEST 5
  test("Searches churches by name", async () => {
    const res = await request(app)
      .get("/api/churches?search=Cathedral");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe(
      "Cathedral of St. Andrew"
    );
  });

  // TEST 6
  test("Search is case insensitive", async () => {
    const res = await request(app)
      .get("/api/churches?search=cathedral");

    expect(res.status).toBe(200);
    expect(res.body[0].id).toBe("1");
  });

  // TEST 7
  test("Search returns empty array if no match", async () => {
    const res = await request(app)
      .get("/api/churches?search=UnknownChurch");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  // TEST 8
  test("Filters churches by denomination", async () => {
    const res = await request(app)
      .get("/api/churches?denomination=Catholic");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].denomination).toBe("Catholic");
  });

  // TEST 9
  test("Filters churches by worship style", async () => {
    const res = await request(app)
      .get("/api/churches?worshipStyle=Contemporary");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);

    res.body.forEach(church => {
      expect(church.worshipStyle).toBe("Contemporary");
    });
  });

  // TEST 10
  test("Returns church details by ID", async () => {
    const res = await request(app).get("/api/churches/1");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe("1");
    expect(res.body.name).toBe(
      "Cathedral of St. Andrew"
    );
  });

});

// STUDENT PREFERENCES

describe("Student Preferences", () => {

  // TEST 11
  test("Retrieves student preferences", async () => {
    const res = await request(app)
      .get("/api/students/1/preferences");

    expect(res.status).toBe(200);
    expect(res.body.denomination).toBe("Catholic");
    expect(res.body.worshipStyle).toBe("Liturgical");
  });

  // TEST 12
  test("Returns 404 for nonexistent student", async () => {
    const res = await request(app)
      .get("/api/students/999/preferences");

    expect(res.status).toBe(404);
  });

  // TEST 13
  test("Updates student preferences", async () => {
    const res = await request(app)
      .put("/api/students/1/preferences")
      .send(preferences);

    expect(res.status).toBe(200);
    expect(res.body.denomination).toBe("Baptist");
    expect(res.body.worshipStyle).toBe("Traditional");
    expect(res.body.maxDistanceMiles).toBe(4);
  });

  // TEST 14
  test("Saved preferences can be retrieved", async () => {
    await request(app)
      .put("/api/students/1/preferences")
      .send(preferences);

    const res = await request(app)
      .get("/api/students/1/preferences");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(preferences);
  });

  // TEST 15
  test("Rejects incomplete preferences", async () => {
    const res = await request(app)
      .put("/api/students/1/preferences")
      .send({
        denomination: "Baptist"
      });

    expect(res.status).toBe(400);
  });

  // TEST 16
  test("Rejects negative maximum distance", async () => {
    const res = await request(app)
      .put("/api/students/1/preferences")
      .send({
        denomination: "Catholic",
        worshipStyle: "Liturgical",
        maxDistanceMiles: -5
      });

    expect(res.status).toBe(400);
  });

});

// CHURCH RECOMMENDATIONS

describe("Church Recommendations", () => {

  // TEST 17
  test("Generates personalized recommendations", async () => {
    const res = await request(app)
      .get("/api/students/1/recommendations");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(6);

    expect(res.body[0].id).toBe("1");
    expect(res.body[0].matchScore).toBe(100);

    for (let i = 1; i < res.body.length; i++) {
      expect(res.body[i - 1].matchScore)
        .toBeGreaterThanOrEqual(
          res.body[i].matchScore
        );
    }
  });

  // TEST 18
  test("Changing preferences changes recommendations", async () => {
    await request(app)
      .put("/api/students/1/preferences")
      .send({
        denomination: "Nondenominational",
        worshipStyle: "Contemporary",
        maxDistanceMiles: 3
      });

    const res = await request(app)
      .get("/api/students/1/recommendations");

    expect(res.status).toBe(200);
    expect(res.body[0].id).toBe("2");
    expect(res.body[0].matchScore).toBe(100);
  });

});

// CHURCH FEEDBACK

describe("Church Feedback", () => {

  // TEST 19
  test("Student can submit church feedback", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send(feedback);

    expect(res.status).toBe(201);
    expect(res.body.studentId).toBe(1);
    expect(res.body.churchId).toBe("1");
    expect(res.body.rating).toBe(5);
  });

  // TEST 20
  test("Rejects rating above 5", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({
        ...feedback,
        rating: 6
      });

    expect(res.status).toBe(400);
  });

  // TEST 21
  test("Rejects rating below 1", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({
        ...feedback,
        rating: 0
      });

    expect(res.status).toBe(400);
  });

  // TEST 22
  test("Rejects feedback for nonexistent church", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({
        ...feedback,
        churchId: "999"
      });

    expect(res.status).toBe(404);
  });

  // TEST 23
  test("Retrieves feedback for a church", async () => {
    await request(app)
      .post("/api/feedback")
      .send(feedback);

    const res = await request(app)
      .get("/api/churches/1/feedback");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].rating).toBe(5);
  });

  // TEST 24
  test("Feedback updates church information", async () => {
    await request(app)
      .post("/api/feedback")
      .send(feedback);

    const res = await request(app)
      .get("/api/churches/1");

    expect(res.status).toBe(200);
    expect(res.body.userFeedback).toContain(
      "Friendly people"
    );
  });

});

// CHURCH COMMITMENTS

describe("Church Commitments", () => {

  // TEST 25
  test("Student can select a home church", async () => {
    const res = await request(app)
      .post("/api/commitments")
      .send(commitment);

    expect(res.status).toBe(201);
    expect(res.body.churchId).toBe("1");
  });

  // TEST 26
  test("Rejects nonexistent home church", async () => {
    const res = await request(app)
      .post("/api/commitments")
      .send({
        studentId: 1,
        churchId: "999"
      });

    expect(res.status).toBe(404);
  });

  // TEST 27
  test("Retrieves student's selected church", async () => {
    await request(app)
      .post("/api/commitments")
      .send(commitment);

    const res = await request(app)
      .get("/api/students/1/commitment");

    expect(res.status).toBe(200);
    expect(res.body.studentId).toBe(1);
    expect(res.body.churchId).toBe("1");
  });

});

// CHURCH ACTIVITIES

describe("Church Activities", () => {

  // TEST 28
  test("Retrieves activities for a church", async () => {
    const res = await request(app)
      .get("/api/churches/1/activities");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe(
      "College Student Fellowship"
    );
  });

  // TEST 29
  test("Cannot join activity before selecting church", async () => {
    const res = await request(app)
      .post("/api/activities/1/join")
      .send({
        studentId: 1
      });

    expect(res.status).toBe(403);
  });

  // TEST 30
  test("Student joins activity and cannot join twice", async () => {
    await request(app)
      .post("/api/commitments")
      .send(commitment);

    const first = await request(app)
      .post("/api/activities/1/join")
      .send({
        studentId: 1
      });

    expect(first.status).toBe(201);
    expect(first.body.activity.participants).toContain(1);

    const second = await request(app)
      .post("/api/activities/1/join")
      .send({
        studentId: 1
      });

    expect(second.status).toBe(409);
  });

});
