import { Team } from "../models/team.model.js";
import { TeamMember } from "../models/team_member.model.js";
import { joinTeamSchema } from "../validators/team.validator.js";

// join a team - create team member
export const joinTeam = async (req, res) => {
    const {teamId} = req.params;
    const {data, error} = joinTeamSchema.safeParse(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Error in req.body"
        })
    }

    const {name, email, reasonToJoin} = data;

    try {
        // checking if user is a member of another team
        const joinedAnotherTeam = await TeamMember.findOne({
            userId: req.user._id,
            active: true
        })

        if (joinedAnotherTeam) {
            return res.status(400).json({
                success: false,
                message: "Cannot join another team"
            })
        }

        // check if user is a leader of another team
        const leaderOfTeam = await Team.findOne({
            userId: req.user._id
        })

        if (leaderOfTeam) {
            return res.status(400).json({
                success: false,
                message: 'Team owners/leaders cannot join other teams.'
            });
        }

        const totalMembersOfTeam = await TeamMember.find({
            teamId: teamId,
            active: true
        })

        if (totalMembersOfTeam.length === 4) {
            return res.status(400).json({
                success: false,
                message: 'Team is full.'
            });
        }

        const alreadyJoined = await TeamMember.findOne({
            userId: req.user._id,
            teamId: teamId
        })

        if (alreadyJoined) {
            return res.status(400).json({
                success: false,
                message: "You already joined a team"
            })
        }

        const teamMember = await TeamMember.create({
            userId: req.user._id,
            teamId: teamId,
            name: name,
            email: email,
            reasonToJoin: reasonToJoin,
            githubLink: githubLink
        })

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: "Team member not found"
            })
        }

        await teamMember.save();

        const existingTeamMember = await TeamMember.findOne({
            userId: req.user._id,
            teamId: teamId
        })

        if (!existingTeamMember) {
            return res.status(400).json({
                success: false,
                message: "Team member not found"
            })
        }

        res.status(201).json({
            success: true,
            message: "team member joined",
            teamMember
        })
    } catch (error) {
        console.error("Error joining team", error);
        res.status(500).json({
            success: false,
            message: "Error joining team"
        })
    }
}

// left a team
export const leftTeam = async (req, res) => {
    const {teamId} = req.params;

    try {
        const alreadyLeftTeam = await TeamMember.findOne({
            userId: req.user._id,
            teamId: teamId,
            memberAction: 'LEFT',
            active: false
        })

        if (alreadyLeftTeam) {
            return res.status(400).json({
                success: false,
                message: "Already left the team"
            })
        }

        const leftTeam = await TeamMember.findOneAndUpdate({
            teamId: teamId,
            userId: req.user._id
        },
            {active: false, memberAction: 'LEFT'},
            {new: true}
        );

        if (!leftTeam) {
            return res.status(400).json({
                success: false,
                message: "didn't left the team"
            })
        }

        res.status(200).json({
            success: true,
            message: "Left the team"
        })
    } catch (error) {
        console.error("Error lefting the team", error)
        res.status(500).json({
            success: false,
            message: "Error lefting the team"
        })
    }
}

// kicked out of a team
export const kickedOutOfTeam = async (req, res) => {
    const {teamId} = req.params;

    try {
        const alreadyKickedOutFromTeam = await TeamMember.findOne({
            userId: req.user._id,
            teamId: teamId,
            memberAction: "KICKED_OUT",
            active: false
        })

        if (alreadyKickedOutFromTeam) {
            return res.status(400).json({
                success: false,
                message: "Already kicked out of the team"
            })
        }
        
        const alreadyLeftTeam = await TeamMember.findOne({
            userId: req.user._id,
            teamId: teamId,
            memberAction: "LEFT",
            active: false
        })

        if (alreadyLeftTeam) {
            return res.status(400).json({
                success: false,
                message: "Already left the team"
            })
        }

        const kickOutTeamMember = await TeamMember.findByIdAndUpdate(teamId,
            {active: false, memberAction: 'KICKED_OUT'},
            {new: true}
        );

        if (!kickOutTeamMember) {
            return res.status(400).json({
                success: false,
                message: "didn't kicked out of the team"
            })
        }

        res.status(200).json({
            success: true,
            message: "kicked out of the team"
        })
    } catch (error) {
        console.error("Error kicking out from the team", error)
        res.status(500).json({
            success: false,
            message: "Error kicking out from the team"
        })
    }
}

// get a team member 
export const getTeamMember = async (req, res) => {
    const {teamId, userId} = req.params;

    try {
        const teamMember = await TeamMember.findOne({
            userId: userId,
            teamId: teamId,
            active: true
        })

        if (!teamMember) {
            return res.status(400).json({
                success: false,
                message: "Error getting team member (left or kicked out of team)"
            })
        }

        res.status(200).json({
            success: true,
            message: "Team member found",
            teamMember
        })
    } catch (error) {
        console.error("Error getting member", error);
        res.status(500).json({
            success: false,
            message: "Error getting member"
        })
    }
}

// get all team members
export const getAllTeamMembers = async (req, res) => {
    const {teamId} = req.params;

    try {
        const teamMembers = await TeamMember.find({
            teamId: teamId,
            active: true
        })

        if (!teamMembers) {
            return res.status(404).json({
                success: false,
                message: "team members not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "teams members found",
            teamMembers
        })
    } catch (error) {
        console.error("Error getting all team members ", error);
        res.status(500).json({
            success: false,
            message: "Error getting all team members"
        })
    }
}

// create owner of team
export const createOwner = async (req, res) => {
    const userId = req.user._id;
    const {teamId} = req.params;
    const {data, error} = joinTeamSchema.safeParse(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Error in req.body"
        })
    }

    const {name, email} = data;

    try {
        // check if user is owner
        const isOwner = await Team.findOne({
            userId: userId
        })

        if (!isOwner) {
            return res.status(400).json({
                success: false,
                message: "User not owner"
            })
        }
        console.log("checked if isOwner")

        const owner = await TeamMember.create({
            userId: userId,
            teamId: teamId,
            name: name,
            email: email,
            reasonToJoin: "",
            teamRole: 'LEADER'
        })

        res.status(201).json({
            success: true,
            message: "Owner created",
            owner
        })
    } catch (error) {
        console.error("Error creating owner", error);
        res.status(500).json({
            success: false,
            message: "Error creating owner"
        })
    }
}