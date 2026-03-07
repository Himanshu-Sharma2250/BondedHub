import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export const useTeam = (teamId) => {
    return useQuery({
        queryKey: ['team', teamId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/team/get-team/${teamId}`);
            return data.team;
        },
        enabled: !!teamId
    })
}

export const useAllTeams = () => {
    return useQuery({
        queryKey: ['teams'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/team/get-all-teams");
            return data.teams;
        }
    })
}

export const useCreateTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (teamData) => await axiosInstance.post("/team/create-team", teamData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            queryClient.setQueriesData(['team', data.data.team._id], data.data.team);
        }
    })
}

export const useDeleteTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (teamId) => await axiosInstance.delete(`/team/delete-team/${teamId}`),
        onSuccess: (_, teamId) => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            queryClient.removeQueries({ queryKey: ['team', teamId] })
        }
    })
}

export const useMyTeam = () => {
    return useQuery({
        queryKey: ['myTeam'],
        queryFn: async () => {
            try {
                const {data} = await axiosInstance.get("/team/my-team");
                return data.team;
            } catch (error) {
                if (error.message?.status === 404) return null;
                throw error;
            }
        }
    })
}