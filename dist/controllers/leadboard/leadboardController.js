"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCloudServiceProviders = void 0;
const CustomErrorHandler_1 = __importDefault(require("../../services/error/CustomErrorHandler"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addCloudServiceProviders = async (req, res, next) => {
    try {
        // check user is in the database
        const topUsers = await prisma.user.findMany({
            orderBy: {
                coins: 'desc', // Order by coins in descending order
            },
            take: 10, // Limit the results to the top 10
        });
        console.log(topUsers, "User ");
        //if not user sending error with message through custom errror handler
        if (!topUsers) {
            return next(CustomErrorHandler_1.default.wrongCredentials());
        }
        // if user don't have any role then sending only with tokens
        res.status(200).json({
            data: topUsers,
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        return next(err);
    }
};
exports.addCloudServiceProviders = addCloudServiceProviders;
