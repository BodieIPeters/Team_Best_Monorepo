
const express = require("express");
const cors = require("cors");
const { db } = require("./mockData");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    app: "Church Match"
  });
});

// ==========================================
// GET ALL CHURCHES / SEARCH / FILTER
// ==========================================

app.get("/api/churches", (req, res) => {
  const { search, denomination, worshipStyle } = req.query;

  if (
    [search, denomination, worshipStyle].some(
      value => value !== undefined &&
      typeof value !== "string"
    )
  ) {
    return res.status(400).json({
      error: "Query parameters must be text"
    });
  }

  let results = [...db.churches];

  // Search by church name, denomination, or city
  if (search && search.trim()) {
    const term = search.toLowerCase();

    results = results.filter(church =>
      church.name.toLowerCase().includes(term) ||
      church.denomination.toLowerCase().includes(term) ||
      church.city.toLowerCase().includes(term)
    );
  }

  // Filter by denomination
  if (denomination) {
    results = results.filter(church =>
      church.denomination.toLowerCase() ===
      denomination.toLowerCase()
    );
  }

  // Filter by worship style
  if (worshipStyle) {
    results = results.filter(church =>
      church.worshipStyle.toLowerCase() ===
      worshipStyle.toLowerCase()
    );
  }

  res.status(200).json(results);
});

// ==========================================
// GET CHURCH BY ID
// ==========================================

app.get("/api/churches/:id", (req, res) => {
  const church = db.churches.find(
    church => church.id === req.params.id
  );

  if (!church) {
    return res.status(404).json({
      error: "Church not found"
    });
  }

  res.status(200).json(church);
});

// ==========================================
// GET STUDENT PREFERENCES
// ==========================================

app.get("/api/students/:id/preferences", (req, res) => {
  const student = db.students.find(
    student => student.id === Number(req.params.id)
  );

  if (!student) {
    return res.status(404).json({
      error: "Student not found"
    });
  }

  res.status(200).json(student.preferences);
});

// ==========================================
// UPDATE STUDENT PREFERENCES
// ==========================================

app.put("/api/students/:id/preferences", (req, res) => {
  const student = db.students.find(
    student => student.id === Number(req.params.id)
  );

  if (!student) {
    return res.status(404).json({
      error: "Student not found"
    });
  }

  const {
    denomination,
    worshipStyle,
    maxDistanceMiles
  } = req.body || {};

  const validStyles = [
    "Contemporary",
    "Traditional",
    "Liturgical",
    "Blended"
  ];

  if (
    typeof denomination !== "string" ||
    !denomination.trim() ||
    !validStyles.includes(worshipStyle) ||
    typeof maxDistanceMiles !== "number" ||
    !Number.isFinite(maxDistanceMiles) ||
    maxDistanceMiles < 0
  ) {
    return res.status(400).json({
      error: "Invalid student preferences"
    });
  }

  student.preferences = {
    denomination: denomination.trim(),
    worshipStyle,
    maxDistanceMiles
  };

  res.status(200).json(student.preferences);
});

// ==========================================
// PERSONALIZED CHURCH RECOMMENDATIONS
// ==========================================

app.get(
  "/api/students/:id/recommendations",
  (req, res) => {
    const student = db.students.find(
      student => student.id === Number(req.params.id)
    );

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    const preferences = student.preferences;

    const recommendations = db.churches.map(church => {
      let score = 0;

      // Denomination match: 50 points
      if (
        church.denomination.toLowerCase() ===
        preferences.denomination.toLowerCase()
      ) {
        score += 50;
      }

      // Worship style match: 30 points
      if (
        church.worshipStyle ===
        preferences.worshipStyle
      ) {
        score += 30;
      }

      // Distance preference: 20 points
      if (
        church.distanceMiles <=
        preferences.maxDistanceMiles
      ) {
        score += 20;
      }

      // Previous experience feedback
      const studentFeedback = db.feedback.filter(
        feedback =>
          feedback.studentId === student.id &&
          feedback.churchId === church.id
      );

      if (studentFeedback.length > 0) {
        const averageRating =
          studentFeedback.reduce(
            (total, feedback) =>
              total + feedback.rating,
            0
          ) / studentFeedback.length;

        // Adjust by -10 to +10 points
        score += (averageRating - 3) * 5;
      }

      // Keep match score between 0 and 100
      const matchScore = Math.max(
        0,
        Math.min(100, score)
      );

      return {
        ...church,
        matchScore
      };
    });

    recommendations.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    res.status(200).json(recommendations);
  }
);

// ==========================================
// SUBMIT CHURCH FEEDBACK
// ==========================================

app.post("/api/feedback", (req, res) => {
  const {
    studentId,
    churchId,
    rating,
    comment = ""
  } = req.body || {};

  const student = db.students.find(
    student => student.id === studentId
  );

  const church = db.churches.find(
    church => church.id === churchId
  );

  if (!student || !church) {
    return res.status(404).json({
      error: "Student or church not found"
    });
  }

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    typeof comment !== "string"
  ) {
    return res.status(400).json({
      error: "Rating must be between 1 and 5"
    });
  }

  const nextId =
    db.feedback.length === 0
      ? 1
      : Math.max(...db.feedback.map(f => f.id)) + 1;

  const newFeedback = {
    id: nextId,
    studentId,
    churchId,
    rating,
    comment
  };

  db.feedback.push(newFeedback);

  // Add written feedback to the church
  if (comment.trim()) {
    church.userFeedback.push(comment.trim());
  }

  res.status(201).json(newFeedback);
});

// ==========================================
// GET FEEDBACK FOR A CHURCH
// ==========================================

app.get("/api/churches/:id/feedback", (req, res) => {
  const churchId = req.params.id;

  const church = db.churches.find(
    church => church.id === churchId
  );

  if (!church) {
    return res.status(404).json({
      error: "Church not found"
    });
  }

  const feedback = db.feedback.filter(
    feedback => feedback.churchId === churchId
  );

  res.status(200).json(feedback);
});

// ==========================================
// SELECT HOME CHURCH
// ==========================================

app.post("/api/commitments", (req, res) => {
  const { studentId, churchId } = req.body || {};

  const student = db.students.find(
    student => student.id === studentId
  );

  const church = db.churches.find(
    church => church.id === churchId
  );

  if (!student || !church) {
    return res.status(404).json({
      error: "Student or church not found"
    });
  }

  student.homeChurchId = churchId;

  res.status(201).json({
    studentId,
    churchId,
    message: "Home church selected successfully"
  });
});

// ==========================================
// GET STUDENT'S SELECTED HOME CHURCH
// ==========================================

app.get("/api/students/:id/commitment", (req, res) => {
  const student = db.students.find(
    student => student.id === Number(req.params.id)
  );

  if (!student) {
    return res.status(404).json({
      error: "Student not found"
    });
  }

  res.status(200).json({
    studentId: student.id,
    churchId: student.homeChurchId
  });
});

// ==========================================
// GET CHURCH COMMUNITY ACTIVITIES
// ==========================================

app.get("/api/churches/:id/activities", (req, res) => {
  const churchId = req.params.id;

  const church = db.churches.find(
    church => church.id === churchId
  );

  if (!church) {
    return res.status(404).json({
      error: "Church not found"
    });
  }

  const activities = db.activities.filter(
    activity => activity.churchId === churchId
  );

  res.status(200).json(activities);
});

// ==========================================
// JOIN CHURCH ACTIVITY
// ==========================================

app.post("/api/activities/:id/join", (req, res) => {
  const { studentId } = req.body || {};

  const student = db.students.find(
    student => student.id === studentId
  );

  const activity = db.activities.find(
    activity => activity.id === Number(req.params.id)
  );

  if (!student || !activity) {
    return res.status(404).json({
      error: "Student or activity not found"
    });
  }

  // Student must select this church first
  if (
    student.homeChurchId !== activity.churchId
  ) {
    return res.status(403).json({
      error: "Select this church before joining"
    });
  }

  // Prevent duplicate participation
  if (
    activity.participants.includes(studentId)
  ) {
    return res.status(409).json({
      error: "Student already joined this activity"
    });
  }

  activity.participants.push(studentId);

  res.status(201).json({
    message: "Joined activity successfully",
    activity
  });
});

// ==========================================
// UNKNOWN API ENDPOINT
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found"
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================

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

// Export for Jest and Supertest
module.exports = app;
