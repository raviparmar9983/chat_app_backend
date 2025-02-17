import { statusCodes } from "@constants";
import { accessChatService, addUserTOGroupService, createGroupChatService, deleteUserFromGroup, getUserchat, updatedChatService } from "@services";

export const accessChat = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const currUserId = req.user._id
        const chat = await accessChatService(currUserId, userId)
        res.status(statusCodes.success_status).json(chat)
    }
    catch (err) {
        next(err)
    }
}

export const getUserchats = async (req, res, next) => {
    try {
        const currUserId = req.user._id
        const params = req.query
        const chat = await getUserchat(currUserId, params)
        res.status(statusCodes.success_status).json(chat)
    } catch (err) {
        next(err)
    }
}

export const createGroupChat = async (req, res, next) => {
    try {
        const { users, chatName } = req.body
        const userId = req.user._id
        const chat = await createGroupChatService(userId, { users, chatName })
        res.status(statusCodes.created_status).json(chat)
    } catch (err) {
        next(err)
    }
}

export const updatedChat = async (req, res, next) => {
    try {
        const { id, name } = req.body
        const chat = await updatedChatService(id, name)
        res.status(statusCodes.success_status).json(chat)
    } catch (err) {
        next(err)
    }
}


export const addUserTOGroup = async (req, res, next) => {
    try {
        const { chatId, userId } = req.body
        const adminId = req.user._id
        const chat = await addUserTOGroupService(adminId, chatId, userId)
        res.status(statusCodes.success_status).json(chat)
    }
    catch (err) {
        next(err)
    }
}

export const removeUserFromGroup = async (req, res, next) => {
    try {
        const { chatId, userId } = req.body
        const adminId = req.user._id
        const chat = await deleteUserFromGroup(adminId, chatId, userId)
        res.status(statusCodes.success_status).json(chat)
    }
    catch (err) {
        next(err)
    }
}