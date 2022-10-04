import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';

import "./styles/indivMeeting.css"
import IndivMeetingAdmin from './indivMeetingAdmin';
import IndivMeetingMember from "./indivMeetingMember"

const IndivMeeting=(props)=>{
    const details = props.meeting    
    const [open,setOpen] = useState(false)
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
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
                    {details.admin===props.userInfo.email ? 
                    <IndivMeetingAdmin rerender={props.rerender} meeting={details}/> : 
                    <IndivMeetingMember handleClose={handleClose} meeting={details} userInfo={props.userInfo} rerender={props.rerender}/>}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default IndivMeeting