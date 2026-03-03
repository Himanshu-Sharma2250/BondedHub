import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import GroupOverview from '../components/GroupOverview';
import GroupMembers from '../components/GroupMembers';
import GroupHistory from '../components/GroupHistory';
import ApplyToGroupModal from '../components/ApplyToGroupModal';
import { Loader2, MoveLeft } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import GroupNotes from '../components/GroupNotes';
import DeleteGroupPopUp from '../components/DeleteGroupPopUp';
import { useTeamStore } from '../store/useTeamStore';
import { useAuthStore } from '../store/useAuthStore';
import { useTeamMemberStore } from '../store/useTeamMemberStore';
import LeaveGroupModal from '../components/LeaveGroupModal';

const getAvatarColor = (name) => {
    if (!name) return '#6b7280'; // fallback gray
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 80%, 60%)`;
};

const GroupDetailPage = () => {
    const [selectedTab, setSelectedTab] = useState('Overview');
    const {teamId} = useParams()
    const {team, loading, getTeam} = useTeamStore();
    const {user} = useAuthStore();
    const {getTeamMember, member, getTeamMembers, members, isGetting} = useTeamMemberStore();

    useEffect(() => {
        if (user?._id && teamId) {
            getTeam(teamId);
            getTeamMember(teamId, user._id);
            getTeamMembers(teamId);
        }
    }, [teamId, user?._id]);

    if (loading) {
        return <div className='m-auto'>
            <Loader2 className='w-5 animate-spin' />
        </div>
    }

    return (
        <div className='pb-1 flex flex-col gap-1'>
            {/* this div contains back button */}
            <div className='flex justify-start items-center px-2 h-12'>
                <NavLink to={'/groups'} className='cursor-pointer'>
                    <MoveLeft className="w-6 text-[#64748B] hover:text-[#2A6E8C] transition-colors" />
                </NavLink>
            </div>

            {/* div 1 - shows group info like group image, name, members number and button to apply */}
            <div className='flex justify-between items-center py-2 px-3 '>
                {/* contains group info */}
                <div className='flex gap-3 items-center'>
                    <div className='flex items-center justify-center'>
                        <span className='p-4 bg-cyan-600 rounded-xs' style={{ backgroundColor: getAvatarColor(team?.name) }}>
                            {team?.name?.toUpperCase().slice(0, 1) || 'G'}
                        </span>
                    </div>

                    <div className='flex flex-col'>
                        <h1 className='text-2xl'>
                            {team?.name}
                        </h1>

                        <span>
                            {team?.totalMembers} members
                        </span>
                    </div>
                </div>

                {/* contains apply btn and dialog that pop up */}
                <div>
                    {!member && <ApplyToGroupModal teamId={teamId} />}
                    {member?.teamRole === 'MEMBER' && <LeaveGroupModal teamId={teamId} />}
                    {member?.teamRole === 'LEADER' && <DeleteGroupPopUp teamId={teamId} />}
                </div>
            </div>

            {/* div 2 - shows the btns to navigate between Group Overview - Members - Group History */}
            <div className="flex gap-5 py-2 px-2 border-b border-[#CBD5E1]">
                {['Overview', 'Members', 'Notes', 'History'].map((tab) => (
                    <span
                        key={tab}
                        className={`text-lg cursor-pointer pb-1 transition-colors ${
                            selectedTab === tab
                                ? 'text-[#2A6E8C] font-semibold border-b-2 border-[#FF7A59]'
                                : 'text-[#64748B] hover:text-[#475569]'
                        }`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab === 'History' ? 'Group History' : tab}
                    </span>
                ))}
            </div>

            {/* div 2 - shows the respective detail of above navigation btns */}
            <div className="px-2">
                {selectedTab === 'Overview' && <GroupOverview team={team} members={members} />}
                {selectedTab === 'Members' && <GroupMembers teamId={team?._id} teamRole={member?.teamRole} members={members} loading={isGetting} />}
                {selectedTab === 'Notes' && <GroupNotes teamId={team?._id} />}
                {selectedTab === 'History' && <GroupHistory teamId={team?._id} />}
            </div>
        </div>
    )
}

export default GroupDetailPage
