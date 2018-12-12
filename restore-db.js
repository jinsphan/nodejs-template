'use strict';
require('dotenv').config();


const path = require('path');
const moment = require("moment");
const shell = require('shelljs');


var ROOT_PATH = path.dirname(require.main.filename);



const run = async () => {
    try {
        let time = moment().format("DD-MM-YY");
        let db_name = process.env.MONGOOSE_DB_NAME;
        let folder = ROOT_PATH + "/" + db_name;
        await shell.exec('./restore-db.sh ' + db_name + " " + folder);

    } catch (er) {
        console.log(er.message);
    }
}

run();
