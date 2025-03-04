import mongoose, { PipelineStage } from "mongoose";

export const getAllChatForUser = (
  userId: string,
  chatId?: string
): PipelineStage[] => [
  {
    $match: {
      users: {
        $in: [new mongoose.Types.ObjectId(userId)],
      },
      ...(chatId ? { _id: new mongoose.Types.ObjectId(chatId) } : {}),
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "users",
      foreignField: "_id",
      as: "users",
    },
  },
  {
    $addFields: {
      item: {
        $filter: {
          input: "$users",
          as: "user",
          cond: {
            $ne: ["$$user._id", new mongoose.Types.ObjectId(userId)],
          },
        },
      },
    },
  },
  {
    $addFields: {
      userName: { $first: "$item.name" },
      contact: { $first: "$item.email" },
      profilePic: { $first: "$item.profilePicture" },
    },
  },
  {
    $project: {
      users: 0,
      item: 0,
    },
  },
];
