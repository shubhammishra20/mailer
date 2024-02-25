require("dotenv").config();
const express = require('express');
const emailRoutes = require('./routes/routsEmails');
const { dataBase } = require("./db/db");

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/dataBaseName"

dataBase(DATABASE_URL);
app.use(express.json());

// Routes
app.use('/emails', emailRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
