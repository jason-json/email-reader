const express = require('express');
const router = express.Router();
const mailImap = require('../modules/mail');


router.get('/', (req, res, next) => {
    console.log("Querying unread messages...");
    mailImap.unreadMail(res);

});

module.exports = router;