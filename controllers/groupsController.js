const Groups = require("../models/groups")
const Users = require("../models/users")

async function createGroup(data){
    const newGroup = await Groups.create({
        name: data.groupName,
        admin: data.email,
        members: [data.email],
        inviteCode: "",
    })
    await Users.updateOne(
        {email:data.email},
        {$push:{currentGroups:`${newGroup._id}@${data.groupName}`}}
    )
    return newGroup
}

async function getGroups(data){
    const user= await Users.findOne({email:data.email})
    return user.currentGroups
}

async function getGroupData(id){
    const group = await Groups.findOne({_id:id})
    return group
}

async function addMember(data){
    await Users.updateOne(
        {email:data.email},
        {$push:{pendingInvites:data.group}}
    )
 }

 async function removeMember(data){
    const id = data.id.split("@")[0]
    await Users.updateOne(
        {email:data.member},
        {$pull:{currentGroups:data.id}}
    )
    await Groups.updateOne(
        {_id:id},
        {$pull:{members:data.member}}

    )
 }

async function removeGroup(data){
    const id=data.group.split("@")[0]
    const groupAdmin = (await Groups.findOne({_id:id})).admin
    console.log(groupAdmin)
    if(data.email===groupAdmin){
        await Groups.deleteOne({_id:id})
        await Users.updateOne(
            {email:data.email},
            {$pull:{currentGroups:data.group}}
        )
    }
    else
        await Groups.updateOne(
            {_id:id},
            {$pull:{members:data.email}}
        )
}

exports.createGroup=createGroup
exports.getGroups=getGroups
exports.addMember=addMember
exports.removeGroup=removeGroup
exports.getGroupData=getGroupData
exports.removeMember=removeMember