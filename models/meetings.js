const mongoose = require('mongoose');

const meetings = new mongoose.Schema(
    {
        name: {type: String, required: true},
        duration: {type: Number},
        admin: {type: String},
        haveUploaded: [{
            user: {type:String}, 
            slots: [{type:String}]
        }],
        haveNotUploaded: [{type:String}],
        range: [{type:Date},{type:Date}],
        timeRangeStart: {type: String},
        timeRangeEnd: {type: String},
        groupID: {type:String},
        slots:{type:String, required: false}
    }, {collection: 'Meetings'}
);

const model = mongoose.model('Meetings', meetings);

module.exports = model;