'use strict';

/*
 * nodejs-mongoose-socket.io-ejs template
 * Copyright(c) 2018 Tinh Phan <pvtinh1996@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketioJwt = require("socketio-jwt");


const socket = require("./app/socket");
const jobs = require("./app/cronjobs")

const port = process.env.PORT || 3001;


// Boostrap models
require(config.PATH_MODELS).map(modelName => `${config.PATH_MODELS}/${modelName}`).forEach(require);

// Boostrap routes
require("./config/express")(app);

const listen = () => new Promise((resolve, reject) => {
    http.listen(port, () => {
        console.log(`App is listening on port: ${port}`);
        jobs().start();
        resolve();
    });
})

const connect = () => new Promise((resolve, reject) => {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(config.MONGOOSE_DB_URL, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on('error', () => reject('Please install and start your mongodb'));
    db.once('open', resolve);
})

connect()
    .then(() => {
        socket(io);
    })
    .then(listen)
    .catch(er => {
        console.log(er);
        process.exit(0);
    });