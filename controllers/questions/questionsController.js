import Joi from "joi";
import CustomErrorHandler from "../../services/error/CustomErrorHandler.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addCloudServiceProviders = async (
  req,
  res,
  next
) => {
  // Joi Validation
  const cloudsSchema = Joi.object({
    name: Joi.string().required(),
  });
  const { error } = cloudsSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  const { name, sections } = req.body;
  try {
    // check user is in the database
    const user = await prisma.quizCategory.create({
      data: {
        name,
      },
    });
    console.log(user, "User ");

    //if not user sending error with message through custom errror handler
    if (!user) {
      return next(CustomErrorHandler.wrongCredentials());
    }

    // if user don't have any role then sending only with tokens
    res.status(200).json({
      data: {},
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const getCloudServiceProviders = async (
  req,
  res,
  next
) => {
  return res
    .status(200)
    .json({ data: await prisma.quizCategory.findMany(), success: true });
};
export const addCloudServiceProvidersSections = async (
  req,
  res,
  next
) => {
  // Joi Validation
  //   const cloudsSchema = Joi.object({
  //     name: Joi.string().required(),
  //   });
  //   const { error } = cloudsSchema.validate(req.body);
  //   if (error) {
  //     return next(error);
  //   }

  const names = req.body;
  console.log(names, "????");
  try {
    // check user is in the database
    for (const name in names) {
      await prisma.service.create({
        data: {
          name: names[name],
          sectionId: "66cc95021d3a1353026389d3",
        },
      });
    }

    // if user don't have any role then sending only with tokens
    res.status(200).json({
      data: {},
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const getCloudServiceProvidersSections = async (
  req,
  res,
  next
) => {
  const id = req.params.id;
  console.log(id, "Id");

  try {
    // if user don't have any role then sending only with tokens
    res.status(200).json({
      data: await prisma.service.findMany({ where: { sectionId: id } }),
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
export const getCloudServiceProvidersSectionsTopics = async (
  req,
  res,
  next
) => {
  const id = req.params.id;

  try {
    // if user don't have any role then sending only with tokens
    res.status(200).json({
      data: await prisma.topic.findMany({ where: { serviceId: id } }),
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const addCloudServiceProvidersSectionsTopics = async (
  req,
  res,
  next
) => {
  // Joi Validation
  //   const cloudsSchema = Joi.object({
  //     name: Joi.string().required(),
  //   });
  //   const { error } = cloudsSchema.validate(req.body);
  //   if (error) {
  //     return next(error);
  //   }

  const data = req.body;
  //   console.log(data, "????");
  try {
    // check user is in the database

    for (let serv in data) {
      // console.log(data[serv].services)
      const services = await prisma.service.findMany({
        where: {
          AND: [
            {
              name: {
                equals: data[serv].category,
                mode: "insensitive",
              },
              sectionId: "66cc95021d3a1353026389d3",
            },
          ],
        },
      });
      if (services[0]) {
        // console.log(services[0]?.id);
        // console.log(data[serv].services);
        for (let topic in data[serv].services) {
          //   console.log(data[serv].services[topic]);
          await prisma.topic.create({
            data: {
              serviceId: services[0]?.id,
              name: data[serv].services[topic],
            },
          });
        }
      }
    }

    //   for(const name  in names){
    //       await prisma.service.create({
    //           data: {
    //             name : names[name],
    //             sectionId : '66cc95021d3a1353026389d3'
    //           },
    //         });
    //   }

    // if user don't have any role then sending only with tokens
    res.status(200).json({
      data: {},
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const addQuestions = async (
  req,
  res,
  next
) => {
  // Joi Validation
  const addQuestionsSchema = Joi.object({
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).length(4).required(), // Assuming `options` is an array of strings with exactly 4 items
    correct_answer: Joi.string().required(),
    topics: Joi.array().items(Joi.string()).required(), // Assuming `topics` is an array of strings
    weightage: Joi.number().required(),
    type: Joi.array().items(Joi.string()).required(), // Assuming `type` is an array of strings
    exams: Joi.array().items(Joi.string()).required(), // Assuming `exams` is an array of strings
    index: Joi.any(), // Assuming `exams` is an array of strings
  });

  const addQuestionsSchemaArray = Joi.array()
    .items(addQuestionsSchema)
    .required();
  const { error } = addQuestionsSchemaArray.validate(req.body);
  if (error) {
    return next(error);
  }

  const questions = req.body;
  try {
    for (let at in questions) {
      console.log(questions[at]);
      const typesIds = await prisma.service
        .findMany({
          where: {
            name: { in: questions[at].type }, // Replace with the actual exam names
            sectionId: "66cc94e11d3a1353026389d1",
          },
          select: { id: true },
        })
        .then((types) => types.map((type) => type.id));

      // console.log(typesIds, "<<<<<");

      // check question is in the database
      const topicIds = await prisma.topic
        .findMany({
          where: {
            name: { in: questions[at].topics }, // Replace with the actual topic names
          },
          select: { id: true },
        })
        .then((topics) => topics.map((topic) => topic.id));

      // console.log(topicIds, "Topic Ids");

      // Fetch the exam IDs based on their names
      const examIds = await prisma.exams
        .findMany({
          where: {
            fname: { in: questions[at].exams }, // Replace with the actual exam names
          },
          select: { id: true },
        })
        .then((exams) => exams.map((exam) => exam.id));

      const newQuestion = await prisma.question.createMany({
        data: {
          question: questions[at].question,
          correct_answer: questions[at].correct_answer,
          options: questions[at].options,
          weightage: questions[at].weightage,
          examsId: examIds,
          topicsId: topicIds,
          typeId: typesIds,
        },
      });
    }

    // console.log(user, "User ");

    // //if not user sending error with message through custom errror handler
    // if (!user) {
    //   return next(CustomErrorHandler.wrongCredentials());
    // }

    // if user don't have any role then sending only with tokens
    res.status(200).json({
      data: { data: req.body },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const addExams = async (
  req,
  res,
  next
) => {
  // Joi Validation
  const addExamSchema = Joi.object({
    fullName: Joi.string().required(),
    shortName: Joi.string().required(),
  });

  const addQExamsSchemaArray = Joi.array().items(addExamSchema).required();
  const { error } = addQExamsSchemaArray.validate(req.body);
  if (error) {
    return next(error);
  }

  const exams = req.body;
  try {
    for (let at in exams) {
      console.log(exams[at]);
      await prisma.exams.create({
        data: {
          fname: exams[at].fullName,
          sname: exams[at].shortName,
          quizCategoryId: "66cc94e11d3a1353026389d1",
        },
      });
    }

    res.status(200).json({
      data: { data: await prisma.exams.findMany() },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const getQuestions = async (
  req,
  res,
  next
) => {
  const { lavel, topic } = req.query;
  console.log(lavel, topic);
  try {
    res.status(200).json({
      data: {
        data: await prisma.question.findMany({
          where: { topicsId: { has: topic?.toString() } },
          take: 10,
          skip: (Number(lavel) - 1) * 10,
        }),
      },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const getLevels = async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  console.log(id ,"id")
  try {
    const questions = await prisma.question.count({
      where: { topicsId: { has: id } },
    });
    const completedQuestions = await prisma.solvedQuestion.count({
      where: { question: { topicsId: { has: id } } },
    });
    res.status(200).json({
      data: {
        questions,
        completedQuestions,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const submitQuestions = async (
  req,
  res,
  next
) => {
  // Joi Validation
  const submitQuestionsSchema = Joi.object({
    questionId: Joi.string().required(), // Assuming `options` is an array of strings with exactly 4 items
    correct_answer: Joi.boolean().required(),
  });

  const submitQuestionsSchemaArray = Joi.array()
    .items(submitQuestionsSchema)
    .required();
  const { error } = submitQuestionsSchemaArray.validate(req.body);
  if (error) {
    return next(error);
  }
  const { lavel, topic } = req.query;
  console.log(lavel, topic);
  const data = req.body;
  try {
    // const sloved = await prisma.solvedQuestion.create({
    //   data: {
    //     isCorrect: true,
    //     questionId: "",
    //     userId: req!.user.id,
    //   },
    // });
    res.status(200).json({
      data: {
        data: await prisma.question.findMany({
          where: { topicsId: { has: topic?.toString() } },
          take: 10,
          skip: (Number(lavel) - 1) * 10,
        }),
      },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const levelsQuestions = async (
  req,
  res,
  next
) => {
  // Joi Validation

  const { lavel, topic } = req.query;
  console.log(lavel, topic);
  try {
    // const slovedLevels = await prisma.solvedQuestion.findMany({
    //   where: {
    //     userId: req!.user.id,
    //     question: { topicsId: { has: topic?.toString() } },
    //   },
    // });
    res.status(200).json({
      data: {
        data: await prisma.question.findMany({
          where: { topicsId: { has: topic?.toString() } },
          take: 10,
          skip: (Number(lavel) - 1) * 10,
        }),
      },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
