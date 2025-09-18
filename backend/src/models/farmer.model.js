import mongoose, { Schema } from "mongoose";

const farmerSchema = new Schema(
  {
    farmerID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      village: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      geo: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
      },
    },
    farmType: {
      type: String,
      enum: ["Smallholder", "Cooperative", "Commercial"],
      required: true,
    },
    crops: [{ type: String }],
    certifications: [{ type: String }],

    // Collection/harvest events
    events: [
      {
        eventID: { type: String, required: true },
        species: { type: String, required: true },
        harvestDate: { type: Date, required: true },
        quantityKg: { type: Number, required: true },
        initialQuality: {
          moisture: { type: String },
          appearance: { type: String },
        },
      },
    ],
  },
  { timestamps: true }
);

export const Farmer = mongoose.model("Farmer", farmerSchema);
