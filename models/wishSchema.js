const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishSchema = new Schema(
  {
    nama: String,
    wish: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false, // Disable automatic timestamps
  }
);

// Middleware to convert Date to String before saving
WishSchema.pre("save", function (next) {
  const now = new Date();
  this.created_at = now;
  this.updated_at = now;
  next();
});

module.exports = mongoose.model("Wish", WishSchema);
