import { messageKey } from "@constants";
import { Chat } from "@models";
import { getAllChatForUser } from "@queries";
import { CustomeError } from "@utils";
import mongoose from "mongoose";

export const accessChatService = async (
  loginUserId: string,
  userId: string
) => {
  try {
    const isChat = await Chat.findOne({
      isGroupChat: false,
      users: {
        $all: [
          new mongoose.Types.ObjectId(loginUserId),
          new mongoose.Types.ObjectId(userId),
        ],
      },
    });
    if (isChat) {
      return {
        status: true,
        data: isChat,
        message: messageKey.requestCompletedSuccessfully,
      };
    }
    const chatData = {
      isGroupChat: false,
      users: [loginUserId, userId],
    };

    const createdChat = await Chat.create(chatData);
    if (!createdChat) throw new CustomeError(messageKey.recordNotCreated);
    return {
      status: true,
      data: createdChat,
      message: messageKey.recordCreatedSuccessfully,
    };
  } catch (err) {
    throw err;
  }
};

export const getUserchat = async (userId: string, params: any) => {
  try {
    const chats = await Chat.aggregate(
      getAllChatForUser(userId, params.chatId)
    );
    return {
      status: true,
      data: chats,
      message: messageKey.requestCompletedSuccessfully,
    };
  } catch (err) {
    throw err;
  }
};

export const createGroupChatService = async (
  userId: string,
  groupChatData: any
) => {
  try {
    const groupChat = await Chat.create({
      isGroupChat: true,
      groupAdmin: userId,
      ...groupChatData,
    });
    if (!groupChat) throw new CustomeError(messageKey.recordNotCreated);
    return {
      status: true,
      data: groupChat,
      message: messageKey.recordCreatedSuccessfully,
    };
  } catch (err) {
    throw err;
  }
};

export const updatedChatService = async (chatId: string, name: string) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        name,
      },
      {
        new: true,
      }
    );

    if (!chat) throw new CustomeError(messageKey.recordNotUpdated);
    return {
      status: true,
      data: chat,
      message: messageKey.recordUpdatedSuccessfully,
    };
  } catch (err) {
    throw err;
  }
};

export const addUserTOGroupService = async (
  adminId: string,
  chatId: string,
  userId: string
) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        groupAdmin: adminId,
      },
      {
        $addToSet: { users: userId },
      },
      { new: true }
    );
    if (!chat) throw new CustomeError(messageKey.recordNotUpdated);
    return {
      status: true,
      data: chat,
      message: messageKey.requestCompletedSuccessfully,
    };
  } catch (err) {
    throw err;
  }
};

export const deleteUserFromGroup = async (
  adminId: string,
  chatId: string,
  userId: string
) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        groupAdmin: adminId,
      },
      {
        $pull: { users: userId },
      },
      { new: true }
    );
    if (!chat) throw new CustomeError(messageKey.recordNotUpdated);
    return {
      status: true,
      data: chat,
      message: messageKey.requestCompletedSuccessfully,
    };
  } catch (err) {
    throw err;
  }
};
