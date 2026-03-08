import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

export const useTeamMemberStore = create((set) => ({
    members: [],
    member: null,
    isJoining: false,
    isGetting: false,
    isLefting: false,

    // teamJoin: async (teamId, data) => {
    //     console.log("team join called with data: ", data)
    //     set({isJoining: true});

    //     try {
    //         const res = await axiosInstance.post(`/team/${teamId}/join`, data);
    //         console.log("Joined success: ", res.data)
    //     } catch (error) {
    //         console.error("Error joining team: ", error);
    //         throw error;
    //     } finally {
    //         set({isJoining: false});
    //     }
    // },

    // teamLeft: async (teamId) => {
    //     set({isLefting: true});

    //     try {
    //         await axiosInstance.patch(`/team/${teamId}/left`);
    //     } catch (error) {
    //         console.error("Error lefting team: ", error);
    //     } finally {
    //         set({isLefting: false});
    //     }
    // },

    // kickedOutOfTeam: async (teamId) => {
    //     set({isLefting: true});

    //     try {
    //         await axiosInstance.patch(`/team/${teamId}/kick-out`);
    //         return true;
    //     } catch (error) {
    //         console.error("Error during kick out member from team: ", error);
    //         return false;
    //     } finally {
    //         set({isLefting: false});
    //     }
    // },

    // getTeamMember: async (teamId, userId) => {
    //     set({isGetting: true});

    //     try {
    //         const res = await axiosInstance.get(`/team/${teamId}/member/${userId}`);
    //         set({member: res.data.teamMember})
    //     } catch (error) {
    //         console.error("Error fetching member: ", error);
    //         set({ member: null });
    //     } finally {
    //         set({isGetting: false});
    //     }
    // },

    // getTeamMembers: async (teamId) => {
    //     set({isGetting: true});

    //     try {
    //         const res = await axiosInstance.get(`/team/${teamId}/members`);
    //         set({members: res.data.teamMembers})
    //     } catch (error) {
    //         console.error("Error fetching team members: ", error);
    //         set({members: []})
    //     } finally {
    //         set({isGetting: false});
    //     }
    // },

    // createTeamOwner: async (teamId, data) => {
    //     console.log("createTeamOwner called with:", teamId, data);
    //     set({isJoining: true});

    //     try {
    //         const res = await axiosInstance.post(`/team/${teamId}/owner`, data);
    //         console.log("createTeamOwner success:", res.data); 
    //     } catch (error) {
    //         console.error("Error creating team owner: ", error);
    //         throw error;
    //     } finally {
    //         set({isJoining: false});
    //     }
    // }
}))