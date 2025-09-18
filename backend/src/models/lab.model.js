import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const labSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["consumer", "processor", "lab"],
      default: null,
    },

    // labID: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   index: true,
    // },
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      geo: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
      },
    },
    accreditations: [{ type: String }],

    testsPerformed: [
      {
        testID: { type: String, required: true },
        batchID: { type: String, required: true },
        testDate: { type: Date, required: true },
        results: {
          moisture: { type: String },
          pesticide: { type: String },
          DNA: { type: String },
        },
        certificateURL: { type: String },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
      },
    ],

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
  },
  { timestamps: true }
);

labSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//comparing password
labSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

labSchema.methods.generateAccessToken = function () {
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
labSchema.methods.generateRefreshToken = function () {
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

export const Lab = mongoose.model("Lab", labSchema);
