import { NavLink } from 'react-router-dom';
import { useRef } from 'react';
import { User, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ProfileOptionModal = ({isCollapsed}) => {
    const dialogRef = useRef(null);
    const {user, logout} = useAuthStore();
    
    const openModal = () => {
        dialogRef.current?.showModal();
    };
    
    const closeModal = () => {
        dialogRef.current?.close();
    };

    const onLogout = () => {
        try {
            logout();
            toast.success("Logout successfull")
        } catch (error) {
            toast.error("Error in logout")
        }
    }

    return (
        <div className='relative'>
            <button className={`w-full flex gap-2 items-center transition-all duration-200 active:scale-95 hover:opacity-90 cursor-pointer py-1 ${isCollapsed ? '' : 'pr-42'}`} onClick={openModal}>
                <User className={`w-5`}/>
                {!isCollapsed && <span className='text-[17px]'>{user.name}</span>}
            </button>

            <dialog 
                ref={dialogRef} 
                className='open:flex flex-col gap-2 min-w-48 p-2 rounded-sm absolute -bottom-101 -left-330 bg-[#F8FAFC] shadow-xl m-auto backdrop:bg-black/60'
            >
                <span className='flex justify-between items-start relative'>
                    <span className='hover:bg-gray-300 px-2 flex flex-col w-full'>
                        Signed in as 
                        <span className='font-bold'>
                            {user.email}
                        </span>
                    </span>
                    
                    <button onClick={closeModal} className='text-xl cursor-pointer absolute right-0 -top-1 px-1'>
                        x
                    </button>
                </span>

                <NavLink to={'/profile'} onClick={closeModal} className='hover:bg-gray-300 px-2'>
                    My Profile
                </NavLink>

                <span className='hover:bg-gray-300 px-2 flex justify-between' onClick={closeModal}>
                    Toggle theme
                    <Moon className='w-4' />
                </span>

                <span className='hover:bg-red-300 px-2' onClick={onLogout}>
                    Log Out
                </span>
            </dialog>
        </div>
    )
}

export default ProfileOptionModal
