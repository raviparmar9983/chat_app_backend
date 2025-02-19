import mongoose from "mongoose";

export interface ChatDTO {
  chatName: string;
  isGroupChat: boolean;
  users: string[] | mongoose.Schema.Types.ObjectId[];
  latestMessage: string;
  groupAdmin: string | mongoose.Schema.Types.ObjectId;
}
