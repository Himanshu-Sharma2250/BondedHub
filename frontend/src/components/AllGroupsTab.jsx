import { Loader2, User, Users } from 'lucide-react'
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTeamStore } from '../store/useTeamStore'

const AllGroupsTab = () => {
    const {loading, getAllTeams, teams} = useTeamStore();

    useEffect(() => {
        function fetchTeams() {
            getAllTeams();
        }
        fetchTeams();
    }, [])

    const createGroupCards = (team) => {
        return <NavLink to={`/groups/${team?._id}`} key={team._id} className='flex flex-col justify-between gap-2 border-2 px-2 py-1 min-h-56 w-72 rounded-xs cursor-pointer'>
            <div className='flex flex-col'>
                <h1 className='text-xl'>
                    {team.name}
                </h1>

                <p>
                    {team.description}
                </p>
            </div>

            <div className='flex flex-col'>
                <div className='flex gap-1'>
                    {team.techUsed?.map((tag, i) => {
                        return <span className='px-0.5 rounded-xl bg-gray-100' key={i}>
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
                    {team.totalMembers - 1} members
                </span>

                <span>
                    {team.isDeleted ? "Not Active" : "Active"}
                </span>
            </div>
        </NavLink>
    }

    if (loading) {
        return <div className='m-auto'>
            <Loader2 className='w-5 animate-spin' />
        </div>
    }

    return (
        <div>
            {teams.length === 0 ? (
                <span className='text-2xl m-auto'>
                    No teams found
                </span>
            ) : (
                teams?.map((team) => createGroupCards(team))
            )}
        </div>
    )
}

export default AllGroupsTab
