import React, { useRef } from 'react'
import Button from './Button';
import { useTeamMemberStore } from '../store/useTeamMemberStore';
import { useTeamStore } from '../store/useTeamStore';
import { useTeamHistoryStore } from '../store/useTeamHistoryStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useUserHistoryStore } from '../store/useUserHistoryStore';

const DeleteGroupPopUp = ({teamId}) => {
    const {deleteTeam} = useTeamStore();
    const {teamDeleteHistory} = useTeamHistoryStore();
    const {userDeletedTeam} = useUserHistoryStore();

    const {register, handleSubmit} = useForm();

    const dialogRef = useRef(null);

    const openModal = () => {
        dialogRef.current?.showModal();
    };

    const closeModal = () => {
        dialogRef.current?.close();
    };

    const handleDelete = async (data) => {
        try {
            await deleteTeam(teamId);
            await teamDeleteHistory(teamId, data);
            await userDeletedTeam({reason: data.reason});
            toast.success("Team Deleted");
        } catch (error) {
            toast.error("Error deleting Team");
        } finally {
            closeModal();
        }
    }

    return (
        <div>
            <Button name={'Delete Group'} bgColor={'#FF7A59'} btnSize={'16px'} onClick={openModal} />

            <dialog 
                ref={dialogRef} 
                className='open:flex flex-col gap-8 w-90 px-4 py-5 rounded-sm bg-[#F8FAFC] border-t-4 border-t-[#2A6E8C] shadow-xl m-auto backdrop:bg-black/60'
            >
                <div className='w-full flex items-center justify-center'>
                    <h1 className='text-2xl font-bold'>
                        Are you sure?
                    </h1>
                </div>

                <form 
                    className='flex flex-col gap-3' 
                    onSubmit={handleSubmit(handleDelete)}
                >
                    <label className='flex flex-col text-sm font-medium'>
                        <input 
                            type="text" 
                            className='border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10' 
                            placeholder="Enter Group's Name to delete" 
                            required
                        />
                    </label>
                    
                    <label className='flex flex-col text-sm font-medium'>
                        <input 
                            type="text" 
                            className='border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10' 
                            placeholder="Reason to delete team"
                            required 
                            {...register("reason")}
                        />
                    </label>

                    <div className='flex gap-2 justify-center items-center w-full mt-5'>
                        <Button 
                            name='Cancel' 
                            txtColor='#64748B' 
                            bgColor={'transparent'}
                            btnSize='16px' 
                            type="button" 
                            onClick={closeModal} 
                        />
                        <Button 
                            name='Delete' 
                            bgColor='#FF7A59' 
                            btnSize='16px' 
                            type="submit" 
                        />
                    </div>
                </form>
            </dialog>
        </div>
    )
}

export default DeleteGroupPopUp
