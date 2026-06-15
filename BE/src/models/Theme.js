import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    traceCount: {
      type: Number,
      default: 0,
      min: 0
    },
    relatedThemes: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

themeSchema.index({ userId: 1, name: 1 }, { unique: true });

themeSchema.methods.toClient = function toClient() {
  return {
    id: this._id.toString(),
    userId: this.userId.toString(),
    name: this.name,
    traceCount: this.traceCount,
    relatedThemes: this.relatedThemes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Theme = mongoose.model("Theme", themeSchema);
