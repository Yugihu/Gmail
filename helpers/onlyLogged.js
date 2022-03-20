const jwt = require('jsonwebtoken')
const models = require('../db/dbmodels')

module.exports.onlyLogged = function (req, res, next) {
    //check for valid access token and refresh valid
    jwt.verify(req.cookies.sid, "SomeSecret", async (err, decoded) => {
        if (err) {
            const dec = jwt.decode(req.cookies.sid)
            if (err.name == "TokenExpiredError") {
                // const refToken = await models.refreshtokens.findOne({ where: { username: dec.username } })
                const refToken =await getRefresh(dec)
                jwt.verify(refToken.token, "SomeOtherSecret", (err, decoded) => {
                    //invalid both
                    if (err) {
                        return res.status(403).send({ err: `you logged out, please log in again 1 ${err}` })
                    }
                    //valid refresh token but invalid access (only exp token err)
                    const accessToken = jwt.sign({ username: dec.username }, "SomeSecret", { expiresIn: '7m' })
                    res.cookie("sid", accessToken, {
                        httpOnly: true,
                        secure: false
                    })
                    req.user = dec
                    next()
                })
            } else {
                return res.status(401).send({ err: 'protected content, please log in again.' })
            }
        } else {
            //const refToken = await models.refreshtokens.findOne({ where: { username: decoded.username } })
            const refToken =await getRefresh(decoded)
            jwt.verify(refToken.token, "SomeOtherSecret", (err, decoded) => {
                //valid access token but invalid refresh e.g. fast logout
                if (err) {
                    return res.status(403).send({ err: `you logged out, please log in again 2 ${err}` })
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

async function getRefresh(decoded) {
    try {
        const refToken = await models.refreshtokens.findOne({ where: { username: decoded.username } })
        console.log(refToken)
        return refToken;
    } catch (error) {
        return res.status(500).send({ err: `internal server error ${err}` })
    }
}