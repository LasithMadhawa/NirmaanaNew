const mongoose = require("mongoose");

const artworkSchema = mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  preview: { type: String, required: true },
  imagePath: { type: String, required: true },
  zipFilePath: { type: String, required: true },
  tags: { type: JSON, required: true },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Artwork", artworkSchema);
