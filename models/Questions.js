const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} must have exactly 4 options']
  },
  correct_answer: {
    type: String,
    required: true,
    trim: true
  },
  topics: {
    type: [String],
    required: true
  },
  // exams: {
  //   type: [String],
  //   required: true,
  //   // enum: ['SAA', 'DA', 'DVA', 'SOA', 'ANS', 'DBS', 'DOP', 'MLS', 'SAP', 'SCS'] // List of possible exams
  // },
  weightage: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  }
}, {
  timestamps: true
});

// Custom validator to ensure exactly 4 options
function arrayLimit(val) {
  return val.length === 4;
}

// Separate indexes
// QuestionSchema.index({ topics: 1 });
// QuestionSchema.index({ exams: 2 });

// Compound index combining an array field and a non-array field
// QuestionSchema.index({ topics: 1, weightage: 1 });
// QuestionSchema.index({ exams: 1, weightage: 2 });

module.exports = mongoose.model('Question', QuestionSchema);
