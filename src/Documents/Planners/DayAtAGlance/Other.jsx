import React, { useState } from "react";
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

    const addTask = () => {
        if (newTask.trim() !== "") {
            setTasks([...tasks, { text: newTask, completed: false }]);
            setNewTask("");
            setShowPopup(false);
        }
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    // open editor popup for a specific task
    const openEdit = (index) => {
        setEditingIndex(index);
        setEditingText(tasks[index].text);
    };

    const saveEdit = () => {
        const updated = [...tasks];
        updated[editingIndex].text = editingText;
        setTasks(updated);
        setEditingIndex(null);
        setEditingText("");
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditingText("");
    };

    const deleteFromEdit = () => {
        deleteTask(editingIndex);
        setEditingIndex(null);
    };

    return (
        <section className="other-display">
            <h1>other</h1>

            <section className="other-todo-container">
                {tasks.map((task, index) => (
                    <div
                        key={index}
                        className={`task ${task.completed ? "completed" : ""}`}
                        onClick={() => openEdit(index)}
                    >
                        <span>{task.text}</span>
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
                        <div className="edit-task-buttons">
                            <button onClick={saveEdit}>save</button>
                            <button onClick={cancelEdit}>cancel</button>
                            <button onClick={deleteFromEdit}>delete</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
