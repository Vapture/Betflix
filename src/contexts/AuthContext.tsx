import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import type { User } from '../types'; 

interface AuthContextType {
    user: User | null;
    login: (username: string, password?: string) => Promise<boolean>;
    logout: () => void;
    updateBalance: (newBalance: number) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser) as User);
        }
        setLoading(false);
    }, []);

    // Mocking login function
    const login = async (username: string, password?: string): Promise<boolean> => {
        try {
            const response = await api.get<{id: number; username: string; password?: string; balance: number}[]>('/users');
            const foundUser = response.data.find(u => u.username === username && (password ? u.password === password : true));

            if (foundUser) {
                const loggedInUser: User = { 
                    id: foundUser.id,
                    username: foundUser.username,
                    balance: foundUser.balance
                };
                setUser(loggedInUser);
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                return true;
            }
            alert('Invalid credentials');
            return false;
        } catch (error) {
            console.error("Login error:", error);
            alert('Login failed. Please try again.');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateBalance = (newBalance: number) => {
        if (user) {
            const updatedUser: User = { ...user, balance: newBalance };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            api.patch(`/users/${user.id}`, { balance: newBalance })
               .catch(err => console.error("Failed to update balance on server", err));
        }
    };

    if (loading) {
        return <div>Loading session...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateBalance, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};