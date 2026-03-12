import React, { useEffect } from 'react'
import EditProfileModal from '../components/EditProfileModal'
import { useAuthStore } from '../store/useAuthStore'
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useUserHistory } from '../hooks/useUserHistoryQueries';
import toast from 'react-hot-toast';

const actionColorMap = {
    CREATED: '#10b981',   // green
    JOINED: '#3b82f6',    // blue
    LEFT: '#ef4444',      // red
    KICKED_OUT: '#f97316', // orange
    DELETED: '#6b7280',   // gray
};

const getAvatarColor = (name) => {
    if (!name) return '#6b7280';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 80%, 60%)`;
};

const MyProfile = () => {
    const {profile, user} = useAuthStore();
    const {data: userHistory = [], isLoading} = useUserHistory();

    useEffect(() => {
        async function getProfile() {
            await profile();
            toast.success("Profile fetched");
        }
        getProfile();
    }, [profile])

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Sort history from latest to oldest
    const sortedHistory = useMemo(() => {
        if (!userHistory) return [];
        return [...userHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [userHistory]);

    const createHistoryCard = (historyItem) => {
        const dotColor = actionColorMap[historyItem.userAction] || '#64748B';

        return (
            <div
                key={historyItem._id}
                className="flex flex-col px-4 py-3 border border-[#CBD5E1] rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Colored dot */}
                        <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: dotColor }}
                        />
                        <h3 className="text-lg font-semibold text-[#0F172A]">
                            {historyItem.title}
                        </h3>
                    </div>
                    <span className="text-xs text-[#64748B]">
                        {formatDate(historyItem.createdAt)}
                    </span>
                </div>
                <p className="mt-2 text-sm text-[#334155]">
                    {historyItem.description}
                </p>
            </div>
        );
    };

    return (
        <div className='py-2 flex flex-col gap-10'>
            {/* shows page's header */}
            <div className='flex flex-col'>
                <h1 className='text-2xl font-bold'>
                    My Profile
                </h1>

                <span>
                    Manage your account and settings
                </span>
            </div>

            {/* shows user profile and role and edit profile button */}
            <div className='flex justify-between items-center'>
                {/* shows user profile , name and role */}
                <div className='flex gap-3 items-center'>
                    {/* user profile image */}
                    <div className='flex items-center'>
                        <span className='p-5 bg-cyan-800' style={{ backgroundColor: getAvatarColor(user?.name) }}>
                            {user?.fullName?.toUpperCase().slice(0,1) || U}
                        </span>
                    </div>

                    {/* page header */}
                    <div className='flex flex-col'>
                        <h1 className='text-xl '>
                            {user?.fullName}
                        </h1>

                        <span className='text-gray-400 text-[14px]'>
                           {user?.name}
                        </span>

                        <span className='text-gray-400 text-[13px]'>
                            {user?.email}
                        </span>
                    </div>
                </div>

                <div>
                    <EditProfileModal initialValue={user} />
                </div>
            </div>

            {/* personal info - username, email, role and date of joining team */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>
                    Personal Information
                </h1>

                <div className='flex flex-col gap-2 px-2 py-1 rounded-xs shadow'>
                    {/* shows username and user email */}
                    <div className='flex items-center'>
                        {/* username */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Full Name
                            </span>

                            <span className='w-145'>
                                {user.fullName}
                            </span>
                        </div>

                        {/* user email */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Username
                            </span>

                            <span className='w-145'>
                                {user.name}
                            </span>
                        </div>
                    </div>

                    {/* shows user role and date of joining team */}
                    <div className='flex items-center'>
                        {/* user role */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600'>
                                email
                            </span>

                            <span className='w-145'>
                                {user.email}
                            </span>
                        </div>

                        {/* user date of joining bonded */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Role
                            </span>

                            <span className='w-145'>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* social info - bio, website, github, linkedln, hashnode, twitter, leetcode */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>
                    Social Information
                </h1>

                <div className='flex flex-col gap-2 px-2 py-1 rounded-xs shadow'>
                    {/* shows bio and website */}
                    <div className='flex items-center'>
                        {/* bio */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Bio
                            </span>

                            <span className='w-145'>
                                {user.bio || "NA"}
                            </span>
                        </div>

                        {/* website */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Website
                            </span>

                            <a href={user.website || '#'} target="_blank" className='w-145'>
                                {user.website || "NA"}
                            </a>
                        </div>
                    </div>

                    {/* shows linkedln and github */}
                    <div className='flex items-center'>
                        {/* linkedln */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Linkedin
                            </span>

                            <a href={user.linkedln || '#'} target="_blank" className='w-145'>
                                {user.linkedln || "NA"}
                            </a>
                        </div>

                        {/* github */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Github
                            </span>

                            <a href={user.github || '#'} target="_blank" className='w-145'>
                                {user.github || "NA"}
                            </a>
                        </div>
                    </div>

                    {/* shows twitter and hashnode */}
                    <div className='flex items-center'>
                        {/* twitter */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Twitter/X
                            </span>

                            <a href={user.twitter || '#'} target="_blank" className='w-145'>
                                {user.twitter || "NA"}
                            </a>
                        </div>

                        {/* hashnode */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                hashnode
                            </span>

                            <a href={user.hashnode || '#'} target="_blank" className='w-145'>
                                {user.hashnode || "NA"}
                            </a>
                        </div>
                    </div>

                    {/* shows medium and leetcode */}
                    <div className='flex items-center'>
                        {/* medium */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Medium
                            </span>

                            <a href={user.medium || '#'} target="_blank" className='w-145'>
                                {user.medium || "NA"}
                            </a>
                        </div>

                        {/* leetcode */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Leetcode
                            </span>

                            <a href={user.leetcode || '#'} target="_blank" className='w-145'>
                                {user.leetcode || "NA"}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* user history */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">User History</h1>
                <div className="px-4 py-4 border-2 border-[#CBD5E1] rounded-md bg-[#F8FAFC]">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
                        </div>
                    ) : !sortedHistory || sortedHistory.length === 0 ? (
                        <div className="text-center py-10">
                            <span className="text-lg text-[#64748B]">No History</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {sortedHistory.map(createHistoryCard)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyProfile
