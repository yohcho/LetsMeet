const express = require('express');

const router = express.Router()
const controller = require('../controllers/usersController');

router.get('/getPendingGroups', async(req,res)=>{
    try{
        const groups= await controller.getPendingGroups(req.query)
        res.json({groups:groups})
    }
    catch(err){
        console.log(err)
    }
})

router.post('/acceptPendingUser', async(req,res)=>{
    try{
        const newGroup = await controller.acceptPendingUser(req.query)
        res.json({group:newGroup})
    }
    catch(err){
        console.log(err)
    }
})

router.post('/rejectPendingUser', async(req,res)=>{
    try{
        await controller.rejectPendingUser(req.query)
        res.json({})
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router;