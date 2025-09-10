import { useState, useEffect } from "react";

// ----------------------------
// Helper: Ask AI which app class fits best
// ----------------------------
async function getBestMatchingClass(canvasCourseName, classes) {
  console.log("Requesting AI match for:", canvasCourseName);
  try {
    const response = await fetch("http://localhost:4000/api/match-class", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseName: canvasCourseName,
        classOptions: classes.map((c) => c.name),
      }),
    });

    const data = await response.json();
    console.log("AI returned best match:", data.bestMatch);
    return data.bestMatch || canvasCourseName; // fallback if AI fails
  } catch (err) {
    console.error("AI match error:", err);
    return canvasCourseName; // fallback to original
  }
}

export default function Backlog({ onClose, classes = [], addAssignment }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // Fetch assignments from Canvas API
  // ----------------------------
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/canvas/assignments");
      const data = await response.json();

      // Filter out removed backlog assignments (server handles this)
      const editableAssignments = await Promise.all(
        data.map(async (a) => {
          const dateOnly = a.due.split("T")[0];
          const bestMatch = await getBestMatchingClass(a.course_name, classes);

          return {
            ...a,
            assignment_id: String(a.assignment_id), // keep consistent with server
            editableCourse: bestMatch,
            editableName: a.assignment_name,
            editableDue: dateOnly,
          };
        })
      );

      setAssignments(editableAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // ----------------------------
  // Update field in assignment list
  // ----------------------------
  const handleChange = (index, field, value) => {
    setAssignments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // ----------------------------
  // Add assignment and remove from backlog
  // ----------------------------
  const handleAddAssignment = async (index) => {
    const item = assignments[index];
    const selectedClassName = item.editableCourse;

    const classIndex = classes.findIndex((cls) => cls.name === selectedClassName);
    if (classIndex === -1) {
      console.error("Class not found for assignment:", selectedClassName);
      return;
    }

    if (!addAssignment) {
      console.error("addAssignment function not provided!");
      return;
    }

    // Step 1: Add assignment to app
    addAssignment(classIndex, item.editableName, item.editableDue);

    // Step 2: Remove from backlog on server
    try {
      await fetch("http://localhost:4000/api/backlog/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment_id: item.assignment_id }),
      });
      console.log(`Removed ${item.editableName} from backlog`);
    } catch (err) {
      console.error("Failed to remove assignment from backlog:", err);
    }

    // Step 3: Update local backlog state
    setAssignments((prev) => prev.filter((_, i) => i !== index));
  };

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="backlog-modal show">
      <section className="backlog-buttons">
        <button onClick={onClose}>
          close
        </button>
        <button onClick={fetchAssignments} disabled={loading}>
          {loading ? "refreshing..." : "refresh"}
        </button>
      </section>
      <h2 className="backlog-h2">new assignments:</h2>

      {loading ? (
        <p>loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p>no upcoming assignments.</p>
      ) : (
        <section className="backlogged-assignments-container">
          {assignments.map((item, index) => (
            <li key={item.assignment_id} className="assignment-card">
              <label>
                <select
                  className="select-backlog-class"
                  value={item.editableCourse}
                  onChange={(e) => handleChange(index, "editableCourse", e.target.value)}
                >
                  {classes.map((cls) => (
                    <option key={cls.name} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <input
                  className="input-backlog-class"
                  type="text"
                  value={item.editableName}
                  onChange={(e) => handleChange(index, "editableName", e.target.value)}
                />
              </label>

              <label>
                <input
                  className="date-backlog-class"
                  type="date"
                  value={item.editableDue}
                  onChange={(e) => handleChange(index, "editableDue", e.target.value)}
                />
              </label>

              <button className="button-backlog-class" onClick={() => handleAddAssignment(index)}>
                +
              </button>
            </li>
          ))}
        </section>
      )}
    </div>
  );
}