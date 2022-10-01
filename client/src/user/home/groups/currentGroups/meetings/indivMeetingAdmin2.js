import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';
import { Bar } from "react-chartjs-2";
//import axios from 'axios';

const IndivMeeting=(props)=>{
    const details = props.meeting
    const submission = new Map()
    
    const startDate = details.range[0].split("T")[0]
    const endDate = details.range[1].split("T")[0]

    const [open,setOpen] = useState(false)
    const handleClickOpen = () => {
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
                if(submission.has(slot))
                    submission.set(slot,submission.get(slot)+1)
                else
                    submission.set(slot,1)
            }
        }
    }

    const slotSubmissionDisplay=()=>{
        const submissions = []
        const start=startDate.replaceAll('-','/')
        submission.forEach((value,key)=>{
            let slotdate = new Date(start)
            let begin= new Date(start)
            slotdate.setDate(begin.getDate()+Math.floor(key/48))
            slotdate = new Date(slotdate.getTime()+30*60000*(key%48))
            let slotEnd = new Date(slotdate.getTime()+30*60000*details.duration*2)
            submissions.push(
                <p key={slotdate[Symbol.toPrimitive]('string')}>
                    {`
                        ${slotdate[Symbol.toPrimitive]('string').substring(0,slotdate[Symbol.toPrimitive]('string').lastIndexOf(":"))} ~
                        ${slotEnd[Symbol.toPrimitive]('string').substring(0,slotdate[Symbol.toPrimitive]('string').lastIndexOf(":"))}
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
        console.log(details.slots)
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
                        <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full'>
                            <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1'>
                                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-header'>
                                    <p>{`Member availabilities from ${startDate} to ${endDate}: `}</p>
                                    {details.slots.length===0 && <button onClick={handleCreateMeetingSlots}>Generate meeting slots</button>}
                                </div>
                                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content'>
                                    <div
                                        className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-section1'
                                    >
                                        <p>{`Submissions:`}</p>
                                        {slotSubmissionDisplay()}
                                    </div>
                                    {details.slots.length>0 && <div
                                        className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-section2'
                                    >
                                    </div>}
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
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default IndivMeeting;