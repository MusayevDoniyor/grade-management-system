import express from "express";
import authRouter from "../routes/auth.routes.js";
import subjectRouter from "../routes/subject.routes.js";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/", subjectRouter);

export default app;
