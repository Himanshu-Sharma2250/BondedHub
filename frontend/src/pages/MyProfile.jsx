import React, { useEffect } from 'react'
import EditProfileModal from '../components/EditProfileModal'
import { useAuthStore } from '../store/useAuthStore'

const MyProfile = () => {
    const {loading, profile, user} = useAuthStore();

    useEffect(() => {
        async function getProfile() {
            await profile();
        }
        getProfile();
    }, [])


    console.log("user is ", user)

    const createHistories = () => {
        return <div className='flex items-center justify-between px-2 py-1 shadow-gray-800 shadow-xs rounded-xs'>
            {/* history's title and reason */}
            <div className='flex gap-2 items-center'>
                <span className='text-4xl text-fuchsia-700'>
                    •
                </span>

                <div className='flex flex-col'>
                    <span className='font-bold'>
                        History Title
                    </span>

                    <span className='text-sm text-gray-700'>
                        History Reason
                    </span>
                </div>
            </div>

            <div>
                <span className='text-sm text-gray-700'>
                    [date - time]
                </span>
            </div>
        </div>
    }

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
                <div className='flex gap-2 items-center'>
                    {/* user profile image */}
                    <div className='flex items-center'>
                        <span className='p-5 bg-cyan-800'>
                            {user?.fullName?.toUpperCase().slice(0,1)}
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

                            <span className='w-145'>
                                {user.website || "NA"}
                            </span>
                        </div>
                    </div>

                    {/* shows linkedln and github */}
                    <div className='flex items-center'>
                        {/* linkedln */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Linkedin
                            </span>

                            <span className='w-145'>
                                {user.linkedln || "NA"}
                            </span>
                        </div>

                        {/* github */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Github
                            </span>

                            <span className='w-145'>
                                {user.github || "NA"}
                            </span>
                        </div>
                    </div>

                    {/* shows twitter and hashnode */}
                    <div className='flex items-center'>
                        {/* twitter */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Twitter/X
                            </span>

                            <span className='w-145'>
                                {user.twitter || "NA"}
                            </span>
                        </div>

                        {/* hashnode */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                hashnode
                            </span>

                            <span className='w-145'>
                                {user.hashnode || "NA"}
                            </span>
                        </div>
                    </div>

                    {/* shows medium and leetcode */}
                    <div className='flex items-center'>
                        {/* medium */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Medium
                            </span>

                            <span className='w-145'>
                                {user.medium || "NA"}
                            </span>
                        </div>

                        {/* leetcode */}
                        <div className='flex flex-col gap-1'>
                            <span className='text-xs text-gray-600 w-145'>
                                Leetcode
                            </span>

                            <span className='w-145'>
                                {user.leetcode || "NA"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* user history */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>
                    User History
                </h1>

                <div className='flex flex-col px-5 py-4 gap-2  shadow rounded-xs border-gray-600'>
                    {createHistories()}
                </div>
            </div>
        </div>
    )
}

export default MyProfile
