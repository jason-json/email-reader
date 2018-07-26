const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mailRoutes = require('./api/routes/mail');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/mail', mailRoutes);

app.use((req, res, next) => {
    const error = new Error('404 Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;