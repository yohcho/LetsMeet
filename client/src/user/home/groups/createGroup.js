import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

const CreateGroup = (props)=>{
    const [open,setOpen] = useState(false)
    const [groupName,setGroupName] = useState("")

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateGroup = ()=>{
        const data = JSON.stringify({
            groupName:groupName,
            email:props.userInfo.email
        })

        var config = {
            method: "post",
            url: 'http://localhost:5000/api/groups/createGroup',
            headers: {
                'Content-Type':'application/json',
            },
            data: data
        }
        
        axios(config)
        .then((res)=>{
            props.rerender(prevRender=>!prevRender)
            handleClose()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <div className='groups-page-content-main-current-header-createsection'>
            <button className='groups-page-content-main-current-header-createsection-button' onClick={handleClickOpen}>
                Create New Group
            </button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogContent>
                    <div className='groups-page-content-main-current-header-createsection-form'>
                        <label>
                            New Group Name:
                            <input 
                                onChange={(e)=> setGroupName(e.target.value)}
                                onKeyDown={(e)=> {
                                    if(e.key==="Enter")
                                        handleCreateGroup()
                                }}
                            ></input>
                        </label>
                        <button type='button' onClick={handleCreateGroup}>Create</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateGroup