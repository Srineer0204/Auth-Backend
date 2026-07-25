import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "./skeleton";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-800">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-8 w-64" />
            <div className="w-full max-w-md space-y-4">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}
    if(!user) {
        return <Navigate to="/login" replace />;
    }
    // else {
    //     return <Navigate to="dashboard" replace />
    // }

    return children;
}