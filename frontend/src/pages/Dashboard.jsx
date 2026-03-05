import { Megaphone, Users, ArrowRight, Loader2 } from 'lucide-react';
import { useTeamStore } from '../store/useTeamStore';
import { useEffect, useState } from 'react';
import { useApplicationStore } from '../store/useApplicationStore';
import { useAuthStore } from '../store/useAuthStore';
import { NavLink } from 'react-router-dom';
import { useTeamMemberStore } from '../store/useTeamMemberStore';
import toast from 'react-hot-toast';
import { useTeamHistoryStore } from '../store/useTeamHistoryStore';
import { useUserHistoryStore } from '../store/useUserHistoryStore';
import Button from '../components/Button';

const Dashboard = () => {
    const { teams, getAllTeams, myTeam, team } = useTeamStore();
    const { applications, getApplications, getAllReceivedApplications, receivedApplications, acceptApplication, rejectApplication } =
        useApplicationStore();
    const { user } = useAuthStore();
    const { teamJoin } = useTeamMemberStore();
    const { memberJoinedHistory } = useTeamHistoryStore();
    const { userJoinedTeam } = useUserHistoryStore();

    const [recommendedGroups, setRecommendedGroups] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await getAllTeams();
            await myTeam();
            await getApplications();
            await getAllReceivedApplications();
        }
        fetchData();
    }, [getAllTeams, getApplications, myTeam, getAllReceivedApplications]);

    // Build recommended groups when teams are loaded and user's team is known
    useEffect(() => {
        if (teams.length > 0) {
            // Exclude the user's own team if they have one
            const otherTeams = team ? teams.filter((t) => t._id !== team._id) : teams;
            // Randomly pick up to 3
            const shuffled = [...otherTeams].sort(() => 0.5 - Math.random());
            setRecommendedGroups(shuffled.slice(0, 3));
        }
    }, [teams, team]);

    const handleAccept = async (application) => {
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
            toast.error('Accept failed');
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectApplication(id);
            toast.success('Application rejected');
        } catch (error) {
            toast.error('Reject failed');
        }
    };

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

    return (
        <div className="flex-1 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-[#64748B]">Welcome back, {user?.fullName || user?.name}!</p>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4">
                {/* Groups card */}
                <div className="flex flex-col border-2 border-[#CBD5E1] rounded-md bg-white p-4 flex-1 min-w-50 shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-[#0F172A]">Groups</span>
                        <Users className="w-5 text-[#64748B]" />
                    </div>
                    <div className="mt-2 text-3xl font-bold text-[#0F172A]">
                        {team ? 1 : 0}
                    </div>
                    <div className="mt-2 text-sm text-[#64748B]">
                        <div>{team ? '1 Joined' : '0 Joined'}</div>
                        <div>{teams?.length || 0} Available</div>
                    </div>
                </div>

                {/* Applications card */}
                <div className="flex flex-col border-2 border-[#CBD5E1] rounded-md bg-white p-4 flex-1 min-w-50 shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-[#0F172A]">Applications</span>
                        <Megaphone className="w-5 text-[#64748B]" />
                    </div>
                    <div className="mt-2 text-3xl font-bold text-[#0F172A]">
                        {receivedApplications?.length || 0}
                    </div>
                    <div className="mt-2 text-sm text-[#64748B]">
                        <div>{receivedApplications?.length || 0} Received</div>
                        <div>{applications?.length || 0} Sent</div>
                    </div>
                </div>
            </div>

            {/* Conditional content based on whether user is in a group */}
            {team ? (
                // User has a group → show group summary and recent applications
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Your Group Card */}
                    <div className="border-2 border-[#CBD5E1] rounded-md bg-[#F8FAFC] p-4">
                        <h2 className="text-xl font-bold text-[#0F172A] mb-3">Your Group</h2>
                        <div className="bg-white border border-[#CBD5E1] rounded-md p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: `hsl(${team.name.length * 30 % 360}, 70%, 60%)` }}
                                >
                                    {team.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#0F172A]">{team.name}</h3>
                                    <p className="text-sm text-[#64748B]">{team.totalMembers} members</p>
                                </div>
                            </div>
                            <NavLink to={`/groups/${team._id}`} className="mt-3 inline-block">
                                <Button name="View Group" bgColor="#2A6E8C" btnSize="14px" />
                            </NavLink>
                        </div>
                    </div>

                    {/* Recent Received Applications */}
                    <div className="border-2 border-[#CBD5E1] rounded-md bg-[#F8FAFC] p-4">
                        <h2 className="text-xl font-bold text-[#0F172A] mb-3">Recent Applications</h2>
                        {receivedApplications.filter((app) => app.status === 'PENDING').length === 0 ? (
                            <p className="text-[#64748B] text-sm">No pending applications</p>
                        ) : (
                            <div className="space-y-3">
                                {receivedApplications
                                    .filter((app) => app.status === 'PENDING')
                                    .slice(0, 3)
                                    .map((app) => (
                                        <div
                                            key={app._id}
                                            className="bg-white border border-[#CBD5E1] rounded-md p-3 shadow-sm"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-[#0F172A]">{app.name}</p>
                                                    <p className="text-xs text-[#64748B]">{formatDate(app.appliedAt)}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        name="✓"
                                                        bgColor="#10b981"
                                                        btnSize="12px"
                                                        onClick={() => handleAccept(app)}
                                                    />
                                                    <Button
                                                        name="✗"
                                                        bgColor="#ef4444"
                                                        btnSize="12px"
                                                        onClick={() => handleReject(app._id)}
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#334155] mt-1 line-clamp-2">{app.reasonToJoin}</p>
                                        </div>
                                    ))}
                                {receivedApplications.filter((app) => app.status === 'PENDING').length > 3 && (
                                    <NavLink to="/applications?tab=received" className="text-sm text-[#2A6E8C] hover:underline flex items-center gap-1">
                                        View all <ArrowRight className="w-3 h-3" />
                                    </NavLink>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // User has no group → show recommendations and recent sent applications
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Recommended Groups */}
                    <div className="border-2 border-[#CBD5E1] rounded-md bg-[#F8FAFC] p-4">
                        <h2 className="text-xl font-bold text-[#0F172A] mb-3">Recommended Groups</h2>
                        {recommendedGroups.length === 0 ? (
                            <p className="text-[#64748B] text-sm">No groups available</p>
                        ) : (
                            <div className="space-y-3">
                                {recommendedGroups.map((group) => (
                                    <div
                                        key={group._id}
                                        className="bg-white border border-[#CBD5E1] rounded-md p-3 shadow-sm flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-medium text-[#0F172A]">{group.name}</p>
                                            <p className="text-xs text-[#64748B]">{group.totalMembers} members</p>
                                        </div>
                                        <NavLink to={`/groups/${group._id}`}>
                                            <Button name="View" bgColor="#2A6E8C" btnSize="12px" />
                                        </NavLink>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Sent Applications */}
                    <div className="border-2 border-[#CBD5E1] rounded-md bg-[#F8FAFC] p-4">
                        <h2 className="text-xl font-bold text-[#0F172A] mb-3">Your Applications</h2>
                        {applications.length === 0 ? (
                            <p className="text-[#64748B] text-sm">No applications sent</p>
                        ) : (
                            <div className="space-y-3">
                                {applications.slice(0, 3).map((app) => (
                                    <div
                                        key={app._id}
                                        className="bg-white border border-[#CBD5E1] rounded-md p-3 shadow-sm"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-[#0F172A]">
                                                    {app.teamId?.name || 'Group'}
                                                </p>
                                                <p className="text-xs text-[#64748B]">{formatDate(app.appliedAt)}</p>
                                            </div>
                                            <span
                                                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                    app.status === 'PENDING'
                                                        ? 'bg-[#E9F1F5] text-[#2A6E8C]'
                                                        : app.status === 'ACCEPTED'
                                                        ? 'bg-green-100 text-green-700'
                                                        : app.status === 'REJECTED'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#334155] mt-1 line-clamp-2">{app.reasonToJoin}</p>
                                    </div>
                                ))}
                                {applications.length > 3 && (
                                    <NavLink to="/applications?tab=sent" className="text-sm text-[#2A6E8C] hover:underline flex items-center gap-1">
                                        View all <ArrowRight className="w-3 h-3" />
                                    </NavLink>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;