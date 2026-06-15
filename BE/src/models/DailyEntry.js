import mongoose from "mongoose";

const dailyEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/
    },
    rawContent: {
      type: String,
      default: "",
      maxlength: 20000
    },
    status: {
      type: String,
      enum: ["writing", "raw", "checking", "completed"],
      default: "writing"
    }
  },
  { timestamps: true }
);

dailyEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

dailyEntrySchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    date: this.date,
    rawContent: this.rawContent,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const DailyEntry = mongoose.model("DailyEntry", dailyEntrySchema);
