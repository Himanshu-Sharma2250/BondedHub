import React, { useRef } from 'react'
import Button from './Button'
import { useForm } from 'react-hook-form';
import { useTeamStore } from '../store/useTeamStore';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTeamMemberStore } from '../store/useTeamMemberStore';
import { useAuthStore } from '../store/useAuthStore';

const createTeamSchema = z.object({
    name: z.string().trim(),
    description: z.string().trim(),
    totalMembers: z.coerce.number(),
    techUsed: z.string().trim()
})

const CreateGroupModal = () => {
    const {register, handleSubmit} = useForm({
        resolver: zodResolver(createTeamSchema)
    })

    const {createTeam, loading, team} = useTeamStore();
    const {createTeamOwner} = useTeamMemberStore();
    const {user} = useAuthStore();

    // reference to the dialog element
    const dialogRef = useRef(null);

    const openModal = () => {
        dialogRef.current?.showModal();
    };

    const closeModal = () => {
        dialogRef.current?.close();
    };

    const onCreateTeam = async (data) => {
        createTeam(data);
        console.log(data)
        createTeamOwner(team._id, {name: user?.name, email: user?.email})
    }

    return (
        <div>
            <Button 
                name='Create Group' 
                bgColor='#2A6E8C' 
                btnSize='16px' 
                onClick={openModal}
            />

            {/* IMPORTANT: Use 'open:flex' so it only becomes flex when open.
               The backdrop: class styles the dimmed background behind the modal.
            */}
            <dialog 
                ref={dialogRef} 
                className='open:flex flex-col gap-8 w-90 px-4 py-5 rounded-sm bg-[#F8FAFC] border-t-4 border-t-[#2A6E8C] shadow-xl m-auto backdrop:bg-black/60'
            >
                <div className='w-full flex items-center justify-center'>
                    <h1 className='text-2xl font-bold'>Create Group</h1>
                </div>

                <form 
                    className='flex flex-col gap-3' 
                    onSubmit={handleSubmit(onCreateTeam)}
                >
                    <label className='flex flex-col text-sm font-medium'>
                        Name
                        <input 
                            type="text" 
                            className='border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10' 
                            placeholder="Group's Name" 
                            {...register("name")}
                        />
                    </label>
                    
                    <label className='flex flex-col text-sm font-medium'>
                        Description
                        <input 
                            type="text" 
                            className='border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10' 
                            placeholder="Group's Description" 
                            {...register("description")}
                        />
                    </label>

                    <label className='flex flex-col text-sm font-medium'>
                        Total Members
                        <input 
                            type="number" 
                            className='border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10' 
                            placeholder="0" 
                            {...register("totalMembers")}
                            required
                        />
                    </label>

                    <label className='flex flex-col text-sm font-medium'>
                        Tech Stack Using
                        <input 
                            type="text" 
                            className='border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10' 
                            placeholder="Group's Tech Stack" 
                            {...register("techUsed")}
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
                            name={loading ? (<Loader2 className='w-4 animate-spin' />) : ("Create")}
                            bgColor='#2A6E8C' 
                            btnSize='16px' 
                            type="submit" 
                        />
                    </div>
                </form>
            </dialog>
        </div>
    )
}

export default CreateGroupModal