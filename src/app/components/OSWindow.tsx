"use client";

import { useOSState } from "@/store/useOSState";
import { useState, useRef, useEffect } from "react";

interface WindowProps {
    appId: string;
    title: string;
    children: React.ReactNode;
    initialX?: number;
    initialY?: number;
}

export default function OSWindow({ appId, title, children, initialX = 100, initialY = 100 }: WindowProps) {
    const { windows, focusApplication, closeApplication } = useOSState();
    const windowState = windows.find((w) => w.id === appId);

    // Position State
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number } | null>(null);

    // If the window was closed from state, unmount it
    if (!windowState || !windowState.isOpen) return null;

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        focusApplication(appId);
        dragRef.current = {
            startX: e.clientX - position.x,
            startY: e.clientY - position.y,
        };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !dragRef.current) return;
        setPosition({
            x: e.clientX - dragRef.current.startX,
            y: e.clientY - dragRef.current.startY,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        dragRef.current = null;
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            onClick={() => focusApplication(appId)}
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                zIndex: windowState.zIndex,
                width: "400px",
                height: "300px",
                backgroundColor: "rgba(30, 30, 30, 0.8)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${windowState.isFocused ? "#0078D4" : "#444"}`,
                borderRadius: "8px",
                boxShadow: windowState.isFocused ? "0 8px 32px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: isDragging ? "none" : "box-shadow 0.2s, border 0.2s",
            }}
        >
            {/* Title Bar (Draggable Area) */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    height: "32px",
                    backgroundColor: windowState.isFocused ? "#2D2D2D" : "#1E1E1E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 12px",
                    cursor: isDragging ? "grabbing" : "grab",
                    userSelect: "none",
                    borderBottom: "1px solid #444",
                }}
            >
                <span style={{ fontSize: "12px", color: windowState.isFocused ? "#FFF" : "#AAA", fontWeight: 500 }}>
                    {title}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        closeApplication(appId);
                    }}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#FFF",
                        cursor: "pointer",
                        fontSize: "14px",
                        width: "24px",
                        height: "24px",
                        borderRadius: "4px",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E81123")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    ✕
                </button>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: "16px", color: "#FFF", overflowY: "auto" }}>
                {children}
            </div>
        </div>
    );
}
