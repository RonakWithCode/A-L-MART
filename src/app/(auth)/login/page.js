'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const dynamic = 'force-dynamic';
export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            // Login successful, user will be redirected
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({
                    ...prev,
                    email: e.target.value
                }))}
            />
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({
                    ...prev,
                    password: e.target.value
                }))}
            />
            <button type="submit">Login</button>
        </form>
    );
}
