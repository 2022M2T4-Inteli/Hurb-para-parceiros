const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const Database = require("sqlite-async");
const transporter = require("../services/mail/nodemailer");

async function sendPin(email) {

    // Generating a random four digit pin code.
    const pin = Math.ceil(Math.random() * (9999 - 1000) + 1000);

    // Generating the user authorization token.
    const authorizationToken = jwt.sign(
        {
            pin
        },
        process.env._SESSION,
        {
        expiresIn: '3 minutes'
        }
    )

    // Updating the user authorization token.
    await Database.open(__dirname + '../database/database.sqlite').then(async (db) => {
        try{
            await db.exec(`PRAGMA foreign_keys = ON; UPDATE Usuario SET token_de_autenticacao = "${authorizationToken}" WHERE email = "${email}"`);
        } catch(e) {
            return res.send({
                "status" : 401,
                "error" : {
                    "code":0,
                    "title":"Invalid token",
                    "detail":"The email provided are not registered in our database. It is not possible to login in our plataform without provide a valid email.",
                    "source":{
                        "pointer":"/helpers/pin.js"
                    }
                }
            })
        }
    })

    // Sending e-mail with the user pin.
    const info = await transporter.sendMail({
    from: '"Hurb" <contact@hurb.com>',
    to: email,
    subject: "Pin code",
    text: `Your Hurb Pin Code is ${pin}`,
    html: `<span>Your Hurb Pin Code is <b>${pin}</b></span>`,
    })

    return info;

}

module.exports = sendPin;