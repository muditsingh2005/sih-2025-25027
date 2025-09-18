import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const consumerSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["consumer", "processor", "lab"],
      default: null,
    },

    // consumerID: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   index: true,
    // },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Manufacturer", "Retailer", "EndConsumer"],
      required: true,
    },
    contact: { type: String, required: true },
    location: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },

    purchases: [
      {
        purchaseID: { type: String, required: true },
        batchID: { type: String, required: true }, // linked to processor/lab
        scanDate: { type: Date, default: Date.now },
        verificationResult: {
          type: String,
          enum: ["Authentic", "Tampered", "Unverified"],
          default: "Authentic",
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

consumerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//comparing password
consumerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

consumerSchema.methods.generateAccessToken = function () {
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
consumerSchema.methods.generateRefreshToken = function () {
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

export const Consumer = mongoose.model("Consumer", consumerSchema);
