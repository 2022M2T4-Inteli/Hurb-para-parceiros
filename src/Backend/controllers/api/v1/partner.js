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
    const { accountable_id, full_name, telephone, cpf } = req.body.partner;

    // Executing the action...
    Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
        
        const partner = {
            create : await db.run(`INSERT INTO Parceiro("id_do_usuario_responsavel","nome_completo","telefone","cpf") VALUES(${accountable_id},"${full_name}","${telephone}","${cpf}")`),
            info : await db.get(`SELECT * FROM Parceiro WHERE "id_do_usuario_responsavel" = ${accountable_id}`),
        }

        res.send({
            "status": 200,
            "success": {
              "code": 0,
              "title": "Partner created successfully.",
              "data": partner.info,
              "source": {
                "pointer": "/controllers/api/v1/partner.js"
              }
            }
          })
        
    })

})

// Exporting the application router.
module.exports = router;