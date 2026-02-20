"use client";

import { auth, googleProvider, signInWithPopup } from "../../lib/firebase";
import { useState } from "react";
import { User } from "firebase/auth";

export default function LoginButton() {
    const [user, setUser] = useState<User | null>(null);

    const handleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    if (user) {
        return (
            <div>
                <p>Welcome, {user.displayName}!</p>
                <button onClick={() => auth.signOut().then(() => setUser(null))}>
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleSignIn}
            style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#4285F4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
            }}
        >
            Sign in with Google
        </button>
    );
}
