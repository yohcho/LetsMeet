const mongoose = require('mongoose');

const users = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        currentGroups:[{type: String}],
        pendingInvites:[{type: String}],
        settings: {
            inputPreferenceSelection: {type:Boolean},
            setMorningStart: {type:Number},
            setNightEnd: {type:Number}
        }
    }, {collection: 'Users'}
);

const model = mongoose.model('Users', users);

module.exports = model;