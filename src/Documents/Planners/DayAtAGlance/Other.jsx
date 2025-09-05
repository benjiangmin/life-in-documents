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

  useEffect(() => {
    const loadTasks = async () => {
      await cleanupOldCompleted();

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) console.error("Error fetching tasks:", error);
      else {
        // initialize hidden for fade-in
        const tasksWithFade = data.map((t) => ({ ...t, show: false, fadingOut: false }));
        setTasks(tasksWithFade);

        // trigger fade-in
        setTimeout(() => {
          setTasks((prev) => prev.map((t) => ({ ...t, show: true })));
        }, 50);
      }
    };
    loadTasks();
  }, []);

  const cleanupOldCompleted = async () => {
    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-09-05"

    const { error } = await supabase
      .from("tasks")
      .delete()
      .lt("created_at", today)
      .eq("status", "completed");

    if (error) console.error("Error cleaning up old completed tasks:", error);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ text: newTask, status: "not started" }])
      .select()
      .single();

    if (error) console.error("Error adding task:", error);
    else {
      // add hidden initially
      setTasks((prev) => [...prev, { ...data, show: false, fadingOut: false }]);

      // fade-in
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((t) => (t.id === data.id ? { ...t, show: true } : t))
        );
      }, 50);
    }

    setNewTask("");
    setShowPopup(false);
  };

  const openEdit = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
    setEditingStatus(tasks[index].status);
  };

  const saveEdit = async () => {
    if (editingIndex === null) return;

    const { data, error } = await supabase
      .from("tasks")
      .update({ text: editingText, status: editingStatus })
      .eq("id", tasks[editingIndex].id)
      .select()
      .single();

    if (error) console.error("Error updating task:", error);
    else {
      // preserve show/fade flags
      setTasks((prev) =>
        prev.map((t, i) =>
          i === editingIndex ? { ...data, show: true, fadingOut: false } : t
        )
      );
    }

    setEditingIndex(null);
    setEditingText("");
    setEditingStatus("not started");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText("");
    setEditingStatus("not started");
  };

  const deleteFromEdit = async () => {
    if (editingIndex === null) return;

    const taskId = tasks[editingIndex].id;

    // trigger fade-out
    setTasks((prev) =>
      prev.map((t, i) =>
        i === editingIndex ? { ...t, show: false, fadingOut: true } : t
      )
    );

    // remove after fade
    setTimeout(async () => {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) console.error("Error deleting task:", error);
      else setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }, 300);

    setEditingIndex(null);
    setEditingText("");
    setEditingStatus("not started");
  };

  const getDot = (status) => {
    switch (status) {
      case "completed": return greenDot;
      case "in progress": return yellowDot;
      case "unimportant": return greyDot;
      default: return redDot;
    }
  };

  return (
    <section className="other-display">
      <h1>other</h1>

      <section className="other-todo-container">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`task ${task.show ? "show" : ""} ${task.fadingOut ? "fade-out" : ""}`}
            onClick={() => openEdit(index)}
          >
            <img src={getDot(task.status)} alt="status" className="assignment-dot" />
            <span className={task.status === "completed" ? "task-completed" : ""}>
              {task.text}
            </span>
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
            <h2>add task</h2>
            <input
              type="text"
              placeholder="e.g do the dishes"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="add-task-buttons">
              <button onClick={addTask}>add</button>
              <button onClick={() => setShowPopup(false)}>cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Popup */}
      {editingIndex !== null && (
        <div className="popup-overlay other-task">
          <div className="other-task-idk-what-to-name-this">
            <h2>edit task</h2>
            <input
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
            />
            <section className="popup-bottom-half other-popup-for-editing-tasks">
              <section className="status-section for-other-tasks">
                <h4>status</h4>
                <select
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value)}
                >
                  <option value="unimportant">unimportant</option>
                  <option value="not started">not started</option>
                  <option value="in progress">in progress</option>
                  <option value="completed">completed</option>
                </select>
              </section>

              <div className="edit-task-buttons">
                <button onClick={saveEdit}>save</button>
                <button onClick={cancelEdit}>cancel</button>
                <button onClick={deleteFromEdit}>delete</button>
              </div>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}
