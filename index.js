import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { userRouter } from "./routers/userRouter.js";
import { taskRouter } from "./routers/taskRoutes.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', userRouter);
app.use('/task', taskRouter);

const defaultPORT = 3000;
const port = process.env.PORT || defaultPORT;

mongoose.connect(`${process.env.MONGO_CONNECT}`, { dbName: "TaskWebsite" },).then(
    () => {
        console.log("Connected to DB.");
        app.listen(port, () => {
            console.log(`Connected successfully on port ${port}.`);
        });
    },
    err => console.log(err)
);
