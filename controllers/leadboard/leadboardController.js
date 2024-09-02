import CustomErrorHandler from "../../services/error/CustomErrorHandler.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addCloudServiceProviders = async (req, res, next) => {
  try {
    // check user is in the database
    const topUsers = await prisma.user.findMany({
      orderBy: {
        coins: "desc", // Order by coins in descending order
      },
      take: 10, // Limit the results to the top 10
    });
    console.log(topUsers, "User ");

    //if not user sending error with message through custom errror handler
    if (!topUsers) {
      return next(CustomErrorHandler.wrongCredentials());
    }

    // if user don't have any role then sending only with tokens
    res.status(200).json({
      data: topUsers,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
