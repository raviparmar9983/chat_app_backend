import { BaseQueryParamsDTO } from './common.dtos';

export interface UserDTO {
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  verificationLink?: string;
  isVerified?: boolean;
  isDeleted?: boolean;
}

export interface UserQueryParamDTO extends BaseQueryParamsDTO {
  name: string;
  email: string;
}
export interface UserTokenDTO {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
}

export interface LinkVerificationDTO {
  _id: string;
  verification?: boolean;
  forgotPassword?: boolean;
}
