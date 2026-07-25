import { createContext, useContext, useState, useEffect } from "react";
import api from "@/api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function logout() {
        try {
            await api.post("/auth/logout");
        } catch(error) {
            console.error(error);
        } finally {
            setUser(null);
        }
    }

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await api.get("/auth/profile");
                setUser(response.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    },[]);
    return (
        <AuthContext.Provider
        value={{
            user,
            setUser,
            loading,
            setLoading,
            logout
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}