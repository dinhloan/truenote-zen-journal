import mongoose from "mongoose";

const realityCheckSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    dailyEntryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailyEntry",
      required: true,
      index: true
    },
    facts: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

realityCheckSchema.index({ userId: 1, dailyEntryId: 1 }, { unique: true });

realityCheckSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    dailyEntryId: this.dailyEntryId.toString(),
    facts: this.facts,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const RealityCheck = mongoose.model("RealityCheck", realityCheckSchema);
