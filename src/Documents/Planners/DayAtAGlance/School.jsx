import React, { useState } from "react";
import greenDot from "../../../../src/images/greenDot.png"
import redDot from "../../../../src/images/redDot.png"
import greyDot from "../../../../src/images/greyDot.png"

export default function SchoolDisplay() {
  const [classes, setClasses] = useState([]);
  const [showClassPopup, setShowClassPopup] = useState(false);
  const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newAssignmentText, setNewAssignmentText] = useState("");
  const [newAssignmentDue, setNewAssignmentDue] = useState("");
  const [currentClassIndex, setCurrentClassIndex] = useState(null);

  // Add new class
  const addClass = (name) => {
    if (!name.trim()) return;
    setClasses([...classes, { name, assignments: [] }]);
  };

  // Helper to format due date
  const formatDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const options = { month: "short", day: "numeric" };
    const formattedDate = due.toLocaleDateString("en-US", options);

    return {
      dueIn: `due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
      dueDate: formattedDate,
    };
  };

  // Add new assignment
  const addAssignment = (classIndex, text, due) => {
    if (!text.trim() || !due) return;

    const { dueIn, dueDate } = formatDue(due);

    const updatedClasses = [...classes];
    updatedClasses[classIndex].assignments.push({
      text,
      dueIn,
      dueDate,
    });
    setClasses(updatedClasses);
  };

  return (
    <section className="school-display">
      <section className="school-header">
        <button onClick={() => setShowClassPopup(true)}>add class</button>
      </section>

      <section className="classes">
        {classes.map((classItem, index) => (
          <section key={index} className="class">
            <h2>{classItem.name}</h2>
            <section className="assignments-section">
              <section className="assignments">
                {classItem.assignments.map((a, i) => (
                  <div
                    className="assignment"
                    key={i}
                    onClick={() => console.log("Clicked assignment:", a.text)}
                  >
                    <div className="assignment-left">
                      <img src={greyDot} alt="status" className="assignment-dot" />
                      <span className="assignment-text">{a.text}</span>
                    </div>
                    <span className="assignment-due-right">
                      {a.dueIn} • {a.dueDate}
                    </span>
                  </div>
                ))}
              </section>
            </section>

            <button
              className="add-assignment-button"
              onClick={() => {
                setCurrentClassIndex(index);
                setShowAssignmentPopup(true);
              }}
            >
              add assignment
            </button>
          </section>
        ))}
      </section>

      {/* Class popup */}
      {showClassPopup && (
        <div className="popup-overlay-school">
          <div className="popup-school">
            <h3>add new class</h3>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="e.g computer science"
            />
            <div className="popup-buttons-school">
              <button
                onClick={() => {
                  addClass(newClassName);
                  setNewClassName("");
                  setShowClassPopup(false);
                }}
              >
                add
              </button>
              <button onClick={() => setShowClassPopup(false)}>cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment popup */}
      {showAssignmentPopup && (
        <div className="popup-overlay-school">
          <div className="popup-school">
            <h3>add new assignment</h3>
            <input
              type="text"
              value={newAssignmentText}
              onChange={(e) => setNewAssignmentText(e.target.value)}
              placeholder="assignment name"
            />
            <input
              type="date"
              value={newAssignmentDue}
              onChange={(e) => setNewAssignmentDue(e.target.value)}
            />
            <div className="popup-buttons-school">
              <button
                onClick={() => {
                  addAssignment(
                    currentClassIndex,
                    newAssignmentText,
                    newAssignmentDue
                  );
                  setNewAssignmentText("");
                  setNewAssignmentDue("");
                  setShowAssignmentPopup(false);
                }}
              >
                add
              </button>
              <button onClick={() => setShowAssignmentPopup(false)}>
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
