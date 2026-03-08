import { Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';
import { useSentApplications, useWithdrawApplication } from '../hooks/useApplicationQueries';
import { useQueries } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';

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
    const { data: applications = [], isLoading: appsLoading, error: appsError } = useSentApplications();
    const withdrawMutation = useWithdrawApplication();

    // Get unique team IDs from applications
    const teamIds = [...new Set(applications.map((app) => app.teamId).filter(Boolean))];

    // Fetch each team using useQueries
    const teamQueries = useQueries({
        queries: teamIds.map((id) => ({
            queryKey: ['team', id],
            queryFn: async () => {
                const { data } = await axiosInstance.get(`/team/get-team/${id}`);
                return data.team;
            },
            staleTime: 5 * 60 * 1000,
        })),
    });

    // Build a map from teamId to team data
    const teamsMap = {};
    teamQueries.forEach((query, index) => {
        if (query.data) {
            teamsMap[teamIds[index]] = query.data;
        }
    });

    // Check if any team query is still loading
    const anyTeamLoading = teamQueries.some((q) => q.isLoading);

    const onWithdraw = async (applicationId) => {
        try {
            await withdrawMutation.mutateAsync(applicationId);
            toast.success('Application withdrawn');
        } catch (error) {
            toast.error('Application withdrawal failed');
        }
    };

    if (appsLoading || anyTeamLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
            </div>
        );
    }

    if (appsError) {
        return (
            <div className="text-center py-10 text-red-500">
                Failed to load sent applications.
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="text-center py-10 text-[#64748B]">No sent applications</div>
        );
    }

    const createApplicationCards = (application) => {
        const team = teamsMap[application.teamId];
        const statusStyle = statusColorMap[application.status] || { bg: '#E2E8F0', text: '#475569' };

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
                        {application.status}
                    </span>
                </div>

                {/* Reason and applied date */}
                <div className="mt-2 space-y-1 text-sm">
                    <div className="flex gap-1">
                        <span className="font-medium text-[#0F172A]">Reason:</span>
                        <span className="text-[#334155]">{application.reasonToJoin}</span>
                    </div>
                    <div className="text-xs text-[#64748B]">
                        Applied on: {formatDate(application.appliedAt)}
                    </div>
                </div>

                {/* Withdraw button (only if status is PENDING) */}
                {application.status === 'PENDING' && (
                    <div className="mt-4">
                        <Button
                            name={withdrawMutation.isPending ? 'Withdrawing...' : 'Withdraw'}
                            bgColor="#ef4444"
                            btnSize="14px"
                            onClick={() => onWithdraw(application._id)}
                            disabled={withdrawMutation.isPending}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-3 px-2 py-4">
            {applications.map(createApplicationCards)}
        </div>
    );
};

export default SentApplications;