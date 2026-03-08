import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export const useAllMembers = (teamId) => {
    return useQuery({
        queryKey: ['members', teamId],
        queryFn: async () => {
            try {
                const { data } = await axiosInstance.get(`/team/${teamId}/members`);
                return data.teamMembers;
            } catch (error) {
                if (error.response?.status === 404) return null;
                throw error;
            }
        },
        enabled: !!teamId,
    })
}

export const useTeamMember = (teamId, userId) => {
    return useQuery({
        queryKey: ['member', teamId, userId],
        queryFn: async () => {
            try {
                const { data } = await axiosInstance.get(`/team/${teamId}/member/${userId}`);
                return data.teamMember;
            } catch (error) {
                if (error.response?.status === 404) return null;
                throw error;
            }
        },
        enabled: !!teamId && !!userId,
    })
}

// Join a team (create team member)
export const useTeamJoin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ teamId, data }) =>
            axiosInstance.post(`/team/${teamId}/join`, data),
        // Optimistic update
        onMutate: async ({ teamId }) => {
            // Cancel outgoing refetches for members list
            await queryClient.cancelQueries({ queryKey: ['members', teamId] });

            // Snapshot previous members
            const previousMembers = queryClient.getQueryData(['members', teamId]);

            // Optimistically add the new member (assuming API returns the created member)
            // For simplicity, we'll just invalidate; but if we want instant UI, we could add a temporary member.
            // However, since the new member's data might need server-generated fields (id, etc.), we'll just invalidate.
            // Instead, we can set a placeholder or simply rely on invalidation after success.
            // We'll just return context for rollback.

            return { previousMembers, teamId };
        },
        onError: (err, variables, context) => {
            // Rollback members list on error
            if (context?.previousMembers) {
                queryClient.setQueryData(['members', context.teamId], context.previousMembers);
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch members list after mutation settles
            queryClient.invalidateQueries({ queryKey: ['members', variables.teamId] });
            // Also invalidate the team queries if needed
            queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
        },
    });
};

// Leave a team
export const useTeamLeft = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ teamId, userId }) =>
            axiosInstance.patch(`/team/${teamId}/left`),
        onMutate: async ({ teamId, userId }) => {
            await queryClient.cancelQueries({ queryKey: ['members', teamId] });
            await queryClient.cancelQueries({ queryKey: ['teamMember', teamId, userId] });

            const previousMembers = queryClient.getQueryData(['members', teamId]);
            const previousMember = queryClient.getQueryData(['teamMember', teamId, userId]);

            // Optimistically remove the member from the list
            if (previousMembers) {
                queryClient.setQueryData(['members', teamId], (old) =>
                    old.filter((m) => m.userId !== userId)
                );
            }
            // Set the member query to null (user is no longer a member)
            queryClient.setQueryData(['teamMember', teamId, userId], null);

            return { previousMembers, previousMember, teamId, userId };
        },
        onError: (err, variables, context) => {
            if (context?.previousMembers) {
                queryClient.setQueryData(['members', context.teamId], context.previousMembers);
            }
            if (context?.previousMember) {
                queryClient.setQueryData(['teamMember', context.teamId, context.userId], context.previousMember);
            }
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ['members', variables.teamId] });
            queryClient.invalidateQueries({ queryKey: ['teamMember', variables.teamId, variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
        },
    });
};

// Kick a member out
export const useKickOut = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ teamId, memberId }) =>
            axiosInstance.patch(`/team/${teamId}/kick-out`, { memberId }),
        onMutate: async ({ teamId, memberId }) => {
            await queryClient.cancelQueries({ queryKey: ['members', teamId] });

            const previousMembers = queryClient.getQueryData(['members', teamId]);

            // Optimistically remove the kicked member
            if (previousMembers) {
                queryClient.setQueryData(['members', teamId], (old) =>
                    old.filter((m) => m._id !== memberId && m.userId !== memberId)
                );
            }

            return { previousMembers, teamId };
        },
        onError: (err, variables, context) => {
            if (context?.previousMembers) {
                queryClient.setQueryData(['members', context.teamId], context.previousMembers);
            }
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ['members', variables.teamId] });
            queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
        },
    });
};

// Create team owner (leader) during team creation
export const useCreateOwner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ teamId, data }) =>
            axiosInstance.post(`/team/${teamId}/owner`, data),
        onSuccess: (data, variables) => {
            // After owner creation, the user becomes a member, so we can update cache
            queryClient.invalidateQueries({ queryKey: ['members', variables.teamId] });
            queryClient.invalidateQueries({ queryKey: ['team', variables.teamId] });
        },
    });
};