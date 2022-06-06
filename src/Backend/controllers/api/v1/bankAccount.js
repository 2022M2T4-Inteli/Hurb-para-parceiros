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
    const { organization_id, beneficiary, cpf_or_cnpj, bank, agency, number, digit } = req.body;

    // Executing the action...
    Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

        // Checking if the organization already has a bank account.
        const hasTheOrganizationABankAccount = await db.get(`SELECT * FROM Conta_bancaria WHERE "id_do_estabelecimento" = ${organization_id}`);
        
        // Sending an error response if the organization already has a bank account.
        if(hasTheOrganizationABankAccount) {
            return res.send({
                "status": 409,
                "error": {
                  "code": 0,
                  "title": "The target organization already has a bank account.",
                  "detail": "It is not possible to create another bank account to this organization. Contact Hurb support to add or update the bank account of this organization.",
                  "source": {
                    "pointer": "/controllers/api/v1/bankAccount.js"
                  }
                }
              })
        }

        const bankAccount = {
            create : await db.run(`INSERT INTO Conta_bancaria("id_do_estabelecimento","beneficiario","cpf_ou_cnpj","banco","agencia","numero","digito") VALUES(${organization_id},"${beneficiary}","${cpf_or_cnpj}","${bank}","${agency}","${number}","${digit}")`),
            info : await db.get(`SELECT * FROM Conta_bancaria WHERE "id_do_estabelecimento" = ${organization_id}`),
        }

        return res.send({
            "status": 200,
            "success": {
              "code": 0,
              "title": "Bank account created successfully.",
              "data": bankAccount.info,
              "source": {
                "pointer": "/controllers/api/v1/bankAccount.js"
              }
            }
          })

    })

})

// Exporting the application router.
module.exports = router;