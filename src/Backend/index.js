// Importing all required libraries.
const express = require("express");
const colors = require("colors");
const env = require("dotenv");

// Setting up the environment variables.
env.config();

// Instacing the app with express.
const app = express();

// Setting up some important server properties.
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Setting up the application database;
const database = require("./database/settings");

// Setting up the application routes path.
const indexRoutes = require("./controllers/api/v1/index");
const authRoutes = require("./controllers/api/v1/auth");
const partnerRoutes = require("./controllers/api/v1/partner");
const organizationRoutes = require("./controllers/api/v1/organization");

// Setting up the application routes itself.
app.use("/api/v1/", indexRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/partner", partnerRoutes);
app.use("/api/v1/organization", organizationRoutes);

// Setting up the application port.
const port = process.env.PORT || 4005;

// Listening port...
app.listen(port, error => {

    // Cleaning up the console.
    console.clear();

    // Printing the server status on screen.
    error ?
    console.log(colors.red(`There was an error while starting server...\n ${error}`)) :
    console.log(colors.green.bold(`🚀 Server started successfully. Listening http://localhost:${port}.`));

})