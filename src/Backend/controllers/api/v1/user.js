// Importing all required libraries.
const express = require("express");
const twilio = require('twilio');
const jwt = require("jsonwebtoken");
const Database = require("sqlite-async");

// Instacing the twilio client.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Importing all required files.
const transporter = require("../../../services/mail/nodemailer");
const auth = require("../../../middlewares/auth");
const hasMinimumPartnerRole = require("../../../middlewares/hasMinimumPartnerRole");
const hasMinimumAdministratorRole = require("../../../middlewares/hasMinimumAdministratorRole");

// Instacing the application router.
const router = express.Router();

// Defining an application route.
router.get("/", auth, hasMinimumAdministratorRole, async (req, res) => {
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
    // Getting all users from database.
    let users = await db.all(`SELECT * FROM Usuario`);

    users = users.map((user) => {
      user.token_de_autenticacao = undefined;
      return user;
    })


    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "Users gotted successfully",
        "data": users,
        "source": {
          "pointer": "/controllers/api/v1/user.js"
        }
      }
    });

  })
})

// Defining an application route.
router.get("/u/:id", auth, hasMinimumAdministratorRole, async(req, res) => {
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

    // Instancing the order object.
    let user = {};

    // Getting the user from database.
    user = await db.get(`SELECT * FROM Usuario WHERE "id" = ${req.params.id}`);

    user.token_de_autenticacao = undefined;

    if(!user) {
      return res.send({
        "status": 401,
        "error":{
          "code":0,
          "title": "User not found.",
          "detail":"There's no user with the inputed id.",
          "source":{
            "pointer": "/controllers/api/v1/user.js"
          }
        }
      })
    }

    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "User gotted successfully",
        "data": user,
        "source": {
          "pointer": "/controllers/api/v1/order.js"
        }
      }
    });


  })
})

router.put("/u/:id", auth, hasMinimumAdministratorRole, async(req, res) => {
  // Getting the user email from request body.
  const { id } = req.params;
  const { email, role } = req.body;

  // Creating the user into database
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

    // Checking if user is already registered.  
    const isEmailAlreadyRegistered = await db.get(`SELECT * FROM Usuario WHERE "email"="${email}"`);
    
    // Returning an error response if user is already register.
    if(isEmailAlreadyRegistered && isEmailAlreadyRegistered.id != id){
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
    
    // Selecting the role.
    const roleData = await db.get(`SELECT * FROM Cargo WHERE nome="${role}"`);

    // Instancing the user object.
    const user = {}
    try{
      user.create = await db.exec(`UPDATE Usuario SET "id_do_cargo" = ${roleData.id}, "email"="${email}" WHERE "id"=${id}`);  
    } catch(e){
      console.log(e);
      return res.send({
        "status" : 401,
        "error":{
          "code" : 0,
          "title": "Fail to update the user",
          "detail": "The user cannot be updated. Try again or contact the hurb support.",
          "source":{
            "pointer": "/controllers/api/v1/user.js"
          }
        }
      })
    }

    user.info = await db.get(`SELECT Usuario.id, Usuario.email, Cargo.nome AS cargo, Cargo.nivel_de_acesso FROM Usuario JOIN Cargo ON Usuario.id_do_cargo = Cargo.id WHERE "email"="${email}"`),
    
    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "User updated successfully.",
        "data": user.info,
        "source": {
          "pointer": "/controllers/api/v1/user.js"
        }
      }
    });

  })
})

router.delete("/u/:id", auth, hasMinimumAdministratorRole, async(req, res) => {
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {

    // Instancing the order object.
    let user = {};

    // Getting the user from database.
    user = await db.get(`SELECT * FROM Usuario WHERE "id" = ${req.params.id}`);

    user.token_de_autenticacao = undefined;

    if(!user) {
      return res.send({
        "status": 401,
        "error":{
          "code":0,
          "title": "User not found.",
          "detail":"There's no user with the inputed id.",
          "source":{
            "pointer": "/controllers/api/v1/user.js"
          }
        }
      })
    }

    await db.exec(`PRAGMA foreign_keys = ON; DELETE FROM Usuario WHERE "id" = ${req.params.id}`)

    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "User deleted successfully",
        "data": user,
        "source": {
          "pointer": "/controllers/api/v1/order.js"
        }
      }
    });


  })
})

// Defining an application route.
router.get("/avaiable-to-link", auth, hasMinimumAdministratorRole, async(req, res) => {
  Database.open(__dirname + '../../../../database/database.db').then(async (db) => {
    // Getting all users from database.
    let users = await db.all(`SELECT * FROM Usuario WHERE Usuario.id_do_cargo=1 AND Usuario.id NOT IN (SELECT id_do_usuario_responsavel FROM Parceiro p WHERE p.id_do_usuario_responsavel = Usuario.id);`);

    users = users.map((user) => {
      user.token_de_autenticacao = undefined;
      return user;
    })


    // Returning the success message response.
    res.send({
      "status": 200,
      "success": {
        "code": 0,
        "title": "Users gotted successfully",
        "data": users,
        "source": {
          "pointer": "/controllers/api/v1/user.js"
        }
      }
    });

  })
})

// Defining an application route.
router.post("/register", auth, hasMinimumAdministratorRole, async (req, res) => {

  // Getting the user email from request body.
  const { email, telephone, role } = req.body;

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

    // Selecting the role.
    const roleData = await db.get(`SELECT * FROM Cargo WHERE nome="${role}"`);

    // Instancing the user object.
    const user = {}
    try{
      user.create = await db.run(`INSERT INTO Usuario("id_do_cargo","email","telephone") VALUES(${roleData.id},"${email}","${telephone}")`);  
    } catch(e){
      return res.send({
        "status" : 401,
        "error":{
          "code" : 0,
          "title": "Fail to register the user",
          "detail": "The user cannot be registered as an administrator.",
          "source":{
            "pointer": "/controllers/api/v1/user.js"
          }
        }
      })
    }

    user.info = await db.get(`SELECT Usuario.id, Usuario.email, Usuario.telephone, Cargo.nome AS cargo, Cargo.nivel_de_acesso FROM Usuario JOIN Cargo ON Usuario.id_do_cargo = Cargo.id WHERE "email"="${email}"`),
    // Returning the success message response.
    res.send({
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
    let isEmailRegistered;

    if(email.indexOf("@") != -1) {
      isEmailRegistered = await db.get(`SELECT * FROM Usuario WHERE "email"="${email}"`);
    } else {
      isEmailRegistered = await db.get(`SELECT * FROM Usuario WHERE "telephone"="${email}"`);
    }

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

    const user = {};

    // Instacing the user object.
    if(email.indexOf("@") != -1) {
        user.info = await db.get(`SELECT Usuario.id, Usuario.email, Cargo.nome AS cargo, Cargo.nivel_de_acesso FROM Usuario JOIN Cargo ON Usuario.id_do_cargo = Cargo.id WHERE "email"="${email}"`);
    } else {
        user.info = await db.get(`SELECT Usuario.id, Usuario.email, Cargo.nome AS cargo, Cargo.nivel_de_acesso FROM Usuario JOIN Cargo ON Usuario.id_do_cargo = Cargo.id WHERE "telephone"="${email}"`);
    }

    // Generating the user authorization token.
    const authorizationToken = jwt.sign(
      {
        "token_type":"pin",
        "user": {
          "id": user.info.id,
          "email": email,
          "telephone": user.info.telephone,
          "role": user.info.cargo,
          "pin": pin,
        }
      },
      process.env._PIN,
      {
      expiresIn: '3 minutes'
      }
    )

    if(email.indexOf("@") != -1) {
      try{
        user.update = await db.exec(`PRAGMA foreign_keys = ON; UPDATE Usuario SET token_de_autenticacao = "${authorizationToken}" WHERE email = "${email}"`);
      } catch(e){
          return res.send({
            "status" : 401,
            "error" : {
              "code" : 0,
              "title" : "Invalid Token",
              "detail" : "The email provided are not registered in our database. It is not possible to login in our plataform without provide a valid email.",
              "source" :{
                "pointer" : "/controllers/api/v1/user.js"
              }
            } 
          })
      }
    } else {
      try{
        user.update = await db.exec(`PRAGMA foreign_keys = ON; UPDATE Usuario SET token_de_autenticacao = "${authorizationToken}" WHERE id = "${user.info.id}"`);
      } catch(e){
          return res.send({
            "status" : 401,
            "error" : {
              "code" : 0,
              "title" : "Invalid Token",
              "detail" : "The email provided are not registered in our database. It is not possible to login in our plataform without provide a valid email.",
              "source" :{
                "pointer" : "/controllers/api/v1/user.js"
              }
            } 
          })
      }
    }

    let mail;

    if(email.indexOf("@") != -1) {
      // Sending e-mail with the user pin.
      mail = await transporter.sendMail({
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
    } else {

      const str = `https://twiml-service.herokuapp.com/${pin}`;

      await client.calls.create({
         url: str,
         to: email,
         from: '+16076009295',
       }).then(call => console.log(call.sid))
      
    }
    

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

      let isEmailRegistered;

      // Checking if user is already registered.
      if(email.indexOf("@") != -1) {
        isEmailRegistered = await db.get(`SELECT * FROM Usuario WHERE "email"="${email}"`);
      } else {
        isEmailRegistered = await db.get(`SELECT * FROM Usuario WHERE "telephone"="${email}"`);
      }

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
      const user = {};

      if(email.indexOf("@") != -1) {
        user.info = await db.get(`SELECT Usuario.id, Usuario.email, Usuario.token_de_autenticacao AS token, Cargo.nome AS cargo, Cargo.nivel_de_acesso FROM Usuario JOIN Cargo ON Usuario.id_do_cargo = Cargo.id WHERE "email"="${email}"`);
      } else {
        user.info = await db.get(`SELECT Usuario.id, Usuario.email, Usuario.token_de_autenticacao AS token, Cargo.nome AS cargo, Cargo.nivel_de_acesso FROM Usuario JOIN Cargo ON Usuario.id_do_cargo = Cargo.id WHERE "telephone"="${email}"`);
      }

      let partner;

      if(user.info.cargo == "parceiro") {
        partner = await db.get(`SELECT * FROM Parceiro WHERE id_do_usuario_responsavel = ${user.info.id}`);
        partner ? partner.id_do_usuario_responsavel = undefined : false;
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
            "title": "Expired pin.",
            "detail": "The created pin to your account has been expired.",
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
            "title": "Invalid pin.",
            "detail": "The provided pin is invalid.",
            "source": {
              "pointer": "/controllers/api/v1/user.js"
            }
          }
        })
      }

      // Generating user session token.
      const sessionToken = jwt.sign({"token_type":"session","user": {
        "id": user.info.id,
        "email": user.info.email,
        "telephone": user.info.telephone,
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
            "role": user.info.cargo,
            "partner": partner,
            "token": sessionToken,
          },
          "source": {
            "pointer": "/controllers/api/v1/user.js"
          }
        }
      })
    })

})

router.get("/is-session-token-still-valid", auth, async (req, res) => {
    return res.status(200).send({
        "status": 200,
        "success": {
          "code": 0,
          "title": "The token still valid",
          "data": {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            access_level: req.user.access_level,
          },
          "source": {
            "pointer": "/controllers/api/v1/user.js"
          }
        }
    })

})

// Exporting the application router.
module.exports = router;