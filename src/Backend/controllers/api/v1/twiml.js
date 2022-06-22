// Importing all required libraries.
const express = require("express");

// Instacing the application router.
const router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.get("/:pin", async (req, res) => {

    // Getting the pin code from request body.
    const { pin } = req.params;
    
    // Create TwiML response
    const twiml = new VoiceResponse();

    // Setting up the message.
    twiml.say(`Hello! Your Hurb Pin Code is ${pin}`);

    // Wrinting the response header.
    res.writeHead(200, { 'Content-Type': 'text/xml' });

    // Sending the response.
    res.end(twiml.toString());

})

// Exporting the application router.
module.exports = router;