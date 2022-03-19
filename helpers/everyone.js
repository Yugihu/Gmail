const jwt = require("jsonwebtoken")

module.exports.everyone = function (req, res, next) {
    try {
        const dec = jwt.decode(req.cookies.sid)
        if (dec) {
            req.user = dec
        } else {
            req.user = false
        }
        next()
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }


}