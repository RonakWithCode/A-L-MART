'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthProtection } from '@/hooks/useAuth';

export default function ProfilePage() {
    useAuthProtection(true); // Protect this route

    const { user, updateProfile, error } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        // Add other profile fields as needed
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            setEditing(false);
        } catch (error) {
            console.error('Profile update failed:', error);
        }
    };

    if (!user) return null;

    return (
        <div>
            <h1>Profile</h1>
            {error && <div className="error">{error}</div>}
            
            {editing ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                </form>
            ) : (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={() => setEditing(true)}>
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );
} 