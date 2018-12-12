const config = require("../index");

module.exports = (req, res, next) => {
    res.locals.session = {
        userAuth: req.session.userAuth || false,
        myData: {
            name: "jinsphan"
        }
    };

    var _render = res.render;

    res.render = function (view, options, fn) {
        _render.call(this, view, {
            ...options,
            ADMIN_URL: config.ADMIN_URL,
            GAME_FEES: config.GAME_FEES,
            REGISTER_LINK: "https://members.mastertrades.io/register?branch=right&referral=mt7global"
        }, fn);
    }
    
    next();
}