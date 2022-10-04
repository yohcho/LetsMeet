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
            url: '/api/meetings/addMember',
            headers: {
                'Content-Type':'application/json',
            },
            data:{
                email:email,
                group:props.details._id
            }
        }
        axios(config)
        .then((res)=>{
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <div>
            <button variant="outlined" onClick={handleClickOpen}>
                Add New Member
            </button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogContent>
                    <form>
                        <label>New member email:
                            <input onChange={(e)=> setEmail(e.target.value)} onKeyDown={(e)=>{e.key==="Enter" && handleAddMember()}}></input>
                        </label>
                        <button type='button' onClick={handleAddMember}>Add</button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewMember