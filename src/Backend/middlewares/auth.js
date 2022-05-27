const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({
            "status": 401,
            "error": {
              "code": 440,
              "title": "No token provided.",
              "detail": "To access this route you need to provide an authorization token in the request header.",
              "source": {
                "pointer": "/middlewares/auth.js"
              }
            }
          })
    }

    const parts = authHeader.split(" ");

    if(parts.length != 2) {
        return res.status(401).send({
            "status": 401,
            "error": {
              "code": 441,
              "title": "Invalid token format.",
              "detail": "The token must be in the following format: 'Token-schema token-value'.",
              "source": {
                "pointer": "/controllers/api/v1/index.js"
              }
            }
          })
    }

    const [schema, token] = parts;

    if(schema != 'Bearer'){
        return res.status(401).send({
            "status": 401,
            "error": {
              "code": 442,
              "title": "Invalid token schema.",
              "detail": "The token schema must be equals to 'Bearer'.",
              "source": {
                "pointer": "/controllers/api/v1/index.js"
              }
            }
          })
    }

    jwt.verify(token, process.env._SESSION, (err, decoded) => {
        if(err){
            return res.status(401).send({
                "status": 401,
                "error": {
                  "code": 443,
                  "title": "Invalid or expired token.",
                  "detail": "The provided token is invalid or has already expired.",
                  "source": {
                    "pointer": "/controllers/api/v1/index.js"
                  }
                }
              })
        }

        req.user = decoded.user;

        next();
    })
}