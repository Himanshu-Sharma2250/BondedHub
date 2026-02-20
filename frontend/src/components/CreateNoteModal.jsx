import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from "react-hot-toast";
import Button from './Button';
import { CirclePlus } from 'lucide-react';
import { useNoteStore } from '../store/useNoteStore';

const noteSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    isPrivate: z.boolean().default(false),
});

const CreateNoteModal = ({ teamId }) => {
    const dialogRef = useRef(null);
    const { createNote, isCreatingNote, getPublicNotes, getPrivateNotes } = useNoteStore();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: '',
            description: '',
            isPrivate: false, 
        },
    });

    const openModal = () => {
        dialogRef.current?.showModal();
    };

    const closeModal = () => {
        dialogRef.current?.close();
        reset(); 
    };

    const onSubmit = async (data) => {
        try {
            await createNote(data, teamId);
            await getPublicNotes(teamId);
            await getPrivateNotes(teamId);
            closeModal();
        } catch (error) {
            console.error('Failed to create note:', error);
            toast.error('Failed to create note. Please try again.');
        }
    };

    return (
        <div>
            <Button
                name={<CirclePlus className="w-10 h-10 text-[#2A6E8C]" />}
                txtColor="#000000"
                btnSize="16px"
                onClick={openModal}
            />

            <dialog
                ref={dialogRef}
                className="open:flex flex-col gap-8 w-90 px-4 py-5 rounded-sm bg-[#F8FAFC] border-t-4 border-t-[#2A6E8C] shadow-xl m-auto backdrop:bg-black/60"
            >
                <div className="w-full flex items-center justify-center">
                    <h1 className="text-2xl font-bold">Create Note</h1>
                </div>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                    {/* Title */}
                    <label className="flex flex-col items-start text-sm font-medium">
                        Title
                        <input
                            type="text"
                            className={`border-2 w-full ${
                                errors.title ? 'border-red-500' : 'border-[#CBD5E1]'
                            } focus:outline-[#2A6E8C] rounded-xs px-1 h-10`}
                            placeholder="Note's Title"
                            {...register('title')}
                        />
                        {errors.title && (
                            <span className="text-red-500 text-xs mt-1">
                                {errors.title.message}
                            </span>
                        )}
                    </label>

                    {/* Description */}
                    <label className="flex flex-col items-start text-sm font-medium">
                        Description
                        <textarea
                            className={`border-2 w-full ${
                                errors.description ? 'border-red-500' : 'border-[#CBD5E1]'
                            } focus:outline-[#2A6E8C] rounded-xs px-1 h-15`}
                            placeholder="Note's Description"
                            {...register('description')}
                        />
                        {errors.description && (
                            <span className="text-red-500 text-xs mt-1">
                                {errors.description.message}
                            </span>
                        )}
                    </label>

                    {/* Visibility - Public/Private */}
                    <div className="flex flex-col items-start gap-1 text-sm font-medium">
                        <span>Who can see this note?</span>
                        <Controller
                            name="isPrivate"
                            control={control}
                            render={({ field }) => (
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            value="false"
                                            checked={field.value === false}
                                            onChange={() => field.onChange(false)}
                                        />
                                        Public (visible to everyone)
                                    </label>
                                    <label className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            value="true"
                                            checked={field.value === true}
                                            onChange={() => field.onChange(true)}
                                        />
                                        Private (visible only to members)
                                    </label>
                                </div>
                            )}
                        />
                    </div>

                    {/* Buttons */}
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
                            name={isCreatingNote ? 'Creating...' : 'Create'}
                            bgColor="#2A6E8C"
                            btnSize="16px"
                            type="submit"
                            disabled={isCreatingNote}
                        />
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default CreateNoteModal;