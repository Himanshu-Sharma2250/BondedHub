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

const GroupDetailPage = () => {
    const [selectedTab, setSelectedTab] = useState('Overview');
    const {teamId} = useParams()
    const {team, loading, getTeam} = useTeamStore();
    const {user} = useAuthStore();
    const {getTeamMember, member, getTeamMembers, members} = useTeamMemberStore();

    useEffect(() => {
        function fetchTeam() {
            getTeam(teamId)
            getTeamMember(teamId, user._id)
            getTeamMembers(teamId)
        }
        fetchTeam();
    }, [])

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
                    <MoveLeft className='w-6' />
                </NavLink>
            </div>

            {/* div 1 - shows group info like group image, name, members number and button to apply */}
            <div className='flex justify-between items-center py-2 px-3 '>
                {/* contains group info */}
                <div className='flex gap-1 items-center'>
                    <div className='flex items-center justify-center'>
                        <span className='p-4 bg-cyan-600 rounded-xs'>
                            {team?.name?.toUpperCase().slice(0,1)}
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
                    {member?.teamRole === "MEMBER" ? (<LeaveGroupModal teamId={teamId} />) : (<DeleteGroupPopUp teamId={teamId} />)}
                    {/* <ApplyToGroupModal teamId={teamId} /> */}
                    

                    {/* if the user is group leader */}
                    {/* <Button name={'Leave Group'} bgColor={'#FF7A59'} btnSize={'16px'} /> */}
                    {/* <DeleteGroupPopUp /> */}
                </div>
            </div>

            {/* div 2 - shows the btns to navigate between Group Overview - Members - Group History */}
            <div className='flex gap-5 py-2 px-2'>
                <span 
                    className={`text-xl cursor-pointer ${selectedTab === 'Overview' ? 'text-[#2A6E8C] font-bold border-b-2 border-b-[#FF7A59]' : 'text-[#64748B] hover:text-[#475569]'}`}
                    onClick={() => setSelectedTab('Overview')}    
                >
                    Overview
                </span>

                <span 
                    className={`text-xl cursor-pointer ${selectedTab === 'Members' ? 'text-[#2A6E8C] font-bold border-b-2 border-b-[#FF7A59]' : 'text-[#64748B] hover:text-[#475569]'}`}
                    onClick={() => setSelectedTab('Members')}    
                >
                    Members
                </span>

                <span 
                    className={`text-xl cursor-pointer ${selectedTab === 'Notes' ? 'text-[#2A6E8C] font-bold border-b-2 border-b-[#FF7A59]' : 'text-[#64748B] hover:text-[#475569]'}`}
                    onClick={() => setSelectedTab('Notes')}    
                >
                    Notes
                </span>

                <span 
                    className={`text-xl cursor-pointer ${selectedTab === 'History' ? 'text-[#2A6E8C] font-bold border-b-2 border-b-[#FF7A59]' : 'text-[#64748B] hover:text-[#475569]'}`}
                    onClick={() => setSelectedTab('History')}    
                >
                    Group History
                </span>
            </div>

            {/* div 2 - shows the respective detail of above navigation btns */}
            {selectedTab === 'Overview' ? (
                <GroupOverview team={team} members={members} />
            ) : (
                selectedTab === 'Members' ? (
                    <GroupMembers members={members} />
                ) : (
                    selectedTab === 'Notes' ? (
                        <GroupNotes teamId={team?._id} />
                    ) : (
                        <GroupHistory teamId={team?._id} />
                    )
                )
            )}
        </div>
    )
}

export default GroupDetailPage
