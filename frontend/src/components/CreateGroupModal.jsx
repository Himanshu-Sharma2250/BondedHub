import { useRef } from 'react';
import Button from './Button';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useCreateTeam } from '../hooks/useTeamQueries';
import { useCreateOwner } from '../hooks/useTeamMemberQueries';
import { useProfile } from '../hooks/useAuthQueries';
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
    const { data: user } = useProfile();

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
            <div onClick={openModal} className="cursor-pointer">
                <div className="hidden lg:block">
                    <Button name="Create Group" variant="primary" size="md" />
                </div>
                <div className="lg:hidden">
                    <button className="btn btn-square btn-primary relative group">
                        <Plus className="w-5 h-5" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-base-800 text-base-content text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Create Group
                        </span>
                    </button>
                </div>
            </div>

            <dialog ref={dialogRef} className="modal">
                <div className="modal-box bg-base-100">
                    <h3 className="font-bold text-lg text-center text-base-content">Create Group</h3>
                    <form onSubmit={handleSubmit(onCreateTeam)} className="py-4 flex flex-col gap-3">
                        <label className="form-control w-full">
                            <span className="label-text text-base-content/80">Name</span>
                            <input
                                type="text"
                                className="input input-bordered w-full bg-base-100"
                                placeholder="Group's Name"
                                {...register('name')}
                            />
                        </label>
                        <label className="form-control w-full mt-2">
                            <span className="label-text text-base-content/80">Description</span>
                            <input
                                type="text"
                                className="input input-bordered w-full bg-base-100"
                                placeholder="Group's Description"
                                {...register('description')}
                            />
                        </label>
                        <label className="form-control w-full mt-2">
                            <span className="label-text text-base-content/80">Total Members</span>
                            <input
                                type="number"
                                className="input input-bordered w-full bg-base-100"
                                placeholder="0"
                                {...register('totalMembers')}
                            />
                        </label>
                        <label className="form-control w-full mt-2">
                            <span className="label-text text-base-content/80">Tech Stack (comma separated)</span>
                            <input
                                type="text"
                                className="input input-bordered w-full bg-base-100"
                                placeholder="React, Node, MongoDB"
                                {...register('techUsed')}
                            />
                        </label>
                        <div className="modal-action flex gap-2 justify-center mt-6">
                            <Button
                                name="Cancel"
                                variant="ghost"
                                size="md"
                                type="button"
                                onClick={closeModal}
                            />
                            <Button
                                name={isPending ? <Loader2 className="w-4 animate-spin" /> : 'Create'}
                                variant="primary"
                                size="md"
                                type="submit"
                                disabled={isPending}
                            />
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={closeModal}>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default CreateGroupModal;