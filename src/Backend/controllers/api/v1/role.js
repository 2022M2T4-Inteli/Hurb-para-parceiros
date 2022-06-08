// Importing all required libraries.
const express = require("express");
const jwt = require("jsonwebtoken");
const Database = require("sqlite-async");

// Importing all required files.
const auth = require("../../../middlewares/auth");
const hasMinimumAdministratorRole = require("../../../middlewares/hasMinimumAdministratorRole");

// Instacing the application router.
const router = express.Router();

router.post("/create", auth, hasMinimumAdministratorRole, (req, res) => {

    // Getting all required attributes from request body.
    const { access_level, name } = req.body;

    // Executing the action...
    Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
        
        // Trying to create the new role...
        try {
            await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Cargo("nivel_de_acesso","nome") VALUES("${access_level}","${name}")`);
        } catch (e) {
            return res.send(
                {
                  "status": 401,
                  "error": {
                    "code": 0,
                    "title": "Existent role name.",
                    "detail": "Already exists a role with the inputed name. Please change it value and try again.",
                    "source": {
                      "pointer": "/controllers/api/v1/role.js"
                    }
                  }
                }
              )
        }

        // Getting the created anticipation modality from database.
        const role = await db.get(`SELECT * FROM Cargo WHERE "nome" = "${name}"`);

        // Sending the success response...
        res.send({
            "status": 200,
            "success": {
              "code": 0,
              "title": "Role created successfully.",
              "data": role,
              "source": {
                "pointer": "/controllers/api/v1/role.js"
              }
            }
          })

    })

})

module.exports = router;