import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

export const useTeamMemberStore = create((set) => ({
    members: [],
    member: null,
    isJoining: false,
    isGetting: false,
    isLefting: false,

    teamJoin: async (teamId, data) => {
        set({isJoining: true});

        try {
            await axiosInstance.post(`/team/${teamId}/join`, data);
        } catch (error) {
            console.log("Error joining team: ", error);
        } finally {
            set({isJoining: false});
        }
    },

    teamLeft: async (teamId) => {
        set({isLefting: true});

        try {
            await axiosInstance.patch(`/team/${teamId}/left`);
        } catch (error) {
            console.log("Error lefting team: ", error);
        } finally {
            set({isLefting: false});
        }
    },

    kickedOutOfTeam: async (teamId) => {
        set({isLefting: true});

        try {
            await axiosInstance.patch(`/team/${teamId}/kick-out`);
        } catch (error) {
            console.log("Error during kick out member from team: ", error);
        } finally {
            set({isLefting: false});
        }
    },

    getTeamMember: async (teamId, userId) => {
        set({isGetting: true});

        try {
            const res = await axiosInstance.get(`/team/${teamId}/member/${userId}`);
            set({member: res.data.teamMember})
        } catch (error) {
            console.log("Error fetching member: ", error);
        } finally {
            set({isGetting: false});
        }
    },

    getTeamMembers: async (teamId) => {
        set({isGetting: true});

        try {
            const res = await axiosInstance.get(`/team/${teamId}/members`);
            set({members: res.data.teamMembers})
        } catch (error) {
            console.log("Error fetching team members: ", error);
        } finally {
            set({isGetting: false});
        }
    },

    createTeamOwner: async (teamId, data) => {
        set({isJoining: true});

        try {
            await axiosInstance.post(`/team/${teamId}/owner`, data);
        } catch (error) {
            console.log("Error creating team owner: ", error);
        } finally {
            set({isJoining: false});
        }
    }
}))