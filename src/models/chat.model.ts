import mongoose, { Mongoose } from "mongoose";

const ChatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true,
        default: 'Private Chat'
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Chat = mongoose.model("Chat", ChatSchema);

export { Chat }