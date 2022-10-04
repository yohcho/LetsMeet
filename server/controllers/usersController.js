const Groups = require("../models/groups")
const Users = require("../models/users")
const Meetings = require("../models/meetings")

async function getPendingGroups(data){
    const user = await Users.findOne({email:data.email})
    const pendingGroups = []
    for(const invite of user.pendingInvites){
        const group = await Groups.findOne({_id:invite})
        pendingGroups.push({
            groupId:group._id,
            groupName:group.name,
            groupAdmin:group.admin
        })
    }
    return pendingGroups
}

async function acceptPendingUser(data){
    await Users.updateOne(
        {email:data.email},
        {$pull:{pendingInvites:data.groupId},
        $push:{currentGroups:`${data.groupId}@${data.name}`}}
    )
    await Groups.updateOne(
        {_id:data.groupId},
        {$push:{members:data.email}}
    )
    return await Groups.findOne({_id:data.groupId})
}

async function rejectPendingUser(data){
    await Users.updateOne(
        {email:data.email},
        {$pull:{pendingInvites:data.groupId}}
    )
}

exports.getPendingGroups=getPendingGroups
exports.acceptPendingUser=acceptPendingUser
exports.rejectPendingUser=rejectPendingUser