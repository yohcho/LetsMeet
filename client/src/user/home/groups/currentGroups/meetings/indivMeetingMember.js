import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

import "./styles/indivMeeting.css"

const IndivMeeting=(props)=>{
    const details = props.meeting
    const submitStatus= !details.haveNotUploaded.includes(props.userInfo.email)

    const selectedSlot = details.slots
    const startDate = details.range[0].split("T")[0]
    const endDate = details.range[1].split("T")[0]
    const [open,setOpen] = useState(false)
    const [submission, setSubmission] = useState([])
    const [mouseHold, setMouseHold] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
        fetchSubmission()
    };
    const handleClose = () => {
        setOpen(false);
        props.rerender()
    };

    const fetchSubmission=()=>{
        if(!submitStatus){
            const start=startDate.replaceAll('-','/')
            const begin= new Date(start)

            const end=endDate.replaceAll('-','/')
            let stop= new Date(end)
            stop.setDate(stop.getDate()+1)

            const numHours = (stop.getTime()-begin.getTime())/(1000*3600)
            const boxCount = []

            for(let i = 0; i < numHours; i+=0.5){
                boxCount.push(-1)
            }
            setSubmission(boxCount)
        }
    }

    const handleClick=(slot)=>{
        setSubmission(prevSubmission=>{
            const newSubmission = [...prevSubmission]
            if(newSubmission[slot]===-1){
                newSubmission[slot]=1
                for(let i = 1; i < details.duration*2; i++){
                    if(newSubmission[slot+i]===1)
                        break;
                    newSubmission[slot+i]=0
                }
            }
            else if(newSubmission[slot]===1){
                newSubmission[slot]=-1
                for(let i = 1; i < details.duration*2; i++){
                    if(newSubmission[slot+i]===1)
                        break;
                    newSubmission[slot+i]=-1
                }
                for(let i = 1; i < details.duration*2; i++){
                    if(newSubmission[slot-i]===1){
                        newSubmission[slot-i]=-1
                        handleClick(slot-i)
                    }
                }
            }
            else if(newSubmission[slot]===0){
                newSubmission[slot]=1
                for(let i = 1; i < details.duration*2; i++){
                    if(newSubmission[slot+i]===1)
                        break;
                    newSubmission[slot+i]=0
                }
            }
            return newSubmission
        })
    }

    const handleSubmitSubmission=()=>{
        const availableSlots=[]
        for(let i =0; i<submission.length;i++){
            if(submission[i]===1)
                availableSlots.push(i)
        }
        var config = {
            method:"post",
            url:"http://localhost:5000/api/meetings/uploadSchedule",
            headers:{
                "Content-type":"application/json"
            },
            data:{
                slots:availableSlots,
                meetingId:details._id,
                user:props.userInfo.email
            }
        }
        axios(config)
        .then(res=>{
            handleClose()
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const createSubmissionDisplay=()=>{
        const display = []
        const start=startDate.replaceAll('-','/')
        let begin= new Date(start)
        for(let i=0; i<submission.length/48;i++){
            const row =[]
            row.push(
                <p key={begin[Symbol.toPrimitive]('string')}>
                    {begin[Symbol.toPrimitive]('string').split("00:")[0]}
                </p>
            )
            let startTime= new Date(start)
            for(let j=0; j<48;j++){
                const secondTime = new Date(startTime.getTime()+30*60000*details.duration*2)
                const timeValue = `
                    ${
                        startTime[Symbol.toPrimitive]('string').substring(
                            startTime[Symbol.toPrimitive]('string').indexOf(":")-2,
                            startTime[Symbol.toPrimitive]('string').lastIndexOf(":")
                        )
                    } ~ ${
                        secondTime[Symbol.toPrimitive]('string').substring(
                            secondTime[Symbol.toPrimitive]('string').indexOf(":")-2,
                            secondTime[Symbol.toPrimitive]('string').lastIndexOf(":")
                        )
                    }
                `
                startTime = new Date(startTime.getTime()+30*60000)
                const minute = 30*j
                let color = "transparent"
                if(submission[i*48+j]===1){
                    color="green"
                }
                else if(submission[i*48+j]===0){
                    color="chartreuse"
                }
                row.push(
                <button 
                    className='selectorBox' 
                    key={`${i}-${j}`} 
                    onClick={()=>{handleClick(i*48+j)}}
                    onMouseEnter={()=>{
                        if(mouseHold)
                        handleClick(i*48+j)
                    }}
                    style={{background:color}}
                >
                    {`${timeValue}`}
                </button>
            )}
            display.push(
                <div key={i} className='selectorDay'>
                    {row}
                </div>
            )
            begin.setDate(begin.getDate()+1)
        }
        display.push(
            
        )
        return(
            <div className='selectorField'>
                {display}
            </div>
        )
    }

    const generateSelectedSlotsDisplay=()=>{
        const availableSlots=[]
        const start=startDate.replaceAll('-','/')
        let begin= new Date(start)
        for(let i =0; i<submission.length;i++){
            if(submission[i]===1)
                availableSlots.push(i)
        }
        return availableSlots.map(slot=>{
            let slotdate = new Date(start)
            slotdate.setDate(begin.getDate()+Math.floor(slot/48))
            slotdate = new Date(slotdate.getTime()+30*60000*(slot%48))
            let slotEnd = new Date(slotdate.getTime()+30*60000*details.duration*2)
            return (
                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2-indiv'>
                    <p>{slotdate[Symbol.toPrimitive]('string').split(":")[0].slice(0,-3)}</p>
                    <div>
                        {slotdate[Symbol.toPrimitive]('string').substring(
                            slotdate[Symbol.toPrimitive]('string').indexOf(":")-2,
                            slotdate[Symbol.toPrimitive]('string').lastIndexOf(":")
                        )}~
                        {slotEnd[Symbol.toPrimitive]('string').substring(
                            slotEnd[Symbol.toPrimitive]('string').indexOf(":")-2,
                            slotEnd[Symbol.toPrimitive]('string').lastIndexOf(":")
                        )}
                    </div>                    
                </div>
            )
        })
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
                                    <p>{`Your availability from ${startDate} to ${endDate}: `}</p>
                                    {!submitStatus && (
                                        <button key={"submitButton"} onClick={handleSubmitSubmission}>
                                            Submit
                                        </button>
                                    )}
                                </div>
                                {submitStatus ?
                                <p>Submitted</p>:
                                <div
                                    className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content'
                                    onMouseDown={()=>{setMouseHold(true)}}
                                    onMouseUp={()=>{setMouseHold(false)}}
                                >
                                    <p>{`Meeting length: ${details.duration} hour`}</p>
                                    {createSubmissionDisplay()}
                                </div>
                                }
                            </div>
                            <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2'>
                                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2-header'>
                                    <p>Selected Slots:</p>
                                </div>
                                {generateSelectedSlotsDisplay()}
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