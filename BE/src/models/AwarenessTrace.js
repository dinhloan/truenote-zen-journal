import mongoose from "mongoose";

const awarenessTraceSchema = new mongoose.Schema(
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
    verificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Verification",
      required: true
    },
    awarenessStatement: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000
    },
    reminderStatement: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    certaintyLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    themes: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

awarenessTraceSchema.index({ userId: 1, dailyEntryId: 1 }, { unique: true });

awarenessTraceSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    dailyEntryId: this.dailyEntryId.toString(),
    verificationId: this.verificationId.toString(),
    awarenessStatement: this.awarenessStatement,
    reminderStatement: this.reminderStatement,
    certaintyLevel: this.certaintyLevel,
    themes: this.themes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const AwarenessTrace = mongoose.model("AwarenessTrace", awarenessTraceSchema);
