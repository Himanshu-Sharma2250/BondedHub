import { CirclePlus, EllipsisVertical } from 'lucide-react'
import React, { useEffect } from 'react'
import CreateNoteModal from './CreateNoteModal'
import { useNoteStore } from '../store/useNoteStore'
import { useTeamMemberStore } from '../store/useTeamMemberStore'
import { useAuthStore } from '../store/useAuthStore'

const GroupNotes = ({teamId}) => {
    const {getPublicNotes, getPrivateNotes, isGettingNotes, privateNotes, publicNotes} = useNoteStore();
    const {getTeamMember, member} = useTeamMemberStore();
    const {user} = useAuthStore();

    useEffect(() => {
        if (user?._id)  {
            getTeamMember(teamId, user._id);
            getPublicNotes(teamId);
            getPrivateNotes(teamId);
        }
    }, [user?._id])

    const notesToShow = member ? [...publicNotes, ...privateNotes] : publicNotes;

    const createNoteCards = (note) => {
        return <div className='flex flex-col px-2 py-1 border-2 gap-2' key={note?._id}>
            {/* shows title, date and options if Group Leader */}
            <div className='flex items-center justify-between'>
                <span className='flex gap-3 items-center'>
                    <span className='text-xl'>
                        {note?.title}
                    </span>

                    <span>
                        {note?.createdAt}
                    </span>
                </span>

                <button className='cursor-pointer'>
                    <EllipsisVertical className='w-5' />
                </button>
            </div>

            {/* shows description */}
            <div>
                <p>
                    {note?.description}
                </p>
            </div>
        </div>
    }

    return (
        <div className='px-2 py-3 border-2 relative'>
            <div className='flex flex-col gap-2'>
                {!member ? (
                    publicNotes.length === 0 ? (
                        <span className='text-2xl text-[#FF7A59] m-auto'>
                            Only Members can access notes
                        </span>
                    ) : (
                        notesToShow?.map((note) => createNoteCards(note))
                    )
                    
                ) : (
                    notesToShow?.map((note) => createNoteCards(note))
                )}
                
            </div>

            {/* this shows only if the user is leader of group */}
            {member?.teamRole === "LEADER" && <CreateNoteModal teamId={teamId} />}
        </div>
    )
}

export default GroupNotes
