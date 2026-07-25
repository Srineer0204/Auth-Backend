import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { 
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";
import { useState,useEffect } from "react";
import api from "@/api/axios";
import { toast } from "sonner";

export default function Dashboard() {

    const navigate = useNavigate();
    const { user,logout,setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name,setName] = useState(user?.name || "");

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if(user) {
            setName(user.name);
        }
    },[user]);


    const handleLogout = async () => {
        await logout();
        toast.success("Logged Out successfully");
        navigate("/login");
    }

    const handleUpdateProfile = async () => {
        try {
            setProfileLoading(true);
            await api.put("/auth/profile", {
                name,
            });
            setUser({
                ...user,
                name,
            });
            toast.success("Profile updated successfully");
            setIsEditing(false); 
        } catch(error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            )
        } finally {
            setProfileLoading(false);
        }
    }

    const handleChangePassword = async () => {
        if(newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setPasswordLoading(true);
            const response = await api.put("/auth/change-password", {
                currentPassword,
                newPassword
            });
            toast.success(response.data.message);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsChangingPassword(false);
            
        } catch(error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setPasswordLoading(false);
        }
    }
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-800 text-white gap-6">
            <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">
                Welcome back, {user?.name}! 👋
            </h1>
            <Card className="w-full max-w-md shadow-xl shadow-gray-700/40">
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{user?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">
                            {new Date(user?.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Button disabled={isEditing}
            className="w-full max-w-md" 
            onClick={() => setIsEditing(true)}>
                Edit Profile
            </Button>
            {isEditing && (
                <form 
                className="w-full max-w-md space-y-4"
                onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateProfile();
                    }}>
                    <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-md border p-2 text-white"
                    />
                    <Button
                    type="submit"
                    disabled={profileLoading}
                    >
                        {profileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button 
                    type="button"
                    disabled={profileLoading}
                    onClick={() => {
                        setName(user.name);
                        setIsEditing(false);
                    }}
                    >
                        Cancel
                    </Button>
                </form>
            )}
            <Button 
            className="w-full max-w-md"
            disabled={isChangingPassword}
            onClick={() => setIsChangingPassword(true)}
            >
                Change Password
            </Button>
            {isChangingPassword && (
                <form 
                className="w-full max-w-md space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleChangePassword();
                }}>
                    <input 
                    type="password"
                    disabled={passwordLoading}
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-md border p-2 text-white"
                    />
                    <input
            type="password"
            disabled={passwordLoading}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-md border p-2 text-white"
        />

        <input
            type="password"
            placeholder="Confirm New Password"
            disabled={passwordLoading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border p-2 text-white"
        />

        <Button
    type="submit"
    disabled={passwordLoading}
>
    {passwordLoading ? "Changing..." : "Change Password"}
</Button>
        <Button
            type="button"
            disabled={passwordLoading}
            onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setIsChangingPassword(false);
            }}
        >
            Cancel
        </Button>
                </form>
            )}
            <Button 
            onClick={handleLogout}
            variant="destructive"
            className="m-2 w-full max-w-md"
            >Logout</Button>
        </div>
    );
}