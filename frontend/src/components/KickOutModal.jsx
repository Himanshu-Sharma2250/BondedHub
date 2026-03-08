import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useKickOut } from '../hooks/useTeamMemberQueries';
import { useUserHistoryStore } from '../store/useUserHistoryStore';
import { useTeamHistoryStore } from '../store/useTeamHistoryStore';
import Button from './Button';
import toast from 'react-hot-toast';

const KickOutModal = ({ teamId, memberId, memberName }) => {
    // Assume we need memberId and memberName passed from parent (e.g., GroupMembers)
    const kickOutMutation = useKickOut();
    const { userKickedOutOfTeam } = useUserHistoryStore();
    const { memberKickedOutHistory } = useTeamHistoryStore();

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            reason: '',
        },
    });

    const dialogRef = useRef(null);

    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => {
        dialogRef.current?.close();
        reset();
    };

    const handleKickOut = async (data) => {
        try {
            await kickOutMutation.mutateAsync({ teamId, memberId });
            await userKickedOutOfTeam({ reason: data.reason });
            await memberKickedOutHistory(teamId, {
                memberName,
                reason: data.reason,
            });
            toast.success('Member kicked out');
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to kick member');
        }
    };

    return (
        <div>
            <Button name="Kick Out" bgColor="#FF7A59" btnSize="16px" onClick={openModal} />

            <dialog
                ref={dialogRef}
                className="open:flex flex-col gap-8 w-90 px-4 py-5 rounded-sm bg-[#F8FAFC] border-t-4 border-t-[#2A6E8C] shadow-xl m-auto backdrop:bg-black/60"
            >
                <div className="w-full flex items-center justify-center">
                    <h1 className="text-2xl font-bold">Kick {memberName}?</h1>
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit(handleKickOut)}>
                    <label className="flex flex-col text-sm font-medium">
                        <input
                            type="text"
                            className="border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-10"
                            placeholder="Reason for kicking"
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
                            name={kickOutMutation.isPending ? 'Kicking...' : 'Kick Out'}
                            bgColor="#FF7A59"
                            btnSize="16px"
                            type="submit"
                            disabled={kickOutMutation.isPending}
                        />
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default KickOutModal;