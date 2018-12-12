'use strict';
require('dotenv').config();


const nodemailer = require('nodemailer');
const config = require('./config');
const path = require('path');
const moment = require("moment");

const shell = require('shelljs');


const bk = async () => {

    
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.MAIL_USERNAME,
            pass: config.MAIL_PASSWORD
        }
    });

    try {
        let time = moment().format("DD-MM-YY-hh:mm");
        let filename = process.env.MONGOOSE_DB_NAME + "_" + time;
        const mailOptions = {
            from: config.MAIL_USERNAME,
            to: process.env.MAIL_BACKUP_DATA,
            subject: 'Title',
            text: 'mail content...',
            attachments: [
                {
                    filename: filename + ".zip",
                    path: '/var/backups/mongobackups/' + time + '/' + filename + ".zip"
                }
            ]
        }

        await shell.exec('./backup-db.sh ' + process.env.MONGOOSE_DB_NAME + ' ' + time + ' ' + filename);

        // await transporter.sendMail(mailOptions), function (err, success) {
        //     if (err) {
        //         // Handle error
        //         console.log(err.message);
        //     } else {
        //         console.log("BACK UP DATA SUCCESS FULL");
        //     }
        // }
    } catch (er) {
        console.log(er.message);
    }
}

bk();
