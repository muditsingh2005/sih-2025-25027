import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const processorSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["consumer", "processor", "lab"],
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // processorID: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   index: true,
    // },
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true },
    facilityLocation: {
      district: { type: String, required: true },
      state: { type: String, required: true },
      geo: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
      },
    },
    certifications: [{ type: String }],

    batchesProcessed: [
      {
        batchID: { type: String, required: true },
        processingSteps: [
          {
            stepID: { type: String, required: true },
            type: { type: String, required: true },
            conditions: { type: Map, of: String },
            timestamp: { type: Date, required: true },
          },
        ],
        status: {
          type: String,
          enum: ["Pending", "Processed", "Rejected"],
          default: "Pending",
        },
      },
    ],
  },
  { timestamps: true }
);

processorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//comparing password
processorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

processorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRT,
    }
  );
};
processorSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Processor = mongoose.model("Processor", processorSchema);
