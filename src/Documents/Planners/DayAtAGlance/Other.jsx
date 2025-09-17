import React, { useState, useEffect } from "react";
import { supabase } from "../DayAtAGlance/supabaseClient.js";
import greenDot from "../../../../src/images/greenDot.png";
import redDot from "../../../../src/images/redDot.png";
import greyDot from "../../../../src/images/greyDot.png";
import yellowDot from "../../../../src/images/yellowDot.png";

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

        setTimeout(() => {
          setTasks(prev => prev.map(t => ({ ...t, show: true })));
        }, 50);
      }
    };
    loadTasks();
  }, []);

  const cleanupOldCompleted = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase
      .from("tasks")
      .delete()
      .lt("completed_at", today)
      .not("completed_at", "is", null);
    if (error) console.error("Error cleaning up old completed tasks:", error);
  };

  // ---------------- Add task ----------------
  const addTask = async () => {
    if (!newTask.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ text: newTask, status: "not started", completed_at: null }])
      .select()
      .single();
    if (error) return console.error("Error adding task:", error);

    setTasks(prev => [...prev, { ...data, show: false }]);
    setTimeout(() => {
      setTasks(prev => prev.map(t => (t.id === data.id ? { ...t, show: true } : t)));
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
    const { data, error } = await supabase
      .from("tasks")
      .update({ text: editingText, status: editingStatus, completed_at })
      .eq("id", task.id)
      .select()
      .single();
    if (error) return console.error("Error updating task:", error);

    setTasks(prev => prev.map((t, i) => (i === editingIndex ? { ...t, ...data, show: true } : t)));
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText("");
    setEditingStatus("not started");
  };

  const deleteFromEdit = async () => {
    const taskId = tasks[editingIndex].id;
    setEditingIndex(null);

    setTasks(prev => prev.map((t, i) => (i === editingIndex ? { ...t, show: false, fadingOut: true } : t)));

    setTimeout(async () => {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) console.error("Error deleting task:", error);
      else setTasks(prev => prev.filter(t => t.id !== taskId));
    }, 300);
  };

  // ---------------- Status dot ----------------
  const getDot = (status) => {
    switch (status) {
      case "completed":
        return greenDot;
      case "in progress":
        return yellowDot;
      case "unimportant":
        return greyDot;
      default:
        return redDot; // not started
    }
  };

  const cycleStatus = async (index) => {
    const currentStatus = tasks[index].status || "not started";
    const nextStatus = statusOrder[(statusOrder.indexOf(currentStatus) + 1) % statusOrder.length];

    // Optimistic UI update
    setTasks(prev => prev.map((t, i) => (i === index ? { ...t, status: nextStatus } : t)));

    const completed_at = nextStatus === "completed" ? new Date().toISOString() : null;
    const { error } = await supabase.from("tasks").update({ status: nextStatus, completed_at }).eq("id", tasks[index].id);
    if (error) console.error("Error updating task status:", error);
  };

  return (
    <section className="other-display">
      <h1>other</h1>

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
            <span className={task.status === "completed" ? "task-completed" : ""}>{task.text}</span>
          </div>
        ))}
      </section>

      <button className="add-task-button" onClick={() => setShowPopup(true)}>
        add task
      </button>

      {/* Add Task Popup */}
      {showPopup && (
        <div className="popup-overlay other-task">
          <div className="other-task-idk-what-to-name-this">
            <section className="top-row-for-editing-class for-assignment um ah">
              <h2>add task</h2>
              <button onClick={addTask}>add</button>
              <button onClick={() => setShowPopup(false)}>cancel</button>
            </section>

            <input
              className="add-task-text"
              type="text"
              placeholder="e.g do the dishes"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTask();
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Task Popup */}
      {editingIndex !== null && (
        <div className="popup-overlay other-task">
          <div className="other-task-idk-what-to-name-this">
            <section className="top-row-for-editing-class for-assignment um">
              <h2>edit task</h2>
              <button onClick={saveEdit}>save</button>
              <button onClick={cancelEdit}>cancel</button>
              <button onClick={deleteFromEdit}>delete</button>
            </section>

            <section className="rows">
              <section className="edit-task-name-row">
                <h2>task name</h2>
                <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
              </section>

              <section className="edit-task-status-row">
                <h4>status</h4>
                <select value={editingStatus} onChange={(e) => setEditingStatus(e.target.value)}>
                  <option value="unimportant">unimportant</option>
                  <option value="not started">not started</option>
                  <option value="in progress">in progress</option>
                  <option value="completed">completed</option>
                </select>
              </section>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}
