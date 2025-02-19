import { messageKey } from "@constants";
import { UserQueryParamDTO } from "@dtos";
import { User } from "@models";
import { baseListQuery, userFilterFields, userSearchFeilds } from "@queries";

const getAllUserService = async (params: UserQueryParamDTO) => {
  try {
    const { query, pageNum, limit, countQuery } = await baseListQuery(
      [],
      params,
      userSearchFeilds,
      userFilterFields
    );
    console.log(JSON.stringify(query));
    console.log(JSON.stringify(countQuery));

    return {
      status: true,
      //   data: users,
      message: messageKey.requestCompletedSuccessfully,
    };
  } catch (err) {
    throw err;
  }
};

export { getAllUserService };
