// Importing all required libraries.
const express = require("express");
const Database = require("sqlite-async");

// Importing all required files.
const auth = require("../../../middlewares/auth");
const hasMinimumPartnerRole = require("../../../middlewares/hasMinimumPartnerRole");
const hasMinimumAdministratorRole = require("../../../middlewares/hasMinimumAdministratorRole");

// Instacing the application router.
const router = express.Router();

router.get("/", auth, hasMinimumPartnerRole, async (req, res) => {
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
    // Getting all users from database.
    let users = await db.all(`SELECT * FROM Parceiro`);

    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "Users gotted successfully",
        "data": users,
        "source": {
          "pointer": "/controllers/api/v1/user.js"
        }
      }
    });

  })
})

router.post("/create", auth, hasMinimumAdministratorRole, async (req, res) => {

    // Getting all required attributes from request body.
    const { accountable_id, full_name, telephone, cpf } = req.body;

    // Executing the action...
    Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
        

        const partner = {};

        try {
          partner.create = await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Parceiro("id_do_usuario_responsavel","nome_completo","telefone","cpf") VALUES(${accountable_id},"${full_name}","${telephone}","${cpf}")`);
        } catch (e) {
          return res.send(
            {
              "status": 401,
              "error": {
                "code": 0,
                "title": "Invalid accountable id or cpf already registered",
                "detail": "The accountable id provided are not registered in our database or the inputed cpf is already registered in our database.",
                "source": {
                  "pointer": "/controllers/api/v1/order.js"
                }
              }
            }
          )
        }
        
        partner.info = await db.get(`SELECT * FROM Parceiro WHERE "id_do_usuario_responsavel" = ${accountable_id} AND "cpf"="${cpf}"`);

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

router.get("/:id/organizations", auth, hasMinimumPartnerRole, async (req, res) => {
  const { id } = req.params;

  // Executing the action...
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
    const organizations = await db.all(`SELECT * FROM Estabelecimento WHERE id_do_parceiro_responsavel = ${id}`);

    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "Organizations gotted successfully",
        "data": organizations,
        "source": {
          "pointer": "/controllers/api/v1/partner.js"
        }
      }
    });
  })
})

// Exporting the application router.
module.exports = router;