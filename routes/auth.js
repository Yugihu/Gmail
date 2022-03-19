const jwt = require('jsonwebtoken')
const models = require('../db/dbmodels')
const bcrypt = require('bcrypt')
//const { onlyLogged } =  require('../helpers/onlyLogged')
const router = require('express').Router()


router.post('/register', async (req, res) => {
    // destructuring the body 
    const { username, password, avatar } = req.body
    // check for missing params
    if (!username || !password || !avatar) {
        return res.status(400).send({ err: "missing some info" })
    }
    const userCount = await models.users.count({ where: { username: username } })
    // check for taken username 
    console.log(userCount)
    if (userCount) {
        return res.status(400).send({ err: "username already taken" })
    }
    // hash the password 
    const hash = await bcrypt.hash(password, 10)
    //save the user to the db
    const newUser = await models.users.create({ username: username, pass: hash, avatar: avatar })

    res.send({ msg: `${username} has been created` })
})

router.post('/login', async (req, res) => {
    // destructuring the body 
    const { username, password } = req.body

    // check for missing params
    if (!username || !password) {
        return res.status(400).send({ err: "missing some info" })
    }

    //select the user
    const user = await models.users.findOne({ where: { username: username } })

    if (!user) {
        return res.status(400).send({ err: "user not found" })
    }

    // compare the hashed passwords
    const match = await bcrypt.compare(password, user.pass)

    if (!match) {
        return res.status(401).send({ err: "wrong password" })
    }

    // create token 
    const accessToken = jwt.sign({ username }, "SomeSecret", { expiresIn: '7m' })
    const refreshedToken = jwt.sign({ username }, "SomeOtherSecret", { expiresIn: '100d' })

    //save the refresh token in the vault
    const ExistRefresh = await models.refreshtokens.findOne({ where: { username: username } })
    if (!ExistRefresh) {
        const refreshes = await models.refreshtokens.create({ username: username, token: refreshedToken })
    } else {
        ExistRefresh.token = refreshedToken
        ExistRefresh.save()
    }

    //save the access token in the client cookie
    res.cookie("sid", accessToken, {
        httpOnly: true,
        secure: false
    })

    res.send({ msg: `${username} has been logged on` })

})


router.delete('/logout', async (req, res) => {

    await models.refreshtokens.destroy({
        where: {
            username: req.user.username
        }
    })
    res.clearCookie("sid")
    res.send({ msg: 'bye bye' })

})
module.exports = router 