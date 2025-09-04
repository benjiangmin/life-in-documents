import React, { useState } from "react";

export default function Other() {
    const [tasks, setTasks] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newTask, setNewTask] = useState("");

    const addTask = () => {
        if (newTask.trim() !== "") {
            setTasks([...tasks, { text: newTask, completed: false }]);
            setNewTask("");
            setShowPopup(false);
        }
    };

    const toggleComplete = (index) => {
        setTasks(tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <section className="other-display">
            <h1>other</h1>

            <section className="other-todo-container">
                {tasks.map((task, index) => (
                    <div key={index} className={`task ${task.completed ? "completed" : ""}`}>
                        <span onClick={() => toggleComplete(index)}>{task.text}</span>
                        <button onClick={() => deleteTask(index)}>x</button>
                    </div>
                ))}
            </section>

            <button className="add-task-button" onClick={() => setShowPopup(true)}>
                add task
            </button>

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
        </section>
    );
}
