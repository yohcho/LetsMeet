import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

import CreateMeeting from './meetings/createMeeting';
import AddNewMember from './addNewGroupMember';
import RemoveGroupMember from './removeGroupMember';
import IndivMeeting from './meetings/indivMeeting';


const IndivGroup = (props)=>{
    const [group,setGroup] = useState("")
    const [meetingInfos,setMeetingInfos] = useState([])
    const [open,setOpen] = useState(false)
    const [render,setRender] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
        getGroupInfo()
        getMeetingInfo()
    };
    const handleClose = () => {
        setOpen(false);
    };
    const getGroupInfo=()=>{
        const id = props.group.split("@")[0]
        var config = {
            method:"get",
            url:"http://localhost:5000/api/groups/getGroupData",
            headers:{
                "Content-type":"application/json"
            },
            params:{
                id:id
            }
        }
        axios(config)
        .then(res=>{
            setGroup(res.data.group)
        })
        .catch(err=>{
            console.log(err)
        })
    }


    const createUsersDisplay =()=>{
        return group.members.map(member=>{
            return(
                <div key={member}>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-content-indiv'>
                        <p>{member}</p>
                        {props.userInfo.email === group.admin && member!==group.admin && <RemoveGroupMember rerender={setRender} group={props.group} member={member}/>}
                    </div>
                    <hr></hr>
                </div>
                
            )
        })
        
    }
    const createMeetingsDisplay = ()=>{
        return meetingInfos.map(meeting=>{
            return(
                <div className='groups-page-content-main-current-individualDisplay-full-section-indiv' key={meeting._id}>
                    <div className='groups-page-content-main-current-individualDisplay-full-section-indiv-section'>
                       <h4 className='groups-page-content-main-current-individualDisplay-full-section-indiv-section-name'>{meeting.name}</h4>
                    </div>                
                    <hr></hr>
                    <h4>{`⏱️ ${meeting.duration} ${meeting.duration > 1 ? "hours" : "hour"}`}</h4>              
                    <IndivMeeting key={meeting._id} userInfo={props.userInfo} meeting={meeting} rerender={setRender}/>
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
                id:props.group.split("@")[0],
                email:props.userInfo.email
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

    useEffect(()=>{
        getGroupInfo()
        getMeetingInfo()
    },[render])

    return(
        <div>
            <button className='groups-page-content-main-current-individualDisplay-buttons-viewmore' onClick={handleClickOpen}>
                {props.group.split("@")[1]}
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
                    {props.group.split("@")[1]}
                </DialogTitle>
                <DialogContent>
                    <div className='groups-page-content-main-current-individualDisplay-full'>
                        <div className='groups-page-content-main-current-individualDisplay-full-section1'>
                            <div className='groups-page-content-main-current-individualDisplay-full-section-header'>
                                <h3>Members:</h3>
                                <AddNewMember group={group._id}/>
                            </div>
                            <div className='groups-page-content-main-current-individualDisplay-full-section-content'>
                                {open && createUsersDisplay()}
                            </div>
                        </div>
                        <div className='groups-page-content-main-current-individualDisplay-full-section2'>
                            <div className='groups-page-content-main-current-individualDisplay-full-section-header'>
                                <h3>Meetings:</h3>
                                <CreateMeeting userInfo={props.userInfo} group={group._id} rerender={setRender}/>
                            </div>
                            {open && createMeetingsDisplay()}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default IndivGroup