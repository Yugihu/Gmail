const jwt = require('jsonwebtoken')
const models = require('../db/dbmodels')

module.exports.onlyLogged = function (req, res, next) {
    //check for valid access token and refresh valid
    jwt.verify(req.cookies.sid, "SomeSecret", (err, decoded) => {
        if (err) {
            const dec = jwt.decode(req.cookies.sid)
            if (err.name == "TokenExpiredError") {
                const refToken = await models.refreshtokens.findOne({ where: { username: dec.username } })
                jwt.verify(refToken, "SomeOtherSecret", (err, decoded) => {
                    //invalid both
                    if (err) {
                        return res.status(403).send({ err: 'you logged out, please log in again' })
                    }
                    //valid refresh token but invalid access (only exp token err)
                    const accessToken = jwt.sign({ username: dec.username }, "SomeSecret", { expiresIn: '7m' })
                    res.cookie("sid", accessToken, {
                        httpOnly: true,
                        secure: false
                    })
                    req.user = decoded
                    next()
                })
            }
        } else {
            const refToken = await models.refreshtokens.findOne({ where: { username: decoded.username } })
            jwt.verify(refToken, "SomeOtherSecret", (err, decoded) => {
                //valid access token but invalid refresh e.g. fast logout
                if (err) {
                    return res.status(403).send({ err: 'you logged out, please log in again' })
                }
                //both token valid
                req.user = decoded
                next()
            })

        }

    })

    // INvalid  Atoken(EXP) + valid Rtoken
    // both INvalid  

    //ELSE

    // valid  Atoken + invalid Rtoken
    // valid  Atoken + valid Rtoken


}