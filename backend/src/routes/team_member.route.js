import express from "express";

import { createOwner, getAllTeamMembers, getTeamMember, joinTeam, kickedOutOfTeam, leftTeam } from "../controllers/team_member.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const teamMemberRouter = express.Router();

teamMemberRouter.post("/:teamId/join/:userId", verifyJWT, joinTeam);
teamMemberRouter.patch("/:teamId/left", verifyJWT, leftTeam);
teamMemberRouter.patch("/:teamId/kick-out", verifyJWT, kickedOutOfTeam);
teamMemberRouter.get("/:teamId/member/:userId", verifyJWT, getTeamMember);
teamMemberRouter.get("/:teamId/members", verifyJWT, getAllTeamMembers);
teamMemberRouter.post("/:teamId/owner", verifyJWT, createOwner);

export default teamMemberRouter;