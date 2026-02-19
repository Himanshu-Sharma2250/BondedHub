import React, { useState } from 'react'

const GroupOverview = ({team, members}) => {
    const [teamLeader, setTeamLeader] = useState(null)
    const leader = members.find((member) => member?.teamRole === 'LEADER')


    return (
        <div className='border-2 px-2 flex flex-col gap-5 rounded-xs py-3'>
            {/* div 1 - about group's creation (reason) */}
            <div className='flex flex-col'>
                <h1 className='text-2xl font-bold'>
                    About
                </h1>

                <p>
                    {team?.description}
                </p>
            </div>

            {/* div 2 - about the category (tags) */}
            <div className='flex flex-col'>
                <h1 className='text-2xl font-bold'>
                    Categories
                </h1>

                <div className='flex gap-2'>
                    {team?.techUsed.map((tag) => {
                        return <span className='px-1 rounded-xs bg-blue-300' key={tag}>
                            {tag}
                        </span>
                    })}
                </div>
            </div>

            {/* div 3 - about group details (members) */}
            <div className='flex flex-col gap-1'>
                <h1 className='text-2xl font-bold'>
                    Details
                </h1>

                <div className='flex flex-col gap-0 border-2 rounded-xs'>
                    {/* Group's Leader */}
                    <div className='flex justify-between px-2 '>
                        <span>
                            Leader
                        </span>

                        <span>
                            {leader?.name || "Loading..."}
                        </span>
                    </div>

                    {/* Total members */}
                    <div className='flex justify-between px-2 '>
                        <span>
                            Total Members
                        </span>

                        <span>
                            {team?.totalMembers-1}
                        </span>
                    </div>

                    {/* Last updated */}
                    <div className='flex justify-between px-2 '>
                        <span>
                            Last Updated
                        </span>

                        <span>
                            {team?.updatedAt || "data not loaded"}
                        </span>
                    </div>

                    {/* Group Id */}
                    <div className='flex justify-between px-2 '>
                        <span>
                            Group Id
                        </span>

                        <span>
                            {team?._id}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupOverview
