import { getAllUser } from "@controllers";
import * as express from "express";

const userRouter = express.Router();

userRouter.get("/", getAllUser);

export { userRouter };
