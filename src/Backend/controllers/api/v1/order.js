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

router.get("/:id", auth, hasMinimumPartnerRole, async(req, res) => {
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

    // Instancing the order object.
    let order = {};

    // Getting the order id from request params.
    order.id = req.params.id;

    order = await db.get(`SELECT * FROM Pedido WHERE "id" = ${order.id}`);

    if(!order) {
      return res.send({
        "status": 401,
        "error":{
          "code":0,
          "title": "Order not found.",
          "detail":"There's no order with the inputed order id.",
          "source":{
            "pointer": "/controllers/api/v1/order.js"
          }
        }
      })
    }

    // Setting up the order modality.
    order.modality = await db.get(`SELECT * FROM Modalidade_de_antecipacao WHERE "id" = ${order.id_da_modalidade}`);

    // Deleting the 'id_da_modalide' order property.
    order.id_da_modalidade = undefined;

    // Getting all bookings of the inputed order from database.
    const bookings = await db.all(`SELECT * FROM Reserva WHERE id_do_pedido = ${order.id}`);

    // Instacing the order value.
    let value = 0;

    bookings.forEach(booking => {
      value += booking.valor;
    })

    // Intacing the anticipation value.
    order.value = value;

    // Calculating the tax in reais.
    order.fee = parseFloat((order.value * order.modality.taxa).toFixed(2));

    // Calculting the net value to receive.
    order.net = parseFloat((order.value - order.fee).toFixed(2));

    // Assigning the bookings used.
    order.bookings = bookings;

    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "Order gotted successfully",
        "data": order,
        "source": {
          "pointer": "/controllers/api/v1/order.js"
        }
      }
    });


  })
})

router.post("/create", auth, hasMinimumPartnerRole, async(req, res) => {

    // Getting all required order attributes from request body.
    const { organization_id, modality_id, reservations_id } = JSON.parse(req.body.data);

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
        create : await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Pedido ("id_da_modalidade", "id_do_estabelecimento", "data_de_solicitacao","status") VALUES (${modality_id},${organization_id},"${requestDate}","creating")`),
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
      order.updateOrderStatus = await db.exec(`PRAGMA foreign_keys = ON; UPDATE Pedido SET status = "requested" WHERE "id_da_modalidade" = ${modality_id} AND "id_do_estabelecimento"=${organization_id} AND "data_de_solicitacao" = "${requestDate}" AND "status" = "creating"`);

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

          
          const bankAccount = await db.get(`SELECT * FROM Conta_bancaria WHERE id_do_estabelecimento = ${organization_id}`);

          // Creating a pix payment transaction history in the database.
          try {

            await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Transferencia ("id_das_informacoes_de_recebimento","beneficiario","cpf_ou_cnpj","banco","agencia","numero","digito") VALUES (${receiptInformation.id}, "${bankAccount.beneficiario}", "${bankAccount.cpf_ou_cnpj}","${bankAccount.banco}","${bankAccount.agencia}","${bankAccount.numero}","${bankAccount.digito}")`);

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
      order.update = await db.get(`SELECT * FROM Pedido WHERE "id_da_modalidade" = ${modality_id} AND "id_do_estabelcimento"=${organization_id} AND "data_de_solicitacao" = "${requestDate}" AND "status" = "requested"`);
      
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

router.post("/simulate", auth, hasMinimumPartnerRole, async(req, res) => {
  // Getting all required attributes from request body.
  const { desired_value, organization_id, modality_id } = req.body;

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
    const order = {};

    // Setting up the order request date. 
    let date = new Date();
    order.date = date.toISOString().substr(0, 19).replace('T', ' ');

    // Setting up the order modality.
    order.modality = await db.get(`SELECT * FROM Modalidade_de_antecipacao WHERE "id" = ${modality_id}`);

    // Getting all organization pending bookings from database.
    const pendingBookings = await db.all(`SELECT * FROM Reserva WHERE id_do_estabelecimento = ${organization_id} AND status = "pending"`);

    // Instacing the reached value and bookings to be billed variables.
    let reachedValue = 0;
    const bookingsToBeBilled = [];

    // Instacing loop auxiliars.
    let currentStep = 0;
    let maxLoop = pendingBookings.length - 1;
    
    // Setting up the bookings to be billed while the reached value is less than the desired value OR all pending bookings are used.
    while(reachedValue < desired_value) {

      const booking = pendingBookings[currentStep];

      reachedValue += booking.valor;

      bookingsToBeBilled.push(booking);

      if(currentStep == maxLoop) {
        break;
      }

      currentStep++;

    }

    // Intacing the anticipation value.
    order.value = reachedValue;

    // Calculating the tax in reais.
    order.fee = parseFloat((reachedValue * order.modality.taxa).toFixed(2));

    // Calculting the net value to receive.
    order.net = parseFloat((order.value - order.fee).toFixed(2));

    // Assigning the bookings used.
    order.bookings = bookingsToBeBilled;

    // Checking if it was possible to simulate a order with the exact desired value.
    if(order.value == desired_value) {
      order.isValueTheDesiredValue = true;
    } else {
      order.isValueTheDesiredValue = false;
    }

    // Sending a successful response
    return res.send({
      "status" : 200,
      "success" : {
        "code" : 0,
        "title" : "Simulation gotted successfully.",
        "data" : order,
        "source":{
          "pointer" : "/controllers/api/v1/order.js"
        }
      }
    })

  })

})


// Exporting the application router.
module.exports = router;