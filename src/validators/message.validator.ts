import { object, string } from 'yup';

export const messageValidator = Object({
    sender: string().required('Sender is Required'),
    content: string().required('Content is Required'),
    chat: string().required('Chat is required'),
})
// export interface MessageDTO {
//     sender: string;
//     content: string;
//     chat: string;
//     readBy: string[];
//     deletedFor: string[]
// }