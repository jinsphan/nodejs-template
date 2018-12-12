const CronJob = require('cron').CronJob;
const moment = require("moment")

stopJob = (job) => job.stop();
startJob = (job) => job.start();

const templateJobs = () => {
    let times = ["00 30 23 * * *"];
    let jobs = times.map(cronTime => {
        return new CronJob({
            cronTime,
            onTick: function () {
                console.log('Job update top traders is running...');
                console.log('Job update top traders is done');
                
            },
            start: true,
            timeZone: 'Asia/Ho_Chi_Minh'
        })
    })

    return {
        start: () => {
            jobs.forEach(startJob)
        },
        stop: () => {
            jobs.forEach(stopJob)
        }
    }
}

module.exports = () => {
    const start = () => {
        templateJobs().start();
    }

    return {
        start
    }
}