import { useState } from 'react';
import CanvasJSReact from "./canvasjs-3.7/canvasjs.react"
import axios from 'axios';

const IndivMeetingAdmin=(props)=>{
    var CanvasJS = CanvasJSReact.CanvasJS;
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const details = props.meeting
    const startDate = new Date(props.meeting.range[0].split("T")[0].replaceAll('-','/'))
    const endDate = new Date(props.meeting.range[1].split("T")[0].replaceAll('-','/'))

    const startString = props.meeting.timeRangeStart.split(":")
    const endString = props.meeting.timeRangeEnd.split(":")
    const startTime = parseInt(startString[0])+ (startString[1]!=="0" && 0.5)
    const endTime = parseInt(endString[0])+ (endString[1]!=="0" && 0.5)
    
    const [showData,setShowData] = useState(true)

    const slotToTime=(slot)=>{
        const time = slot.split("-")
        time[0] = parseInt(time[0])+startTime*2
        time[1] = parseInt(time[1])
        const date = new Date(startDate)
        date.setDate(date.getDate()+time[1])
        date.setTime(date.getTime()+(time[0]*30*60*1000))
        return date
    }

    const fetchSubmission=()=>{
        const submissionMap = new Map()
        let current = new Date(startDate)
        while(current.getTime()<=endDate.getTime()){
            submissionMap.set(`${current.toLocaleDateString().substring(0,current.toLocaleDateString().lastIndexOf("/"))}A`,0)
            submissionMap.set(`${current.toLocaleDateString().substring(0,current.toLocaleDateString().lastIndexOf("/"))}B`,0)
            current.setDate(current.getDate()+1)
        }
        const middleTime = startTime<endTime ? (startTime+endTime)/2 : (startTime+(endTime+24-startTime)/2)%24
        
        const allSlots = []
        const uploads = (details.haveUploaded)
        for(const upload of uploads){
            for(const slot of upload.slots)
                allSlots.push(slotToTime(slot))
        }

        for(const date of allSlots){
            let dateString = `${date.toLocaleDateString().substring(0,date.toLocaleDateString().lastIndexOf("/"))}`
            if(date.getHours()<middleTime)
                submissionMap.set(`${dateString}A`,submissionMap.get(`${dateString}A`)+1)
            else
                submissionMap.set(`${dateString}B`,submissionMap.get(`${dateString}B`)+1)
        }
        return submissionMap
        
    }
    const submissionsMap = fetchSubmission()
    
    const createUsersDisplay=(uploaded)=>{
        const usersList = uploaded ? props.meeting.haveUploaded : props.meeting.haveNotUploaded
        return usersList.map(user=>{
            const email = user.user ? user.user : user
            return(
                <div key={email}>
                    {email}
                </div>
            )
        })
    }
    const slotSubmissionDisplay=()=>{
        const middleTime = startTime<endTime ? (startTime+endTime)/2 : (startTime+(endTime+24-startTime)/2)%24
        const data = []
        for(const submission of submissionsMap){
            const value = (submission[0].charAt(submission[0].length-1))
            submission[0] = submission[0].substring(0,submission[0].length-1)
            const slot = value==="A" ? submission[0]+` -- ${decimalToTime(startTime)}~${decimalToTime(middleTime)}` : submission[0]+` -- ${decimalToTime(middleTime)}~${decimalToTime(endTime)}`
            data.push({
                label: slot,
                y: submission[1]
            })
        }
        const options = {
			title: {
				text: "Submission Data"
			},
			data: [
                {
                    type: "doughnut",
                    dataPoints: data
                }
			]
		}
        return(
            <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-contentadmin-chart'>
                <CanvasJSChart options = {options}/>
            </div>
        )
    }

    const decimalToTime=(decimal)=>{
        return `${Math.floor(decimal)>12 ? Math.floor(decimal)-12:Math.floor(decimal)}:${decimal%1!==0 ? "30" : "00"}${decimal<12 ? " am" : " pm"}`
    }

    const handleCreateMeetingSlots=()=>{
        const mostPopularSections = []
        let maximum=-1
        while(true){
            const max = ([...submissionsMap.entries()].reduce((a, e ) => e[1] > a[1] ? e : a))
            if(maximum===-1 || max[1]>=maximum*0.85){
                maximum = max[1]
                mostPopularSections.push(max[0])
                submissionsMap.delete(max[0])
            }
            else
                break
        }
        const middleTime = startTime<endTime ? (startTime+endTime)/2 : (startTime+(endTime+24-startTime)/2)%24

        const ans = []
        for(let section of mostPopularSections){
            const char = (section.charAt(section.length-1))
            section = section.substring(0,section.length-1)
            let center = startTime<middleTime ? (startTime+middleTime)/2 : (startTime+(middleTime+24-startTime)/2)%24
            if(char==="B")
                center = middleTime<endTime ? (middleTime+endTime)/2 : (middleTime+(endTime+24-middleTime)/2)%24
            ans.push(`${section}-${decimalToTime(center)}~${decimalToTime(center+details.duration)}`)
        }
        return ans
    }
    
    const selectMeetingSlot=(slot)=>{
        var config = {
            method:"post",
            url:"/api/meetings/selectSlot",
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
            props.rerender(prevRender=>!prevRender)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const displayMeetingSlots=()=>{
        const slots = handleCreateMeetingSlots()
        return slots.map(slot=>{
            return(
                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-contentadmin-indivcreatedSlots' 
                    key={slot}>
                    {slot}
                    <button onClick={()=>selectMeetingSlot(slot)}>{"Select (Final)"}</button>
                </div>
            )
        })
    }

    return(
        <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-'>
            {!props.meeting.slots ? <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full'>
                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1'>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-header'>
                        <p>
                            {`Member availabilities from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}: `}<br></br>
                            {`between 
                                ${decimalToTime(startTime)} and 
                                ${decimalToTime(endTime)}
                                for ${props.meeting.duration} hour`
                            }
                        </p>
                        <button onClick={()=>setShowData(prevShowData=>!prevShowData)}>
                            {showData ? "Generate meeting slots" : "View submission data"}
                        </button>
                    </div>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content1-contentadmin'>
                        {showData ? slotSubmissionDisplay() : displayMeetingSlots()}
                    </div>
                </div>
                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2'>
                    <p>Members who have submitted:</p>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2-section'>
                        {details.haveUploaded.length > 0 ? createUsersDisplay(true) : <p>No members have submitted yet</p>}
                    </div>                                    
                    <p>Members who haven't submitted:</p>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-full-content2-section'>
                        {details.haveNotUploaded.length > 0 ? createUsersDisplay(false) : <p>All members have submitted</p>}
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

export default IndivMeetingAdmin