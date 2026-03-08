import { useEffect, useState } from 'react';
import { Loader2, MoveLeft } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import GroupOverview from '../components/GroupOverview';
import GroupMembers from '../components/GroupMembers';
import GroupHistory from '../components/GroupHistory';
import GroupNotes from '../components/GroupNotes';
import ApplyToGroupModal from '../components/ApplyToGroupModal';
import DeleteGroupPopUp from '../components/DeleteGroupPopUp';
import LeaveGroupModal from '../components/LeaveGroupModal';
import { useAuthStore } from '../store/useAuthStore';
import { useTeam } from '../hooks/useTeamQueries';
import { useTeamMember } from '../hooks/useTeamMemberQueries';

const getAvatarColor = (name) => {
    if (!name) return '#6b7280';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 80%, 60%)`;
};

const GroupDetailPage = () => {
    const [selectedTab, setSelectedTab] = useState('Overview');
    const { teamId } = useParams();
    const { user } = useAuthStore();

    const { data: team, isLoading: teamLoading, error: teamError } = useTeam(teamId);

    const { data: member, isLoading: memberLoading, error: memberError } = useTeamMember(
        teamId,
        user?._id
    );

    if (teamLoading || memberLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
            </div>
        );
    }

    if (teamError || !team) {
        return (
            <div className="text-center py-20 text-red-500">
                <p>Failed to load group details.</p>
                <NavLink to="/groups" className="text-[#2A6E8C] hover:underline mt-4 inline-block">
                    Back to Groups
                </NavLink>
            </div>
        );
    }

    return (
        <div className="pb-1 flex flex-col gap-1">
            {/* Back button */}
            <div className="flex justify-start items-center px-2 h-12">
                <NavLink
                    to="/groups"
                    className="cursor-pointer border-2 px-2 py-1 rounded-xs flex items-center gap-2 hover:gap-3 hover:ease-out text-[#64748B] hover:text-[#2A6E8C] transition-colors"
                >
                    <MoveLeft className="w-6" />
                    <span>Back</span>
                </NavLink>
            </div>

            {/* Group header */}
            <div className="flex justify-between items-center py-2 px-3">
                <div className="flex gap-3 items-center">
                    <div className="flex items-center justify-center">
                        <span
                            className="p-4 rounded-md text-white font-bold"
                            style={{ backgroundColor: getAvatarColor(team?.name) }}
                        >
                            {team?.name?.toUpperCase().slice(0, 1) || 'G'}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl">{team?.name}</h1>
                        <span>{team?.totalMembers} members</span>
                    </div>
                </div>

                {/* Action buttons based on membership */}
                <div>
                    {!member && <ApplyToGroupModal teamId={teamId} />}
                    {member?.teamRole === 'MEMBER' && <LeaveGroupModal teamId={teamId} />}
                    {member?.teamRole === 'LEADER' && <DeleteGroupPopUp teamId={teamId} />}
                </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-5 py-2 px-2 border-b border-[#CBD5E1]">
                {['Overview', 'Members', 'Notes', 'History'].map((tab) => (
                    <span
                        key={tab}
                        className={`text-lg cursor-pointer pb-1 transition-colors ${
                            selectedTab === tab
                                ? 'text-[#2A6E8C] font-semibold border-[#FF7A59]'
                                : 'text-[#64748B] hover:text-[#475569]'
                        }`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab === 'History' ? 'Group History' : tab}
                    </span>
                ))}
            </div>

            {/* Tab content */}
            <div className="px-2">
                {selectedTab === 'Overview' && (
                    <GroupOverview team={team} members={team?.members || []} />
                )}
                {selectedTab === 'Members' && (
                    <GroupMembers
                        teamId={team?._id}
                        teamRole={member?.teamRole}
                        members={team?.members || []}
                        loading={memberLoading}
                    />
                )}
                {selectedTab === 'Notes' && <GroupNotes teamId={teamId} member={member} />}
                {selectedTab === 'History' && <GroupHistory teamId={team?._id} />}
            </div>
        </div>
    );
};

export default GroupDetailPage;