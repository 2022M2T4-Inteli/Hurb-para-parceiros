// Importing all required libraries.
const express = require("express");
const jwt = require("jsonwebtoken");
const Database = require("sqlite-async");

// Importing all required files.
const auth = require("../../../middlewares/auth");
const hasMinimumPartnerRole = require("../../../middlewares/hasMinimumPartnerRole");
const hasMinimumAdministratorRole = require("../../../middlewares/hasMinimumAdministratorRole");

// Instacing the application router.
const router = express.Router();

router.post("/create", auth, hasMinimumAdministratorRole, (req, res) => {

    // Getting all required attributes from request body.
    const { name, tax } = req.body;

    // Executing the action...
    Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
        
        // Trying to create the new modality...
        try {
            await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Modalidade_de_antecipacao("nome","taxa") VALUES("${name}","${tax}")`);
        } catch (e) {
            return res.send(
                {
                  "status": 401,
                  "error": {
                    "code": 0,
                    "title": "Existent name or tax.",
                    "detail": "Already exists a modality with the inputed name or tax. Please change its values and try again.",
                    "source": {
                      "pointer": "/controllers/api/v1/modality.js"
                    }
                  }
                }
              )
        }

        // Getting the created anticipation modality from database.
        const modality = await db.get(`SELECT * FROM Modalidade_de_antecipacao WHERE "nome" = "${name}"`);

        // Sending the success response...
        res.send({
            "status": 200,
            "success": {
              "code": 0,
              "title": "Anticipation modality created successfully.",
              "data": modality,
              "source": {
                "pointer": "/controllers/api/v1/modality.js"
              }
            }
          })

    })

})

module.exports = router;