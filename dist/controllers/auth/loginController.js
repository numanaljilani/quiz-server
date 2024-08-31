"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const CustomErrorHandler_1 = __importDefault(require("../../services/error/CustomErrorHandler"));
const client_1 = require("@prisma/client");
const JwtService_1 = __importDefault(require("../../services/jwt/JwtService"));
const prisma = new client_1.PrismaClient();
const login = async (req, res, next) => {
    // Joi Validation
    const loginSchema = joi_1.default.object({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
        FCMToken: joi_1.default.string(),
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
            return next(CustomErrorHandler_1.default.wrongCredentials());
        }
        // compare the password
        const match = (await bcrypt_1.default.compare(password, user?.password)) || "";
        //if not match sending error with message through custom errror handler
        if (!match) {
            return next(CustomErrorHandler_1.default.wrongCredentials());
        }
        // creating access token
        const access_token = JwtService_1.default.sign({
            id: user.id,
        });
        // creating refresh token
        const refresh_token = JwtService_1.default.sign({ id: user.id }, "1y", process.env.REFRESH_SECRET);
        // if user don't have any role then sending only with tokens
        res.status(200).json({
            data: { access_token, refresh_token, user: user },
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.login = login;
const me = async (req, res, next) => {
    // Joi Validation
    const loginSchema = joi_1.default.object({
        FCMToken: joi_1.default.string(),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { FCMToken } = req.body;
    let authHeader = req.headers.authorization;
    console.log(authHeader, "AuthHeaders");
    if (authHeader === "bearer null" || authHeader === "bearer undefined")
        return next(CustomErrorHandler_1.default.unAuthorized());
    try {
        // check user is in the database
        const jwtToken = authHeader?.split(" ")[1];
        if (!jwtToken)
            return next(CustomErrorHandler_1.default.unAuthorized());
        const { id } = await JwtService_1.default.verify(jwtToken);
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
        });
        console.log(user, "User ");
        //if not user sending error with message through custom errror handler
        if (!user) {
            return next(CustomErrorHandler_1.default.wrongCredentials());
        }
        // creating access token
        const access_token = JwtService_1.default.sign({
            id: user.id,
        });
        // creating refresh token
        const refresh_token = JwtService_1.default.sign({ id: user.id }, "1y", process.env.REFRESH_SECRET);
        // if user don't have any role then sending only with tokens
        res.status(200).json({
            data: { access_token, refresh_token, user: user },
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.me = me;
