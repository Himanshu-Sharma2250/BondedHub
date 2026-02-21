import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { editProfile, forgotPassword, getProfile, getUserProfile, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetForgottenPassword, verifyEmail } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post("/login", loginUser);
authRouter.get("/profile", verifyJWT, getProfile);
authRouter.post("/logout", verifyJWT, logoutUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetForgottenPassword);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.post("/resend-email-verification", resendEmailVerification);
authRouter.patch("/edit", verifyJWT, editProfile);
authRouter.get("/get-profile/:userId", verifyJWT, getUserProfile);

export default authRouter;