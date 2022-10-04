import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

const AddNewMember = (props)=>{
    const [open,setOpen] = useState(false)
    const [email,setEmail] = useState("")

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddMember=()=>{
        var config = {
            method: "post",
            url: '/api/groups/addMember',
            headers: {
                'Content-Type':'application/json',
            },
            data:{
                email:email,
                group:props.group
            }
        }
        axios(config)
        .then((res)=>{
            handleClose()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <div>
            <button className='groups-page-content-main-current-individualDisplay-full-section-header-button' onClick={handleClickOpen}>
                Add New Member
            </button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogContent>
                    <div>
                        <label>New member email:
                            <input 
                                onChange={(e)=> setEmail(e.target.value)}
                                onKeyDown={(e)=> {
                                    if(e.key==="Enter")
                                        handleAddMember()
                                }}
                            ></input>
                        </label>
                        <button type='button' onClick={handleAddMember}>Add</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewMember