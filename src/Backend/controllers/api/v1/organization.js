// Importing all required libraries.
const express = require("express");
const Database = require("sqlite-async");

// Importing all required files.
const auth = require("../../../middlewares/auth");
const hasMinimumPartnerRole = require("../../../middlewares/hasMinimumPartnerRole");
const hasMinimumAdministratorRole = require("../../../middlewares/hasMinimumAdministratorRole");

// Instacing the application router.
const router = express.Router();

router.post("/create", auth, hasMinimumAdministratorRole, async (req, res) => {

    // Getting all required attributes from request body.
    const { partner_id, name, telephone, cnpj, quantity_of_rooms } = req.body;

    // Executing the action...
    Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
        
        const organization = {
            create : await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Estabelecimento("id_do_parceiro_responsavel","nome","telefone","cnpj","quantidade_de_quartos") VALUES(${partner_id},"${name}","${telephone}","${cnpj}",${quantity_of_rooms})`),
            info : await db.get(`SELECT * FROM Estabelecimento WHERE "id_do_parceiro_responsavel" = ${partner_id} AND "cnpj" = "${cnpj}"`),
        }

        return res.send({
            "status": 200,
            "success": {
              "code": 0,
              "title": "Organization created successfully.",
              "data": organization.info,
              "source": {
                "pointer": "/controllers/api/v1/organization.js"
              }
            }
          })
        
    })

})

// Exporting the application router.
module.exports = router;