import React, { useEffect, useState } from 'react';
import axios from 'axios'
import "./pendingGroups.css"

const PendingGroups=(props)=>{
    const [pendingGroups,setPendingGroups] = useState([])
    const getPendingGroups=()=>{
        var config = {
            method:"get",
            url:"/api/users/getPendingGroups",
            headers:{
                "Content-type":"application/json"
            },
            params:{
                email:props.userInfo.email
            }
        }
        axios(config)
        .then(res=>{
            setPendingGroups(res.data.groups)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleAccept=(group)=>{
        var config = {
            method:"post",
            url:"/api/users/acceptPendingUser",
            headers:{
                "Content-type":"application/json"
            },
            params:{
                groupId:group.groupId,
                name:group.groupName,
                email:props.userInfo.email
            }
        }
        axios(config)
        .then(res=>{
            props.rerender(prevRender=>!prevRender)
            getPendingGroups()
        })
        .catch(err=>{
            console.log(err)
        })
    }    
    const handleDecline=(group)=>{
        setPendingGroups(prevPendingGroups=>{
            const newPendingGroups=prevPendingGroups.filter(pendingGroup=>pendingGroup.groupName!==group.groupName)
            return newPendingGroups
        })
        var config = {
            method:"post",
            url:"/api/users/rejectPendingUser",
            headers:{
                "Content-type":"application/json"
            },
            params:{
                groupId:group.groupId,
                email:props.userInfo.email
            }
        }
        axios(config)
        .then(res=>{
            getPendingGroups()
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const createPendingGroupsDisplay=()=>{
        if(pendingGroups.length===0)
            return(
                <div>
                    No Pending Invites
                </div>
            )
        return pendingGroups.map(group=>{
            return(
                <div className='groups-page-content-main-pending-indiv' key={group.groupId} id={group.groupId}>
                    <h4>{group.groupName}</h4>
                    <div className='groups-page-content-main-pending-indiv-buttons'>
                        <button onClick={()=>handleAccept(group)}>???</button>
                        <hr></hr>
                        <button onClick={()=>handleDecline(group)}>???</button>
                    </div>
                </div>
            )
        })
    }
    useEffect(()=>{
        getPendingGroups()
    },[])
   
    
    return(
        <div>
            {createPendingGroupsDisplay()}
        </div>
    )
}

export default PendingGroups