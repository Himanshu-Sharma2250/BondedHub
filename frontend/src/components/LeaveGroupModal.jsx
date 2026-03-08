import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTeamLeft } from '../hooks/useTeamMemberQueries';
import { useTeamHistoryStore } from '../store/useTeamHistoryStore';
import { useUserHistoryStore } from '../store/useUserHistoryStore';
import { useAuthStore } from '../store/useAuthStore';
import Button from './Button';
import toast from 'react-hot-toast';

const LeaveGroupModal = ({ teamId }) => {
    const teamLeftMutation = useTeamLeft();
    const { memberLeftHistory } = useTeamHistoryStore();
    const { userLeftTeam } = useUserHistoryStore();
    const { user } = useAuthStore();

    const { register, handleSubmit, reset } = useForm({
        defaultValues: { reason: '' },
    });

    const dialogRef = useRef(null);

    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => {
        dialogRef.current?.close();
        reset();
    };

    const handleLeft = async (data) => {
        try {
            await teamLeftMutation.mutateAsync({ teamId, userId: user._id });
            await memberLeftHistory(teamId, { reason: data.reason, memberName: user?.fullName });
            await userLeftTeam({ reason: data.reason });
            toast.success('You left the team');
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to leave team');
        }
    };

    return (
        <div>
            <Button name="Leave Group" bgColor="#FF7A59" btnSize="16px" onClick={openModal} />

            <dialog
                ref={dialogRef}
                className="open:flex flex-col gap-8 w-90 px-4 py-5 rounded-sm bg-[#F8FAFC] border-t-4 border-t-[#2A6E8C] shadow-xl m-auto backdrop:bg-black/60"
            >
                <div className="w-full flex items-center justify-center">
                    <h1 className="text-2xl font-bold">
                        Are you sure?
                        <span className="font-light text-gray-300 text-xs block">
                            (If you leave, you cannot join the same team again)
                        </span>
                    </h1>
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit(handleLeft)}>
                    <label className="flex flex-col text-sm font-medium">
                        <input
                            type="text"
                            className="border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10"
                            placeholder="Enter Group's Name to leave"
                            required
                        />
                    </label>

                    <label className="flex flex-col text-sm font-medium">
                        <input
                            type="text"
                            className="border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10"
                            placeholder="Reason to leave"
                            required
                            {...register('reason')}
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
                            name={teamLeftMutation.isPending ? 'Leaving...' : 'Leave'}
                            bgColor="#FF7A59"
                            btnSize="16px"
                            type="submit"
                            disabled={teamLeftMutation.isPending}
                        />
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default LeaveGroupModal;