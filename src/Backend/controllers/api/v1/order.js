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

    // Getting all required order attributes from request body.
    const { organization_id, modality_id, reservations_id } = req.body;

    // Defining the request date. 
    let date = new Date()
    let requestDate = date.toISOString().substr(0, 19).replace('T', ' ');

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
        create : await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Pedido ("id_da_modalidade", "data_de_solicitacao","status") VALUES (${modality_id},"${requestDate}","creating")`),
      }

      // Getting the order information from database.
      order.info = await db.get(`SELECT * FROM Pedido WHERE "id_da_modalidade" = ${modality_id} AND "data_de_solicitacao" = "${requestDate}" AND "status" = "creating"`);

      // Getting the order tax from database.
      order.tax = await db.get(`SELECT * FROM Modalidade_de_antecipacao WHERE "id" = ${modality_id}`);

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
      order.updateOrderStatus = await db.exec(`PRAGMA foreign_keys = ON; UPDATE Pedido SET status = "requested" WHERE "id_da_modalidade" = ${modality_id} AND "data_de_solicitacao" = "${requestDate}" AND "status" = "creating"`);

      // Getting all reservation 
      const reservation = {
        all: await db.all(`SELECT codigo, data, valor, status FROM Reserva WHERE "id_do_pedido" = ${order.info.id}`)
      }

      // Getting all required receipt information attributes from request body.
      const { type } = req.body;

      // Instacing the gross value variable.
      let grossValue = 0;

      // Calculating the gross value.
      reservation.all.forEach(reservation => {
        grossValue += reservation.valor;
      })

      // Instacing the tax.
      const tax = order.tax.taxa;

      // Calculating the liquid value.
      const liquidValue = (1.00-tax)*(grossValue); 

      // Calculating the tax in reais.
      const taxInReais = grossValue * tax;

      // Instacing the expected receipt date variable.
      let expected_receipt_date;

      // Estiming the expected receipt date.
      switch(type) {
        case 'pix':
          // Setting up the expected receipt date as the request date plus one day.
          expected_receipt_date = (new Date(date.setDate(date.getDate()+1))).toISOString().substr(0, 19).replace('T', ' ');
        break;
        case 'boleto':
          // Setting up the expected receipt date as the request date plus three days.
          expected_receipt_date = (new Date(date.setDate(date.getDate()+3))).toISOString().substr(0, 19).replace('T', ' ');
        break;
        case 'transferencia':
          // Setting up the expected receipt date as the request date plus one day.
          expected_receipt_date = (new Date(date.setDate(date.getDate()+1))).toISOString().substr(0, 19).replace('T', ' ');
        break;
        default:
          // Setting up the expected receipt date as the request date plus seven days.
          expected_receipt_date = (new Date(date.setDate(date.getDate()+7))).toISOString().substr(0, 19).replace('T', ' ');
        break;
      }

      // Creating the payment information and linking it to the created order.
      try {
        await db.exec(`INSERT INTO Informacao_de_recebimento("id_do_pedido","valor_bruto","valor_liquido","taxa_em_reais","data_de_recebimento_prevista","tipo") VALUES(${order.info.id},"${grossValue}","${liquidValue}","${taxInReais}","${expected_receipt_date}","${type}")`);
      } catch (e) {
        return res.send(
          {
            "status": 401,
            "error": {
              "code": 0,
              "title": "We're sorry. Unable to link the receipt information to the created order.",
              "detail": "Contact the hurb support to solve this error.",
              "source": {
                "pointer": "/controllers/api/v1/order.js"
              }
            }
          }
        )
      }

      const receiptInformation = await db.get(`SELECT * FROM Informacao_de_recebimento WHERE "id_do_pedido" = ${order.info.id} AND "valor_bruto" = ${grossValue} AND "valor_liquido" = ${liquidValue} AND "taxa_em_reais" = ${taxInReais} AND "data_de_recebimento_prevista" = "${expected_receipt_date}" AND "tipo" = "${type}"`);

      // Linking the used receipt method to a transaction receipt information.
      switch(type) {
        case 'pix':

          // Getting the pix key and the pix key type from the request body.
          const { pix_key_type, pix_key } = req.body;

          // Creating a pix payment transaction history in the database.
          try {
            await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Pix ("id_das_informacoes_de_recebimento","tipo_da_chave","chave") VALUES (${receiptInformation.id},"${pix_key_type}","${pix_key}")`);
          } catch (e) {
            return res.send(
              {
                "status": 401,
                "error": {
                  "code": 0,
                  "title": "We're sorry. Unable to create a bank slip payment transaction history in the database.",
                  "detail": "Contact the hurb support to solve this error.",
                  "source": {
                    "pointer": "/controllers/api/v1/order.js"
                  }
                }
              }
            )
          }

        break;
        case 'boleto':

          // Getting the slip bank code from the request body.
          const { slip_bank_code } = req.body;

          // Creating a bank slip payment transaction history in the database.
          try {
            await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Boleto ("id_das_informacoes_de_recebimento","numero_do_boleto") VALUES (${receiptInformation.id},"${slip_bank_code}")`);
          } catch (e) {
            return res.send(
              {
                "status": 401,
                "error": {
                  "code": 0,
                  "title": "We're sorry. Unable to create a bank slip payment transaction history in the database.",
                  "detail": "Contact the hurb support to solve this error.",
                  "source": {
                    "pointer": "/controllers/api/v1/order.js"
                  }
                }
              }
            )
          }
        break;
        case 'transferencia':

          
          // Getting the pix key and the pix key type from the request body.
          const { beneficiary, cpf_or_cnpj, bank, agency, number, digit } = req.body;

          // Creating a pix payment transaction history in the database.
          try {

            await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Transferencia ("id_das_informacoes_de_recebimento","beneficiario","cpf_ou_cnpj","banco","agencia","numero","digito") VALUES (${receiptInformation.id}, "${beneficiary}", "${cpf_or_cnpj}","${bank}","${agency}","${number}","${digit}")`);

          } catch (e) {

            return res.send(
              {
                "status": 401,
                "error": {
                  "code": 0,
                  "title": "We're sorry. Unable to create a bank slip payment transaction history in the database.",
                  "detail": "Contact the hurb support to solve this error.",
                  "source": {
                    "pointer": "/controllers/api/v1/order.js"
                  }
                }
              }
            )

          }
          
        break;
      }

      // Getting the updated order information from database.
      order.update = await db.get(`SELECT * FROM Pedido WHERE "id_da_modalidade" = ${modality_id} AND "data_de_solicitacao" = "${requestDate}" AND "status" = "requested"`);
      
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