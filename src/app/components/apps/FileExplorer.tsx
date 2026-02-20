"use client";

import { useState } from "react";

interface FSNode {
    id: string;
    name: string;
    type: "file" | "folder";
    children?: string[]; // IDs of children
    parentId: string | null;
}

const initialFS: Record<string, FSNode> = {
    "root": { id: "root", name: "root", type: "folder", parentId: null, children: ["docs", "pics", "downloads", "projects"] },
    "docs": { id: "docs", name: "Documents", type: "folder", parentId: "root", children: ["resume", "notes"] },
    "pics": { id: "pics", name: "Pictures", type: "folder", parentId: "root", children: ["vacation"] },
    "downloads": { id: "downloads", name: "Downloads", type: "folder", parentId: "root", children: ["app"] },
    "projects": { id: "projects", name: "Projects", type: "folder", parentId: "root", children: ["nexus"] },
    "vacation": { id: "vacation", name: "Vacation_Photo.png", type: "file", parentId: "pics" },
    "resume": { id: "resume", name: "Resume.pdf", type: "file", parentId: "docs" },
    "notes": { id: "notes", name: "Notes.txt", type: "file", parentId: "docs" },
    "app": { id: "app", name: "Installer.exe", type: "file", parentId: "downloads" },
    "nexus": { id: "nexus", name: "Agentic_OS_Architecture.pdf", type: "file", parentId: "projects" },
};

export default function FileExplorer() {
    const [currentPath, setCurrentPath] = useState<string[]>(["root"]);
    const [fs, setFs] = useState<Record<string, FSNode>>(initialFS);

    const currentFolderId = currentPath[currentPath.length - 1];
    const currentFolder = fs[currentFolderId];

    // Sort logic: Folders first, then files, sorted alphabetically
    const currentItems = (currentFolder.children || []).map(id => fs[id]).sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
    });

    const handleNavigate = (id: string, type: "file" | "folder") => {
        if (type === "folder") {
            setCurrentPath([...currentPath, id]);
        } else {
            alert(`Opening file: ${fs[id].name}. Full integration with file viewer coming soon!`);
        }
    };

    const goBack = () => {
        if (currentPath.length > 1) {
            setCurrentPath(currentPath.slice(0, -1));
        }
    };

    const navigateToBreadcrumb = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'Inter', sans-serif", backgroundColor: "transparent", color: "#ddd" }}>
            {/* Toolbar */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "16px", backgroundColor: "rgba(0,0,0,0.2)" }}>
                <button
                    onClick={goBack}
                    disabled={currentPath.length === 1}
                    style={{ background: "transparent", border: "none", color: currentPath.length === 1 ? "#555" : "#CCC", cursor: currentPath.length === 1 ? "default" : "pointer", fontSize: "18px", padding: "4px 8px", borderRadius: "4px", transition: "background 0.2s" }}
                    onMouseOver={(e) => { if (currentPath.length > 1) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)" }}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                    &#8592;
                </button>
                <div style={{ flex: 1, display: "flex", gap: "6px", fontSize: "15px", alignItems: "center", fontWeight: 500 }}>
                    {currentPath.map((pathId, idx) => (
                        <div key={pathId} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span
                                onClick={() => navigateToBreadcrumb(idx)}
                                style={{ cursor: "pointer", color: idx === currentPath.length - 1 ? "#FFF" : "#888", transition: "color 0.2s" }}
                                onMouseOver={(e) => e.currentTarget.style.color = "#FFF"}
                                onMouseOut={(e) => e.currentTarget.style.color = idx === currentPath.length - 1 ? "#FFF" : "#888"}
                            >
                                {idx === 0 ? "My Nexus System" : fs[pathId].name}
                            </span>
                            {idx < currentPath.length - 1 && <span style={{ color: "#555", userSelect: "none" }}>/</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "20px", alignContent: "start", overflowY: "auto" }}>
                {currentItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleNavigate(item.id, item.type)}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "16px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s", border: "1px solid transparent" }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.borderColor = "transparent";
                        }}
                    >
                        <div style={{ fontSize: "42px", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}>
                            {item.type === "folder" ? "📁" : "📄"}
                        </div>
                        <div style={{ fontSize: "13px", textAlign: "center", wordBreak: "break-word", color: "#E2E8F0", fontWeight: 500, lineHeight: "1.4" }}>
                            {item.name}
                        </div>
                    </div>
                ))}
                {currentItems.length === 0 && (
                    <div style={{ gridColumn: "1 / -1", color: "#777", textAlign: "center", marginTop: "60px", fontSize: "15px" }}>
                        This folder is empty.
                    </div>
                )}
            </div>
        </div>
    );
}
