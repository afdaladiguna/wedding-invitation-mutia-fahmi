const mongoose = require("mongoose");
const { Schema } = mongoose;

const RsvpSchema = new Schema({
  statusHadir: String,
  nama: String,
  jumlahTamu: Number,
});

module.exports = mongoose.model("Rsvp", RsvpSchema);