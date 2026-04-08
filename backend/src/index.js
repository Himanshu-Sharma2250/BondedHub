import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connect_db from "./utils/db.js";
import authRouter from "./routes/auth.route.js";
import teamRouter from "./routes/team.route.js";
import teamMemberRouter from "./routes/team_member.route.js";
import noteRouter from "./routes/note.route.js";
import teamHistoryRouter from "./routes/team_history.route.js";
import userHistoryRouter from "./routes/user_history.route.js";
import applicationRouter from "./routes/application.route.js";

dotenv.config({path: './.env'});

const app = express()
const port = process.env.PORT || 8000;

app.use(cors({
  origin: process.env.FRONTEND_BASE_URL,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods:['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

connect_db();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/team", teamRouter);
app.use("/api/v1/team", teamMemberRouter);
app.use("/api/v1/note", noteRouter);
app.use("/api/v1/teamHistory", teamHistoryRouter);
app.use("/api/v1/userHistory", userHistoryRouter);
app.use("/api/v1/application", applicationRouter);

app.get('/', (req, res) => {
  res.send('Hello World again!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})