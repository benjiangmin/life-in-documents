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

      // Map assignments with AI-matched classes
      const editableAssignments = await Promise.all(
        data.map(async (a) => {
          // Convert Canvas UTC date to local YYYY-MM-DD
          let dateOnly = "";
          if (a.due) {
            const dueDate = new Date(a.due);
            const year = dueDate.getFullYear();
            const month = String(dueDate.getMonth() + 1).padStart(2, "0");
            const day = String(dueDate.getDate()).padStart(2, "0");
            dateOnly = `${year}-${month}-${day}`;
          }

          const bestMatch = await getBestMatchingClass(a.course_name, classes);

          return {
            ...a,
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
  // Add assignment using dropdown as definitive source
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

    // Step 1: Add assignment to your app
    addAssignment(classIndex, item.editableName, item.editableDue);

    // Step 2: Tell the server this assignment is removed
    try {
      await fetch("http://localhost:4000/api/backlog/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment_id: item.assignment_id }),
      });
      console.log(`Removed ${item.assignment_name} from backlog`);
    } catch (err) {
      console.error("Failed to remove assignment from backlog:", err);
    }

    // Step 3: Remove from local UI immediately
    setAssignments((prev) => prev.filter((_, i) => i !== index));
  };


  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="backlog-modal show">
      <button className="close-button" onClick={onClose}>
        Close
      </button>
      <h2>Backlog</h2>

      <button onClick={fetchAssignments} disabled={loading}>
        {loading ? "Refreshing..." : "Refresh Assignments"}
      </button>

      {loading ? (
        <p>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p>No upcoming assignments.</p>
      ) : (
        <ul>
          {assignments.map((item, index) => (
            <li key={index} className="assignment-card">
              <label>
                <select
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
                  type="text"
                  value={item.editableName}
                  onChange={(e) => handleChange(index, "editableName", e.target.value)}
                />
              </label>

              <label>
                <input
                  type="date"
                  value={item.editableDue}
                  onChange={(e) => handleChange(index, "editableDue", e.target.value)}
                />
              </label>

              <button className="add-assignment-button" onClick={() => handleAddAssignment(index)}>
                +
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
