import {
  accessChat,
  addUserTOGroup,
  removeUserFromGroup,
  createGroupChat,
  getUserchats,
  updatedChat,
} from "@controllers";
import { yupvalidation } from "@middlewares";
import { acessChatValidator } from "@validators";
import * as express from "express";

const chatRouter = express.Router();

chatRouter.post("/", yupvalidation(acessChatValidator), accessChat);

chatRouter.get("", getUserchats);

chatRouter.post("/group", createGroupChat);
chatRouter.get("/group");
chatRouter.put("/group", updatedChat);
chatRouter.put("/group/user", addUserTOGroup);
chatRouter.delete("/group/user", removeUserFromGroup);

export { chatRouter };
