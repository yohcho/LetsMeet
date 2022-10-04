const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const corsOptions ={
    credentials:true,            
    optionSuccessStatus:200,
    origin:'http://localhost:3000'
}
const cookieParser = require('cookie-parser');

const app=express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

const initialize = async()=>{
    await mongoose.connect(process.env.MONGODB_URI || `mongodb+srv://yohcho:qw123edc@cluster0.dmxfo.mongodb.net/Let'sMeet!?retryWrites=true&w=majority`)
}

initialize()
console.log("connected")

app.use('/api/landing/', require('./routes/landingRoutes'));
app.use('/api/groups/', require('./routes/groupsRoutes'));
app.use('/api/meetings/', require('./routes/meetingsRoutes'));
app.use('/api/users/', require('./routes/usersRoutes'));

if(process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"))
}

app.listen(process.env.PORT);