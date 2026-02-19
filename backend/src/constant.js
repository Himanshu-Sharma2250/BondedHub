export const UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER"
}

export const availableUserRoles = Object.values(UserRolesEnum);

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000;

export const TeamRolesEnum = {
    LEADER: "LEADER",
    MEMBER: "MEMBER"
}

export const availableTeamRoles = Object.values(TeamRolesEnum);

export const TeamMemberAction = {
    JOINED: "JOINED",
    LEFT: "LEFT",
    CREATED: "CREATED",
    KICKED_OUT: "KICKED_OUT"
}

export const availableTeamMemberActions = Object.values(TeamMemberAction);

export const TeamAction = {
    CREATED: "CREATED",
    DELETED: "DELETED",
    JOINED: "JOINED",
    LEFT: "LEFT",
    KICKED_OUT: "KICKED_OUT"
}

export const availableTeamActions = Object.values(TeamAction);

export const UserAction = {
    CREATED: "CREATED",
    DELETED: "DELETED",
    JOINED: "JOINED",
    LEFT: "LEFT",
    KICKED_OUT: "KICKED_OUT"
}

export const availableUserActions = Object.values(UserAction);

export const ApplicationStatus = {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    WITHDRAW: "WITHDRAWN"
}

export const availableApplicationStatus = Object.values(ApplicationStatus);