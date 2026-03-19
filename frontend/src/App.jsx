import './App.css';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import Dashboard from './pages/Dashboard';
import Announcement from './pages/Announcement';
import Groups from './pages/Groups';
import Applications from './pages/Applications';
import GroupDetailPage from './pages/GroupDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import MyProfile from './pages/MyProfile';
import Layout from './components/Layout';
import { useProfile } from './hooks/useAuthQueries'; 
import { Loader2 } from 'lucide-react';
import CheckEmailPage from './pages/CheckEmailPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import AboutUs from './pages/AboutUs';

function App() {
    const { data: user, isLoading, error } = useProfile();

    if (error) {
        console.error('Failed to fetch profile:', error);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="h-screen w-screen">
                <Toaster position="bottom-right" reverseOrder={true} />
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route
                        path="/signup"
                        element={user ? <Navigate to="/dashboard" replace /> : <SignUpPage />}
                    />
                    <Route
                        path="/signin"
                        element={user ? <Navigate to="/dashboard" replace /> : <SignInPage />}
                    />
                    <Route
                        path="/verify-email"
                        element={!user?.isVerified ? <CheckEmailPage /> : <Navigate to="/" />}
                    />
                    <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/announcements" element={<Announcement />} />
                        <Route path="/applications" element={<Applications />} />
                        <Route path="/groups/:teamId" element={<GroupDetailPage />} />
                        <Route path="/user/:name" element={<UserProfilePage />} />
                        <Route path="/profile" element={<MyProfile />} />
                    </Route>

                    {/* Fallback for any unknown routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </>
    );
}

export default App;