// Importing all required libraries.
const express = require("express");

// Importing all required files.
const auth = require("../../../middlewares/auth");
const hasMinimumPartnerRole = require("../../../middlewares/hasMinimumPartnerRole");
const hasMinimumAdministratorRole = require("../../../middlewares/hasMinimumAdministratorRole");

// Instacing the application router.
const router = express.Router();

// Defining an application route.
router.get("/", async (req, res) => {
    res.send(
        {
        "status": 200,
        "success": {
          "jsonapi": {
            "name": "Hurb",
            "host": "http://localhost",
            "port": process.env.port || 4000,
            "version": "1.0",
            "environment": "development"
          }
        }
        }
      )
})

// Exporting the application router.
module.exports = router;