import IndivGroup from './indivGroup'
import "./currentGroups.css"

import DeleteGroup from "./deleteGroup"

const CurrentGroups = (props)=>{
    const groups = props.groups
    const populateCurrentGroups = ()=>{
        if(groups.length===0)
            return(
                <div>
                    No Pending Invites
                </div>
            )
        return groups.map(group=>{
            return(
                <div className='groups-page-content-main-current-individualDisplay' key={group._id}>
                    <h4>{group.name}</h4>
                    <div className='groups-page-content-main-current-individualDisplay-buttons'>
                        <IndivGroup userInfo={props.userInfo} group={group}/>
                        {props.userInfo.email !==group.admin && 
                        <DeleteGroup userInfo={props.userInfo} rerender={props.rerender} group={group}/>}
                    </div>
                </div>
            )
        })
    }
    
    return(
        <div>
           {populateCurrentGroups()}
        </div>
    )
}

export default CurrentGroups