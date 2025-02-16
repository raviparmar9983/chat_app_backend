import * as express from 'express';
import { loginUser, registerUser } from '@controllers';
import { yupvalidation } from '@middlewares';
import { loginValidator, userValidationSchema } from 'src/validators/user.validator';

const authRouter = express.Router()

authRouter.post('/login', yupvalidation(loginValidator), loginUser)
authRouter.post('/signup', yupvalidation(userValidationSchema), registerUser)

export { authRouter }