import { create } from 'zustand';

// --- TYPES ---
export interface OSWindow {
    id: string;      // e.g., 'study_planner', 'file_explorer'
    title: string;
    isOpen: boolean;
    isFocused: boolean;
    zIndex: number;
    // Position and size could handle draggable states
}

interface OSState {
    windows: OSWindow[];
    highestZIndex: number;

    // Actions
    openApplication: (appId: string, defaultTitle?: string) => void;
    closeApplication: (appId: string) => void;
    focusApplication: (appId: string) => void;

    // The 'Kernel' listener that processes the JSON from /api/os-command
    executeOSCommand: (action: { type: string; payload: any }) => void;
}

export const useOSState = create<OSState>((set, get) => ({
    windows: [],
    highestZIndex: 10, // Base level

    openApplication: (appId, defaultTitle = "New Window") => {
        const { windows, highestZIndex, focusApplication } = get();
        const newZ = highestZIndex + 1;

        // If already open, just focus it
        if (windows.some(w => w.id === appId)) {
            return focusApplication(appId);
        }

        // Mount the new window
        set({
            windows: [...windows, {
                id: appId,
                title: defaultTitle,
                isOpen: true,
                isFocused: true,
                zIndex: newZ
            }],
            highestZIndex: newZ
        });
    },

    closeApplication: (appId) => {
        set(state => ({
            windows: state.windows.filter(w => w.id !== appId)
        }));
    },

    focusApplication: (appId) => {
        const { highestZIndex } = get();
        const newZ = highestZIndex + 1;

        set(state => ({
            windows: state.windows.map(w =>
                w.id === appId
                    ? { ...w, isFocused: true, zIndex: newZ }
                    : { ...w, isFocused: false }
            ),
            highestZIndex: newZ
        }));
    },

    executeOSCommand: (action) => {
        const { openApplication } = get();

        // Central switchboard mapped directly to AI Tool executions
        switch (action.type) {
            case 'open_application':
                if (action.payload?.app_id) {
                    // e.g. 'study_planner'
                    openApplication(action.payload.app_id, "Smart Study Planner");
                }
                break;

            case 'search_virtual_file_system':
                if (action.payload?.query) {
                    // AI wants to search: Mount the File Explorer window and pass it the query
                    // (Passing specific arguments to components is generally done via a secondary store or URL params, 
                    // but mounting the window is Step 1)
                    openApplication("file_explorer", `Search: ${action.payload.query}`);
                }
                break;

            case 'none':
            default:
                console.log("No specific UI action required for this dialogue.");
                break;
        }
    }
}));
