const path = require('path');
const __DEV__ = require('./env/development');
const __PRO__ = require('./env/production');
const APP_NAME = 'nodejs-ejs-socket-template';

// config session
var SESSION = {
    APP_NAME,
    secret: APP_NAME + 'jki33234!@@',
    jwtSecret: `jwt-sct-${APP_NAME}-!@##@!`,
    cookie: { maxAge: 60000 }
}

// This is defaults config
const defaults = {
    ROOT: path.join(__dirname, ".."),
    PATH_MODELS: path.join(__dirname, "../app/models"),
    SESSION,
    ADMIN_URL: "/admin",
    GAME_FEES: 0.05,
}

const config = {
    development: {
        ...defaults,
        ...__DEV__
    },
    production: {
        ...defaults,
        ...__PRO__
    }
}

module.exports = config[process.env.NODE_ENV || 'development'];
