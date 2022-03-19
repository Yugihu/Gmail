const models = require('../db/dbmodels');
const { everyone } = require('../helpers/everyone');

const router = require('express').Router()

//get list of blocked users for the logged user
router.get('/', everyone, async (req, res) => {
    const user = req.user.username
    const blocked = await models.blockedlist.findAll({attributes: ['blocked', 'blockedTime'],where:{blocker : user}})
    res.send(blocked)
})

// block this user  for the logged user
router.post('/:username',everyone, async (req, res) => {
    
    const user = req.user.username
    
    const {username} = req.params
    
    if (!username)
    {
        return res.status(400).send({err:'missing arguments'})
    }
    try {
        const usernameExist = await models.users.findOne({where:{username:username}}) 
    
        if (!usernameExist) {
            return res.status(400).send({err:`blocked username ${username} does not exist!!`})
        }

        const blockedAlready = await models.blockedlist.findOne({
            where:{
                blocker :user,
                blocked :username
                }
            }) 
    
        if (blockedAlready)
        {
            return res.status(400).send({err:`username ${username} already blocked for ${user}`})
        }
    
        const block = await models.blockedlist.create({
            blocker :user,
            blocked :username,
            blockedTime :new Date()
        })
    
        if (block){
            return res.send({msg:`username ${username} was blocked for ${user}`})
        }
        
    } catch (err) {
        return res.status(500).send({err:err})
    }
    
})

//return if this user is spam (has more then 5 record in blockedList)
router.get('/spam/:username',everyone, async (req, res) => {
    const {username} = req.params
    
    if (!username)
    {
        return res.status(400).send({err:'missing arguments'})
    }
    try {
        const usernameExist = await models.users.findOne({where:{username:username}}) 
        
        if (!usernameExist) {
            return res.status(400).send({err:`spam username ${username} does not exist!!`})
        }

        const blockedList = await models.blockedlist.findAll({where:{blocked:username}}) 
        if(blockedList && blockedList.lenght >4 ){
            res.send({msg:`username ${username} is a spammer !!`})
        }else{
            res.send({msg:`username ${username} are not spam !!`})
        }


    } catch (err) {
        return res.status(500).send({err:err})
    }


})
// remove the username from blocked list of the logged user
router.delete('/:username', async (req, res) => {

})

module.exports = router
//---- POST   /:username 🔐      // block this user   
//---- GET    /spam/:username 🔐 //return if this user is spam (has more then 5 record in blockedList)
//---- DELETE /:username 🔐   