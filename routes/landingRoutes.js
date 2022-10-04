const express = require('express');

const router = express.Router()
const controller = require('../controllers/landingController');

router.post('/login', async (req, res) =>{ 
    try{
        const user = await controller.login(req.body)
        res.json({user:user});
    } catch(e){
        console.log(e);
        res.json({status: 'error'});
    }
});

router.post('/signup', async (req, res) =>{
    try{
        await controller.signUp(req.body)
        res.json({status: 'ok'});
    } catch(e){
        console.log(e);
        res.json({status: 'error'});
    }
});

module.exports = router;