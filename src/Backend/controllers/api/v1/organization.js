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
        

        const organization = {}

        try{
          organization.create = await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Estabelecimento("id_do_parceiro_responsavel","nome","telefone","cnpj","quantidade_de_quartos") VALUES(${partner_id},"${name}","${telephone}","${cnpj}",${quantity_of_rooms})`);
        } catch(e){
            return res.send({
              "status": 401,
              "error":{
                "code":0,
                "title": "Invalid partner id",
                "detail":"The partner id provided are not registered in our database. It is not possible to create the reservation without provide a valid organization id.",
                "source":{
                  "pointer": "/controllers/api/v1/organization.js"
                }
              }
            })
        }
        organization.info = await db.get(`SELECT * FROM Estabelecimento WHERE "id_do_parceiro_responsavel" = ${partner_id} AND "cnpj" = "${cnpj}"`),
        // Sending a successful response
         res.send({
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