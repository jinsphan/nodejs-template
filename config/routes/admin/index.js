const router = require("express").Router();

// Controllers
const  {
} = require("../../../app/controllers/admin");

// Middleware
const {
} = require("../../../config/middleware");

router.get("/", (req, res) => {
    res.status(200).json({
        message: "Admin"
    })
});


module.exports = router;