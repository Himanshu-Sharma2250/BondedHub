import { useEffect, useState } from 'react'
import './App.css'
import {Toaster} from "react-hot-toast"
import {Routes, Route, Navigate} from "react-router-dom"

import LandingPage from './pages/LandingPage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import SideMenu from './components/SideMenu'
import Dashboard from './pages/Dashboard'
import Announcement from './pages/Announcement'
import Groups from './pages/Groups'
import Applications from './pages/Applications'
import GroupDetailPage from './pages/GroupDetailPage'
import UserProfilePage from './pages/UserProfilePage'
import MyProfile from './pages/MyProfile'
import Layout from './components/Layout'
import { useAuthStore } from './store/useAuthStore'
import { Loader2 } from 'lucide-react'

function App() {
    const {loading, profile, user} = useAuthStore();

    useEffect(() => {
        async function getProfile() {
            await profile();
        }
        getProfile();
    }, [])

    if (loading) {
        return <div className='flex items-center justify-center h-screen w-screen'>
            <Loader2 className='w-5' />
        </div>
    }

    return (
        <>
            <div className='h-screen w-screen'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={true}
                />
                <Routes>
                    <Route path='/landing' element={<LandingPage />} />

                    <Route path='/signup' element={<SignUpPage />} />

                    <Route path='/signin' element={user ? <Navigate to="/" /> : <SignInPage />} />

                    <Route path="/" element={!user ? <Navigate to="/signin" /> : <Layout />}>
                        <Route index element={<Navigate to="/dashboard" />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="groups" element={<Groups />} />
                        <Route path="announcements" element={<Announcement />} />
                        <Route path="applications" element={<Applications />} />
                        <Route path="/groups/:teamId" element={<GroupDetailPage />} />
                        <Route path="/user/:userId" element={<UserProfilePage />} />
                        <Route path="/profile" element={<MyProfile />} />
                    </Route>
                </Routes>
            </div>
        </>
    )
}

export default App
