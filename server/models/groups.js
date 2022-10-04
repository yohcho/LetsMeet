const mongoose = require('mongoose');

const groups = new mongoose.Schema(
    {
        name: {type: String, required: true},
        admin: {type:String},
        groupId: {type:String},
        members: [{type:String}],
        inviteCode: {type:String},
    }, {collection: 'Groups'}
);

const model = mongoose.model('Groups', groups);

module.exports = model;