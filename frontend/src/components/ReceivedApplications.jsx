import { Loader2, Users } from 'lucide-react';
import Button from './Button';
import { NavLink } from 'react-router-dom';
import { useMemberJoinedHistory } from '../hooks/useTeamHistoryQueries';
import { useUserJoinTeam } from '../hooks/useUserHistoryQueries';
import { useTeamJoin } from '../hooks/useTeamMemberQueries';
import toast from 'react-hot-toast';
import {
    useReceivedApplications,
    useAcceptApplication,
    useRejectApplication,
} from '../hooks/useApplicationQueries';

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

const ReceivedApplications = () => {
    const { data: receivedApplications = [], isLoading, error } = useReceivedApplications();
    const acceptMutation = useAcceptApplication();
    const rejectMutation = useRejectApplication();
    const memberJoinedHistoryMutation = useMemberJoinedHistory();
    const userJoinTeamMutation = useUserJoinTeam();
    const teamJoinMutation = useTeamJoin();

    const onAcceptApplication = async (application) => {
        try {
            await acceptMutation.mutateAsync(application._id);
            toast.success('Application accepted');

            await teamJoinMutation.mutateAsync({
                teamId: application?.teamId,
                data: {
                    name: application?.name,
                    email: application?.email,
                    reasonToJoin: application?.reasonToJoin,
                },
            });

            await memberJoinedHistoryMutation.mutateAsync({
                teamId: application?.teamId,
                data: { memberName: application?.name },
            });

            await userJoinTeamMutation.mutateAsync();
        } catch (error) {
            toast.error('Application accept failed');
        }
    };

    const onRejectApplication = async (applicationId) => {
        try {
            await rejectMutation.mutateAsync(applicationId);
            toast.success('Application rejected');
        } catch (error) {
            toast.error('Application rejection failed');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                Failed to load received applications.
            </div>
        );
    }

    if (receivedApplications.length === 0) {
        return (
            <div className="text-center py-10 text-[#64748B]">No applications received</div>
        );
    }

    const createApplicationCards = (application) => (
        <div
            key={application._id}
            className="flex flex-col px-4 py-3 border border-[#CBD5E1] rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <span
                            className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: `hsl(${application?.name?.length * 30 % 360}, 70%, 60%)` }}
                        >
                            {application?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-[#0F172A]">{application?.name}</h3>
                        <span className="text-sm text-[#64748B]">{application?.email}</span>
                    </div>
                </div>
                <NavLink to={`/user/${application?.userId}`}>
                    <Button name="View Profile" btnSize="14px" bgColor="#2A6E8C" />
                </NavLink>
            </div>

            <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center gap-1 text-[#334155]">
                    <Users className="w-4 h-4 text-[#64748B]" />
                    <span className="font-medium text-[#0F172A]">Group:</span>
                    <span className="text-[#334155]">{application?.teamId?.name || 'Unknown'}</span>
                </div>
                <div className="flex gap-1">
                    <span className="font-medium text-[#0F172A]">Reason:</span>
                    <span className="text-[#334155]">{application?.reasonToJoin}</span>
                </div>
                <div className="text-xs text-[#64748B]">
                    Applied on: {formatDate(application?.appliedAt)}
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <Button
                    name={acceptMutation.isPending ? <Loader2 className="w-4 animate-spin" /> : 'Accept'}
                    bgColor="#10b981"
                    btnSize="14px"
                    onClick={() => onAcceptApplication(application)}
                    disabled={acceptMutation.isPending || rejectMutation.isPending}
                />
                <Button
                    name={rejectMutation.isPending ? <Loader2 className="w-4 animate-spin" /> : 'Reject'}
                    bgColor="#ef4444"
                    btnSize="14px"
                    onClick={() => onRejectApplication(application._id)}
                    disabled={acceptMutation.isPending || rejectMutation.isPending}
                />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-3 px-2 py-4">
            {receivedApplications.map(createApplicationCards)}
        </div>
    );
};

export default ReceivedApplications;