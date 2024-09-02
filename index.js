const express = require('express')
// import express from "express";
const app = express();

// import authRoutes from "./routes/authRoutes.js";
// import questionsRoutes from "./routes/questionsRoutes.js";
// import errorHandler from "./middlewares/errorHandler.js";


// import cors from "cors"
const cors = require("cors")

app.use(express.json());
app.use(cors())

//The express.urlencoded() middleware is used to parse and extract this URL-encoded data from the request body and make it available in the req.body object for further processing in your application
app.use(express.urlencoded({ extended: true }));

// Define the path to the static HTML file
// const publicPath = path.join(dirname('public'), 'public');
// console.log(dirname('public'))
// Serve static files from the 'public' directory
app.use(express.static("./public"));
// Set up the default route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile('./index.html', (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send({ message: 'Internal server error' });
    }
  });
});
app.get('/privacy-policy', (req, res) => {
  res.sendFile('./privacy.html', (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send({ message: 'Internal server error' });
    }
  });
});




// app.use("/api/auth", authRoutes);
// app.use("/api/question", questionsRoutes);


// global.appRoot : any = path.resolve(path.resolve());

// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
