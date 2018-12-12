const router = require('express').Router();
const { 
} = require('../../middleware');

const {
} = require("../../../app/controllers").clientCtrls;

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Client"
    })
});

module.exports = router;