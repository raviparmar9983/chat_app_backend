import { accessChat, addUserTOGroup, removeUserFromGroup, createGroupChat, getUserchats, updatedChat } from '@controllers';
import { yupvalidation } from '@middlewares';
import { acessChatValidator, messageValidator } from '@validators';
import * as express from 'express';

const messageRouter = express.Router()

messageRouter.post('', yupvalidation(messageValidator),)

export { messageRouter }