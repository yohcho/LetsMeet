const Users = require("../models/users");
const Groups = require("../models/groups")
const Meetings = require("../models/meetings")

async function login(data){
    const possibleUser = await Users.findOne({
        email:data.email,
        password:data.password
    })
    return possibleUser
}

async function signUp(data){
    await Users.create({
        name:data.name,
        email:data.email,
        password:data.password,
        currentGroups:[],
        pendingInvites:[],
        settings: {
            inputPreferenceSelection: false,
            setMorningStart: 8,
            setNightEnd: 6
        }
    })
}

exports.login=login
exports.signUp=signUp