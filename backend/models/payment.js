const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  artworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artwork",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  creationDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Payment", paymentSchema);
