import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

const registrationSessionSchema = new Schema({
  token: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true, index: true },
  status: {
    type: String,
    enum: ["pending", "completed", "expired"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  data: { type: Schema.Types.Mixed, default: {} },
});

registrationSessionSchema.statics.createForPhone = async function (
  phone,
  ttlHours = 24
) {
  const token = crypto.randomBytes(16).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlHours * 3600 * 1000);
  const doc = await this.create({ token, phone, expiresAt });
  return doc;
};

export const RegistrationSession = mongoose.model(
  "RegistrationSession",
  registrationSessionSchema
);
