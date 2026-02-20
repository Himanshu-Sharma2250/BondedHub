import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

export const useNoteStore = create((set) => ({
    privateNotes: [],
    publicNotes: [],
    isCreatingNote: false,
    isEditingNote: false,
    isGettingNotes: false,
    isDeletingNotes: false,

    createNote: async (noteData, teamId) => {
        set({isCreatingNote: true});

        try {
            await axiosInstance.post(`/note/create/${teamId}`, noteData);
        } catch (error) {
            console.error("Error creating note: ", error);
        } finally {
            set({isCreatingNote: false});
        }
    },

    editNote: async (editData, noteId) => {
        set({isEditingNote: true});

        try {
            await axiosInstance.patch(`/note/edit/${noteId}`, editData);
        } catch (error) {
            console.error("Error editing note: ", error);
        } finally {
            set({isEditingNote: false});
        }
    },

    getPublicNotes: async (teamId) => {
        console.log("getting public notes with teamId ", teamId)
        set({isGettingNotes: true});

        try {
            const res = await axiosInstance.get(`/note/get-public-notes/${teamId}`);
            set({publicNotes: res.data.publicNotes});
        } catch (error) {
            console.error("Error fetching public notes: ", error);
            set({publicNotes: []});
        } finally {
            set({isGettingNotes: false});
        }
    },

    getPrivateNotes: async (teamId) => {
        console.log("getting private notes with teamId ", teamId)
        set({isGettingNotes: true});

        try {
            const res = await axiosInstance.get(`/note/get-private-notes/${teamId}`);
            set({privateNotes: res.data.privateNotes});
        } catch (error) {
            console.error("Error fetching private notes: ", error);
            set({privateNotes: []});
        } finally {
            set({isGettingNotes: false});
        }
    },

    deleteNote: async (noteId) => {
        set({isDeletingNotes: true});

        try {
            await axiosInstance.delete(`/note/delete/${noteId}`);
        } catch (error) {
            console.error("Error deleting note: ", error);
        } finally {
            set({isDeletingNotes: false});
        }
    }
}))