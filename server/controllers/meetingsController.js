const Groups = require("../models/groups")
const Users = require("../models/users")
const Meetings = require("../models/meetings")

const moment = require("moment")

async function createMeeting(data){
    const newMeeting = await Meetings.create({
        name: data.name,
        duration: data.length,
        admin:data.self,
        haveUploaded: [],
        haveNotUploaded: data.addedMembers,
        timeRangeStart: data.start,
        timeRangeEnd: data.end,
        range: [moment(data.range[0],'YYYY-MM-DD'),moment(data.range[1],'YYYY-MM-DD')],
        groupID: data.groupId,
        slots:null
    })
    return newMeeting._id
}

async function getMeeting(data){
    const meetingInfos = (await Meetings.find({groupID:data.id})).filter(meeting=>{
        const allMembers = [meeting.admin,...meeting.haveNotUploaded]
        for(const submission of meeting.haveUploaded)
            allMembers.push(submission.user)
        return allMembers.includes(data.email)
    })
    return meetingInfos
}

async function addMember(data){
    await Meetings.updateOne(
        {_id:data.group},
        {$push:{haveNotUploaded:data.email}}
    )
}

async function uploadSchedule(data){
    await Meetings.updateOne(
        {_id:data.meetingId},
        {
            $push:{haveUploaded:{
                user:data.user,
                slots:data.slots
            }},
            $pull:{haveNotUploaded:data.user}
        }
    )
}

async function selectSlot(data){
    await Meetings.updateOne(
        {_id:data.meetingId},
        {$set:{slots:data.selectedSlot}}
    )
}

exports.createMeeting=createMeeting
exports.getMeeting=getMeeting
exports.addMember=addMember
exports.uploadSchedule=uploadSchedule
exports.selectSlot=selectSlot