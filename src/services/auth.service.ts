import { messageKey } from '@constants';
import { EmailDTO, LinkVerificationDTO, UserDTO, UserTokenDTO } from '@dtos';
import { User } from '@models';
import {
  compareHash,
  createToken,
  CustomeError,
  hashGenerator,
  jwtTokenVerifier,
  sendEmail,
} from '@utils';
import * as config from 'config';

const { DOMAIN, REGISTER_URL, BASE_URL, LINKVERIFICATION, LOGIN_URL } =
  config.get('URLS') as any;

const registerUserService = async (userData: UserDTO) => {
  const password = await hashGenerator(userData?.password);
  const email = userData?.email;
  delete userData?.email;
  const user = await User.findOneAndUpdate(
    { email, isVerified: false },
    { ...userData, password },
    { new: true, upsert: true },
  );
  if (!user) throw new CustomeError(messageKey.recordNotCreated);

  const { accessToken } = await createToken(
    { _id: user?._id?.toString(), verification: true },
    true,
  );

  const link = `${DOMAIN}${LINKVERIFICATION}/${accessToken}`;
  const emailData: EmailDTO = {
    to: [user?.email],
    content: {
      subject: 'Verification Link for verifiy your self',
      text: link,
    },
  };
  user.verificationLink = accessToken;
  await user.save();
  sendEmail(emailData);
  return {
    status: true,
    message: messageKey.verificationEmailSent,
  };
};

const verificationLinkService = async (token: string) => {
  const data: any = await jwtTokenVerifier(token);
  const { _id, verification } = data?.payload?.userData as LinkVerificationDTO;
  if (verification) {
    const user = await User.findOneAndUpdate(
      { _id, isDeleted: false, verificationLink: token },
      {
        isVerified: true,
        verificationLink: null,
      },
      {
        new: true,
      },
    );
    if (!user)
      return {
        status: true,
        data: `${BASE_URL}${REGISTER_URL}`,
      };
    return {
      status: true,
      data: `${BASE_URL}${LOGIN_URL}`,
      message: messageKey.verificationsuccess,
    };
  }
};

const loginUserService = async (userData: {
  email: string;
  password: string;
}) => {
  const { email, password } = userData;
  const user = await User.findOne({ email });
  if (!user) throw new CustomeError(messageKey.userNotFound);
  if (user && !(await compareHash(user?.password, password)))
    throw new CustomeError(messageKey.invalidCredentials);
  const userToken: UserTokenDTO = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
  };
  const token = await createToken(userToken);
  return {
    status: true,
    data: userToken,
    token,
    message: messageKey.loginSuccessMessage,
  };
};

export { registerUserService, verificationLinkService, loginUserService };
