import * as yup from "yup";

const chatValidationSchema = yup.object({
  chatName: yup.string().trim().required("Chat name is required"),
  isGroupChat: yup.boolean().default(false),
  users: yup
    .array()
    .of(yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid user ID"))
    .min(2, "A chat must have at least two users")
    .required("Users array is required"),
  latestMessage: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid message ID")
    .nullable(),
  groupAdmin: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid admin ID")
    .nullable(),
});

const acessChatValidator = yup.object().shape({
  userId: yup.string().required("User ID is required"),
});

export { chatValidationSchema, acessChatValidator };
