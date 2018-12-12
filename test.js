const DB = ["db-name" ];
const nameDb = DB[0];

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/" + nameDb, { useNewUrlParser: true });
const db = mongoose.connection;

const moment = require("moment")
const bcrypt = require('bcryptjs');

db.once('open', async () => {
    /**
     * setting add:
     * top_traders
     * 
     * 
     */
})