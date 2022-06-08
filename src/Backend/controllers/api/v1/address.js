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

router.post("/create", auth, hasMinimumPartnerRole, (req, res) => {

    // Getting all required attributes from request body.
    const { organization_id, type_of_logradouro, logradouro, number, complement, neighborhood, city, state, cep } = req.body;

    // Executing the action...
    Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

        const hasTheOrganizationAnAddress =  await db.get(`SELECT * FROM Endereco WHERE "id_do_estabelecimento"=${organization_id}`);

        if(hasTheOrganizationAnAddress) {
            return res.send({
                "status": 409,
                "error": {
                  "code": 0,
                  "title": "The target organization already has an address registered.",
                  "detail": "It is not possible to create another address to this organization.",
                  "source": {
                    "pointer": "/controllers/api/v1/address.js"
                  }
                }
              })
        }

        
        const address = {};
        try {
          address.create = await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Endereco("id_do_estabelecimento","tipo_do_logradouro","logradouro","numero","complemento","bairro","cidade","estado","cep") VALUES(${organization_id}, "${type_of_logradouro}", "${logradouro}", "${number}", "${complement}", "${neighborhood}", "${city}", "${state}", "${cep}")`);
        } catch (e) {
          return res.send(
            {
              "status": 401,
              "error": {
                "code": 0,
                "title": "Invalid accountable id.",
                "detail": "The accountable id provided are not registered in our database. It is not possible to create a partner without provide a valid accountable id.",
                "source": {
                  "pointer": "/controllers/api/v1/order.js"
                }
              }
        })
        }
            
            address.info = await db.get(`SELECT * FROM Endereco WHERE "id_do_estabelecimento"=${organization_id}`),
            res.send({
            "status": 200,
            "success": {
              "code": 0,
              "title": "Address created successfully.",
              "data": address.info,
              "source": {
                "pointer": "/controllers/api/v1/address.js"
              }
            }
          })

    })
})

module.exports = router;