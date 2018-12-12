const express = require('express');
const session = require('express-session');
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser');
var Recaptcha = require('express-recaptcha').Recaptcha;
const config = require("./index");
const recaptcha = new Recaptcha(process.env.GOOGLE_CAPCHA_KEY, process.env.GOOGLE_CAPCHA_SECRET);
const json2xls = require('json2xls');

// Routes
const {
    testRoute,
    adminRoute,
    clientRoute,
    apiRoute
} = require("./routes");

// Middlewares
const {
    notFound,
    localVariables,
} = require("./middleware");


module.exports = (app, io) => {
    app.set('views', config.ROOT + '/app/views');
    app.set("view engine", "ejs");

    // Config for session
    app.set('trust proxy', 1) // trust first proxy
    app.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    app.use(session())
    app.use(express.static(config.ROOT + '/assets'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(localVariables);

    if (config.IS_OPEN_TEST) {
        app.use(json2xls.middleware);
        app.use("/test", testRoute)
    }
    
    app.use(config.ADMIN_URL, adminRoute);
    app.use("/api", apiRoute);
    app.use("/", clientRoute);

    app.use(notFound);
}

exports.recaptcha = recaptcha;