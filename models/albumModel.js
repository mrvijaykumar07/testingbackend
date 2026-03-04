const albumSchema = new mongoose.Schema({

  albumName: {
    type: String,
    required: true,
    trim: true
  },

  clientName: {
    type: String,
    required: true
  },

  eventType: String,

  eventDate: Date,

  description: String,

  coverImage: {
    type: String,
    default: null
  },

  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Studio",
    required: true,
    index: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  publicSlug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  status: {
    type: String,
    enum: ["draft", "active", "archived", "deleted"],
    default: "draft",
    index: true
  },

  allowUserUploads: {
    type: Boolean,
    default: false
  },

  allowedUploaders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  totalPhotos: {
    type: Number,
    default: 0
  },

  processedPhotos: {
    type: Number,
    default: 0
  }

}, { timestamps: true });