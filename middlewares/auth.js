import CustomErrorHandler from "../services/error/CustomErrorHandler.js";
import JwtService from "../services/jwt/JwtService.js";

export const isAuthenticated = async (
  req,
  res,
  next
) => {
  let authHeader = req.headers.authorization;
  console.log(authHeader , "AuthHeaders")

  if (authHeader === "bearer null" || authHeader === "bearer undefined")
    return next(CustomErrorHandler.unAuthorized());

  try {
    const jwtToken = authHeader?.split(" ")[1];

    if (!jwtToken) return next(CustomErrorHandler.unAuthorized());

    const { id} = await JwtService.verify(jwtToken);
    const user = {
      id,
    };
    req.user = user;
    next();
  } catch (error) {
    // console.log(error);
    return next(CustomErrorHandler.unAuthorized());
  }
};

