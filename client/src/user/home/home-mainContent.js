import React, {useEffect, useState} from 'react';
import axios from "axios"

import CreateGroup from './groups/createGroup'
import CurrentGroup from './groups/currentGroups/currentGroups'
import PendingGroups from './groups/pendingGroups/pendingGroups';

import "./home.css"

const Content = (props) => {
    const [groups, setGroups] = useState([])
    const [render, setRender] = useState(false)
    const getCurrentGroups = ()=>{
        var config={
            method:"get",
            url:"/api/groups/getGroups",
            header:{
                "Content-type":"application/json"
            },
            params: {
                email:props.userInfo.email
            }
        }

        axios(config)
        .then((res)=>{
            setGroups(res.data.groups)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    
    useEffect(()=>{
        getCurrentGroups()
    },[render])

    return (
        <div className='groups-page-content-main'>
            <div className='groups-page-content-main-pending'>
                <h3>Pending Invites:</h3>
                <PendingGroups userInfo={props.userInfo} rerender={setRender}/>
            </div>
            <div className='groups-page-content-main-current'>
                <div className='groups-page-content-main-current-header'>
                    <h3>My Groups:</h3>
                    <CreateGroup userInfo={props.userInfo} rerender={setRender}/>
                </div>
                <CurrentGroup userInfo={props.userInfo} rerender={setRender} groups={groups}/>
            </div>
        </div>
    )
}
//
export default Content;