import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

const DeleteGroup = (props)=>{
    const group = props.group
    const [open,setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const removeGroup=()=>{
        var config={
            method:"post",
            url:"/api/groups/removeGroup",
            header:{
                "Content-type":"application/json"
            },
            data: {
                email:props.userInfo.email,
                group:group
            }
        }

        axios(config)
        .then((res)=>{
            handleClose()
            props.rerender(prevRender=>!prevRender)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <div>
            <button className='groups-page-content-main-current-individualDisplay-buttons-remove' onClick={handleClickOpen}> ❌
            </button>
            <Dialog
                open={open} 
                onClose={handleClose}
                sx={{
                  }}
            >
                <DialogTitle>
                </DialogTitle>
                <DialogContent>
                    <h3>Would you like to leave this group?</h3>
                    <button>Cancel</button>
                    <button onClick={removeGroup}>Confirm</button>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DeleteGroup