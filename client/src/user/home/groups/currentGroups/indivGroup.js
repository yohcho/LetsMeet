import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

import CreateMeeting from './meetings/createMeeting';
import AddNewMember from './addNewGroupMember';
import IndivMeetingAdmin from './meetings/indivMeetingAdmin';
import IndivMeetingMember from './meetings/indivMeetingMember';


const IndivGroup = (props)=>{
    const group = props.group
    const [meetings,setMeetings] = useState(group.meetings)
    const [meetingInfos,setMeetingInfos] = useState([])
    const [open,setOpen] = useState(false)
    const [render,setRender] = useState(false)
    const [members,setMembers] = useState(group.members)

    const handleClickOpen = () => {
        setOpen(true);
        getMeetingInfo()
    };
    const handleClose = () => {
        setOpen(false);
    };

    const removeMember=(member)=>{
        console.log(member)
    }

    const createUsersDisplay =()=>{
        return members.map(member=>{
            return(
                <div key={member}>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-content-indiv'>
                        <p>{member}</p>
                        <button onClick={()=>removeMember(member)}>❌</button>
                    </div>
                    <hr></hr>
                </div>
                
            )
        })
    }
    const createMeetingsDisplay = ()=>{
        if(meetingInfos.length===0)
            return(
                <div>
                    No Scheduled Meetings
                </div>
            )
        return meetingInfos.map(meeting=>{
            return(
                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv' key={meeting._id}>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-section'>
                       <h4 className='groups-page-content-main-current-individualDisplay-full-section-indiv-section-name'>{meeting.name}</h4>
                    </div>                
                    <hr></hr>
                    <h4>{`⏱️ ${meeting.duration} ${meeting.duration > 1 ? "hours" : "hour"}`}</h4>              
                    {meeting.admin===props.userInfo.email ? 
                    <IndivMeetingAdmin key={meeting._id} userInfo={props.userInfo} meeting={meeting} rerender={setRender}/>:
                    <IndivMeetingMember key={meeting._id} rerender={handleClickOpen} userInfo={props.userInfo} meeting={meeting}/>}
                </div>
            )
        })
    }

    const getMeetingInfo = ()=>{
        var config = {
            method:"get",
            url:"http://localhost:5000/api/meetings/getMeeting",
            headers:{
                "Content-type":"application/json"
            },
            params:{
                email:props.userInfo.email,
                meetingId:meetings
            }
        }
        axios(config)
        .then(res=>{
            setMeetingInfos(res.data.meetingInfos)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return(
        <div>
            <button className='groups-page-content-main-current-individualDisplay-buttons-viewmore' onClick={handleClickOpen}>
            </button>
            <Dialog
                open={open} 
                onClose={handleClose}
                sx={{
                    "& .MuiDialog-container": {
                      "& .MuiPaper-root": {
                        width: "100%",
                        height: "100%",
                        maxWidth: "90vw",
                        backgroundColor: "#A5A682"
                      },
                    },
                    "& .MuiDialogTitle-root":{
                        fontFamily:"Helvetica",
                        fontWeight: "bold",
                        fontSize: "25px"
                    }
                  }}
            >
                <DialogTitle>
                    {group.name}
                </DialogTitle>
                <DialogContent>
                    <div className='groups-page-content-main-current-individualDisplay-full'>
                        <div className='groups-page-content-main-current-individualDisplay-full-section1'>
                            <div className='groups-page-content-main-current-individualDisplay-full-section-header'>
                                <h3>Members:</h3>
                                <AddNewMember group={group._id}/>
                            </div>
                            <div className='groups-page-content-main-current-individualDisplay-full-section-content'>
                                {createUsersDisplay()}
                            </div>
                        </div>
                        <div className='groups-page-content-main-current-individualDisplay-full-section2'>
                            <div className='groups-page-content-main-current-individualDisplay-full-section-header'>
                                <h3>Meetings:</h3>
                                <CreateMeeting userInfo={props.userInfo} group={group._id} rerender={setMeetings}/>
                            </div>
                            {createMeetingsDisplay()}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default IndivGroup