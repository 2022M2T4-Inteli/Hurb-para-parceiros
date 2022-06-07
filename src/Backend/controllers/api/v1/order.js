// Importing all required libraries.
const express = require("express");
const jwt = require("jsonwebtoken");
const Database = require("sqlite-async");

// Importing all required files.
const auth = require("../../../middlewares/auth");
const hasMicdnimumPartnerRole = require("../../../middlewares/hasMinimumPartnerRole");
const hasMinimumAdministratorRole = require("../../../middlewares/hasMinimumAdministratorRole");

// Instacing the application router.
const router = express.Router();

router.post("/create", auth, hasMinimumAdministratorRole, async(req, res) => {

    // Getting all required attributes from request body.
    const{ modality,solicitationDate,status } = req.body;

    // Executing the action...
    Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
      

    const orders = {
      create : await db.run(`INSERT INTO Pedido ("id_da_modalidade", "data_de_solicitacao","status") VALUES (${modality},"${solicitationDate}","${status}")`),
      info : await db.get(`SELECT * FROM Pedido WHERE "id_da_modalidade" = ${modality}`),
    }

    // Sending a successful response
    return res.send({
      "status" : 200,
      "success" : {
        "code" : 0,
        "title" : "The order was successful",
        "data" : orders.info,
        "source":{
          "pointer" : "/controllers/api/v1/orders.js"
        }
      }
    })

  })
})


// Exporting the application router.
module.exports = router;