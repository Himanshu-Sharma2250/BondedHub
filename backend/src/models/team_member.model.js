import mongoose, {Schema} from "mongoose";
import { availableTeamMemberActions, availableTeamRoles, TeamMemberAction, TeamRolesEnum } from "../constant.js";

const teamMemberSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    reasonToJoin: {
        type: String,
        required: true
    },
    teamRole: {
        type: String,
        enum: availableTeamRoles,
        default: TeamRolesEnum.MEMBER,
        required: true
    },
    memberAction: {
        type: String,
        enum: availableTeamMemberActions,
        default: TeamMemberAction.JOINED,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    }
}, { timestamps: true })

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);