import { useRef } from 'react';
import Button from './Button';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useCreateTeam } from '../hooks/useTeamQueries';
import { useCreateOwner } from '../hooks/useTeamMemberQueries';
import { useAuthStore } from '../store/useAuthStore';
import { useTeamCreateHistory } from '../hooks/useTeamHistoryQueries';
import { useUserCreateTeam } from '../hooks/useUserHistoryQueries';
import toast from 'react-hot-toast';

const createTeamSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().trim().min(1, 'Description is required'),
    totalMembers: z.coerce.number().min(1, 'At least 1 member required'),
    techUsed: z.string().trim(),
});

const CreateGroupModal = () => {
    const { register, handleSubmit, reset } = useForm({
        resolver: zodResolver(createTeamSchema),
    });
    const createTeamMutation = useCreateTeam();
    const createOwnerMutation = useCreateOwner();
    const createTeamHistoryMutation = useTeamCreateHistory();
    const userCreateTeamMutation = useUserCreateTeam();
    const { user } = useAuthStore();

    const dialogRef = useRef(null);

    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => {
        dialogRef.current?.close();
        reset();
    };

    const onCreateTeam = async (data) => {
        try {
            const techArray = data.techUsed.split(',').map((t) => t.trim()).filter(Boolean);
            const teamData = { ...data, techUsed: techArray };

            const result = await createTeamMutation.mutateAsync(teamData);
            const newTeam = result.data.team;

            if (newTeam?._id) {
                await createOwnerMutation.mutateAsync({
                    teamId: newTeam._id,
                    data: {
                        name: user?.name,
                        email: user?.email,
                        reasonToJoin: 'Team creator',
                    },
                });
                await createTeamHistoryMutation.mutateAsync({ teamId: newTeam._id });
                await userCreateTeamMutation.mutateAsync();
                toast.success('Group created successfully!');
                closeModal();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create group');
        }
    };

    const isPending =
        createTeamMutation.isPending ||
        createOwnerMutation.isPending ||
        createTeamHistoryMutation.isPending ||
        userCreateTeamMutation.isPending;

    return (
        <div>
            <Button name="Create Group" bgColor="#2A6E8C" btnSize="16px" onClick={openModal} />

            <dialog
                ref={dialogRef}
                className="open:flex flex-col gap-8 w-90 px-4 py-5 rounded-sm bg-[#F8FAFC] border-t-4 border-t-[#2A6E8C] shadow-xl m-auto backdrop:bg-black/60"
            >
                <div className="w-full flex items-center justify-center">
                    <h1 className="text-2xl font-bold">Create Group</h1>
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit(onCreateTeam)}>
                    <label className="flex flex-col text-sm font-medium">
                        Name
                        <input
                            type="text"
                            className="border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10"
                            placeholder="Group's Name"
                            {...register('name')}
                        />
                    </label>

                    <label className="flex flex-col text-sm font-medium">
                        Description
                        <input
                            type="text"
                            className="border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10"
                            placeholder="Group's Description"
                            {...register('description')}
                        />
                    </label>

                    <label className="flex flex-col text-sm font-medium">
                        Total Members
                        <input
                            type="number"
                            className="border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10"
                            placeholder="0"
                            {...register('totalMembers')}
                        />
                    </label>

                    <label className="flex flex-col text-sm font-medium">
                        Tech Stack Using (comma separated)
                        <input
                            type="text"
                            className="border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10"
                            placeholder="React, Node, MongoDB"
                            {...register('techUsed')}
                        />
                    </label>

                    <div className="flex gap-2 justify-center items-center w-full mt-5">
                        <Button
                            name="Cancel"
                            txtColor="#64748B"
                            bgColor="transparent"
                            btnSize="16px"
                            type="button"
                            onClick={closeModal}
                        />
                        <Button
                            name={isPending ? <Loader2 className="w-4 animate-spin" /> : 'Create'}
                            bgColor="#2A6E8C"
                            btnSize="16px"
                            type="submit"
                            disabled={isPending}
                        />
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default CreateGroupModal;