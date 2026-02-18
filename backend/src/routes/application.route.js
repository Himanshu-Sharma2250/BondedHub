import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { acceptApplication, createApplication, getAllApplication, getAllReceivedApplications, rejectApplication, withdrawApplication } from "../controllers/application.controller.js";

const applicationRouter = express.Router();

applicationRouter.post("/:teamId/apply", verifyJWT, createApplication)
applicationRouter.get("/all-applications", verifyJWT, getAllApplication)
applicationRouter.get("/all-received-applications", verifyJWT, getAllReceivedApplications)
applicationRouter.patch("/accept/:applicationId", verifyJWT, acceptApplication)
applicationRouter.patch("/reject/:applicationId", verifyJWT, rejectApplication)
applicationRouter.patch("/withdraw/:applicationId", verifyJWT, withdrawApplication)

export default applicationRouter;