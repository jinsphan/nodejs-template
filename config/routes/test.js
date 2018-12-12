const router = require('express').Router();
const moment = require("moment")

// controllers
const {
} = require("../../app/controllers/test");

// Middlewares
const {
} = require("../middleware");


router.get("/", (req, res) => {
    res.status(200).json({
        message: "test"
    })
});

module.exports = router;