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


router.post("/create", auth, hasMinimumAdministratorRole, async (req, res) => {

    // Getting all required attributes from request body.
    const {organization_id, code, value} = req.body; 

    const date = new Date().toISOString().substr(0, 19).replace('T', ' ');

 // Executing the action...
 Database.open(__dirname + '../../../../database/database.db').then(async (db) => { 


    const reservation = {};

    try{
        reservation.create = await db.exec(`PRAGMA foreign_keys = ON; INSERT INTO Reserva("id_do_estabelecimento","codigo","data","valor","status") VALUES(${organization_id},"${code}","${date}","${value}","pending")`);
    } catch(e){
        return res.send({
            "status":401,
            "error":{
                "code": 0,
                "title": "Invalid organization id.",
                "detail": "The organization id provided are not registered in our database. It is not possible to create the reservation without provide a valid organization id.",
                "source": {
                    "pointer": "/controllers/api/v1/reservation.js"
                }
            }
        })
    }
    
    reservation.info = await db.get(`SELECT * FROM Reserva WHERE "id_do_estabelecimento" = ${organization_id} AND "codigo" = ${code}`),
    // Sending a successful response
    res.send({
        "status":200,
        "success":{
            "code": 0,
            "title": "Reservation created successfully.",
            "data": reservation.info,
            "source": {
                "pointer": "/controllers/api/v1/reservation.js"
            }
        }
    })   
 })
        
})

// Exporting the application router.
module.exports = router;