import { Loader2, Users } from 'lucide-react'
import React from 'react'
import Button from './Button'
import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { useApplicationStore } from '../store/useApplicationStore'
import { useAuthStore } from '../store/useAuthStore'
import toast from 'react-hot-toast'
import { useTeamMemberStore } from '../store/useTeamMemberStore'

const ReceivedApplications = () => {
    const {getAllReceivedApplications, isGetting, receivedApplications, acceptApplication, rejectApplication, isAccepting, isRejecting} = useApplicationStore();
    const {user} = useAuthStore();
    const {teamJoin} = useTeamMemberStore();

    useEffect(() => {
        function fetchApplications() {
            getAllReceivedApplications();
        }
        fetchApplications();
    }, [])
        
    if (isGetting) {
        return <div className='m-auto'>
            <Loader2 className='w-5 animate-spin' />
        </div>
    }

    const onAcceptApplication = (application) => {
        try {
            acceptApplication(application?._id)
            toast.success("Application accepted")
            teamJoin(application?.teamId, {name: application?.name, email: application?.email, reasonToJoin: application?.reasonToJoin})
        } catch (error) {
            toast.success("Application accept failed")
        }
    }

    const onRejectApplication = (applicationId) => {
        try {
            rejectApplication(applicationId);
            toast.success("Application rejeced");
        } catch (error) {
            toast.error("Application rejected failed")
        }
    }

    console.log("received app: ", receivedApplications)

    const createApplicationCards = (application) => {
        return <div className='flex flex-col px-2 py-2 border-2 w-full gap-3 justify-between'>
            {/* div 1 - contains user name and email and if applications is pending or rejected or approved */}
            <div className='flex items-center justify-between'>
                {/* contains user profile and name and email */}
                <div className='flex items-center gap-3'>
                    {/* profile photo */}
                    <div>
                        <span className='border-2 rounded-xs p-2'>
                            {application?.name.toUpperCase().slice(0,1)}
                        </span>
                    </div>

                    {/* user name and email */}
                    <div className='flex flex-col'>
                        <h1 className='text-xl'>
                            {application?.name}
                        </h1>

                        <span className='text-[11px]'>
                            {application?.email}
                        </span>
                    </div>
                </div>

                {/* contains if applications pending or rejected or approved */}
                <div>
                    <NavLink to={'/user/user-id'}>
                        <Button name={'View Profile'} bgColor={'#2A6E8C'} btnSize={'16px'} />
                    </NavLink>
                </div>
            </div>

            {/* div 2 - contains groups name and reason to join and application date and time */}
            <div className='flex flex-col'>
                {/* contains group name */}
                <span className='flex gap-1 items-center'>
                    <Users className='w-4.5'/>

                    <span className='font-bold text-[1.1rem]'>
                        Group: 
                    </span>

                    <span>
                        Group Name
                    </span>
                </span>

                {/* contains reason */}
                <span className='flex gap-1 items-center'>
                    <span className='font-bold text-[1.1rem]'>
                        Reason: 
                    </span>

                    <span>
                        {application?.reasonToJoin}
                    </span>
                </span>

                {/* contains application date and time */}
                <span className=' font-extralight text-[12px] text-gray-800'>
                    Applied on: {application?.appliedAt}
                </span>
            </div>

            {/* div 3 - contains withdraw button */}
            <div className='flex gap-3'>
                <Button 
                    name={isAccepting ? (<Loader2 className='w-4 animate-spin' />) : ("Accept")}
                    bgColor="#FF7A59" 
                    btnSize="15px" 
                    onClick={() => onAcceptApplication(application)} 
                />
                <Button 
                    name={isRejecting ? (<Loader2 className='w-4 animate-spin' />) : ("Reject")}
                    bgColor="#FF7A59" 
                    btnSize="15px" 
                    onClick={() => onRejectApplication(application?._id)} 
                />
            </div>
        </div>
    }

    return (
        <div>
            {receivedApplications.length == 0 ? (
                <span>
                    No application received
                </span>
            ) : (
                receivedApplications.map((application) => createApplicationCards(application))
            )}
        </div>
    )
}

export default ReceivedApplications
