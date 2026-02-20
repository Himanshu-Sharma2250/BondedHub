import { useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from './Button';
import { useNoteStore } from '../store/useNoteStore';

const editNoteSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    isPrivate: z.boolean(),
});

const EditNoteModal = ({ note, teamId, onClose }) => {
    const dialogRef = useRef(null);
    const { editNote, isEditingNote, getPublicNotes, getPrivateNotes } = useNoteStore();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(editNoteSchema),
        defaultValues: {
            title: note.title,
            description: note.description,
            isPrivate: note.isPrivate,
        },
    });

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    const onSubmit = async (data) => {
        await editNote(data, note._id);
        await getPublicNotes(teamId);
        await getPrivateNotes(teamId);
        onClose();
    };

    const handleClose = () => {
        dialogRef.current?.close();
        onClose();
    };

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="open:flex flex-col gap-8 w-90 px-4 py-5 rounded-sm bg-[#F8FAFC] border-t-4 border-t-[#2A6E8C] shadow-xl m-auto backdrop:bg-black/60"
        >
            <div className="w-full flex items-center justify-center">
                <h1 className="text-2xl font-bold">Edit Note</h1>
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                <label className="flex flex-col items-start text-sm font-medium">
                    Title
                    <input
                        type="text"
                        className={`border-2 w-full ${
                            errors.title ? 'border-red-500' : 'border-[#CBD5E1]'
                        } focus:outline-[#2A6E8C] rounded-xs px-1 h-10`}
                        {...register('title')}
                    />
                    {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                </label>

                <label className="flex flex-col items-start text-sm font-medium">
                    Description
                    <textarea
                        className={`border-2 w-full ${
                            errors.description ? 'border-red-500' : 'border-[#CBD5E1]'
                        } focus:outline-[#2A6E8C] rounded-xs px-1 h-15`}
                        {...register('description')}
                    />
                    {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                </label>

                <div className="flex flex-col items-start gap-1 text-sm font-medium">
                    <span>Visibility</span>
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
                                    Public
                                </label>
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        value="true"
                                        checked={field.value === true}
                                        onChange={() => field.onChange(true)}
                                    />
                                    Private
                                </label>
                            </div>
                        )}
                    />
                </div>

                <div className="flex gap-2 justify-center items-center w-full mt-5">
                    <Button
                        name="Cancel"
                        txtColor="#64748B"
                        bgColor="transparent"
                        btnSize="16px"
                        type="button"
                        onClick={handleClose}
                    />
                    <Button
                        name={isEditingNote ? 'Saving...' : 'Save'}
                        bgColor="#2A6E8C"
                        btnSize="16px"
                        type="submit"
                        disabled={isEditingNote}
                    />
                </div>
            </form>
        </dialog>
    );
};

export default EditNoteModal;