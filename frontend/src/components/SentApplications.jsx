import { Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';
import { useApplicationStore } from '../store/useApplicationStore';
import { useEffect, useState } from 'react';
import { useTeamStore } from '../store/useTeamStore';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Map application status to badge colors
const statusColorMap = {
    PENDING: { bg: '#E9F1F5', text: '#2A6E8C' },
    ACCEPTED: { bg: '#10b98120', text: '#10b981' },
    REJECTED: { bg: '#ef444420', text: '#ef4444' },
    WITHDRAWN: { bg: '#64748B20', text: '#64748B' },
};

const SentApplications = () => {
    const [teamsMap, setTeamsMap] = useState({});
    const { getApplications, isGetting, applications, withdrawApplication } = useApplicationStore();
    const { getTeam } = useTeamStore();

    useEffect(() => {
        getApplications();
    }, [getApplications]);

    useEffect(() => {
        const fetchTeamsForApplications = async () => {
            const teamIds = [...new Set(applications.map((app) => app.teamId).filter(Boolean))];
            if (teamIds.length === 0) return;

            try {
                const teamPromises = teamIds.map((id) => getTeam(id));
                const teamsData = await Promise.all(teamPromises);
                const newTeamsMap = teamsData.reduce((acc, team) => {
                    acc[team._id] = team;
                    return acc;
                }, {});
                setTeamsMap(newTeamsMap);
            } catch (error) {
                console.error('Error fetching teams:', error);
                toast.error('Could not load group details');
            }
        };

        if (applications.length > 0) {
            fetchTeamsForApplications();
        }
    }, [applications, getTeam]);

    if (isGetting) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
            </div>
        );
    }

    const onWithdraw = async (applicationId) => {
        try {
            await withdrawApplication(applicationId);
            toast.success('Application withdrawn');
        } catch (error) {
            toast.error('Application withdrawal failed');
        }
    };

    const createApplicationCards = (application) => {
        const team = teamsMap[application?.teamId];
        const statusStyle = statusColorMap[application?.status] || { bg: '#E2E8F0', text: '#475569' };

        return (
            <div
                key={application._id}
                className="flex flex-col px-4 py-3 border border-[#CBD5E1] rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
            >
                {/* Header: group name and status badge */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-[#64748B]" />
                        <h3 className="text-lg font-semibold text-[#0F172A]">
                            {team?.name || 'Unknown Group'}
                        </h3>
                    </div>
                    <span
                        className="px-2 py-0.5 text-xs font-medium rounded-full"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                        {application?.status}
                    </span>
                </div>

                {/* Reason and applied date */}
                <div className="mt-2 space-y-1 text-sm">
                    <div className="flex gap-1">
                        <span className="font-medium text-[#0F172A]">Reason:</span>
                        <span className="text-[#334155]">{application?.reasonToJoin}</span>
                    </div>
                    <div className="text-xs text-[#64748B]">
                        Applied on: {formatDate(application?.appliedAt)}
                    </div>
                </div>

                {/* Withdraw button (only if status is PENDING) */}
                {application?.status === 'PENDING' && (
                    <div className="mt-4">
                        <Button
                            name="Withdraw"
                            bgColor="#ef4444"
                            btnSize="14px"
                            onClick={() => onWithdraw(application._id)}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-3 px-2 py-4">
            {applications.length === 0 ? (
                <div className="text-center py-10 text-[#64748B]">No sent applications</div>
            ) : (
                applications.map(createApplicationCards)
            )}
        </div>
    );
};

export default SentApplications;