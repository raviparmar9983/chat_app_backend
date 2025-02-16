import * as yup from "yup";

const userValidationSchema = yup.object({
    email: yup.string().email("Invalid email format").required("Email is required"),
    name: yup.string().required("Name is required"),
    password: yup.string().min(6, "Password must be at least 6 characters long").required("Password is required"),
    profilePicture: yup.string().url("Profile picture must be a valid URL").nullable(),
});


const loginValidator = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required')
});


export { userValidationSchema, loginValidator };
