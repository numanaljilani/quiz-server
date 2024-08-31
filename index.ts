import express, { Request, Response } from "express";
const app = express();

import authRoutes from "./routes/authRoutes";
import questionsRoutes from "./routes/questionsRoutes";
import errorHandler from "./middlewares/errorHandler";
import cors from 'cors'


app.use(express.json());
app.use(cors())

//The express.urlencoded() middleware is used to parse and extract this URL-encoded data from the request body and make it available in the req.body object for further processing in your application
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("<h2>Salon server is working</h2>");
});

app.use("/api/auth", authRoutes);
app.use("/api/question", questionsRoutes);
// app.use("/api", salonRoutes);

app.use("/uploads", express.static("uploads"));

// global.appRoot : any = path.resolve(path.resolve());

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
