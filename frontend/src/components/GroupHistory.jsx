import React, { useEffect } from 'react'
import { useTeamHistoryStore } from '../store/useTeamHistoryStore'
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

const actionColorMap = {
    CREATED: '#10b981',   // green
    JOINED: '#3b82f6',    // blue
    LEFT: '#ef4444',      // red
    KICKED_OUT: '#f97316', // orange
    DELETED: '#6b7280',   // gray
};

const GroupHistory = ({teamId}) => {
    const {getHistory, loading, history} = useTeamHistoryStore();

    useEffect(() => {
        async function fetchHistory() {
            if (teamId) {
                await getHistory(teamId);
            }
        }
        fetchHistory();
    }, [teamId, getHistory])

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

    // Sort history from latest to oldest
    const sortedHistory = useMemo(() => {
        if (!history) return [];
        return [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [history]);


    const createHistoryCard = (historyItem) => {
        const dotColor = actionColorMap[historyItem.teamAction] || '#64748B'; 

        return (
            <div
                key={historyItem._id}
                className="flex flex-col px-4 py-3 border border-[#CBD5E1] rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Colored dot */}
                        <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: dotColor }}
                        />
                        <h3 className="text-lg font-semibold text-[#0F172A]">
                            {historyItem.title}
                        </h3>
                    </div>
                    <span className="text-xs text-[#64748B]">
                        {formatDate(historyItem.createdAt)}
                    </span>
                </div>
                <p className="mt-2 text-sm text-[#334155]">
                    {historyItem.description}
                </p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#2A6E8C]" />
            </div>
        );
    }
    
    return (
        <div className="px-4 py-4 border-2 border-[#CBD5E1] rounded-md bg-[#F8FAFC]">
            {/* histories */}
            {!sortedHistory || sortedHistory.length === 0 ? (
                <div className="text-center py-10">
                    <span className="text-lg text-[#64748B]">No History</span>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {sortedHistory.map(createHistoryCard)}
                </div>
            )}
        </div>
    )
}

export default GroupHistory
