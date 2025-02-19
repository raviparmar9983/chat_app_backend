import { statusCodes } from "@constants";
import { UserQueryParamDTO } from "@dtos";
import { getAllUserService } from "@services";

const getAllUser = async (req, res, next) => {
  try {
    const params: UserQueryParamDTO = req.query;
    const users = await getAllUserService(params);
    res.status(statusCodes.success_status).json(users);
  } catch (err) {
    next(err);
  }
};

export { getAllUser };
