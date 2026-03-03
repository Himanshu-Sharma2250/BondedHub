import { NavLink } from 'react-router-dom';
import Button from './Button';
import { Loader2 } from 'lucide-react';
import KickOutModal from './KickOutModal';

const getAvatarColor = (name) => {
    if (!name) return '#6b7280'; // gray fallback
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 80%, 60%)`; // vibrant, consistent
};

const GroupMembers = ({ teamId, teamRole, members, loading }) => {
    const teamLeader = members?.find((member) => member.teamRole === 'LEADER');
    const teamMembers = members?.filter((member) => member.teamRole === 'MEMBER');

    const createLeaderCard = () => (
        <div
            key={teamLeader?._id}
            className="flex items-center justify-between px-4 py-3 border border-[#CBD5E1] rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex gap-3 items-center">
                <div>
                    <span className="p-3 rounded-md bg-amber-500 text-white font-bold" style={{ backgroundColor: getAvatarColor(teamLeader?.name) }}>
                        {teamLeader?.name?.toUpperCase().slice(0, 1) || 'L'}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-[#0F172A]">
                        {teamLeader?.name || 'Leader name'}
                    </span>
                    <span className="text-sm text-[#64748B]">{teamLeader?.email || 'leader@example.com'}</span>
                </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium text-[#FF7A59] bg-[#FF7A59]/10 rounded-full">
                Leader
            </span>
        </div>
    );

    const createMemberCards = (member) => (
        <div
            key={member?._id}
            className="flex items-center justify-between px-4 py-3 border border-[#CBD5E1] rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex gap-3 items-center">
                <div>
                    <span className="p-3 rounded-md bg-amber-500 text-white font-bold" style={{ backgroundColor: getAvatarColor(member?.name) }}>
                        {member?.name?.toUpperCase().slice(0, 1) || 'M'}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-[#0F172A]">{member?.name || 'Member name'}</span>
                    <span className="text-sm text-[#64748B]">{member?.email || 'member@example.com'}</span>
                </div>
            </div>
            <div>
                <NavLink to={`/user/${member?.userId}`}>
                    {teamRole === 'LEADER' && <KickOutModal teamId={teamId} />}
                    {teamRole === 'MEMBER' && <Button name="View Profile" btnSize="14px" bgColor="#2A6E8C" />}
                </NavLink>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="px-2 py-4 border-2 border-[#CBD5E1] rounded-md bg-[#F8FAFC] flex justify-center items-center min-h-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
            </div>
        );
    }

    return (
        <div className="px-4 py-4 border-2 border-[#CBD5E1] rounded-md bg-[#F8FAFC]">
            <div className="flex flex-col gap-4">
                {/* Leader Section */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold text-[#0F172A]">Group Leader</h2>
                    {teamLeader ? createLeaderCard() : <p className="text-[#64748B]">No leader assigned</p>}
                </div>

                {/* Members Section */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold text-[#0F172A]">
                        Members {teamMembers?.length ? `(${teamMembers.length})` : ''}
                    </h2>
                    {teamMembers?.length === 0 ? (
                        <p className="text-[#64748B]">No members joined yet</p>
                    ) : (
                        <div className="flex flex-col gap-3">{teamMembers?.map(createMemberCards)}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupMembers;