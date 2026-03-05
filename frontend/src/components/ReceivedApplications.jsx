import { Loader2, Users } from 'lucide-react';
import React, { useEffect } from 'react';
import Button from './Button';
import { NavLink } from 'react-router-dom';
import { useApplicationStore } from '../store/useApplicationStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { useTeamMemberStore } from '../store/useTeamMemberStore';
import { useTeamHistoryStore } from '../store/useTeamHistoryStore';
import { useUserHistoryStore } from '../store/useUserHistoryStore';

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
    const {
        getAllReceivedApplications,
        isGetting,
        receivedApplications,
        acceptApplication,
        rejectApplication,
        isAccepting,
        isRejecting,
    } = useApplicationStore();
    const { user } = useAuthStore();
    const { teamJoin } = useTeamMemberStore();
    const { memberJoinedHistory } = useTeamHistoryStore();
    const { userJoinedTeam } = useUserHistoryStore();

    useEffect(() => {
        getAllReceivedApplications();
    }, [getAllReceivedApplications]);

    if (isGetting) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
            </div>
        );
    }

    const onAcceptApplication = async (application) => {
        try {
            await acceptApplication(application?._id);
            toast.success('Application accepted');
            await teamJoin(application?.teamId, {
                name: application?.name,
                email: application?.email,
                reasonToJoin: application?.reasonToJoin,
            });
            await memberJoinedHistory(application?.teamId, { memberName: application?.name });
            await userJoinedTeam();
        } catch (error) {
            toast.error('Application accept failed');
        }
    };

    const onRejectApplication = async (applicationId) => {
        try {
            await rejectApplication(applicationId);
            toast.success('Application rejected');
        } catch (error) {
            toast.error('Application rejection failed');
        }
    };

    const createApplicationCards = (application) => (
        <div
            key={application._id}
            className="flex flex-col px-4 py-3 border border-[#CBD5E1] rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Applicant info and view profile button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar with dynamic color */}
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

            {/* Group and reason details */}
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

            {/* Accept/Reject buttons */}
            <div className="flex gap-2 mt-4">
                <Button
                    name={isAccepting ? <Loader2 className="w-4 animate-spin" /> : 'Accept'}
                    bgColor="#10b981"
                    btnSize="14px"
                    onClick={() => onAcceptApplication(application)}
                    disabled={isAccepting}
                />
                <Button
                    name={isRejecting ? <Loader2 className="w-4 animate-spin" /> : 'Reject'}
                    bgColor="#ef4444"
                    btnSize="14px"
                    onClick={() => onRejectApplication(application._id)}
                    disabled={isRejecting}
                />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-3 px-2 py-4">
            {receivedApplications.length === 0 ? (
                <div className="text-center py-10 text-[#64748B]">No applications received</div>
            ) : (
                receivedApplications.map(createApplicationCards)
            )}
        </div>
    );
};

export default ReceivedApplications;