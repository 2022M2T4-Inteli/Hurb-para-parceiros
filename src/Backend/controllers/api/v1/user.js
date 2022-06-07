// Importing all required libraries.
const express = require("express");
const jwt = require("jsonwebtoken");
const Database = require("sqlite-async");

// Importing all required files.
const transporter = require("../../../services/mail/nodemailer");
const auth = require("../../../middlewares/auth");
const hasMinimumPartnerRole = require("../../../middlewares/hasMinimumPartnerRole");
const hasMinimumAdministratorRole = require("../../../middlewares/hasMinimumAdministratorRole");

// Instacing the application router.
const router = express.Router();

// Defining an application route.
router.post("/register", auth, hasMinimumAdministratorRole, async (req, res) => {

  // Getting the user email from request body.
  const { email } = req.body;

  // Creating the user into database
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

    // Checking if user is already registered.  
    const isEmailAlreadyRegistered = await db.get(`SELECT * FROM Usuario WHERE "email"="${email}"`);

    // Returning an error response if user is already register.
    if(isEmailAlreadyRegistered){
      return res.send({
        "status": 409,
        "error": {
          "code": 0,
          "title": "E-mail is already registered.",
          "detail": "The 'email' address entry value is already registered. If you are the owner of it recover your password or if you aren't the owner choose another one to continue.",
          "source": {
            "pointer": "/controllers/api/v1/user.js"
          }
        }
      })
    }

    // Instancing the user object.
    const user = {
      create: await db.run(`INSERT INTO Usuario("id_do_cargo","email") VALUES(1,"${email}")`),
      info: await db.get(`SELECT Usuario.id, Usuario.email, Cargo.nome AS cargo, Cargo.nivel_de_acesso FROM Usuario JOIN Cargo ON Usuario.id_do_cargo = Cargo.id WHERE "email"="${email}"`),
    }

    // Returning the success message response.
    return res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "User registered successfully.",
        "data": user.info,
        "source": {
          "pointer": "/controllers/api/v1/user.js"
        }
      }
    });

  })

})

// Defining an application route.
router.post("/requestpincode", async (req, res) => {

  // Getting the user email from request body.
  const { email } = req.body;

  // Updating the user authorization token.
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
    
    // Checking if user is already registered.
    const isEmailRegistered = await db.get(`SELECT * FROM Usuario WHERE "email"="${email}"`);

    // If user isn't already registeres, sending an error response.
    if(!isEmailRegistered) {
      return res.send(
        {
          "status": 401,
          "error": {
            "code": 0,
            "title": "Invalid e-mail.",
            "detail": "The email address provided are not registered in our database.",
            "source": {
              "pointer": "/controllers/api/v1/user.js"
            }
          }
        }
      )
    }
  
    // Generating a random four digit pin code.
    const pin = Math.ceil(Math.random() * (9999 - 1000) + 1000);

    // Instacing the user object.
    const user = {
      info: await db.get(`SELECT Usuario.id, Usuario.email, Cargo.nome AS cargo, Cargo.nivel_de_acesso FROM Usuario JOIN Cargo ON Usuario.id_do_cargo = Cargo.id WHERE "email"="${email}"`),
    }

    // Generating the user authorization token.
    const authorizationToken = jwt.sign(
      {
        "token_type":"pin",
        "user": {
          "id": user.info.id,
          "email": email,
          "role": user.info.cargo,
          "pin": pin,
        }
      },
      process.env._PIN,
      {
      expiresIn: '3 minutes'
      }
    )

    user.update = await db.exec(`PRAGMA foreign_keys = ON; UPDATE Usuario SET token_de_autenticacao = "${authorizationToken}" WHERE email = "${email}"`)
    
    // Sending e-mail with the user pin.
    const mail = await transporter.sendMail({
      from: `"Hurb" <${process.env._MAIL_USER}>`,
      to: email,
      subject: "Pin code",
      text: `Your Hurb Pin Code is ${pin}`,
      html: `<span>Your Hurb Pin Code is <b>${pin}</b></span>`,
    })

    // Deleting undesired infomations from mail data.
    mail.accepted = undefined;
    mail.rejected = undefined;
    mail.envelope = undefined;

    // Sending response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "Pin code requested successfully.",
        "detail": `Email sent to ${email}`,
        "data": mail,
        "source": {
          "pointer": "/controllers/api/v1/user.js",
        }
      }
    });

  })

})

// Defining an application route.
router.post("/signin", (req,res) => {

    // Getting the user email and pin from request body.
    const { email, pin : providedPin } = req.body;

    Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

      // Checking if user is already registered.
      const isEmailRegistered = await db.get(`SELECT * FROM Usuario WHERE "email"="${email}"`);

      // If user isn't already registeres, sending an error response.
      if(!isEmailRegistered) {
        return res.send(
          {
            "status": 401,
            "error": {
              "code": 0,
              "title": "Invalid e-mail.",
              "detail": "The email address provided are not registered in our database.",
              "source": {
                "pointer": "/controllers/api/v1/user.js"
              }
            }
          }
        )
      }

      // Instacing the user object.
      const user = {
        info: await db.get(`SELECT Usuario.id, Usuario.email, Usuario.token_de_autenticacao AS token, Cargo.nome AS cargo, Cargo.nivel_de_acesso FROM Usuario JOIN Cargo ON Usuario.id_do_cargo = Cargo.id WHERE "email"="${email}"`),
      }

      // Getting the user database recorded authorization token.
      const authorizationToken = user.info.token;

      // Instacing the decoded token variable.
      let decodedToken;

      // Trying to decode token...
      try {
        decodedToken = jwt.verify(authorizationToken, process.env._PIN);
      } catch (e) {
        return res.send({
          "status": 401,
          "error": {
            "code": 0,
            "title": "Invalid or expired token.",
            "detail": "The provided token is invalid or has already expired.",
            "source": {
              "pointer": "/controllers/api/v1/user.js"
            }
          }
        })
      }

      // Checking if provided pin is valid or not.
      if(providedPin != decodedToken.user.pin) {
        return res.send({
          "status": 401,
          "error": {
            "code": 0,
            "title": "Invalid or expired token.",
            "detail": "The provided token is invalid or has already expired.",
            "source": {
              "pointer": "/controllers/api/v1/user.js"
            }
          }
        })
      }

      // Generating user session token.
      const sessionToken = jwt.sign({"token_type":"session","user": {
        "id": user.info.id,
        "email": email,
        "role":user.info.cargo,
        "access_level":user.info.nivel_de_acesso,
      }},process.env._SESSION, {
        expiresIn: "1 day",
      });

      return res.send({
        "status": 200,
        "success": {
          "code": 0,
          "title": "User authenticated successfully.",
          "data": {
            "id": user.info.id,
            "email": user.info.email,
            "role": user.info.tipo,
            "token": sessionToken,
          },
          "source": {
            "pointer": "/controllers/api/v1/user.js"
          }
        }
      })
    })

})

// Exporting the application router.
module.exports = router;