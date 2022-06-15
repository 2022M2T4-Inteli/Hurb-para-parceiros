// Importing all required libraries.
const express = require("express");
const Database = require("sqlite-async");

// Importing all required files.
const auth = require("../../../middlewares/auth");
const hasMinimumPartnerRole = require("../../../middlewares/hasMinimumPartnerRole");
const hasMinimumAdministratorRole = require("../../../middlewares/hasMinimumAdministratorRole");

// Instacing the application router.
const router = express.Router();

router.get("/:id/orders", auth, hasMinimumPartnerRole, async(req, res) => {
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

    const organization_id = req.params.id;

    const orders = await db.all(`SELECT * FROM Pedido WHERE "id_do_estabelecimento" = ${organization_id}`);

    if(!orders) {
      return res.send({
        "status": 401,
        "error":{
          "code":0,
          "title": "No orders founded.",
          "detail":"There's no orders associated to this organization.",
          "source":{
            "pointer": "/controllers/api/v1/organization.js"
          }
        }
      })
    }

    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "Orders gotted successfully",
        "data": orders,
        "source": {
          "pointer": "/controllers/api/v1/organization.js"
        }
      }
    });

  })
})

router.get("/", auth, hasMinimumPartnerRole, async (req, res) => {
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
    // Getting all users from database.
    let organizations = await db.all(`SELECT * FROM Estabelecimento`);

    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "Organizations gotted successfully",
        "data": organizations,
        "source": {
          "pointer": "/controllers/api/v1/organization.js"
        }
      }
    });

  })
})

router.get("/:id/bank-account", auth, hasMinimumPartnerRole, async(req, res) => {
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

    const organization_id = req.params.id;

    const bankAccount = await db.get(`SELECT * FROM Conta_bancaria WHERE id_do_estabelecimento = ${organization_id}`);

    if(!bankAccount) {
      return res.send({
        "status": 401,
        "error":{
          "code":0,
          "title": "No bank account founded.",
          "detail":"There's no bank account associated to this organization.",
          "source":{
            "pointer": "/controllers/api/v1/organization.js"
          }
        }
      })
    }

    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "Bank account gotted successfully",
        "data": bankAccount,
        "source": {
          "pointer": "/controllers/api/v1/organization.js"
        }
      }
    });

  })
})

router.get("/:id/avaiable-reservations", auth, hasMinimumPartnerRole, async (req, res) => {
  
  const { id } = req.params;

  // Executing the action...
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
    
    const avaiableReservations = await db.all(`SELECT * FROM Reserva WHERE id_do_estabelecimento = ${id} AND status = "pending"`);

    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "Avaiable reservations gotted successfully",
        "data": avaiableReservations,
        "source": {
          "pointer": "/controllers/api/v1/organization.js"
        }
      }
    });
  })

})

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
                "title": "Invalid partner id or repeated cnpj",
                "detail":"The partner id provided are not registered in our database or the cnpj provided is already registered.",
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