import { statusCodes } from '@constants';
import { UserDTO } from '@dtos';
import {
  loginUserService,
  registerUserService,
  verificationLinkService,
} from '@services';

import { NextFunction, Request, Response } from 'express';

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData: UserDTO = req.body;
    const user = await registerUserService(userData);
    res.status(statusCodes.success_status).json(user);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const login = await loginUserService({ email, password });
    res.status(201).json(login);
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req?.params?.token;
    const data = await verificationLinkService(token);
    res.redirect(data?.data);
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, verifyUser };
