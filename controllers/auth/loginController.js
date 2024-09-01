import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import CustomErrorHandler from "../../services/error/CustomErrorHandler";
import { PrismaClient } from "@prisma/client";
import { Login, MiddlewareInterface } from "../../interfaces";
import JwtService from "../../services/jwt/JwtService";

const prisma = new PrismaClient();

export const login = async (
  req,
  res,
  next
) => {
  // Joi Validation
  const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    FCMToken: Joi.string(),
  });
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { email, password, FCMToken } = req.body;
  try {
    // check user is in the database
    const user = await prisma.user.findUnique({
      where: {
        email
      },
    });
    console.log(user, "User ");

    //if not user sending error with message through custom errror handler
    if (!user) {
      return next(CustomErrorHandler.wrongCredentials());
    }

    // compare the password
    const match = (await bcrypt.compare(password, user?.password)) || "";

    //if not match sending error with message through custom errror handler
    if (!match) {
      return next(CustomErrorHandler.wrongCredentials());
    }

    // creating access token
    const access_token = JwtService.sign({
      id: user.id,
    });

    // creating refresh token
    const refresh_token = JwtService.sign(
      { id: user.id },
      "1y",
      process.env.REFRESH_SECRET
    );

    // if user don't have any role then sending only with tokens
    res.status(200).json({
      data: { access_token, refresh_token, user: user },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const me = async (
  req,
  res,
  next
) => {
  // Joi Validation
  const loginSchema = Joi.object({
    FCMToken: Joi.string(),
  });
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const {  FCMToken } = req.body;

  let authHeader = req.headers.authorization;
  console.log(authHeader , "AuthHeaders")

  if (authHeader === "bearer null" || authHeader === "bearer undefined")
    return next(CustomErrorHandler.unAuthorized());


  try {
    // check user is in the database

    const jwtToken = authHeader?.split(" ")[1];

    if (!jwtToken) return next(CustomErrorHandler.unAuthorized());

    const { id} = await JwtService.verify(jwtToken);

    const user = await prisma.user.findUnique({
      where: {
        id : id
      },
    });
    console.log(user, "User ");

    //if not user sending error with message through custom errror handler
    if (!user) {
      return next(CustomErrorHandler.wrongCredentials());
    }

    // creating access token
    const access_token = JwtService.sign({
      id: user.id,
    });

    // creating refresh token
    const refresh_token = JwtService.sign(
      { id: user.id },
      "1y",
      process.env.REFRESH_SECRET
    );

    // if user don't have any role then sending only with tokens
    res.status(200).json({
      data: { access_token, refresh_token, user: user },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
