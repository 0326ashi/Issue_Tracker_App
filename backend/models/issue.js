const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    severity: {
      type: String,
      enum: ["Minor", "Major", "Critical"],
      default: "Minor",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Issue", issueSchema);
