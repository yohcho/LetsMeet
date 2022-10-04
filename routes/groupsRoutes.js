const express = require('express');

const router = express.Router()
const controller = require('../controllers/groupsController');

router.post('/createGroup', async (req,res)=>{
    try{
        const group = await controller.createGroup(req.body)
        res.json({newGroup:group})
    } catch(err){
        console.log(err)
    }
})

router.get('/getGroups', async (req,res)=>{
    try{
        const groups = await controller.getGroups(req.query)
        res.json({groups:groups})
    } catch(err){
        console.log(err)
    }
})

router.get('/getGroupData', async (req,res)=>{
    try{
        const group = await controller.getGroupData(req.query.id)
        res.json({group:group})
    } catch(err){
        console.log(err)
    }
})

router.post('/addMember', async (req,res)=>{
    try{
        await controller.addMember(req.body)
        res.json({})
    } catch(err){
        console.log(err)
    }
})

router.post('/removeMember', async (req,res)=>{
    try{
        await controller.removeMember(req.body)
        res.json({})
    } catch(err){
        console.log(err)
    }
})

router.post('/removeGroup', async (req,res)=>{
    try{
        await controller.removeGroup(req.body)
        res.json({status:"good"})
    } catch(err){

    }
})

module.exports = router;