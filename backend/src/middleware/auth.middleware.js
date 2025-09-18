import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Consumer } from "../models/consumer.model.js";
import { Lab } from "../models/lab.model.js";
import { Processor } from "../models/processor.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const { _id, role } = decodedToken;

        let UserModel;
        switch (role) {
            case "consumer":
                UserModel = Consumer;
                break;
            case "lab":
                UserModel = Lab;
                break;
            case "processor":
                UserModel = Processor;
                break;
            default:
                throw new ApiError(401, "Invalid Access Token");
        }

        const user = await UserModel.findById(_id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
