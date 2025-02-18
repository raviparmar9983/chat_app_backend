export interface MessageDTO {
    sender: string;
    content: string;
    chat: string;
    readBy: string[];
    deletedFor: string[]
}
// sender: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     content: {
//         type: String,
//         trim: true
//     },
//     chat: {
//         type: mngoose.Schema.Types.ObjectId,
//         ref: "Chat",
//         required: true
//     },
//     readyBy: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: 'User',
//     },
//     deletedFor: {
//         type: [mongoose.Schema.Types.ObjectId]
//     }