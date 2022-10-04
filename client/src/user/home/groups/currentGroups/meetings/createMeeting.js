import { useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

const CreateMeeting = (props)=>{
    const [open,setOpen] = useState(false)
    const ref = useRef(null)

    const [meetingName,setMeetingName] = useState("")
    const [meetingLength,setMeetingLength] = useState(0)
    const [memberField,setMemberField] = useState("")
    const [members,setMembers] = useState([])
    const [startRange,setStartRange] = useState("")
    const [startTime,setStartTime] = useState("")
    const [endTime,setEndTime] = useState("")
    const [endRange,setEndRange] = useState("")

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setMeetingName("")
        setMeetingLength(0)
        ref.current.value=""
        setMembers([])
        setOpen(false);
    };

    const handleAddMember = ()=>{
        setMembers(prevMembers=>{
            return [...prevMembers,memberField]
        })
        ref.current.value=""
    }

    const removeAddedMember = (removeMember)=>{
        setMembers(prevMembers=>{
            return prevMembers.filter(member=>member!==removeMember)
        })
    }

    const handleCreateMeeting = (e)=>{
        e.preventDefault()
        const data={
            self:props.userInfo.email,
            name:meetingName,
            length:meetingLength,
            addedMembers:members,
            range:[startRange,endRange],
            groupId:props.group,
            start:startTime,
            end:endTime,
        }
        var config = {
            method:"post",
            url:"http://localhost:5000/api/meetings/createMeeting",
            headers:{
                "Content-type":"application/json"
            },
            params:data
        }
        axios(config)
        .then(res=>{
            handleClose()
            props.rerender(prevRender=>!prevRender)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const addedMembersDisplay = ()=>{
        return members.map(member=>{
            return(
                <div key={member}>
                    {member}
                    <button type='button' onClick={()=>removeAddedMember(member)}>X</button>
                </div>
            )
        })
    }

    return(
        <div>
            <button className='groups-page-content-main-current-individualDisplay-full-section-header-button' onClick={handleClickOpen}>
                Create New Meeting
            </button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Meeting</DialogTitle>
                <DialogContent>
                    <div>
                        <label>Name:
                            <input onChange={(e)=> setMeetingName(e.target.value)}></input>
                        </label><br></br>
                        <label>Length:
                            <input type="number" onChange={(e)=> setMeetingLength(e.target.value)}></input>
                        </label><br></br>
                        <label>Add Members:
                            <input
                                ref={ref}
                                onChange={(e)=>setMemberField(e.target.value)}
                                onKeyDown={(e)=>{
                                    e.key==="Enter" && handleAddMember()
                                }}
                            ></input>
                        </label><br></br>
                        {addedMembersDisplay()}
                        <label>Date Range:
                            <input type="date" onChange={(e)=> setStartRange(e.target.value)}></input>
                            to
                            <input type="date" onChange={(e)=> setEndRange(e.target.value)}></input>
                        </label><br></br>
                        <label>Between the hours:
                            <input type="time" onChange={(e)=> setStartTime(e.target.value)}></input>
                            to
                            <input type="time" onChange={(e)=> setEndTime(e.target.value)}></input>
                        </label><br></br>
                        <button type='submit' onClick={(e)=>handleCreateMeeting(e)}>Create</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateMeeting