import React, { useState, useEffect } from "react";
import { supabase } from "../DayAtAGlance/supabaseClient.js";
import greenDot from "../../../../src/images/greenDot.png";
import redDot from "../../../../src/images/redDot.png";
import greyDot from "../../../../src/images/greyDot.png";
import yellowDot from "../../../../src/images/yellowDot.png";

export default function School({ classes, setClasses, addAssignment }) {
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [showClassPopup, setShowClassPopup] = useState(false);
  const [showAssignmentPopup, setShowAssignmentPopup] = useState(false);
  const [showEditClassPopup, setShowEditClassPopup] = useState(false);
  const [showEditAssignmentPopup, setShowEditAssignmentPopup] = useState(false);

  const [newClassName, setNewClassName] = useState("");
  const [newAssignmentText, setNewAssignmentText] = useState("");
  const [newAssignmentDue, setNewAssignmentDue] = useState("");

  const [currentClassIndex, setCurrentClassIndex] = useState(null);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null);

  const [editClassName, setEditClassName] = useState("");
  const [editAssignmentText, setEditAssignmentText] = useState("");
  const [editAssignmentDue, setEditAssignmentDue] = useState("");
  const [editAssignmentColor, setEditAssignmentColor] = useState("grey");

  const dotColors = { green: greenDot, red: redDot, grey: greyDot, yellow: yellowDot };
  const statusOrder = ["red", "yellow", "green", "grey"];

  // -------------------------
  // Utility: Format due dates
  // -------------------------
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

  // -------------------------
  // Fetch classes + assignments
  // -------------------------
  const fetchData = async () => {
    try {
      const { data: classesData, error: classErr } = await supabase.from("classes").select("*");
      if (classErr) throw classErr;

      const { data: assignmentsData, error: assignErr } = await supabase.from("assignments").select("*");
      if (assignErr) throw assignErr;

      let merged = classesData.map((c) => ({
        ...c,
        assignments: assignmentsData
          .filter((a) => a.class_id === c.id)
          .map((a) => ({ ...a, show: false, fadingOut: false }))
      }));

      // Compute due info dynamically
      merged = merged.map((cls) => ({
        ...cls,
        assignments: cls.assignments.map((a) => {
          const { dueIn, dueDate } = formatDue(a.raw_due);
          return { ...a, due_in: dueIn, due_date: dueDate };
        })
      }));

      // Delete overdue completed assignments
      for (let i = 0; i < merged.length; i++) {
        const cls = merged[i];
        const toDelete = cls.assignments.filter((a) => a.color === "green" && a.due_in === "overdue");
        for (let a of toDelete) {
          const { error } = await supabase.from("assignments").delete().eq("id", a.id);
          if (error) console.error("Error deleting overdue completed assignment:", error.message);
        }
        merged[i].assignments = cls.assignments.filter((a) => !(a.color === "green" && a.due_in === "overdue"));
      }

      setClasses(merged);

      // Staggered fade-in
      setVisibleClasses(merged.map(() => false));
      merged.forEach((_, i) => {
        setTimeout(() => {
          setVisibleClasses((prev) => {
            const updated = [...prev];
            updated[i] = true;
            return updated;
          });
        }, 600 + i * 150);
      });

      // Fade-in assignments
      merged.forEach((cls, clsIdx) => {
        cls.assignments.forEach((a, aIdx) => {
          setTimeout(() => {
            setClasses((prev) => {
              const updated = [...prev];
              updated[clsIdx].assignments[aIdx].show = true;
              return updated;
            });
          }, 650 + aIdx * 50);
        });
      });

    } catch (err) {
      console.error("Error fetching school data:", err.message);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // -------------------------
  // Class Operations
  // -------------------------
  const addClass = async (name) => {
    if (!name.trim()) return;
    const { data, error } = await supabase.from("classes").insert([{ name }]).select().single();
    if (error) return console.error("Error adding class:", error.message);

    setClasses((prev) => [...prev, { ...data, assignments: [] }]);
    setVisibleClasses((prev) => [...prev, true]);
  };

  const saveClassEdit = async () => {
    const cls = classes[currentClassIndex];
    const { data, error } = await supabase.from("classes").update({ name: editClassName }).eq("id", cls.id).select().single();
    if (error) return console.error("Error updating class:", error.message);

    setClasses((prev) => {
      const updated = [...prev];
      updated[currentClassIndex].name = data.name;
      return updated;
    });

    setShowEditClassPopup(false);
  };

  const deleteClass = async () => {
    const cls = classes[currentClassIndex];
    const { error } = await supabase.from("classes").delete().eq("id", cls.id);
    if (error) return console.error("Error deleting class:", error.message);

    setClasses((prev) => prev.filter((_, i) => i !== currentClassIndex));
    setShowEditClassPopup(false);
  };

  // -------------------------
  // Assignment Operations
  // -------------------------
  const saveEditedAssignment = async () => {
    if (!editAssignmentText.trim() || !editAssignmentDue) return;
    const assignment = classes[currentClassIndex].assignments.find((a) => a.id === currentAssignmentId);
    if (!assignment) return;

    const { dueIn, dueDate } = formatDue(editAssignmentDue);
    const { data, error } = await supabase
      .from("assignments")
      .update({ text: editAssignmentText, raw_due: editAssignmentDue, due_in: dueIn, due_date: dueDate, color: editAssignmentColor })
      .eq("id", assignment.id)
      .select()
      .single();
    if (error) return console.error("Error updating assignment:", error.message);

    setClasses((prev) => {
      const updated = [...prev];
      const idx = updated[currentClassIndex].assignments.findIndex((a) => a.id === assignment.id);
      updated[currentClassIndex].assignments[idx] = { ...data, show: true, fadingOut: false };
      return updated;
    });

    setShowEditAssignmentPopup(false);
    setEditAssignmentText("");
    setEditAssignmentDue("");
    setEditAssignmentColor("grey");
    setCurrentAssignmentId(null);
  };

  const deleteAssignment = async () => {
    const assignment = classes[currentClassIndex].assignments.find((a) => a.id === currentAssignmentId);
    if (!assignment) return;

    setClasses((prev) => {
      const updated = [...prev];
      updated[currentClassIndex].assignments = updated[currentClassIndex].assignments.map((a) =>
        a.id === currentAssignmentId ? { ...a, fadingOut: true, show: false } : a
      );
      return updated;
    });

    setTimeout(async () => {
      const { error } = await supabase.from("assignments").delete().eq("id", assignment.id);
      if (error) console.error("Error deleting assignment:", error.message);

      setClasses((prev) => {
        const updated = [...prev];
        updated[currentClassIndex].assignments = updated[currentClassIndex].assignments.filter((a) => a.id !== currentAssignmentId);
        return updated;
      });
    }, 300);

    setShowEditAssignmentPopup(false);
    setCurrentAssignmentId(null);
  };

  const changeStatus = async (classIdx, assignmentId) => {
    const assignment = classes[classIdx].assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const currentColor = assignment.color || "grey";
    const nextColor = statusOrder[(statusOrder.indexOf(currentColor) + 1) % statusOrder.length];

    // Optimistically update UI first
    setClasses((prev) => {
      const updated = [...prev];
      const assignmentIdx = updated[classIdx].assignments.findIndex(a => a.id === assignmentId);
      if (assignmentIdx !== -1) {
        updated[classIdx].assignments[assignmentIdx].color = nextColor;
      }
      return updated;
    });

    // Update Supabase
    const { error } = await supabase
      .from("assignments")
      .update({ color: nextColor })
      .eq("id", assignmentId);

    if (error) {
      console.error("Error updating assignment status:", error.message);
      // Optional: revert UI if the update fails
      setClasses((prev) => {
        const updated = [...prev];
        const assignmentIdx = updated[classIdx].assignments.findIndex(a => a.id === assignmentId);
        if (assignmentIdx !== -1) {
          updated[classIdx].assignments[assignmentIdx].color = currentColor;
        }
        return updated;
      });
    }
  };



  // -------------------------
  // Render
  // -------------------------
  return (
    <section className="school-display">
      {/* Header */}
      <section className="school-header">
        <button onClick={() => setShowClassPopup(true)}>school</button>
      </section>

      {/* Classes */}
      <section className="classes">
        {classes.map((cls, index) => (
          <section key={cls.id} className={`class ${visibleClasses[index] ? "visible" : ""}`}>
            <h2 className="edit-class" onClick={() => { setCurrentClassIndex(index); setEditClassName(cls.name); setShowEditClassPopup(true); }}>
              {cls.name}
            </h2>

            <section className="assignments-section">
              <section className="assignments">
                {cls.assignments
                  .sort((a, b) => new Date(a.raw_due) - new Date(b.raw_due))
                  .map((a) => (
                    <div
                      key={a.id}
                      className={`assignment ${a.color === "green" ? "assignment-complete" : ""} ${a.show ? "show" : ""} ${a.fadingOut ? "fade-out" : ""}`}
                      onClick={() => {
                        setCurrentClassIndex(index);
                        setCurrentAssignmentId(a.id);
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
                          onClick={(e) => {
                            e.stopPropagation(); // prevent opening edit popup
                            changeStatus(index, a.id);
                          }}
                        />
                        <span className="assignment-text">{a.text}</span>
                      </div>
                      <span className="assignment-due-right">{a.due_in} • {a.due_date}</span>
                    </div>
                  ))}
              </section>
            </section>

            <button className="add-assignment-button" onClick={() => { setCurrentClassIndex(index); setShowAssignmentPopup(true); }}>
              add assignment
            </button>
          </section>
        ))}
      </section>

      {/* ---------------- Popups ---------------- */}

      {/* New Class */}
      {showClassPopup && (
        <div className="popup-overlay-school">
          <div className="popup-school">
            <section className="top-row-for-new-class">
              <h3 className="add-new-class-text">add new class</h3>
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
            </section>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="e.g computer science"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addClass(newClassName);
                  setNewClassName("");
                  setShowClassPopup(false);
                }
              }}
            />
          </div>
        </div>
      )}


      {/* New Assignment */}
      {showAssignmentPopup && (
        <div className="popup-overlay-school">
          <div className="add-assignment-popup">
            <section className="top-row-for-editing-class for-assignment uh">
              <h3>add new assignment</h3>
              <button
                onClick={() => {
                  addAssignment(currentClassIndex, newAssignmentText, newAssignmentDue);
                  setNewAssignmentText("");
                  setNewAssignmentDue("");
                  setShowAssignmentPopup(false);
                }}
              >
                add
              </button>
              <button onClick={() => setShowAssignmentPopup(false)}>cancel</button>
            </section>

            <section className="new-assignment-container">
              <section className="new-assignment-details-block">
                <h4>assignment name</h4>
                <input
                  type="text"
                  value={newAssignmentText}
                  onChange={(e) => setNewAssignmentText(e.target.value)}
                  placeholder="e.g textbook chap 5 problems 5-9"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAssignment(currentClassIndex, newAssignmentText, newAssignmentDue);
                      setNewAssignmentText("");
                      setNewAssignmentDue("");
                      setShowAssignmentPopup(false);
                    }
                  }}
                />
              </section>

              <section className="new-assignment-details-block">
                <h4>due date</h4>
                <input
                  type="date"
                  value={newAssignmentDue}
                  onChange={(e) => setNewAssignmentDue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAssignment(currentClassIndex, newAssignmentText, newAssignmentDue);
                      setNewAssignmentText("");
                      setNewAssignmentDue("");
                      setShowAssignmentPopup(false);
                    }
                  }}
                />
              </section>
            </section>
          </div>
        </div>
      )}


      {/* Edit Assignment */}
      {showEditAssignmentPopup && (
        <div className="popup-overlay-school">
          <div className="edit-assignment-popup">
            <section className="top-row-for-editing-class for-assignment">
              <h3>edit assignment</h3>
              <button onClick={saveEditedAssignment}>save</button>
              <button onClick={() => setShowEditAssignmentPopup(false)}>cancel</button>
              <button onClick={deleteAssignment}>delete</button>
            </section>
            <section className="rows">
              <section className="edit-assignments-row">
                <h4>assignment name:</h4>
                <input type="text" value={editAssignmentText} onChange={(e) => setEditAssignmentText(e.target.value)} placeholder="assignment name" />
              </section>
              
              <section className="edit-assignments-row">
                <h4>due date:</h4>
                <input className="edit-due-date" type="date" value={editAssignmentDue} onChange={(e) => setEditAssignmentDue(e.target.value)} />
              </section>
              
              <section className="edit-assignments-row">
                <h4>status:</h4>
                <select value={editAssignmentColor} onChange={(e) => setEditAssignmentColor(e.target.value)} className="status-options">
                  <option value="grey">unimportant</option>
                  <option value="red">not started</option>
                  <option value="yellow">in progress</option>
                  <option value="green">complete</option>
                </select>
              </section>
            </section>
          </div>
        </div>
      )}
    {/* Edit Class */}
    {showEditClassPopup && (
      <div className="popup-overlay-school">
        <section className="edit-class-popup">
          <div className="top-row-for-editing-class">
            <h3>edit class</h3>
            <div className="buttons-for-editing-class">
              <button onClick={saveClassEdit}>save</button>
              <button onClick={() => setShowEditClassPopup(false)}>cancel</button>
              <button onClick={deleteClass}>delete</button>
            </div>
          </div>
          <input
            type="text"
            value={editClassName}
            onChange={(e) => setEditClassName(e.target.value)}
            placeholder="class name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                saveClassEdit();
              }
            }}
          />
        </section>
      </div>
    )}

    </section>
  );
}

