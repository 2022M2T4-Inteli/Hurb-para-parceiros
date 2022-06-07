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
const userRoutes = require("./controllers/api/v1/user");
const partnerRoutes = require("./controllers/api/v1/partner");
const organizationRoutes = require("./controllers/api/v1/organization");
const bankAccountRoutes = require("./controllers/api/v1/bankAccount");
const addressRoutes = require("./controllers/api/v1/address");

// Setting up the application routes itself.
app.use("/api/v1/", indexRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/partner", partnerRoutes);
app.use("/api/v1/organization", organizationRoutes);
app.use("/api/v1/bank-account", bankAccountRoutes);
app.use("/api/v1/address", addressRoutes);

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