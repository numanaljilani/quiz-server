import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import CustomErrorHandler from "../../services/error/CustomErrorHandler";
import bcrypt from "bcrypt";
import JwtService from "../../services/jwt/JwtService";

const prisma = new PrismaClient();

const signup = async (req, res, next) => {
  console.log("Inside customer Registration");
  // Validation
  const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9.@]+$"))
      .message("Email address not valid"),
    password: Joi.string()
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "string.min": "Password must be at least 6 characters long",
        "string.max": "Password cannot be longer than 20 characters",
        "any.required": "Password is required",
      }),
  });
  const { error } = registerSchema.validate(req.body);
  if (error) {
    // return next(error);
    console.log("error", error);
  }

  // check if user is in the database already
  try {
    const exist = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (exist) {
      return next(
        CustomErrorHandler.alreadyExist(
          "This email address has already been registered"
        )
      );
    }

    const {
      name,
      email,
      password,
    } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // prepare the model
    const user = await prisma.user.create({
      data: {
        name: name,
        email,
        password: hashedPassword,
      },
    });
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
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
// export const register_owner = async (req: Request, res: Response, next: NextFunction) => {
//   console.log("Inside Owner Registration");
//   // Validation
//   const registerSchema = Joi.object({
//     firstName: Joi.string().min(3).max(30).required(),
//     lastName: Joi.string().min(3).max(30).required(),
//     email: Joi.string()
//       .email()
//       .required()
//       .pattern(new RegExp("^[a-zA-Z0-9.@]+$"))
//       .message("Email address not valid"),
//     password: Joi.string()
//       .min(6)
//       .max(20)
//       .pattern(
//         new RegExp(
//           "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
//         )
//       )
//       .required()
//       .messages({
//         "string.pattern.base":
//           "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
//         "string.min": "Password must be at least 6 characters long",
//         "string.max": "Password cannot be longer than 20 characters",
//         "any.required": "Password is required",
//       }),
//     phoneNumber: Joi.string(),
//     profilePic: Joi.string(),
//   });
//   const { error } = registerSchema.validate(req.body);
//   if (error) {
//     // return next(error);
//     console.log("error", error);
//   }

//   // check if user is in the database already
//   try {
//     const exist = await prisma.user.findUnique({
//       where: { email: req.body.email },
//     });

//     // TODO: If user is customer then update to admin

//     if (exist) {
//       return next(
//         CustomErrorHandler.alreadyExist(
//           "This email address has already been registered"
//         )
//       );
//     }

//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       phoneNumber,
//       profilePic,
//     }: {
//       firstName : string,
//       lastName:string,
//       email: string;
//       password: string;
//       phoneNumber: string;
//       profilePic: string;
//     } = req.body;

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
// let data = {
//   name: `${firstName} ${lastName}`,
//   email,
//   avatar : `https://ui-avatars.com/api/?name=${firstName}+${lastName}&&color=fff&&background=0066a2&&rounded=true&&font-size=0.44`,
//   password: hashedPassword,
//   role: UserRole.ADMIN,
// }

//     // prepare the model
//     const user = await prisma.user.create({
//       data :data,
//     });


//     // verify token
//     // const verifyToken = await new verificationToken({
//     //   userId: user._id,
//     //   token: crypto.randomBytes(32).toString("hex"),
//     // }).save();

//     //sending mail

//     // const url = `${process.env.FRONTEND_URL}/${user.id}/verify/${verifyToken.token}`;
//     // await sendEmail({
//     //   data: {
//     //     name: user.firstName,
//     //     email: user.email,
//     //     subject: "KT-Guru Email Verification ",
//     //     sub: "verifyEmail",
//     //     url: url,
//     //   },
//     // });
//     console.log("User is registered",user)

//     res
//       .status(200)
//       .send({ message: "An Email sent to your account please verify" , data : user });
//   } catch (error) {
//     console.log(error);
//     return next(error);
//   }
// };

export default signup;
