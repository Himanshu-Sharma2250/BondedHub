import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export const useUserHistory = () => {
    return useQuery({
        queryKey: ['userHistory'],
        queryFn: async () => {
            try {
                const { data } = await axiosInstance.get("/userHistory");
                return data.history;
            } catch (error) {
                if (error.response?.status === 404) return null;
                throw error;
            }
        }
    })
}

export const useUserJoinTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => await axiosInstance.post("/userHistory/user-joined-team"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userHistory'] })
        }
    })
}

export const useUserCreateTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => await axiosInstance.post("/userHistory/user-created-team"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userHistory'] })
        }
    })
}

export const useUserLeftTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => await axiosInstance.post("/userHistory/user-left-team", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userHistory'] })
        }
    })
}

export const useUserKickedOutOfTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => await axiosInstance.post("/userHistory/user-kicked-out-team", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userHistory'] })
        }
    })
}

export const useUserDeleteTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => await axiosInstance.post("/userHistory/user-delete-team", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userHistory'] })
        }
    })
}