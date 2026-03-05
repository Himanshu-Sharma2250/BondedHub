import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUserHistoryStore = create((set) => ({
    userHistory: [],
    loading: false,

    getUserHistories: async () => {
        set({loading: true});

        try {
            const res = await axiosInstance.get("/userHistory");
            
            set({userHistory: res.data.history});
        } catch (error) {
            console.error("Error fetching user histories: ", error);
            set({userHistory: []});
        } finally {
            set({loading: false});
        }
    },

    userJoinedTeam: async () => {
        try {
            await axiosInstance.post("/userHistory/user-joined-team");
        } catch (error) {
            console.error("Error creating user history(joined team): ", error);
            throw error;
        }
    },

    userCreatedTeam: async () => {
        try {
            await axiosInstance.post("/userHistory/user-created-team");
        } catch (error) {
            console.error("Error creating user history(create team): ", error);
            throw error;
        }
    },

    userLeftTeam: async (data) => {
        try {
            await axiosInstance.post("/userHistory/user-left-team", data);
        } catch (error) {
            console.error("Error creating user history(left team): ", error);
            throw error;
        }
    },

    userKickedOutOfTeam: async (data) => {
        try {
            await axiosInstance.post("/userHistory/user-kicked-out-team", data);
        } catch (error) {
            console.error("Error creating user history(kicked out team): ", error);
            throw error;
        }
    },

    userDeletedTeam: async (data) => {
        try {
            await axiosInstance.post("/userHistory/user-delete-team", data);
        } catch (error) {
            console.error("Error creating user history(delete team): ", error);
            throw error;
        }
    },
}))