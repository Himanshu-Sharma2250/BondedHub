import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getOtherUserHistory, getUserHistories, userCreatedTeam, userDeletedTeam, userJoinedTeam, userKickedOutOfTeam, userLeftTeam } from "../controllers/user_history.controller.js";

const userHistoryRouter = express.Router();

userHistoryRouter.get("/", verifyJWT, getUserHistories);
userHistoryRouter.get("/:userId", verifyJWT, getOtherUserHistory);
userHistoryRouter.post("/user-joined-team/:userId", verifyJWT, userJoinedTeam);
userHistoryRouter.post("/user-created-team", verifyJWT, userCreatedTeam);
userHistoryRouter.post("/user-left-team", verifyJWT, userLeftTeam);
userHistoryRouter.post("/user-kicked-out-team/:name", verifyJWT, userKickedOutOfTeam);
userHistoryRouter.post("/user-delete-team", verifyJWT, userDeletedTeam);

export default userHistoryRouter;