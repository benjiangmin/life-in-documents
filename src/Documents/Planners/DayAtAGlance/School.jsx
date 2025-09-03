import React, { useState } from "react";

export default function SchoolDisplay() {
  const [classes, setClasses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); // "class" or "assignment"
  const [newClassName, setNewClassName] = useState("");
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [newAssignmentDue, setNewAssignmentDue] = useState("");
  const [currentClassIndex, setCurrentClassIndex] = useState(null);

  const addClass = (name) => {
    if (!name.trim()) return;
    setClasses([...classes, { name, assignments: [] }]);
  };

  const addAssignment = (classIndex, text, due) => {
    if (!text.trim() || !due.trim()) return;
    const updatedClasses = [...classes];
    updatedClasses[classIndex].assignments.push({ text, due });
    setClasses(updatedClasses);
  };

  return (
    <section className="school-display">
      <section className="school-header">
        <button
          onClick={() => {
            setPopupType("class");
            setShowPopup(true);
          }}
        >
          school
        </button>
      </section>

      <section className="classes">
        {classes.map((classItem, index) => (
          <section key={index} className="class">
            <h2>{classItem.name}</h2>
            <section className="assignments-section">
              <section className="assignments">
                {classItem.assignments.map((a, i) => (
                  <div className="assignment" key={i}>
                    <p>{a.text}</p>
                    <p>due on {a.due}</p>
                  </div>
                ))}
              </section>
            </section>

            <button
              className="add-assignment-button"
              onClick={() => {
                setPopupType("assignment");
                setCurrentClassIndex(index);
                setShowPopup(true);
              }}
            >
              add assignment
            </button>
          </section>
        ))}
      </section>

      {showPopup && (
        <div className="popup-overlay-school">
          <div className="popup-school">
            {popupType === "class" && (
              <>
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
                      setShowPopup(false);
                    }}
                  >
                    add
                  </button>
                  <button onClick={() => setShowPopup(false)}>cancel</button>
                </div>
              </>
            )}

            {popupType === "assignment" && (
              <>
                <h3>add new assignment</h3>
                <input
                  type="text"
                  value={newAssignmentName}
                  onChange={(e) => setNewAssignmentName(e.target.value)}
                  placeholder="assignment name"
                />
                <input
                  type="text"
                  value={newAssignmentDue}
                  onChange={(e) => setNewAssignmentDue(e.target.value)}
                  placeholder="due date"
                />
                <div className="popup-buttons-school">
                  <button
                    onClick={() => {
                      addAssignment(
                        currentClassIndex,
                        newAssignmentName,
                        newAssignmentDue
                      );
                      setNewAssignmentName("");
                      setNewAssignmentDue("");
                      setShowPopup(false);
                    }}
                  >
                    add
                  </button>
                  <button onClick={() => setShowPopup(false)}>cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
