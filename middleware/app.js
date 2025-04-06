import express from "express";
import authRouter from "../routes/auth.routes.js";
import subjectRouter from "../routes/subject.routes.js";
import gradesRouter from "../routes/grade.routes.js";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/grades", gradesRouter);

export default app;
