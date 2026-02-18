import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

export const useTeamStore = create((set) => ({
    team: null,
    teams: [],
    loading: false,

    createTeam: async (teamData) => {
        set({loading: true});

        try {
            const res = await axiosInstance.post("/team/create-team", teamData);
            
            set({team: res.data.team});
        } catch (error) {
            console.error("Error creating team: ", error);
        } finally {
            set({loading: false});
        }
    },

    getTeam: async (teamId) => {
        set({loading: true});

        try {
            const res = await axiosInstance.get(`/team/get-team/${teamId}`);

            set({team: res.data.team})
            return res.data.team
        } catch (error) {
            console.error("Error fetching team: ", error);
        } finally {
            set({loading: false});
        }
    },

    getAllTeams: async () => {
        set({loading: true});

        try {
            const res = await axiosInstance.get("/team/get-all-teams");

            set({teams: res.data.teams});
        } catch (error) {
            console.error("Error fetching teams: ", error);
        } finally {
            set({loading: false});
        }
    },

    deleteTeam: async (teamId) => {
        set({loading: true});

        try {
            await axiosInstance.delete(`/team/delete-team/${teamId}`);

            set({team: null});
        } catch (error) {
            console.error("Error deleting team: ", error);
        } finally {
            set({loading: false});
        }
    },

    myTeam: async () => {
        set({loading: true});

        try {
            const res = await axiosInstance.get("/team/my-team")
            set({team: res.data.team})
        } catch (error) {
            console.error("Error fetching my team ", error);
        } finally {
            set({loading: false})
        }
    }
}))