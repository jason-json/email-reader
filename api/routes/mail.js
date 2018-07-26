const express = require('express');
const router = express.Router();
// const config = require('./config.json');


router.get('/', (req, res, next) => {
    console.log("Hello Word");
    res.status(200).json({
        message: "Messagge not send",
    });

});

module.exports = router;