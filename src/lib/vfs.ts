import { collection, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { db } from './firebase';

// --- TYPES ---
export type VFSNodeType = 'folder' | 'file';
export type MimeType = 'application/pdf' | 'text/markdown' | 'unknown';

export interface VFSNode {
    id: string;
    name: string;
    type: VFSNodeType;
    parentId: string | null; // null represents the root directory '/'
    createdAt: number;

    // File specifics
    size?: number;
    mimeType?: MimeType;
    storageUrl?: string;     // Link to Firebase Storage

    // Folder specifics
    children?: VFSNode[];    // Used for nested UI rendering
}

/**
 * Fetches the entire directory tree for a specific user from Firestore.
 * Schema Path: /users/{userId}/fs/{nodeId}
 */
export async function getVirtualFileSystem(userId: string): Promise<VFSNode[]> {
    try {
        const fsRef = collection(db, 'users', userId, 'fs');

        // In a real app, you might paginate or lazy-load folders. 
        // Here we fetch all nodes for the user to build the tree.
        const snapshot = await getDocs(fsRef);

        const nodes: VFSNode[] = [];
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            nodes.push({
                id: docSnap.id,
                name: data.name,
                type: data.type,
                parentId: data.parentId,
                createdAt: data.createdAt,
                size: data.size,
                mimeType: data.mimeType,
                storageUrl: data.storageUrl
            });
        });

        return buildTree(nodes, null);

    } catch (error) {
        console.error("VFS Fetch Error:", error);
        return [];
    }
}

/**
 * Helper to turn a flat list of nodes into a nested tree structure.
 */
function buildTree(nodes: VFSNode[], parentId: string | null): VFSNode[] {
    return nodes
        .filter(node => node.parentId === parentId)
        .map(node => ({
            ...node,
            children: node.type === 'folder' ? buildTree(nodes, node.id) : undefined
        }));
}

/**
 * --- MOCK DATA STRUCTURE EXAMPLE ---
 * 
 * To visualize how Probability and Statistics notes would be structured:
 * 
 * /users/user123/fs/folder_uni
 *   { name: "University", type: "folder", parentId: null }
 * 
 * /users/user123/fs/folder_stats
 *   { name: "Probability & Statistics", type: "folder", parentId: "folder_uni" }
 * 
 * /users/user123/fs/file_notes_pdf
 *   { name: "Chapter 1 Notes.pdf", type: "file", parentId: "folder_stats", mimeType: "application/pdf" }
 * 
 * /users/user123/fs/file_schedule
 *   { name: "Study Schedule.md", type: "file", parentId: "folder_uni", mimeType: "text/markdown" }
 */
