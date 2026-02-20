"use client";

import { useState } from "react";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

export default function SmartPlanner() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: "1", title: "Review Probability & Statistics", completed: false },
        { id: "2", title: "Read Chapter 3", completed: true },
    ]);
    const [newTask, setNewTask] = useState("");

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now().toString(), title: newTask.trim(), completed: false }]);
        setNewTask("");
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px", fontFamily: "'Inter', sans-serif", backgroundColor: "transparent" }}>
            <h3 style={{ marginBottom: "20px", color: "#FFF", fontSize: "22px", fontWeight: 600 }}>Smart Study Planner</h3>

            <form onSubmit={handleAddTask} style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(0,0,0,0.4)", color: "#FFF", outline: "none", fontSize: "15px" }}
                    onFocus={(e) => e.target.style.borderColor = "#0078D4"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
                />
                <button type="submit" style={{ padding: "0 20px", borderRadius: "8px", backgroundColor: "#0078D4", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "15px", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#005a9e"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#0078D4"}>
                    Add
                </button>
            </form>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "4px" }}>
                {tasks.map(task => (
                    <div key={task.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}>
                        <label style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", flex: 1 }}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                style={{ width: "18px", height: "18px", accentColor: "#0078D4", cursor: "pointer" }}
                            />
                            <span style={{ color: task.completed ? "#888" : "#E2E8F0", textDecoration: task.completed ? "line-through" : "none", fontSize: "15px", fontWeight: 500 }}>
                                {task.title}
                            </span>
                        </label>
                        <button onClick={() => deleteTask(task.id)} style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "18px", padding: "4px 8px", borderRadius: "4px", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                            &times;
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <p style={{ color: "#888", textAlign: "center", marginTop: "30px", fontSize: "15px" }}>No tasks yet. Enjoy your day!</p>
                )}
            </div>
        </div>
    );
}
