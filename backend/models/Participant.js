// Participant.js
const mongoose = require('mongoose');
const ParticipantSchema = new mongoose.Schema({
  firstname: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Participant', ParticipantSchema);