import { useRef } from 'react';
import Button from './Button';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useApplyApplication } from '../hooks/useApplicationQueries';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const applySchema = z.object({
    reasonToJoin: z.string().trim().min(1, 'Reason is required'),
});

const ApplyToGroupModal = ({ teamId }) => {
    const { register, handleSubmit, reset } = useForm({
        resolver: zodResolver(applySchema),
    });
    const applyMutation = useApplyApplication();
    const { user } = useAuthStore();

    const dialogRef = useRef(null);

    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => {
        dialogRef.current?.close();
        reset();
    };

    const onApplyToJoin = async (data) => {
        try {
            await applyMutation.mutateAsync({
                teamId,
                data: {
                    name: user.name,
                    email: user.email,
                    reasonToJoin: data.reasonToJoin,
                },
            });
            toast.success('Application submitted');
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply');
        }
    };

    return (
        <div>
            <Button name="Apply" bgColor="#2A6E8C" btnSize="16px" onClick={openModal} />

            <dialog
                ref={dialogRef}
                className="open:flex flex-col gap-8 w-90 px-4 py-5 rounded-sm bg-[#F8FAFC] border-t-4 border-t-[#2A6E8C] shadow-xl m-auto backdrop:bg-black/60"
            >
                <div className="w-full flex items-center justify-center">
                    <h1 className="text-2xl font-bold">Want to join?</h1>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onApplyToJoin)}>
                    <label className="flex flex-col text-sm font-medium">
                        Why should we add you to our team?
                        <textarea
                            className="border-2 border-[#CBD5E1] focus:outline-[#2A6E8C] rounded-xs px-1 h-15"
                            placeholder="Give us reason"
                            {...register('reasonToJoin')}
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
                            name={applyMutation.isPending ? <Loader2 className="w-4 animate-spin" /> : 'Apply'}
                            bgColor="#2A6E8C"
                            btnSize="16px"
                            type="submit"
                            disabled={applyMutation.isPending}
                        />
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default ApplyToGroupModal;