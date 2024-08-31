import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "../services/error/CustomErrorHandler";
import JwtService from "../services/jwt/JwtService";
import { MiddlewareInterface } from "../interfaces";

export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let authHeader = req.headers.authorization;
  console.log(authHeader , "AuthHeaders")

  if (authHeader === "bearer null" || authHeader === "bearer undefined")
    return next(CustomErrorHandler.unAuthorized());

  try {
    const jwtToken = authHeader?.split(" ")[1];

    if (!jwtToken) return next(CustomErrorHandler.unAuthorized());

    const { id}: any = await JwtService.verify(jwtToken);
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

