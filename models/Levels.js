const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  levelNumber: {
    type: Number,
    required: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },
  service: {
    type: String,
    default: null,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Level', LevelSchema);
