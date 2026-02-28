import { MoveLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserHistoryStore } from '../store/useUserHistoryStore';

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

const UserProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { getUserProfile, loading, otherUser } = useAuthStore();
    const {getUserHistories, userHistory} = useUserHistoryStore();
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        const fetchUserProfile = async () => {
            try {
                setError(null);
                await getUserProfile(userId);
                await getUserHistories();
            } catch (err) {
                setError('User not found or failed to load.');
            }
        };

        if (userId) {
            fetchUserProfile();
        }

        return () => abortController.abort();
    }, [userId, getUserProfile, getUserHistories]);

    // Format date for "Member Since"
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-[#FF7A59]">
                {error}
            </div>
        );
    }

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
            {/* Back button and header */}
            <div className='flex gap-5 items-center'>
                <div className='flex items-center'>
                    <button onClick={() => navigate(-1)} className='cursor-pointer'>
                        <MoveLeft className='w-6' />
                    </button>
                </div>
                <div>
                    <h1 className='text-2xl font-bold'>User Profile</h1>
                    <span>Viewing {otherUser?.fullName || otherUser?.name}'s profile</span>
                </div>
            </div>

            {/* User avatar and basic info */}
            <div className='flex gap-2 items-center'>
                <div className='flex items-center'>
                    <span className='p-5 bg-cyan-800 uppercase' style={{ backgroundColor: getAvatarColor(otherUser?.name) }}>
                        {(otherUser?.fullName?.[0] || otherUser?.name?.[0] || 'U')}
                    </span>
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-xl '>
                        {otherUser?.fullName || otherUser?.name}
                    </h1>
                    <span className='text-gray-400 text-[14px]'>
                        @{otherUser?.name}
                    </span>
                    <span className='text-gray-400 text-[13px]'>
                        {otherUser?.email}
                    </span>
                </div>
            </div>

            {/* Personal Information */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>Personal Information</h1>
                <div className='flex flex-col gap-2 px-2 py-1 rounded-xs shadow'>
                    <div className='flex items-center'>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>Username</span>
                            <span className='w-145'>{otherUser?.name}</span>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>Email</span>
                            <span className='w-145'>{otherUser?.email}</span>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>Role</span>
                            <span className='w-145'>{otherUser?.role}</span>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>Member Since</span>
                            <span className='w-145'>{formatDate(otherUser?.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Information */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>Social Information</h1>
                <div className='flex flex-col gap-2 px-2 py-1 rounded-xs shadow'>
                    {/* Bio and Website */}
                    <div className='flex items-center'>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>Bio</span>
                            <span className='w-145'>{otherUser?.bio}</span>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>Website</span>
                            <span className='w-145'>
                                {otherUser?.website ? (
                                    <a href={otherUser?.website} target="_blank" rel="noopener noreferrer" className="text-[#2A6E8C] hover:underline">
                                        {otherUser?.website}
                                    </a>
                                ) : 'Not provided'}
                            </span>
                        </div>
                    </div>

                    {/* LinkedIn and GitHub */}
                    <div className='flex items-center'>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>LinkedIn</span>
                            <span className='w-145'>
                                {otherUser?.linkedln ? (
                                    <a href={otherUser?.linkedln} target="_blank" rel="noopener noreferrer" className="text-[#2A6E8C] hover:underline">
                                        {otherUser?.linkedln}
                                    </a>
                                ) : 'Not provided'}
                            </span>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>GitHub</span>
                            <span className='w-145'>
                                {otherUser?.github ? (
                                    <a href={otherUser?.github} target="_blank" rel="noopener noreferrer" className="text-[#2A6E8C] hover:underline">
                                        {otherUser?.github}
                                    </a>
                                ) : 'Not provided'}
                            </span>
                        </div>
                    </div>

                    {/* Twitter and Hashnode */}
                    <div className='flex items-center'>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>Twitter/X</span>
                            <span className='w-145'>
                                {otherUser?.twitter ? (
                                    <a href={otherUser?.twitter} target="_blank" rel="noopener noreferrer" className="text-[#2A6E8C] hover:underline">
                                        {otherUser?.twitter}
                                    </a>
                                ) : 'Not provided'}
                            </span>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>Hashnode</span>
                            <span className='w-145'>
                                {otherUser?.hashnode ? (
                                    <a href={otherUser?.hashnode} target="_blank" rel="noopener noreferrer" className="text-[#2A6E8C] hover:underline">
                                        {otherUser?.hashnode}
                                    </a>
                                ) : 'Not provided'}
                            </span>
                        </div>
                    </div>

                    {/* Medium and LeetCode */}
                    <div className='flex items-center'>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>Medium</span>
                            <span className='w-145'>
                                {otherUser?.medium ? (
                                    <a href={otherUser?.medium} target="_blank" rel="noopener noreferrer" className="text-[#2A6E8C] hover:underline">
                                        {otherUser?.medium}
                                    </a>
                                ) : 'Not provided'}
                            </span>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>LeetCode</span>
                            <span className='w-145'>
                                {otherUser?.leetcode ? (
                                    <a href={otherUser?.leetcode} target="_blank" rel="noopener noreferrer" className="text-[#2A6E8C] hover:underline">
                                        {otherUser?.leetcode}
                                    </a>
                                ) : 'Not provided'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* User History (static for now) */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>User History</h1>
                <div className="px-4 py-4 border-2 border-[#CBD5E1] rounded-md bg-[#F8FAFC]">
                    {!userHistory || userHistory.length === 0 ? (
                        <div className="text-center py-10">
                            <span className="text-lg text-[#64748B]">No History</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {userHistory.map(createHistoryCard)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage