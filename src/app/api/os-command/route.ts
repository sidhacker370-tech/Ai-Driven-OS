import { NextResponse } from 'next/server';

// This is a minimal mock for the LLM OS Orchestrator. 
// In a real scenario, this would import LangChain or OpenAI SDK.
export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
        }

        // --- MOCK LLM LOGIC ---
        // Here we analyze the prompt to decide which "Tool" to use.
        let dialogue = "I'm processing your request.";
        let actionType = "none";
        let actionPayload: any = null;

        const lowerPrompt = prompt.toLowerCase();

        // 1. TOOL: open_application
        if (lowerPrompt.includes("open") && lowerPrompt.includes("planner")) {
            dialogue = "Opening the Study Planner application for you.";
            actionType = "open_application";
            actionPayload = { app_id: "study_planner" };
        }
        // 2. TOOL: search_virtual_file_system
        else if (lowerPrompt.includes("search") || lowerPrompt.includes("find")) {
            const match = lowerPrompt.match(/(?:search|find)\s+(.+)/);
            const query = match ? match[1] : "recent files";

            dialogue = `Searching the virtual file system for: "${query}"`;
            actionType = "search_virtual_file_system";
            actionPayload = { query };
        }
        // Default 
        else {
            dialogue = `I heard you say: "${prompt}". How else can I assist?`;
        }

        // Return the structured JSON expected by the frontend OS State Manager.
        return NextResponse.json({
            dialogue,
            action: {
                type: actionType,
                payload: actionPayload,
            }
        });

    } catch (error) {
        console.error("OS Command Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
