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
    const { data: receivedApplications = [], isLoading, error, isSuccess } = useReceivedApplications();
    const acceptMutation = useAcceptApplication();
    const rejectMutation = useRejectApplication();
    const memberJoinedHistoryMutation = useMemberJoinedHistory();
    const userJoinTeamMutation = useUserJoinTeam();
    const teamJoinMutation = useTeamJoin();

    const onAcceptApplication = async (application) => {
        try {
            await acceptMutation.mutateAsync(application._id);
            
            await teamJoinMutation.mutateAsync({
                teamId: application?.teamId,
                userId: application?.userId,
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
            toast.success('Application accepted');
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
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isSuccess) {
        toast.success("Applications Loaded");
    }

    if (error) {
        return (
            <div className="text-center py-10 text-error">
                Failed to load received applications.
            </div>
        );
    }

    if (receivedApplications.length === 0) {
        return (
            <div className="text-center py-10 text-base-content/70">No applications received</div>
        );
    }

    const createApplicationCards = (application) => (
        <div
            key={application._id}
            className="flex flex-col px-4 py-3 border border-base-300 rounded-box bg-base-100 shadow-sm hover:shadow-md transition-shadow"
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
                        <h3 className="text-lg font-semibold text-base-content">{application?.name}</h3>
                        <span className="text-sm text-base-content/70">{application?.email}</span>
                    </div>
                </div>
                <NavLink to={`/user/${application?.name}`}>
                    <Button name="View Profile" variant="primary" size="sm" />
                </NavLink>
            </div>

            <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center gap-1 text-base-content/80">
                    <Users className="w-4 h-4 text-base-content/70" />
                    <span className="font-medium text-base-content">Group:</span>
                    <span className="text-base-content/80">{application?.teamId?.name || 'Unknown'}</span>
                </div>
                <div className="flex gap-1">
                    <span className="font-medium text-base-content">Reason:</span>
                    <span className="text-base-content/80">{application?.reasonToJoin}</span>
                </div>
                <div className="text-xs text-base-content/70">
                    Applied on: {formatDate(application?.appliedAt)}
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <Button
                    name={acceptMutation.isPending ? <Loader2 className="w-4 animate-spin" /> : 'Accept'}
                    variant="success"
                    size="sm"
                    onClick={() => onAcceptApplication(application)}
                    disabled={acceptMutation.isPending || rejectMutation.isPending}
                />
                <Button
                    name={rejectMutation.isPending ? <Loader2 className="w-4 animate-spin" /> : 'Reject'}
                    variant="error"
                    size="sm"
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