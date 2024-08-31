"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const CustomErrorHandler_1 = __importDefault(require("../services/error/CustomErrorHandler"));
const JwtService_1 = __importDefault(require("../services/jwt/JwtService"));
const isAuthenticated = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    console.log(authHeader, "AuthHeaders");
    if (authHeader === "bearer null" || authHeader === "bearer undefined")
        return next(CustomErrorHandler_1.default.unAuthorized());
    try {
        const jwtToken = authHeader?.split(" ")[1];
        if (!jwtToken)
            return next(CustomErrorHandler_1.default.unAuthorized());
        const { id } = await JwtService_1.default.verify(jwtToken);
        const user = {
            id,
        };
        req.user = user;
        next();
    }
    catch (error) {
        // console.log(error);
        return next(CustomErrorHandler_1.default.unAuthorized());
    }
};
exports.isAuthenticated = isAuthenticated;
