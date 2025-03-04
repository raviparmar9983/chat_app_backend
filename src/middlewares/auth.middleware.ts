import { messageKey } from "@constants";
import { CustomeError, jwtTokenVerifier } from "@utils";

const authMiddleware = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.includes("Bearer")
    )
      return next(new CustomeError(messageKey.unauthorizeResourse));
    const { authorization } = req.headers;
    const authToken = authorization.replace(/bearer/gim, "").trim();
    const decoded: any = await jwtTokenVerifier(authToken);
    if (!decoded?.payload?.userData)
      throw new CustomeError(messageKey.unauthorizeResourse);
    req.user = decoded?.payload?.userData;
    next();
  } catch (err) {
    next(err);
  }
};

export { authMiddleware };
