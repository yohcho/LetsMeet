import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

const RemoveGroupMember = (props)=>{
    const member = props.member
    const [open,setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const removeMember=()=>{
        console.log(member)
        console.log(props.group)
        var config = {
            method:"post",
            url:"/api/groups/removeMember",
            headers:{
                "Content-type":"application/json"
            },
            data:{
                id:props.group,
                member:member
            }
        }
        axios(config)
        .then(res=>{
            props.rerender(prevRender=>!prevRender)
            handleClose()
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return(
        <div>
            <button className='groups-page-content-main-current-individualDisplay-full-section-content-indiv-remove' onClick={handleClickOpen}> ❌
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
                    <h3>{`Would you like to remove ${member} from the group?`}</h3>
                    <button>Cancel</button>
                    <button onClick={removeMember}>Confirm</button>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RemoveGroupMember