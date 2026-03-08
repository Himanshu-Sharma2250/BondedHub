import { LayoutDashboard, Users, Mail, MoveLeft } from 'lucide-react'
import { NavLink } from 'react-router-dom';
import ProfileOptionModal from './ProfileOptionModal';

const SideMenu = ({isCollapsed, setIsCollapsed}) => {
    const linkStyle = ({ isActive }) => 
        `flex ${isCollapsed ? 'justify-center' : 'justify-start'} gap-2 px-3 items-center h-14 cursor-pointer transition-colors duration-200 ${
            isActive ? 'bg-[#2A6E8C] text-[#F8FAFC]' : 'text-[#000000] hover:bg-[#E9F1F5] hover:text-[#2A6E8C]'
        }`;

    return (
        <div className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-[4%]' : 'w-[20%]'} border-r-2 bg-[#F8FAFC] transition-all duration-300 z-50`}>
            {/* div 1 - Logo */}
            <div className='h-[10%] w-full flex items-center justify-center border-b-2'>
                <h1 className='text-[26px] font-bold'>
                    {isCollapsed ? 'B' : 'Bonded'}
                </h1>
            </div>

            {/* div 2 - Menu */}
            <div className='h-[80%] w-full flex flex-col py-2 px-2'>
                <NavLink to="/dashboard" className={linkStyle}>
                    <LayoutDashboard className='w-5' />
                    {!isCollapsed && <h1 className='text-2xl'>Dashboard</h1>}
                </NavLink>

                {/* <NavLink to="/announcements" className={linkStyle}>
                    <Megaphone className='w-5' />
                    {!isCollapsed && <h1 className='text-2xl'>Announcements</h1>}
                </NavLink> */}
                
                <NavLink to="/groups" className={linkStyle}>
                    <Users className='w-5' />
                    {!isCollapsed && <h1 className='text-2xl'>Groups</h1>}
                </NavLink>
                
                <NavLink to="/applications" className={linkStyle}>
                    <Mail className='w-5' />
                    {!isCollapsed && <h1 className='text-2xl'>Applications</h1>}
                </NavLink>
            </div>

            {/* div 3 - Profile */}
            <div className='h-[10%] w-full flex justify-between items-center px-2 border-t-2 relative'>
                <div 
                    className={`flex ${isCollapsed ? 'justify-center' : 'justify-start w-full'} rounded-xs items-center border-2 px-3 py-1.5 cursor-pointer relative`}
                >
                    <ProfileOptionModal isCollapsed={isCollapsed} />
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className='border-2 px-1 py-1 rounded-xs cursor-pointer absolute -right-4.5 bg-[#F8FAFC] z-50'
                >
                    <MoveLeft className={`w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </div>
    )
}

export default SideMenu