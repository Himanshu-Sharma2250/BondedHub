import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import CreateNoteModal from './CreateNoteModal';
import NoteCard from './NoteCard';
import { useNoteStore } from '../store/useNoteStore';
import { useTeamMemberStore } from '../store/useTeamMemberStore';
import { useAuthStore } from '../store/useAuthStore';

const GroupNotes = ({ teamId }) => {
    const {
        getPublicNotes,
        getPrivateNotes,
        isGettingNotes,
        privateNotes,
        publicNotes,
    } = useNoteStore();
    const { getTeamMember, member } = useTeamMemberStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user?._id) {
            getTeamMember(teamId, user._id);
            getPublicNotes(teamId);
            getPrivateNotes(teamId);
        }
    }, [teamId, user?._id]); 

    // Combine notes: members see all, non-members see only public
    const notesToShow = member ? [...publicNotes, ...privateNotes] : publicNotes;

    // Sort by newest first
    const sortedNotes = notesToShow.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const isLeader = member?.teamRole === 'LEADER';

    if (isGettingNotes) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
            </div>
        );
    }

    return (
        <div className="px-2 py-4 border-2 border-[#CBD5E1] rounded-md bg-[#F8FAFC] relative min-h-50">
            {notesToShow.length === 0 ? (
                <div className="text-center py-10">
                    {!member ? (
                        <span className="text-lg text-[#FF7A59]">
                            Only members can access notes
                        </span>
                    ) : (
                        <span className="text-lg text-[#64748B]">
                            No notes yet. Create your first note!
                        </span>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {sortedNotes.map((note) => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            teamId={teamId}
                            isLeader={isLeader}
                        />
                    ))}
                </div>
            )}

            {/* Create Note Button (only for leader) */}
            {isLeader && (
                <div className="sticky bottom-4 flex justify-end mt-4">
                    <CreateNoteModal teamId={teamId} />
                </div>
            )}
        </div>
    );
};

export default GroupNotes;