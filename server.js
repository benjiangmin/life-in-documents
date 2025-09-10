import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const app = express();
const PORT = 4000;
const REMOVED_FILE = "./removedBacklog.json";

// ----------------------------
// OpenAI client
// ----------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ----------------------------
// Middleware
// ----------------------------
app.use(cors());
app.use(express.json()); // parse JSON bodies

// ----------------------------
// Helper functions for removed backlog
// ----------------------------
async function readRemovedIds() {
  try {
    const raw = await fs.readFile(REMOVED_FILE, "utf8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch (err) {
    if (err.code === "ENOENT") return [];
    console.error("Error reading removed backlog file:", err);
    return [];
  }
}

async function addRemovedId(id) {
  const strId = String(id);
  const arr = await readRemovedIds();
  if (!arr.includes(strId)) {
    arr.push(strId);
    await fs.writeFile(REMOVED_FILE, JSON.stringify(arr, null, 2), "utf8");
  }
}

// ----------------------------
// Canvas assignments endpoint
// ----------------------------
app.get("/api/canvas/assignments", async (req, res) => {
  try {
    const token = process.env.CANVAS_API_TOKEN;
    const removedIds = await readRemovedIds();

    // Fetch all active courses
    const coursesRes = await fetch(
      "https://canvas.wisc.edu/api/v1/courses?enrollment_state=active",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const courses = await coursesRes.json();
    if (!Array.isArray(courses)) {
      console.error("Courses fetch did not return an array:", courses);
      return res.status(500).json({ error: "Courses fetch failed" });
    }

    const upcomingAssignments = [];
    const now = new Date();

    for (const course of courses) {
      if (!course?.id || !course?.name) continue;

      const courseId = course.id;
      const courseName = course.name;

      const assignmentsRes = await fetch(
        `https://canvas.wisc.edu/api/v1/courses/${courseId}/assignments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const assignments = await assignmentsRes.json();
      if (!Array.isArray(assignments)) continue;

      for (const assignment of assignments) {
        if (!assignment?.id) continue;
        if (assignment?.due_at && new Date(assignment.due_at) > now) {
          if (removedIds.includes(String(assignment.id))) continue; // skip removed
          upcomingAssignments.push({
            course_id: courseId,
            course_name: courseName,
            assignment_id: assignment.id,        // include unique id
            assignment_name: assignment.name,
            due: assignment.due_at,
          });
        }
      }
    }

    console.log(`Fetched ${upcomingAssignments.length} upcoming assignments from Canvas`);
    res.json(upcomingAssignments);
  } catch (err) {
    console.error("Error in /api/canvas/assignments:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// AI match endpoint
// ----------------------------
app.post("/api/match-class", async (req, res) => {
  const { courseName, classOptions } = req.body;

  console.log("Matching Canvas course:", courseName);
  console.log("Available classes:", classOptions);

  if (!courseName || !Array.isArray(classOptions)) {
    return res.status(400).json({ error: "Missing courseName or classOptions" });
  }

  try {
    const prompt = `
      Canvas course name: "${courseName}"
      List of app classes: ${JSON.stringify(classOptions)}
      Pick the single class that best matches the course name.
      Respond with only the class name.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const bestMatch = response.choices[0].message.content.trim();
    console.log("AI best match result:", bestMatch);

    res.json({ bestMatch });
  } catch (err) {
    console.error("Error in AI class matching:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Remove assignment from backlog
// ----------------------------
app.post("/api/backlog/remove", async (req, res) => {
  try {
    const { assignment_id } = req.body;
    if (!assignment_id) return res.status(400).json({ error: "Missing assignment_id" });

    await addRemovedId(assignment_id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error in /api/backlog/remove:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Start server
// ----------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
