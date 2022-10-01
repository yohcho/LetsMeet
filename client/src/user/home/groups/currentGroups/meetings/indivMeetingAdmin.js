import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

const IndivMeeting=(props)=>{
    const details = props.meeting
    const submission = new Map()
    const submissionCount = new Map()
    const startDate = details.range[0].split("T")[0]
    const endDate = details.range[1].split("T")[0]

    const [selectedSlot,setSelectedSlot] = useState(details.slots)

    let viewAmount = 1

    const [open,setOpen] = useState(false)
    const [generatedSlots,setGeneratedSlots] = useState([])
    const handleClickOpen = () => {
        console.log(details.haveUploaded)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const createUsersDisplay=(uploaded)=>{
        if(uploaded)
            return details.haveUploaded.map(user=>{
                return <div key={user.user}>{user.user}</div>
            })
        if(!uploaded)
            return details.haveNotUploaded.map(user=>{
                return <div key={user.user}>{user.user}</div>
            })
    }
    
    const fetchSubmission=()=>{
        for(const uploads of details.haveUploaded){
            for(const slot of uploads.slots){
                const section = Math.floor((slot+details.duration)/(details.duration*2))
                if(submission.has(section)){
                    submissionCount.set(section,submissionCount.get(section)+1)
                    submission.set(section,[...submission.get(section),slot])
                }
                else{
                    submissionCount.set(section,1)
                    submission.set(section,[slot])
                }
            }
        }
    }

    const slotToDate=(key,num)=>{
        let factor=2
        if(num){
            factor=4
        }
        const start=startDate.replaceAll('-','/')
        let slotdate = new Date(start)
        let begin= new Date(start)
        slotdate.setDate(begin.getDate()+Math.floor(key/48))
        slotdate = new Date(slotdate.getTime()+30*60000*(key%48))
        const slotDateTimeOfDay = slotdate.getHours() > 11 ? "PM" : "AM"
        let slotEnd = new Date(slotdate.getTime()+30*60000*details.duration*factor)
        const slotEndTimeofDay = slotEnd.getHours() > 11 ? "PM" : "AM"
        if(slotdate.getHours()===0){
            slotdate.setHours(12)
        }
        if(slotEnd.getHours()===0){
            slotEnd.setHours(12)
        }
        return [
            `${slotdate[Symbol.toPrimitive]('string').substring(0,slotdate[Symbol.toPrimitive]('string').lastIndexOf(":"))} ${slotDateTimeOfDay}`,
            `${slotEnd[Symbol.toPrimitive]('string').substring(0,slotEnd[Symbol.toPrimitive]('string').lastIndexOf(":"))} ${slotEndTimeofDay}`
        ]
    }

    const slotSubmissionDisplay=()=>{
        const submissions = []
        submission.forEach((value,key)=>{
            const slots = slotToDate(key)
            submissions.push(
                <p key={slots[0]}>
                    {`
                        ${slots[0]} ~
                        ${slots[1]}
                        ,${value}
                    `}
                </p>
            )
        })

        return(
            <div>
                {submissions}
            </div>
        )
    }
    fetchSubmission()

    const handleCreateMeetingSlots=()=>{
        const slots = []
        for(let i = 0; i < viewAmount; i++){
            const mostPopularCount  = Math.max(...submissionCount.values())
            for(const count of submissionCount){
                if(count[1]===mostPopularCount){
                    slots.push([count[0],submission.get(count[0])])
                    submissionCount.delete(count[0])
                }
            }
        }
        console.log(slots)
        setGeneratedSlots(slots)
    }
    
    const selectMeetingSlot=(slot)=>{
        console.log(slot)
        var config = {
            method:"post",
            url:"http://localhost:5000/api/meetings/selectSlot",
            headers:{
                "Content-type":"application/json"
            },
            data:{
                meetingId:details._id,
                selectedSlot:slot
            }
        }
        axios(config)
        .then(res=>{
            console.log(res)
            setSelectedSlot(slot)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const displayMeetingSlots=()=>{
        return generatedSlots.map(slot=>{
            const date = slotToDate(slot[0],2)
            return(
                <ul key={date} className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-section2-slots'>
                    {`From ${date[0]} to ${date[1]}:`}
                    {slot[1].map(el=>{
                        const elDate = slotToDate(el)
                        return(
                            <div key={el} className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-section2-slots-indiv'>
                                {`${elDate[0]}~${elDate[1]}`}
                                <button onClick={()=>{selectMeetingSlot(el)}}>Select</button>
                            </div>
                        )
                    })}
                </ul>
            )
        })
    }

    return(
        <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full'>
            <button className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-open' onClick={handleClickOpen}>
            </button>
            <Dialog 
                open={open} 
                onClose={handleClose}
                sx={{
                    "& .MuiDialog-container": {
                      "& .MuiPaper-root": {
                        width: "85%",
                        height: "85%",
                        maxWidth: "90vw",
                        backgroundColor: "#794577"
                      },
                    },
                    "& .MuiDialogTitle-root":{
                        fontFamily:"Helvetica",
                        fontWeight: "bold",
                        fontSize: "25px",
                        backgroundColor:"#A5A682",
                    }
                  }}
            >
                <DialogTitle>{details.name}</DialogTitle>
                <DialogContent>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-'>
                        {selectedSlot===null ? 
                            <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full'>
                                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1'>
                                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-header'>
                                        <p>{`Member availabilities from ${startDate} to ${endDate}: `}</p>
                                        {<button onClick={handleCreateMeetingSlots}>Generate meeting slots</button>}
                                    </div>
                                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content'>
                                        {generatedSlots.length>0 ? <div
                                            className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-section2'
                                        >
                                            <p>Generated Slots:</p>
                                            {displayMeetingSlots()}
                                        </div>:
                                        <div
                                            className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-section1'
                                        >
                                            <p>{`Submissions:`}</p>
                                            {slotSubmissionDisplay()}
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2'>
                                    <p>Members who have submitted:</p>
                                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2-section'>
                                        {details.haveUploaded.length > 0 ? createUsersDisplay(true) : <p>No members have submitted yet</p>}
                                    </div>                                    
                                    <p>Members who haven't submitted:</p>
                                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2-section'>
                                        {details.haveNotUploaded.length > 0 ? createUsersDisplay(false) : <p>No members have submitted yet</p>}
                                    </div>    
                                </div>
                            </div>:
                            <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full'>
                                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-selected'>
                                    <p>Selected Meeting Slot:</p>
                                    {`${slotToDate(selectedSlot)[0]} ~ ${slotToDate(selectedSlot)[0]}`}
                                </div>
                            </div>
                        }
                        
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default IndivMeeting;