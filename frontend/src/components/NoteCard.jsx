import { EllipsisVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import EditNoteModal from './EditNoteModal';
import { useNoteStore } from '../store/useNoteStore';

const NoteCard = ({ note, teamId, isLeader }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const menuRef = useRef(null);
    const { deleteNote } = useNoteStore();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            await deleteNote(note._id);
        }
        setShowMenu(false);
    };

    const handleEdit = () => {
        setShowEditModal(true);
        setShowMenu(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <>
            <div className="flex flex-col px-4 py-3 border border-[#CBD5E1] rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-[#0F172A]">{note.title}</h3>
                        <span className="text-xs text-[#64748B]">{formatDate(note.createdAt)}</span>
                    </div>

                    {/* Only show menu for leaders or the note creator */}
                    {isLeader && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-1 rounded-full hover:bg-[#F1F5F9] transition-colors"
                            >
                                <EllipsisVertical className="w-5 text-[#64748B]" />
                            </button>

                            {/* Dropdown menu */}
                            {showMenu && (
                                <div className="absolute right-0 mt-1 w-32 bg-white border border-[#CBD5E1] rounded-md shadow-lg z-10">
                                    <button
                                        onClick={handleEdit}
                                        className="w-full text-left px-4 py-2 text-sm text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full text-left px-4 py-2 text-sm text-[#FF7A59] hover:bg-[#F1F5F9] transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="mt-2 text-sm text-[#334155]">{note.description}</p>

                {/* show visibility tag */}
                {note.isPrivate ? (
                    <span className="mt-2 self-start text-xs bg-[#E2E8F0] text-[#475569] px-2 py-0.5 rounded-full">
                        Private
                    </span>
                ) : (
                    <span className="mt-2 self-start text-xs bg-[#2A6E8C]/10 text-[#2A6E8C] px-2 py-0.5 rounded-full">
                        Public
                    </span>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditNoteModal
                    note={note}
                    teamId={teamId}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </>
    );
};

export default NoteCard;