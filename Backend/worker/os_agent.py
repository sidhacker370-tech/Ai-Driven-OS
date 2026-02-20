# os_agent.py
# Background Worker for AI Driven OS
# Listens to Firestore for new files and runs background processes.

import os
import time
import firebase_admin
from firebase_admin import credentials, firestore

# --- Initialization ---
# Requires a serviceAccountKey.json file exported from Firebase Console
cred_path = "serviceAccountKey.json"

if not os.path.exists(cred_path):
    print(f"Warning: {cred_path} not found. Background worker cannot connect to Firestore.")
    print("Please download a service account key from the Firebase Console (Project Settings -> Service Accounts -> Generate new private key).")
    print("Save it as 'serviceAccountKey.json' in this folder.")
    exit(1)

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

db = firestore.client()
print("Firebase Admin Initialized successfully.")

# --- Background Task: Auto-Summarization ---

def auto_summarize_file(user_id, file_id, file_data):
    """
    Mock function representing an LLM summarization pipeline.
    In real life: fetch file from storage URL, parse text, pass to LangChain.
    """
    print(f"[\u26a1 AI Worker] Summarizing new file '{file_data.get('name')}'...")
    
    # Simulate processing time
    time.sleep(2)
    
    mock_summary = "This is an AI-generated summary of the probability concepts inside the document..."
    
    # Write summary back to Firestore as metadata on the file node
    file_ref = db.collection('users').document(user_id).collection('fs').document(file_id)
    file_ref.update({
        'aiSummary': mock_summary,
        'aiProcessedAt': firestore.SERVER_TIMESTAMP
    })
    
    print(f"[\u2705 AI Worker] Finished processing '{file_data.get('name')}'.")


# --- Event Listener ---

def on_snapshot(col_snapshot, changes, read_time):
    """Callback triggered whenever a document in the collection view changes."""
    for change in changes:
        if change.type.name == 'ADDED':
            doc_data = change.document.to_dict()
            doc_id = change.document.id
            
            # Extract user_id from document path (users/{uid}/fs/{fid})
            path_parts = change.document.reference.path.split('/')
            if len(path_parts) >= 2 and path_parts[0] == 'users':
                user_id = path_parts[1]
                
                # We only want to process "file" nodes that haven't been summarized yet
                if doc_data.get('type') == 'file' and not doc_data.get('aiSummary'):
                    auto_summarize_file(user_id, doc_id, doc_data)


# To listen securely across *all* users' virtual file systems, we can use a Collection Group Query.
# Firestore requires a composite index to be built for this query to work in production.
try:
    print("Starting background listener for new Virtual File System documents...")
    vfs_query = db.collection_group('fs').where("type", "==", "file")
    vfs_watch = vfs_query.on_snapshot(on_snapshot)

    # Keep the main thread alive
    while True:
        time.sleep(1)

except Exception as e:
    print(f"Error starting listener: {e}")
