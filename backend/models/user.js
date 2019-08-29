const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isDesigner: { type: Boolean, default: false, required: true },
  downloads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
  skills: { type: String },
  description: { type: String }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
