import React, { useState, useEffect } from "react";
import { supabase } from "../DayAtAGlance/supabaseClient.js";
import greenDot from "../../../../src/images/greenDot.png";
import yellowDot from "../../../../src/images/yellowDot.png";
import greyDot from "../../../../src/images/greyDot.png";
import redDot from "../../../../src/images/redDot.png";

export default function Other() {
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingStatus, setEditingStatus] = useState("not started");

  const statusOrder = ["not started", "in progress", "completed", "unimportant"];

  // ---------------- Load tasks ----------------
  useEffect(() => {
    const loadTasks = async () => {
      await cleanupOldCompleted();
      const { data, error } = await supabase.from("tasks").select("*").order("id", { ascending: true });
      if (error) console.error("Error fetching tasks:", error);
      else {
        const tasksWithShow = data.map(t => ({ ...t, show: false }));
        setTasks(tasksWithShow);

        // Fade-in effect
        setTimeout(() => {
          setTasks(prev => prev.map(t => ({ ...t, show: true })));
        }, 50);
      }
    };
    loadTasks();
  }, []);

  const cleanupOldCompleted = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("tasks").delete().lt("completed_at", today).not("completed_at", "is", null);
    if (error) console.error("Error cleaning up old tasks:", error);
  };

  // ---------------- Add task ----------------
  const addTask = async () => {
    if (!newTask.trim()) return;

    const { data, error } = await supabase.from("tasks").insert([{ text: newTask, status: "not started", completed_at: null }]).select().single();
    if (error) return console.error("Error adding task:", error);

    setTasks(prev => [...prev, { ...data, show: false }]);
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === data.id ? { ...t, show: true } : t));
    }, 50);

    setNewTask("");
    setShowPopup(false);
  };

  // ---------------- Edit task ----------------
  const openEdit = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
    setEditingStatus(tasks[index].status);
  };

  const saveEdit = async () => {
    const task = tasks[editingIndex];
    const completed_at = editingStatus === "completed" ? new Date().toISOString() : null;
    const { data, error } = await supabase.from("tasks").update({ text: editingText, status: editingStatus, completed_at }).eq("id", task.id).select().single();
    if (error) return console.error("Error updating task:", error);

    setTasks(prev => prev.map((t, i) => i === editingIndex ? { ...t, ...data, show: true } : t));
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText("");
    setEditingStatus("not started");
  };

  const deleteTask = async () => {
    const taskId = tasks[editingIndex].id;
    setEditingIndex(null);

    setTasks(prev => prev.map((t, i) => i === editingIndex ? { ...t, show: false, fadingOut: true } : t));
    setTimeout(async () => {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) console.error("Error deleting task:", error);
      else setTasks(prev => prev.filter(t => t.id !== taskId));
    }, 300);
  };

  // ---------------- Status dot ----------------
  const getDot = (status) => {
    switch (status) {
      case "completed": return greenDot;
      case "in progress": return yellowDot;
      case "unimportant": return greyDot;
      default: return redDot; // "not started"
    }
  };

  const cycleStatus = async (index) => {
    const currentStatus = tasks[index].status || "not started";
    const nextStatus = statusOrder[(statusOrder.indexOf(currentStatus) + 1) % statusOrder.length];

    // Update UI optimistically
    setTasks(prev => prev.map((t, i) => i === index ? { ...t, status: nextStatus } : t));

    const completed_at = nextStatus === "completed" ? new Date().toISOString() : null;
    const { error } = await supabase.from("tasks").update({ status: nextStatus, completed_at }).eq("id", tasks[index].id);
    if (error) console.error("Error updating task status:", error);
  };

  return (
    <section className="other-display">
      <h1>Other</h1>

      <section className="other-todo-container">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`task ${task.show ? "show" : "fading-in"} ${task.fadingOut ? "fade-out" : ""}`}
            onClick={() => openEdit(index)}
          >
            <img
              src={getDot(task.status)}
              alt="status"
              className="assignment-dot"
              onClick={(e) => {
                e.stopPropagation();
                cycleStatus(index);
              }}
            />
            <span className={task.status === "completed" ? "task-completed" : ""}>
              {task.text}
            </span>
          </div>
        ))}
      </section>

      <button className="add-task-button" onClick={() => setShowPopup(true)}>Add Task</button>

      {/* Add Task Popup */}
      {showPopup && (
        <div className="popup-overlay other-task">
          <div className="other-task-popup">
            <h2>Add Task</h2>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="e.g. do the dishes"
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button onClick={addTask}>Add</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Task Popup */}
      {editingIndex !== null && (
        <div className="popup-overlay other-task">
          <div className="other-task-popup">
            <h2>Edit Task</h2>
            <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
            <select value={editingStatus} onChange={(e) => setEditingStatus(e.target.value)}>
              <option value="unimportant">Unimportant</option>
              <option value="not started">Not Started</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button onClick={saveEdit}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
            <button onClick={deleteTask}>Delete</button>
          </div>
        </div>
      )}
    </section>
  );
}
