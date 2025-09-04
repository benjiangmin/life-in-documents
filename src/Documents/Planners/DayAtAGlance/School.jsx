import React, { useState, useEffect } from "react";
import { supabase } from "../DayAtAGlance/supabaseClient.js"; 
import greenDot from "../../../../src/images/greenDot.png";
import redDot from "../../../../src/images/redDot.png";
import greyDot from "../../../../src/images/greyDot.png";
import yellowDot from "../../../../src/images/yellowDot.png";

export default function SchoolDisplay() {
  const [classes, setClasses] = useState([]);
  const [showClassPopup, setShowClassPopup] = useState(false);
  const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
  const [showEditAssignmentPopup, setShowEditAssignmentPopup] = useState(false);
  const [showEditClassPopup, setShowEditClassPopup] = useState(false);
  const [visibleClasses, setVisibleClasses] = useState([]);

  const [newClassName, setNewClassName] = useState("");
  const [newAssignmentText, setNewAssignmentText] = useState("");
  const [newAssignmentDue, setNewAssignmentDue] = useState("");

  const [currentClassIndex, setCurrentClassIndex] = useState(null);
  const [currentAssignmentIndex, setCurrentAssignmentIndex] = useState(null);

  const [editAssignmentText, setEditAssignmentText] = useState("");
  const [editAssignmentDue, setEditAssignmentDue] = useState("");
  const [editAssignmentColor, setEditAssignmentColor] = useState("grey");
  const [editClassName, setEditClassName] = useState("");

  const dotColors = { green: greenDot, red: redDot, grey: greyDot, yellow: yellowDot };

  // Fetch classes and assignments
  const fetchData = async () => {
    const { data: classesData, error: classErr } = await supabase.from("classes").select("*");
    if (classErr) return console.error("Error fetching classes:", classErr.message);

    const { data: assignmentsData, error: assignErr } = await supabase.from("assignments").select("*");
    if (assignErr) return console.error("Error fetching assignments:", assignErr.message);

    // Merge assignments into their classes
    const merged = classesData.map((c) => ({
      ...c,
      assignments: assignmentsData.filter((a) => a.class_id === c.id),
    }));

    setClasses(merged);
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
  setVisibleClasses(classes.map(() => false));

  classes.forEach((_, i) => {
      setTimeout(() => {
        setVisibleClasses((prev) => {
          const updated = [...prev];
          updated[i] = true;
          return updated;
        });
      }, i * 150); // stagger animation
    });
  }, [classes]);


  // Helper: format due date
  const formatDue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = dueDate.split("-").map(Number);
    const due = new Date(year, month - 1, day);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    const formattedDate = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (diffDays < 0) return { dueIn: "overdue", dueDate: formattedDate };
    if (diffDays === 0) return { dueIn: "due today", dueDate: formattedDate };
    return { dueIn: `due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`, dueDate: formattedDate };
  };

  // Add new class
  const addClass = async (name) => {
    if (!name.trim()) return;
    const { data, error } = await supabase.from("classes").insert([{ name }]).select().single();
    if (error) return console.error("Error adding class:", error.message);
    setClasses([...classes, { ...data, assignments: [] }]);
  };

  // Add new assignment
  const addAssignment = async (classIndex, text, due) => {
    if (!text.trim() || !due) return;
    const { dueIn, dueDate } = formatDue(due);
    const classId = classes[classIndex].id;

    const { data, error } = await supabase
      .from("assignments")
      .insert([{ class_id: classId, text, raw_due: due, due_date: dueDate, due_in: dueIn, color: "red" }])
      .select()
      .single();

    if (error) return console.error("Error adding assignment:", error.message);

    const updated = classes.map(c => ({ ...c, assignments: [...c.assignments] }));
    updated[classIndex].assignments.push(data);
    setClasses(updated);
  };

  // Edit assignment
  const saveEditedAssignment = async () => {
    if (!editAssignmentText.trim() || !editAssignmentDue) return;
    const { dueIn, dueDate } = formatDue(editAssignmentDue);
    const assignment = classes[currentClassIndex].assignments[currentAssignmentIndex];

    const { data, error } = await supabase
      .from("assignments")
      .update({ text: editAssignmentText, raw_due: editAssignmentDue, due_date: dueDate, due_in: dueIn, color: editAssignmentColor })
      .eq("id", assignment.id)
      .select()
      .single();

    if (error) return console.error("Error updating assignment:", error.message);

    const updated = classes.map(c => ({ ...c, assignments: [...c.assignments] }));
    updated[currentClassIndex].assignments[currentAssignmentIndex] = data;
    setClasses(updated);

    setShowEditAssignmentPopup(false);
    setEditAssignmentText("");
    setEditAssignmentDue("");
    setEditAssignmentColor("grey");
  };

  // Delete assignment
  const deleteAssignment = async () => {
    const assignment = classes[currentClassIndex].assignments[currentAssignmentIndex];
    const { error } = await supabase.from("assignments").delete().eq("id", assignment.id);
    if (error) return console.error("Error deleting assignment:", error.message);

    const updated = classes.map(c => ({ ...c, assignments: [...c.assignments] }));
    updated[currentClassIndex].assignments.splice(currentAssignmentIndex, 1);
    setClasses(updated);
    setShowEditAssignmentPopup(false);
  };

  // Save class edit
  const saveClassEdit = async () => {
    const classObj = classes[currentClassIndex];
    const { data, error } = await supabase.from("classes").update({ name: editClassName }).eq("id", classObj.id).select().single();
    if (error) return console.error("Error updating class:", error.message);

    const updated = classes.map(c => ({ ...c }));
    updated[currentClassIndex].name = data.name;
    setClasses(updated);
    setShowEditClassPopup(false);
  };

  // Delete class
  const deleteClass = async () => {
    const classObj = classes[currentClassIndex];
    const { error } = await supabase.from("classes").delete().eq("id", classObj.id);
    if (error) return console.error("Error deleting class:", error.message);

    const updated = classes.map(c => ({ ...c }));
    updated.splice(currentClassIndex, 1);
    setClasses(updated);
    setShowEditClassPopup(false);
  };

  return (
    <section className="school-display">
      <section className="school-header">
        <button onClick={() => setShowClassPopup(true)}>school</button>
      </section>

      <section className="classes">
        {classes.map((classItem, index) => (
          <section
            key={classItem.id}
            className={`class ${visibleClasses[index] ? "visible" : ""}`}
          >
            <h2
              className="edit-class"
              onClick={() => {
                setCurrentClassIndex(index);
                setEditClassName(classItem.name);
                setShowEditClassPopup(true);
              }}
            >
              {classItem.name}
            </h2>

            <section className="assignments-section">
              <section className="assignments">
                {[...classItem.assignments]
                  .sort((a, b) => new Date(a.raw_due) - new Date(b.raw_due))
                  .map((a, i) => (
                    <div
                      className={`assignment ${a.color === "green" ? "assignment-complete" : ""}`}
                      key={a.id}
                      onClick={() => {
                        setCurrentClassIndex(index);
                        setCurrentAssignmentIndex(i);
                        setEditAssignmentText(a.text);
                        setEditAssignmentDue(a.raw_due);
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
                        {a.due_in} • {a.due_date}
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


      {/* Popups (Class, Assignment, Edit) */}
      {showClassPopup && (
        <div className="popup-overlay-school">
          <div className="popup-school">
            <h3>add new class</h3>
            <input type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="e.g computer science" />
            <div className="popup-buttons-school-for-new-class">
              <button onClick={() => { addClass(newClassName); setNewClassName(""); setShowClassPopup(false); }}>add</button>
              <button onClick={() => setShowClassPopup(false)}>cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAssignmentPopup && (
        <div className="popup-overlay-school">
          <div className="popup-school">
            <h3>add new assignment</h3>
            <h4>assignment name</h4>
            <input type="text" value={newAssignmentText} onChange={(e) => setNewAssignmentText(e.target.value)} placeholder="e.g textbook chap 5 problems 5-9" />
            <h4>due date</h4>
            <input type="date" value={newAssignmentDue} onChange={(e) => setNewAssignmentDue(e.target.value)} />
            <div className="popup-buttons-school">
              <button onClick={() => { addAssignment(currentClassIndex, newAssignmentText, newAssignmentDue); setNewAssignmentText(""); setNewAssignmentDue(""); setShowAssignmentPopup(false); }}>add</button>
              <button onClick={() => setShowAssignmentPopup(false)}>cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditAssignmentPopup && (
        <div className="popup-overlay-school">
          <div className="popup-school">
            <h3>edit assignment</h3>
            <h4>assignment name</h4>
            <input type="text" value={editAssignmentText} onChange={(e) => setEditAssignmentText(e.target.value)} placeholder="assignment name" />
            <h4>due date</h4>
            <input type="date" value={editAssignmentDue} onChange={(e) => setEditAssignmentDue(e.target.value)} />
            <section className="popup-bottom-half">
              <section className="status-section">
                <h4>status</h4>
                <select value={editAssignmentColor} onChange={(e) => setEditAssignmentColor(e.target.value)} className="status-options">
                  <option value="grey">unimportant</option>
                  <option value="red">not started</option>
                  <option value="yellow">in progress</option>
                  <option value="green">complete</option>
                </select>
              </section>
              <div className="popup-buttons-school edit-current-assignment">
                <button onClick={saveEditedAssignment}>save</button>
                <button onClick={() => setShowEditAssignmentPopup(false)}>cancel</button>
                <button onClick={deleteAssignment}>delete</button>
              </div>
            </section>
          </div>
        </div>
      )}

      {showEditClassPopup && (
        <div className="popup-overlay-school">
          <div className="popup-school">
            <h3>edit class</h3>
            <input type="text" value={editClassName} onChange={(e) => setEditClassName(e.target.value)} placeholder="class name" />
            <div className="popup-buttons-school edit-current-class">
              <button onClick={saveClassEdit}>save</button>
              <button onClick={() => setShowEditClassPopup(false)}>cancel</button>
              <button onClick={deleteClass}>delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
