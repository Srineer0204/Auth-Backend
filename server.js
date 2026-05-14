const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

require('dotenv').config();
require("./config/db"); //Database connection
app.use(express.json()); // Middleware to parse JSON
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
const authRoutes = require('./routes/authRoutes');// Import routes

app.use("/api/auth",authRoutes); //Route prefix

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});