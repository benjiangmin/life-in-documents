import React, { useState } from "react";
import greenDot from "../../../../src/images/greenDot.png";
import redDot from "../../../../src/images/redDot.png";
import greyDot from "../../../../src/images/greyDot.png";
import yellowDot from "../../../../src/images/yellowDot.png";

export default function SchoolDisplay() {
  const [classes, setClasses] = useState([]);
  const [showClassPopup, setShowClassPopup] = useState(false);
  const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
  const [showEditAssignmentPopup, setShowEditAssignmentPopup] = useState(false);

  const [newClassName, setNewClassName] = useState("");
  const [newAssignmentText, setNewAssignmentText] = useState("");
  const [newAssignmentDue, setNewAssignmentDue] = useState("");

  const [currentClassIndex, setCurrentClassIndex] = useState(null);
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState(null);

  // Edit state
  const [editAssignmentText, setEditAssignmentText] = useState("");
  const [editAssignmentDue, setEditAssignmentDue] = useState("");
  const [editAssignmentColor, setEditAssignmentColor] = useState("grey");

  const dotColors = { green: greenDot, red: redDot, grey: greyDot, yellow: yellowDot};

  // Add new class
  const addClass = (name) => {
    if (!name.trim()) return;
    setClasses([...classes, { name, assignments: [] }]);
  };

  // Helper to format due date
  const formatDue = (dueDate) => {
    const today = new Date();
    const [year, month, day] = dueDate.split("-").map(Number);
    const due = new Date(year, month - 1, day); // local midnight
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
      dueDate,   // pretty version
      rawDue: due, // exact yyyy-mm-dd for editing
      color: "red",
    });
    setClasses(updatedClasses);
  };

  // Edit assignment
  const saveEditedAssignment = () => {
    if (!editAssignmentText.trim() || !editAssignmentDue) return;

    const { dueIn, dueDate } = formatDue(editAssignmentDue);
    const updatedClasses = [...classes];
    updatedClasses[currentClassIndex].assignments[currentAssignmentIndex] = {
      ...updatedClasses[currentClassIndex].assignments[currentAssignmentIndex],
      text: editAssignmentText,
      dueIn,
      dueDate,
      rawDue: editAssignmentDue, // keep raw date
      color: editAssignmentColor,
    };
    setClasses(updatedClasses);

    // reset
    setShowEditAssignmentPopup(false);
    setEditAssignmentText("");
    setEditAssignmentDue("");
    setEditAssignmentColor("grey");
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
                    onClick={() => {
                      setCurrentClassIndex(index);
                      setCurrentAssignmentIndex(i);
                      setEditAssignmentText(a.text);
                      setEditAssignmentDue(a.rawDue); // use stored raw date
                      setEditAssignmentColor(a.color || "grey");
                      setShowEditAssignmentPopup(true);
                    }}
                  >
                    <div className="assignment-left">
                      <img
                        src={dotColors[a.color || "grey"]}
                        alt="status"
                        className="assignment-dot"
                      />
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
            <h4>assignment name</h4>
            <input
              type="text"
              value={newAssignmentText}
              onChange={(e) => setNewAssignmentText(e.target.value)}
              placeholder="e.g textbook chap 5 problems 5-9"
            />
            <h4>due date</h4>
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

      {/* Edit Assignment popup */}
      {showEditAssignmentPopup && (
        <div className="popup-overlay-school">
          <div className="popup-school">
            <h3>edit assignment</h3>
            <h4>assignment name</h4>
            <input
              type="text"
              value={editAssignmentText}
              onChange={(e) => setEditAssignmentText(e.target.value)}
              placeholder="assignment name"
            />
            <h4>due date</h4>
            <input
              type="date"
              value={editAssignmentDue}
              onChange={(e) => setEditAssignmentDue(e.target.value)}
            />
            <section className="popup-bottom-half">
              <section className="status-section">
                <h4>status</h4>
                <select
                  value={editAssignmentColor}
                  onChange={(e) => setEditAssignmentColor(e.target.value)}
                  className="status-options"
                >
                  <option value="grey">unimportant</option>
                  <option value="red">not started</option>
                  <option value="yellow">in progress</option>
                  <option value="green">complete</option>
                </select>
              </section>
              <div className="popup-buttons-school">
                <button onClick={saveEditedAssignment}>save</button>
                <button onClick={() => setShowEditAssignmentPopup(false)}>
                  cancel
                </button>
              </div>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}
