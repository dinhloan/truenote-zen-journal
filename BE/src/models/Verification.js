import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
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
    beliefBeingChecked: {
      type: String,
      default: "",
      maxlength: 1000
    },
    beliefLevelBefore: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    supportingBasis: {
      type: [String],
      default: []
    },
    isBasisEnough: {
      type: String,
      enum: ["enough", "not_enough", "unsure"],
      default: "unsure"
    },
    alternativePossibilities: {
      type: [String],
      default: []
    },
    reasoningConclusion: {
      type: String,
      default: "",
      maxlength: 3000
    },
    beliefLevelAfter: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  },
  { timestamps: true }
);

verificationSchema.index({ userId: 1, dailyEntryId: 1 }, { unique: true });

verificationSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    dailyEntryId: this.dailyEntryId.toString(),
    beliefBeingChecked: this.beliefBeingChecked,
    beliefLevelBefore: this.beliefLevelBefore,
    supportingBasis: this.supportingBasis,
    isBasisEnough: this.isBasisEnough,
    alternativePossibilities: this.alternativePossibilities,
    reasoningConclusion: this.reasoningConclusion,
    beliefLevelAfter: this.beliefLevelAfter,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Verification = mongoose.model("Verification", verificationSchema);
