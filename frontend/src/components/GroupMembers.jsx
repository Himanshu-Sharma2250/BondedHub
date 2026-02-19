import { NavLink } from 'react-router-dom';
import Button from './Button'
import { useTeamMemberStore } from '../store/useTeamMemberStore';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const GroupMembers = ({members}) => {
    const teamLeader = members?.find((member) => member.teamRole === "LEADER")
    const teamMembers = members?.filter((member) => member.teamRole === "MEMBER")

    const createLeaderCard = () => {
        return <div className='flex items-center justify-between mx-2 px-2 py-1 border-2 rounded-xs' key={teamLeader?._id}>
            {/* leader's profile, name and email */}
            <div className='flex gap-2 items-center'>
                {/* leader's profile */}
                <div>
                    <span className='p-3 rounded-xs bg-amber-500'>
                        {teamLeader?.name?.toUpperCase().slice(0,1) || "L"}
                    </span>
                </div>
                        
                {/* leader's name and email */}
                <div className='flex flex-col'>
                    <span className='text-xl'>
                        {teamLeader?.name || "leader name"}
                    </span>

                    <span>
                        {teamLeader?.email || "leader email"}
                    </span>
                </div>
            </div>

            {/* Leader tag */}
            <span className='px-1 text-[#FF7A59]'>
                Leader
            </span>
        </div>
    }

    const createMemberCards = (member) => {
        return <div className='flex items-center justify-between px-2 mx-2 border-2 py-1 rounded-xs' key={member?._id}>
            {/* Member's profile, name and email */}
            <div className='flex gap-2 items-center'>
                {/* member's profile */}
                <div>
                    <span className='p-3 rounded-xs bg-amber-500'>
                        {member?.name.toUpperCase().slice(0,1) || "M"}
                    </span>
                </div>
                        
                {/* leader's name and email */}
                <div className='flex flex-col'>
                    <span className='text-xl'>
                        {member?.name || "Member Name"}
                    </span>

                    <span>
                        {member?.email || "Member email"}
                    </span>
                </div>
            </div>

            {/* view profile btn */}
            <div>
                <NavLink to={`/user/${member?.userId}`}>
                    <Button name={'View Profile'} btnSize={'16px'} bgColor={'#2A6E8C'} />
                </NavLink>
            </div>
        </div>
    }

    return (
        <div className='px-2 flex flex-col gap-2 border-2 py-2 pb-3 rounded-xs'>
            {/* div 1 - show Group Leader */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>
                    Group Leader
                </h1>

                
                {createLeaderCard()}
            </div>

            {/* div 2 - shows Group Members */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>
                    Members {members?.length-1}
                </h1>

                {members.length === 1 ? (
                    <span>
                        No members joined
                    </span>
                ) : (teamMembers.map((member) => createMemberCards(member)))}
            </div>
        </div>
    )
}

export default GroupMembers
