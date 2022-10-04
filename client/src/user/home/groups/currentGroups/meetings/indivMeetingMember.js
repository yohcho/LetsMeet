import { useState, useEffect } from 'react';
import axios from 'axios';

import "./styles/indivMeeting.css"

const IndivMeetingMember=(props)=>{
    const startString = props.meeting.timeRangeStart.split(":")
    const endString = props.meeting.timeRangeEnd.split(":")
    const startTime = parseInt(startString[0])+ (startString[1]!=="0" && 0.5)
    const endTime = parseInt(endString[0])+ (endString[1]!=="0" && 0.5)
    let numCols = endTime>startTime ? (endTime-startTime)*2 : (endTime+24-startTime)*2
    const startDate = new Date(props.meeting.range[0].split("T")[0].replaceAll('-','/'))
    const endDate = new Date(props.meeting.range[1].split("T")[0].replaceAll('-','/'))
    const numDays = (Math.ceil((endDate.getTime()-startDate.getTime())/(1000*3600*24)))+1
    const slots = Array.from({length: numCols},()=> Array.from({length: numDays}, () => false))
    const [submission, setSubmission] = useState([])    
    const [mouseHold, setMouseHold] = useState(false)

    useEffect(()=>{
        for(const userSubmission of props.meeting.haveUploaded){
            if(userSubmission.user===props.userInfo.email)
                setSubmission(userSubmission.slots)
        }
    },[])

    const uploadSubmission=()=>{
        var config = {
            method:"post",
            url:"http://localhost:5000/api/meetings/uploadSchedule",
            headers:{
                "Content-type":"application/json"
            },
            data:{
                slots:submission,
                meetingId:props.meeting._id,
                user:props.userInfo.email
            }
        }
        axios(config)
        .then(res=>{
            props.handleClose()
            props.rerender(prevRender=>!prevRender)
        })
        .catch(err=>{
        })
    }

    const createSubmissionDisplay=()=>{
        let i = -1;
        return slots.map(row=>{
            i++
            let j = -1;
            return (
                <div key={i} className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-schedule-row'>
                    {row.map(col=>{
                        j++
                        const rowNum = 0+i
                        const colNum = 0+j
                        const color = setColor(rowNum,colNum)
                        const date = new Date(startDate)
                        date.setDate(date.getDate()+colNum)
                        return (
                            <div
                                key={`${rowNum}-${colNum}`} 
                                className='unselectable groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-schedule-row-block'
                                style={{backgroundColor:color}}
                                onClick={()=>handleSlotClick(rowNum,colNum)}
                                onMouseEnter={()=>{mouseHold && handleSlotClick(rowNum,colNum)}}>
                                    {`${date.getMonth()+1}/${date.getDate()}`}
                            </div>
                        )
                    })}
                </div>
            )
        })
    }

    const setColor=(row,col)=>{
        const index = `${row}-${col}`
        if(submission.includes(index))
            return "green"
        let meetingLength = props.meeting.duration-0.5
        while(meetingLength>0){
            if(submission.includes(`${row-1}-${col}`))
                return "cyan"
            row--
            meetingLength-=0.5
        }

        return "transparent"
    }

    const handleSlotClick=(row,col)=>{
        setSubmission(prevSumbission=>{
            let newSubmission           
            if(prevSumbission.includes(`${row}-${col}`))
                newSubmission = prevSumbission.filter(submission=>submission!==`${row}-${col}`)
            else
                newSubmission = [...prevSumbission,`${row}-${col}`]
            return newSubmission
        })
    }

    const createRangeVisual=()=>{
        const times = []

        let time = new Date();
        time.setHours(startTime,0,0,0);
        if(startTime%1!==0)
            time.setMinutes(30)
        while(true){
            times.push([time.getHours(),time.getMinutes()])
            time.setTime(time.getTime()+(60*60*1000))
            if(time.getHours()>Math.floor(endTime) || (time.getHours()===(endTime) && time.getMinutes()===30))
                break
        }
        return times.map(time=>{
            const hour = time[0]<=12 ? time[0] : time[0]-12
            const mins = time[1]===0 ? "00" : "30"
            const amOrpm = time[0]<12 ? " am" : " pm"

            return(
                <div key={`${hour}-${mins}-${amOrpm}`} className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-schedule-times-block'>
                    {`${hour}:${mins}${amOrpm}`}
                </div>
            )
        })
    }

    const generateSelectedSlotsDisplay=()=>{
        return submission.map(slot=>{
            return (
                <div key={slot}>
                    {slotToTime(slot)}
                </div>
            )
        })
    }

    const slotToTime=(slot)=>{
        const time = slot.split("-")
        time[0] = parseInt(time[0])+startTime*2
        time[1] = parseInt(time[1])
        
        const date = new Date(startDate)
        date.setDate(date.getDate()+time[1])
        date.setTime(date.getTime()+(time[0]*30*60*1000))
        const endTime= new Date(date)
        endTime.setTime(endTime.getTime()+props.meeting.duration*60*60*1000)

        return `${getTime(date)} ~ ${getTime(endTime,true)}`
    }

    const getTime=(date,end)=>{
        const amOrpm = date.getHours()>12? " pm" : " am"
        if(amOrpm===" pm")
            date.setHours(date.getHours()-12)
        const dateString = `${date}`
        if(!end)
        return `${dateString.substring(0,dateString.lastIndexOf(":"))}${amOrpm}`
        else
        return `${date.getHours()}:${date.getMinutes()===0 ? "00" : "30"}${amOrpm}`
    }

    return(
        <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-'>
            {!props.meeting.slots ? <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full'>
                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1'>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-header'>
                        <p>
                            {`Your availability from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}, `}<br></br>
                            {`between 
                                ${Math.floor(startTime)>12 ? Math.floor(startTime)-12:Math.floor(startTime)}:${startTime%1!==0 ? "30" : "00"}${startTime<12 ? " am" : " pm"} and 
                                ${Math.floor(endTime)>12 ? Math.floor(endTime)-12 : Math.floor(endTime)}:${endTime%1!==0 ? "30" : "00"}${endTime<12 ? " am" : " pm"}
                                for ${props.meeting.duration} hour`
                            }
                        </p>
                        <button onClick={uploadSubmission}>
                            {props.meeting.haveNotUploaded.includes(props.userInfo.email) ? "Submit" : "Re-Submit"}
                        </button>
                    </div>
                    <div
                        className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content'
                    >
                        <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-schedule'>
                            <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-schedule-times'>
                                {createRangeVisual()}</div>
                            <div 
                                className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-content-schedule-board'
                                onMouseDown={()=>{setMouseHold(true)}}
                                onMouseUp={()=>{setMouseHold(false)}}>
                                    {createSubmissionDisplay()}</div>
                        </div>                 
                    </div>
                </div>
                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2'>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2-header'>
                        <p>Selected Slots:</p>
                        {generateSelectedSlotsDisplay()}
                    </div>
                    
                </div>
            </div>:
            <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full'>
                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content3'>
                    <h1>
                        {`Finalized meeting slot is ${props.meeting.slots}`}
                    </h1>
                </div>
            </div>}           
        </div>
    )
}

export default IndivMeetingMember