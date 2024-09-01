"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const questionsRoutes_1 = __importDefault(require("./routes/questionsRoutes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//The express.urlencoded() middleware is used to parse and extract this URL-encoded data from the request body and make it available in the req.body object for further processing in your application
app.use(express_1.default.urlencoded({ extended: true }));
// Define the path to the static HTML file
const publicPath = path_1.default.join(__dirname, '..', 'public');
// Serve static files from the 'public' directory
app.use(express_1.default.static(publicPath));
// Set up the default route to serve the HTML file
// Set up the default route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html'), (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send({ message: 'Internal server error' });
        }
    });
});
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'privacy.html'), (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send({ message: 'Internal server error' });
        }
    });
});
app.get("/", (req, res) => {
    res.send("<h2>Salon server is working</h2>");
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/question", questionsRoutes_1.default);
// app.use("/api", salonRoutes);
app.use("/uploads", express_1.default.static("uploads"));
// global.appRoot : any = path.resolve(path.resolve());
app.use(errorHandler_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
