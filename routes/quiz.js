const express = require("express");
const router = express.Router();
const Question = require("../models/Questions");
const SolveQuestions = require("../models/SolveQuestions");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get 10 random questions
router.get("/questions", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const completedQuestionIds = user.completedQuestions.map((q) => q.question);

    const questions = await Question.aggregate([
      { $match: { _id: { $nin: completedQuestionIds } } },
      { $sample: { size: 10 } },
      { $project: { correctAnswer: 0 } },
    ]);

    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add multiple questions simultaneously
router.post("/add-questions", async (req, res) => {
  try {
    const questions = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an array of questions" });
    }

    const questionDocs = questions.map((q) => ({
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      topics: [...q.topics, ...q.exams],
      weightage: q.weightage,
      type: q.type,
    }));
    console.log(questionDocs, "Questions");
    const createdQuestions = await Question.insertMany(questionDocs);

    res
      .status(201)
      .json({
        message: `${createdQuestions.length} questions added successfully`,
        createdQuestions,
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/questions/by-topics", async (req, res) => {
  try {
    const topic = req.query.topics; // Expecting an array of topics from query params
    console.log(topic , "Topics");
    const questions = await Question.find({
      topics: {
        $in: topic,
      },
    });
    console.log(questions);
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/questions/levels", async (req, res) => {
  try {
    const topic = req.query.topics; // Expecting an array of topics from query params
   
    console.log("Topics:", topic);

    // Count the number of questions where any of the provided topics match
    const count = await Question.countDocuments({
      topics: {
        $in: topic,
      },
    });

    console.log("Number of questions found:", count);

    // Return the count only
    res.json({
      count: count
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Submit answers
// router.post("/submit", auth, async (req, res) => {
//   try {
//     const { answers } = req.body;
//     const user = await User.findById(req.user.id);

//     const results = await Promise.all(
//       answers.map(async (answer) => {
//         const question = await Question.findById(answer.questionId);
//         const isCorrect = question.correctAnswer === answer.selectedAnswer;

//         user.completedQuestions.push({
//           question: question._id,
//           isCorrect,
//         });

//         return {
//           questionId: question._id,
//           isCorrect,
//           correctAnswer: question.correctAnswer,
//         };
//       })
//     );

//     await user.save();

//     res.json(results);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// Get user progress
router.get("/progress", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "completedQuestions.question",
      "topics difficulty"
    );

    const progress = {
      totalQuestions: user.completedQuestions.length,
      correctAnswers: user.completedQuestions.filter((q) => q.isCorrect).length,
      topicBreakdown: {},
      difficultyBreakdown: {
        easy: { total: 0, correct: 0 },
        medium: { total: 0, correct: 0 },
        hard: { total: 0, correct: 0 },
      },
    };

    user.completedQuestions.forEach((q) => {
      q.question.topics.forEach((topic) => {
        if (!progress.topicBreakdown[topic]) {
          progress.topicBreakdown[topic] = { total: 0, correct: 0 };
        }
        progress.topicBreakdown[topic].total++;
        if (q.isCorrect) progress.topicBreakdown[topic].correct++;
      });

      progress.difficultyBreakdown[q.question.difficulty].total++;
      if (q.isCorrect)
        progress.difficultyBreakdown[q.question.difficulty].correct++;
    });

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.post('/submit', auth, async (req, res) => {
  try {
    const  questions  = req.body;
    // console.log(">>>",req.body,"<<<<")

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ msg: 'Please provide an array of questions' });
    }

    const solvedQuestions = [];

    for (const questionData of questions) {
      const { _id, isCorrect } = questionData;

      if (!_id || typeof isCorrect !== 'boolean') {
        return res.status(400).json({ msg: 'Each question must include questionId and isCorrect status' });
      }

      // Find the question by ID
      const question = await Question.findById(_id);
      if (!question) {
        return res.status(404).json({ msg: `Question with ID ${_id} not found` });
      }

      // Create a new solved question entry
      const solvedQuestion = new SolvedQuestion({
        user: req.user.id,
        question: _id,
        isCorrect,
        topics: question.topics,
      });

      solvedQuestions.push(solvedQuestion);
    }

    // Save all solved questions at once
    await SolvedQuestion.insertMany(solvedQuestions);

    res.status(201).json({ msg: 'Solved questions added successfully', solvedQuestions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
