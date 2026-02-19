import { NavLink } from 'react-router-dom';
import Searchbar from '../components/Searchbar'
import { User, Users } from 'lucide-react'
import CreateGroupModal from '../components/CreateGroupModal'
import { useState } from 'react';
import AllGroupsTab from '../components/AllGroupsTab';
import MyGroupTab from '../components/MyGroupTab';

const Groups = () => {
    const [selectedTab, setSelectedTab] = useState('All Groups');

    return (
        <div className='flex flex-col gap-1'>
            {/* header */}
            <div className='flex justify-between items-center pb-1'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-3xl font-bold'>
                        Groups
                    </h1>

                    <p>
                        Full view of your groups and other groups.
                    </p>
                </div>

                <div>
                    {/* for the create group button to open a dialog */}
                    <CreateGroupModal />
                </div>
            </div>

            <Searchbar />

            {/* tab - seperate my group and all groups */}
            <div className='flex gap-5 mt-3'>
                <span 
                    className={`cursor-pointer ${selectedTab === 'All Groups' ? 'text-[#2A6E8C] font-bold' : 'text-[#64748B] hover:text-[#475569]'}`}
                    onClick={() => setSelectedTab("All Groups")}
                >
                    All Groups
                </span>

                <span 
                    className={`cursor-pointer ${selectedTab === 'My Group' ? 'text-[#2A6E8C] font-bold' : 'text-[#64748B] hover:text-[#475569]'}`}
                    onClick={() => setSelectedTab("My Group")}
                >
                    My Group
                </span>
            </div>

            {/* announcement hero */}
            <main className='flex flex-wrap w-full py-1 gap-3'>
                {selectedTab === "My Group" ? (
                    <MyGroupTab />
                ) : (
                    <AllGroupsTab />
                )}
            </main>
        </div>
    )
}

export default Groups
