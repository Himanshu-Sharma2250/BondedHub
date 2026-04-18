import { Team } from "../models/team.model.js";
import { TeamMember } from "../models/team_member.model.js";
import { createTeamSchema } from "../validators/team.validator.js";

// create team
export const createTeam = async (req, res) => {
    const {data, error} = createTeamSchema.safeParse(req.body);

    if (error) {
        return res.status(400).json({
            message: "error occured in req body",
            error
        })
    }

    const {name, description, totalMembers, techUsed} = data;

    try {
        const existingTeam = await Team.findOne({
            userId: req.user._id,
            isDeleted: false
        })

        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: "You already created a team"
            })
        }

        // check if user is active team member of other team
        const activeTeamMemberOfOtherTeam = await TeamMember.findOne({
            userId: req.user._id,
            active: true
        })

        if (activeTeamMemberOfOtherTeam) {
            return res.status(400).json({
                success: false,
                message: "Already joined another team"
            })
        }

        const team = await Team.create({
            userId: req.user._id,
            name: name,
            description: description,
            totalMembers: totalMembers,
            isDeleted: false,
            techUsed: techUsed
        })

        await team.save();

        const createdTeam = await Team.findOne({
            userId: req.user._id,
            isDeleted: false
        })

        if (!createdTeam) {
            return res.status(400).json({
                success: false,
                message: 'Team not found'
            })
        }

        res.status(201).json({
            success: true,
            message: "Team created successfully",
            team
        })
    } catch (error) {
        console.error("Error creating team", error);
        res.status(500).json({
            success: false,
            message: "Error creating team"
        })
    }
}

// get a team
export const getTeam = async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId).populate({
            path: 'members',
            match: { active: true }      // Only active members
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Team",
            team
        });
    } catch (error) {
        console.error("Error getting team", error);
        res.status(500).json({
            success: false,
            message: "Error getting team"
        });
    }
};

// get all teams which are not deleted
export const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({
            isDeleted: false
        }).populate({
            path: 'members',
            match: { active: true }      // Only active members
        });

        if (!teams) {
            return res.status(400).json({
                success: false,
                message: "No teams found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Teams",
            teams
        });
    } catch (error) {
        console.error("Error getting teams", error);
        res.status(500).json({
            success: false,
            message: "Error getting teams"
        });
    }
};

// delete team
export const deleteTeam = async (req, res) => {
    const { teamId } = req.params;

    try {
        const delete_team = await Team.findByIdAndUpdate(teamId, 
            { isDeleted: true },
            { new: true }
        )

        if (!delete_team) {
            return res.status(400).json({
                success: false,
                message: "Team not deleted"
            })
        }

        res.status(200).json({
            success: true,
            message: "Team deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting team", error);
        res.status(500).json({
            success: false,
            message: "Error deleting team"
        })
    }
}

// get my team
export const getMyTeam = async (req, res) => {
    const userId = req.user._id;

    try {
        // 1. Owner branch – team with active members only
        const myTeam = await Team.findOne({
            userId: userId,
            isDeleted: false
        }).populate({
            path: 'members',
            match: { active: true }
        });

        if (myTeam) {
            return res.status(200).json({
                success: true,
                message: "My team fetched (owner)",
                team: myTeam
            });
        }

        // 2. Member branch – find active membership and populate team with active members
        const membership = await TeamMember.findOne({
            userId: userId,
            active: true
        }).populate({
            path: 'teamId',
            match: { isDeleted: false },
            populate: {
                path: 'members',
                match: { active: true }
            }
        });

        if (membership && membership.teamId) {
            return res.status(200).json({
                success: true,
                message: "My group fetched (member)",
                team: membership.teamId
            });
        }

        // 3. No team found
        return res.status(404).json({
            success: false,
            message: "No team found"
        });
    } catch (error) {
        console.error("Error fetching my team: ", error);
        res.status(500).json({
            success: false,
            message: "Error fetching my team"
        });
    }
};