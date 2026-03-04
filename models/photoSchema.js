import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({

  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
    required: true,
    index: true
  },

  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Studio",
    required: true,
    index: true
  },

  imageUrl: {
    type: String,
    required: true
  },

  thumbnailUrl: {
    type: String,
    default: null
  },

  originalName: {
    type: String,
    required: true
  },

  size: {
    type: Number,
    required: true
  },

  mimetype: {
    type: String,
    required: true
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  /* ==============================
     PROCESSING STATUS
  ============================== */

  processingStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
    index: true
  },

  facesDetected: {
    type: Number,
    default: 0
  },

  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },

pythonProcessedAt: Date,
embeddingStatus: {
  type: String,
  enum: ["pending", "stored", "failed"],
  default: "pending"
}
}, { timestamps: true });


photoSchema.index({ album: 1, createdAt: -1 });
photoSchema.index({ album: 1, processingStatus: 1 });

export const Photo = mongoose.model("Photo", photoSchema);