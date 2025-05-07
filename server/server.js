const express = require("express");
const cors = require("cors")
const path = require("path")
require("express-async-errors"); // This must come *before* routes
const homeRoute = require("./routes/homeRoute");
const strategyRoute = require('./routes/strategyRoute');
const dotenv = require("dotenv");
const signupRoute = require("./routes/signupRoute")
const loginRoute = require("./routes/loginRoute")
const programsRoute = require("./routes/programsRoute")
const notificationsRoute = require("./routes/notificationsRoute")
const ratingsRoute = require("./routes/ratingsRoute")
const uploadprofileRoute = require("./routes/uploadprofileRoute")

dotenv.config();
const app = express();


app.use(cors({
    origin: ['http://localhost:5173', 'https://peak-academy-client.vercel.app'], // array of allowed origins
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

// Serve static files from the "uploads" directory
app.use(express.static(path.join(__dirname, 'public')));  
// Handle uncaught exceptions (e.g., undefined variables, bugs)
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections (e.g., missing .catch)
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
    process.exit(1);
});

// Register routes
app.use(express.json())
app.use("/", homeRoute);
app.use("/api", strategyRoute);
app.use("/api", signupRoute);
app.use("/api", loginRoute);
app.use("/api", programsRoute);
app.use("/api", notificationsRoute);
app.use("/", ratingsRoute);
app.use("/api", uploadprofileRoute);

app.get("/test", (req, res) => {
    res.send("Welcome to the Peak Performance Tutoring API!")
})

// Error-handling middleware (must be after routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(process.env.PORT||3500, () => {
    console.log("Server running on port 3500");
});
