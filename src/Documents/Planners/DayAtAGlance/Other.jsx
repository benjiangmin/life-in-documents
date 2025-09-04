import React, { useState, useEffect } from "react";
import { supabase } from "../DayAtAGlance/supabaseClient.js"
import greenDot from "../../../../src/images/greenDot.png";
import redDot from "../../../../src/images/redDot.png";
import greyDot from "../../../../src/images/greyDot.png";
import yellowDot from "../../../../src/images/yellowDot.png";

export default function Other() {
    const [tasks, setTasks] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newTask, setNewTask] = useState("");

    // editing state
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

        if (error) {
        console.error("Error fetching tasks:", error);
        } else {
        setTasks(data);
        }
    };

    loadTasks();
    }, []);

    const cleanupOldCompleted = async () => {
    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-09-05"

    const { error } = await supabase
        .from("tasks")
        .delete()
        .lt("created_at", today)  // created before today
        .eq("status", "completed");

    if (error) {
        console.error("Error cleaning up old completed tasks:", error);
    }
    };

    const addTask = async () => {
        if (newTask.trim() === "") return;

        const { data, error } = await supabase
            .from("tasks")
            .insert([{ text: newTask, status: "not started" }])
            .select();

        if (error) {
            console.error("Error adding task:", error);
        } else if (data) {
            setTasks([...tasks, ...data]);
        }

        setNewTask("");
        setShowPopup(false);
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const openEdit = (index) => {
        setEditingIndex(index);
        setEditingText(tasks[index].text);
        setEditingStatus(tasks[index].status);
    };

    const saveEdit = async () => {
        const { data, error } = await supabase
            .from("tasks")
            .update({ text: editingText, status: editingStatus })
            .eq("id", tasks[editingIndex].id)
            .select();

        if (error) {
            console.error("Error updating task:", error);
        } else if (data) {
            const updated = [...tasks];
            updated[editingIndex] = data[0];
            setTasks(updated);
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
    const taskId = tasks[editingIndex].id;

    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

    if (error) {
        console.error("Error deleting task:", error);
    } else {
        setTasks(tasks.filter((_, i) => i !== editingIndex));
    }

    setEditingIndex(null);
    };


    // match statuses to dots
    const getDot = (status) => {
        switch (status) {
            case "completed": return greenDot;
            case "in progress": return yellowDot;
            case "unimportant": return greyDot;
            default: return redDot; // not started
        }
    };

    return (
        <section className="other-display">
            <h1>other</h1>

            <section className="other-todo-container">
                {tasks.map((task, index) => (
                    <div
                        key={index}
                        className="task"
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

            {/* Add task popup */}
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

            {/* Edit task popup */}
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
                                    <option value="completed">complete</option>
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
