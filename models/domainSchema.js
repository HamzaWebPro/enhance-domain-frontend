import mongoose from "mongoose";

const domainSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Paid", "Payment Issue"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Domain = mongoose.models.Domain || mongoose.model("Domain", domainSchema);

export default Domain;
