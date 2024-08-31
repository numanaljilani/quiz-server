const mongoose = require('mongoose');

const SolvedQuestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  topics: {
    type: [String],
    required: true,
  },
  solvedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SolvedQuestion', SolvedQuestionSchema);
