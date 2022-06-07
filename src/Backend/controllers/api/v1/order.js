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

router.post("/create", auth, hasMinimumAdministratorRole, async(req, res) => {

    // Getting all required attributes from request body.
    const{ organization_id, modality_id, reservations_id } = req.body;

    // Defining the request date. 
    const date = new Date().toISOString().substr(0, 19).replace('T', ' ');

    // Executing the action...
    Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

      // Checking if has an organization with the inputed id.
      const hasAnOrganizationWithTheInputedId = await db.get(`SELECT * FROM Estabelecimento WHERE "id"=${organization_id}`);

      // Returning an error response if has no organization with the inputed id.
      if(!hasAnOrganizationWithTheInputedId) {
        return res.send(
          {
            "status": 401,
            "error": {
              "code": 0,
              "title": "Invalid organization id.",
              "detail": "The organization id provided are not registered in our database.",
              "source": {
                "pointer": "/controllers/api/v1/order.js"
              }
            }
          }
        )
      }
      
      // Instacing the order object.
      const order = {
        create : await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Pedido ("id_da_modalidade", "data_de_solicitacao","status") VALUES (${modality_id},"${date}","creating")`),
      }

      // Getting the order information from database.
      order.info = await db.get(`SELECT * FROM Pedido WHERE "id_da_modalidade" = ${modality_id} AND "data_de_solicitacao" = "${date}" AND "status" = "creating"`);

      // Building the query text.
      let queryText = ``;

      reservations_id.forEach((id, index) => {

        if (index == (reservations_id.length - 1)) {
          queryText += `id=${id}`
        } else {
          queryText += `id=${id} OR `;
        }
        
      })

      // Linking all received reservations to this created order by adding the order id and status as billed.
      order.linkReservations = await db.exec(`PRAGMA foreign_keys = ON; UPDATE Reserva SET id_do_pedido = ${order.info.id}, status = "billed" WHERE ("id_do_estabelecimento"=${organization_id}) AND "status"="pending" AND (${queryText})`);

      // Updating the order status to "requested".
      order.updateOrderStatus = await db.exec(`PRAGMA foreign_keys = ON; UPDATE Pedido SET status = "requested" WHERE "id_da_modalidade" = ${modality_id} AND "data_de_solicitacao" = "${date}" AND "status" = "creating"`);

      // Getting all reservation 
      const reservation = {
        all: await db.all(`SELECT codigo, data, valor, status FROM Reserva WHERE "id_do_pedido" = ${order.info.id}`)
      }

      // Getting the updated order information from database.
      order.update = await db.get(`SELECT * FROM Pedido WHERE "id_da_modalidade" = ${modality_id} AND "data_de_solicitacao" = "${date}" AND "status" = "requested"`);
      
      // Sending a successful response
      return res.send({
        "status" : 200,
        "success" : {
          "code" : 0,
          "title" : "Order created successfully.",
          "data" : {
            order: order.update,
            reservations: reservation.all
          },
          "source":{
            "pointer" : "/controllers/api/v1/order.js"
          }
        }
      })

  })
})


// Exporting the application router.
module.exports = router;