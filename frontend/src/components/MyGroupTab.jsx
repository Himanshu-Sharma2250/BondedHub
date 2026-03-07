import { Loader2, User, Users } from 'lucide-react';
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTeamStore } from '../store/useTeamStore';
import { useMyTeam } from '../hooks/useTeamQueries';

const getAvatarColor = (name) => {
    if (!name) return '#6b7280';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
};

const MyGroupTab = () => {
    // const { loading, team, myTeam } = useTeamStore();
    const { data: team, isLoading, error } = useMyTeam();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 h-full w-full">
                <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
            </div>
        );
    }

    if (!team?._id) {
        return <span className="text-2xl text-[#64748B] py-10 block text-center h-full w-full">No team found</span>;
    }

    return (
        <div className="flex">
            <NavLink
                to={`/groups/${team._id}`}
                className="flex flex-col min-w-72 border border-[#CBD5E1] rounded-md bg-white shadow-sm hover:shadow-md transition-shadow p-4"
            >
                <div className="flex items-start gap-3">
                    <div
                        className="w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-xl shrink-0"
                        style={{ backgroundColor: getAvatarColor(team.name) }}
                    >
                        {team.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[#0F172A] truncate">{team.name}</h3>
                        <p className="text-sm text-[#334155] line-clamp-2">{team.description}</p>
                    </div>
                </div>

                {team.techUsed?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {team.techUsed.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-0.5 text-xs bg-[#E2E8F0] text-[#475569] rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex flex-col gap-2 mt-4 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        Team Leader
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {team.totalMembers - 1} members
                    </span>
                </div>

                <div className="mt-3 text-right">
                    <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                            team.isDeleted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}
                    >
                        {team.isDeleted ? 'Inactive' : 'Active'}
                    </span>
                </div>
            </NavLink>
        </div>
    );
};

export default MyGroupTab;