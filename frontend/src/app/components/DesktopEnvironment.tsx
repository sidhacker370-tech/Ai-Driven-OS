"use client";

import { useOSState } from "@/store/useOSState";
import OSWindow from "./OSWindow";
import { useState, useEffect } from "react";
import LoginButton from "./LoginButton";
import FileExplorer from "./apps/FileExplorer";
import SmartPlanner from "./apps/SmartPlanner";

export default function DesktopEnvironment() {
    const { windows, executeOSCommand, openApplication } = useOSState();

    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState("");
    const [time, setTime] = useState("");

    // Update clock every minute
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleOSCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsLoading(true);
        setAiResponse("");

        try {
            const res = await fetch("/api/os-command", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();

            if (data.dialogue) setAiResponse(data.dialogue);
            if (data.action) executeOSCommand(data.action);

        } catch (error) {
            setAiResponse("System Error: Failed to contact AI Orchestrator.");
        } finally {
            setIsLoading(false);
            setPrompt("");
        }
    };

    // Mock Desktop Shortcuts
    const shortcuts = [
        { id: "about_os", name: "About Nexus OS", icon: "🌐" },
        { id: "file_explorer", name: "File System", icon: "📁" },
        { id: "study_planner", name: "Smart Planner", icon: "📅" },
        { id: "system_settings", name: "Settings", icon: "⚙️" },
    ];

    return (
        <div style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            backgroundColor: "#0d1117",
            backgroundImage: "radial-gradient(circle at top left, #1f2937, #0d1117)",
            color: "#FFF",
            fontFamily: "'Inter', sans-serif"
        }}
        >
            {/* Top Menu Bar */}
            <div style={{
                height: "32px",
                width: "100%",
                backgroundColor: "rgba(10, 10, 10, 0.6)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 16px",
                fontSize: "13px",
                fontWeight: 500,
                zIndex: 9999
            }}>
                <div style={{ display: "flex", gap: "20px" }}>
                    <span style={{ fontWeight: 700, letterSpacing: "1px" }}>Nexus OS</span>
                    <span style={{ cursor: "pointer", color: "#AAA" }} onClick={() => openApplication("file_explorer", "File Explorer")}>Files</span>
                    <span style={{ cursor: "pointer", color: "#AAA" }} onClick={() => openApplication("about_os", "About Nexus OS")}>Help</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span>{time}</span>
                    <div style={{ transform: "scale(0.8)", transformOrigin: "right" }}>
                        <LoginButton />
                    </div>
                </div>
            </div>

            {/* Desktop Grid (Shortcuts) */}
            <div style={{
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                gap: "24px",
                height: "calc(100vh - 120px)", // Leave room for top bar and bottom dock
                alignContent: "start",
            }}>
                {shortcuts.map((app) => (
                    <div
                        key={app.id}
                        onClick={() => openApplication(app.id, app.name)}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            padding: "12px",
                            borderRadius: "8px",
                            transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <div style={{ fontSize: "36px", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}>
                            {app.icon}
                        </div>
                        <span style={{ fontSize: "12px", textAlign: "center", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                            {app.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Dynamic Windows parsed from Kernel State */}
            {windows.map((app) => (
                <OSWindow key={app.id} appId={app.id} title={app.title}>

                    {app.id === "about_os" && (
                        <div style={{ padding: "8px", lineHeight: "1.6" }}>
                            <h2 style={{ marginBottom: "12px", background: "linear-gradient(45deg, #0078D4, #00C6FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nexus OS v1.0</h2>
                            <p style={{ color: "#CCC", marginBottom: "16px" }}>The next-generation Agentic Operating System. Powered by Large Language Models, Firebase, and Next.js.</p>
                            <h3>Features:</h3>
                            <ul style={{ marginLeft: "20px", color: "#AAA", marginTop: "8px" }}>
                                <li>Natural Language Command Center</li>
                                <li>Virtual File System (VFS)</li>
                                <li>Background Python Automation processes</li>
                                <li>Draggable, stateful window rendering</li>
                            </ul>
                        </div>
                    )}

                    {app.id === "study_planner" && (
                        <SmartPlanner />
                    )}

                    {app.id === "file_explorer" && (
                        <FileExplorer />
                    )}

                    {app.id === "system_settings" && (
                        <div style={{ padding: "8px" }}>
                            <h3 style={{ marginBottom: "12px" }}>Settings</h3>
                            <p style={{ color: "#AAA", fontSize: "14px", marginBottom: "20px" }}>Manage your AI Environment.</p>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #333" }}>
                                <span>AI Autopilot</span>
                                <input type="checkbox" defaultChecked />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #333" }}>
                                <span>Background Summarization</span>
                                <input type="checkbox" defaultChecked />
                            </div>
                        </div>
                    )}
                </OSWindow>
            ))}

            {/* AI Command Center Dock */}
            <div style={{
                position: "absolute",
                bottom: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "600px",
                backgroundColor: "rgba(15, 15, 15, 0.7)",
                backdropFilter: "blur(24px)",
                borderRadius: "20px",
                padding: "16px",
                boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
                zIndex: 9999
            }}>
                <form onSubmit={handleOSCommand} style={{ display: "flex", gap: "12px" }}>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Chat with your OS... (e.g., 'open planner', 'search for pdf')"
                        style={{
                            flex: 1,
                            padding: "14px 20px",
                            borderRadius: "12px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "#FFF",
                            outline: "none",
                            fontSize: "15px",
                            transition: "border 0.2s"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#0078D4"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            padding: "0 28px",
                            borderRadius: "12px",
                            backgroundColor: isLoading ? "#333" : "#0078D4",
                            color: "#FFF",
                            border: "none",
                            cursor: isLoading ? "wait" : "pointer",
                            fontWeight: 600,
                            transition: "background 0.2s"
                        }}
                    >
                        {isLoading ? "..." : "Execute"}
                    </button>
                </form>

                {aiResponse && (
                    <div style={{
                        marginTop: "16px",
                        color: "#E2E8F0",
                        fontSize: "14px",
                        padding: "12px",
                        backgroundColor: "rgba(0,120,212,0.1)",
                        borderLeft: "3px solid #0078D4",
                        borderRadius: "4px"
                    }}>
                        <span style={{ marginRight: "8px" }}>🤖</span> {aiResponse}
                    </div>
                )}
            </div>
        </div>
    );
}
