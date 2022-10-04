const express = require('express');

const router = express.Router()
const controller = require('../controllers/meetingsController');

router.post('/createMeeting', async (req,res)=>{
    try{
        const id = await controller.createMeeting(req.query)
        res.json({newMeetingId:id})
    } catch(err){
        console.log(err)
    }
})

router.get('/getMeeting', async (req,res)=>{
    try{
        const meetingInfos = await controller.getMeeting(req.query)
        res.json({meetingInfos:meetingInfos})
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

router.post('/uploadSchedule',async(req,res)=>{
    try{
        await controller.uploadSchedule(req.body)
        res.json({})
    } catch(err){
        console.log(err)
    }
})

router.post('/selectSlot',async(req,res)=>{
    try{
        await controller.selectSlot(req.body)
        res.json({})
    } catch(err){
        console.log(err)
    }
})

module.exports = router;