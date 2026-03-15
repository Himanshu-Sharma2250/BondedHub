import { Team } from "../models/team.model.js";
import { TeamMember } from "../models/team_member.model.js";
import { UserHistory } from "../models/user_history.model.js";
import { userHistorySchema } from "../validators/history.validator.js";

export const userCreatedTeam = async (req, res) => {
    const username = req.user.name;

    try {
        const team = await Team.findOne({
            userId: req.user._id,
            isDeleted: false
        })

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            })
        }

        const history = await UserHistory.create({
            userId: req.user._id,
            userAction: "CREATED",
            title: "Created Team",
            description: `${username} create team ${team.name}`
        })
        
        res.status(201).json({
            success: true,
            message: "User created team history",
            history
        })
    } catch (error) {
        console.error("Error in creating user_created_team history ", error);
        res.status(500).json({
            success: false,
            message: "Error in creating user_created_team history"
        })
    } 
}

export const userJoinedTeam = async (req, res) => {
    const username = req.user.name;
    const userId = req.user._id;

    try {
        const membership = await TeamMember.findOne({
            userId: userId,
            active: true
        }).populate({
            path: 'teamId',
            match: { isDeleted: false } // only include if team is not deleted
        });

        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "User is not member of team"
            })
        }

        const team = await Team.findById(membership?.teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            })
        }

        const history = await UserHistory.create({
            userId: req.user._id,
            userAction: "JOINED",
            title: "Joined Team",
            description: `${username} joined team ${team.name}`
        })
    
        res.status(201).json({
            success: true,
            message: "User joined team",
            history
        })
    } catch (error) {
        console.error("Error in creating user_joined_team history ", error);
        res.status(500).json({
            success: false,
            message: "Error in creating user_joined_team history"
        })
    } 
}

export const userLeftTeam = async (req, res) => {
    const {data, error} = userHistorySchema.safeParse(req.body);
    const username = req.user.name;
    const userId = req.user._id;
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Error in req body"
        })
    }
    
    const {reason} = data;

    try {
        const membership = await TeamMember.findOne({
            userId: userId,
            active: false
        })

        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "User is not member of team"
            })
        }

        const team = await Team.findById(membership?.teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            })
        }

        const history = await UserHistory.create({
            userId: req.user._id,
            userAction: "LEFT",
            title: "Left Team",
            description: `${username} left team ${team.name} because ${reason}`
        })
    
        res.status(201).json({
            success: true,
            message: "User left team",
            history
        })
    } catch (error) {
        console.error("Error in creating user_left_team history ", error);
        res.status(500).json({
            success: false,
            message: "Error in creating user_left_team history"
        })
    } 
}

export const userKickedOutOfTeam = async (req, res) => {
    const {data, error} = userHistorySchema.safeParse(req.body);
    const username = req.user.name;
    const userId = req.user._id;
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Error in req body"
        })
    }
    
    const {reason} = data;

    try {
        const membership = await TeamMember.findOne({
            userId: userId,
            active: false
        })

        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "User is not member of team"
            })
        }

        const team = await Team.findById(membership?.teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            })
        }

        const history = await UserHistory.create({
            userId: req.user._id,
            userAction: "KICKED_OUT",
            title: "Kicked Out of Team",
            description: `${username} kicked out of team ${team.name} because ${reason}`
        })
    
        res.status(201).json({
            success: true,
            message: "User kicked out of team",
            history
        })
    } catch (error) {
        console.error("Error in creating user_kickedOut_team history ", error);
        res.status(500).json({
            success: false,
            message: "Error in creating user_kickedOut_team history"
        })
    } 
}

export const userDeletedTeam = async (req, res) => {
    const {data, error} = userHistorySchema.safeParse(req.body);
    const username = req.user.name;
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Error in req body"
        })
    }
    
    const {reason} = data;

    try {
        const team = await Team.findOne({
            userId: req.user._id,
            isDeleted: true
        })

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            })
        }

        const history = await UserHistory.create({
            userId: req.user._id,
            userAction: "DELETED",
            title: "Deleted Team",
            description: `${username} deleted team ${team.name} because ${reason}`
        })
    
        res.status(201).json({
            success: true,
            message: "User deleted team history",
            history
        })
    } catch (error) {
        console.error("Error in creating user_delete_team history ", error);
        res.status(500).json({
            success: false,
            message: "Error in creating user_delete_team history"
        })
    } 
}

export const getUserHistories = async (req, res) => {
    const userId = req.user._id;

    try {
        const history = await UserHistory.find({userId});

        if (!history) {
            return res.status(404).json({
                success: false,
                message: "No history found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User history fetched successfully",
            history
        })
    } catch (error) {
        console.log("Error fetching user histories: ", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user histories"
        })
    }
}

export const getOtherUserHistory = async (req, res) => {
    const {userId} = req.params;

    try {
        const history = await UserHistory.find({
            userId: userId
        })

        if (!history) {
            return res.status(404).json({
                success: false,
                message: "History Not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User history fetched successfully",
            history
        })
    } catch (error) {
        console.log("Error fetching other user histories: ", error);
        res.status(500).json({
            success: false,
            message: "Error fetching other user histories"
        })
    }
}