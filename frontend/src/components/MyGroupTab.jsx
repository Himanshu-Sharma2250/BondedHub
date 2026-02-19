import { Loader2, User, Users } from 'lucide-react'
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTeamStore } from '../store/useTeamStore'

const MyGroupTab = () => {
    const {loading, team, myTeam} = useTeamStore();

    useEffect(() => {
        function fetchMyTeam() {
            myTeam();
        }
        fetchMyTeam()
    }, [])

    if (loading) {
        return <div className='m-auto'>
            <Loader2 className='w-5 animate-spin' />
        </div>
    }
    console.log("my team: ", team)

    const createTeamCard = () => {
        return <NavLink to={`/groups/${team?._id}`} className='flex flex-col justify-between gap-2 border-2 px-2 py-1 min-h-56 w-72 rounded-xs cursor-pointer'>
            <div className='flex flex-col'>
                <h1 className='text-xl'>
                    {team?.name}
                </h1>

                <p>
                    {team?.description}
                </p>
            </div>

            <div className='flex flex-col'>
                <div className='flex gap-1'>
                    {team?.techUsed?.map((tag, index) => {
                        return <span className='px-0.5 rounded-xl bg-gray-100' key={index}>
                            {tag}
                        </span>
                    })}
                </div>

                <span className='flex gap-1 items-center'>
                    <User className='w-3.5'/>
                    Team Leader
                </span>

                <span className='flex gap-1 items-center'>
                    <Users className='w-3.5' />
                    {team?.totalMembers - 1} members
                </span>

                <span>
                    {team?.isDeleted ? "Not Active" : "Active"}
                </span>
            </div>
        </NavLink>
    }

    return (
        <div>
            {team?._id ? (createTeamCard()) : (
                <span className='text-2xl m-auto'>
                    No team found
                </span>
            )}
        </div>
    )
}

export default MyGroupTab
