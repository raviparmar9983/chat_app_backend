import { BaseQueryParamsDTO } from "./common.dtos";

export interface UserDTO {
  name: string;
  email: string;
  password: string;
  profilePicture: string;
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
