module.exports = (req, res, next) => {

    if(req.user.access_level < 10) {
        return res.send({
            "status": 401,
            "error": {
              "code": 0,
              "title": "Unauthorized.",
              "detail": "You have not the required permission level to use this route.",
              "source": {
                "pointer": "/controllers/api/v1/hasMinimumPartnerRole.js"
              }
            }
          })
    }

    next();
    
}