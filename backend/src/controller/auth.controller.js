import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Consumer } from "../models/consumer.model.js";
import { Lab } from "../models/lab.model.js";
import { Processor } from "../models/processor.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const { role, email, password, ...otherDetails } = req.body;

  if (!role || !email || !password) {
    throw new ApiError(400, "Role, email, and password are required");
  }

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
      throw new ApiError(400, "Invalid user role");
  }

  const existedUser = await UserModel.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await UserModel.create({
    role,
    email,
    password,
    ...otherDetails,
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

// const generateAccessAndRefreshTokens = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//     //
//   } catch (error) {
//     throw new ApiError(
//       500,
//       "something went wrong while generating refresh and access token"
//     );

//     //console.log("error while generating token: ", error);
//   }
// };
const loginUser = asyncHandler(async (req, res, next) => {});
const logoutUser = asyncHandler(async (req, res, next) => {});
const refreshAccessToken = asyncHandler(async (req, res, next) => {});
const getCurrentUser = asyncHandler(async (req, res, next) => {});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
};
