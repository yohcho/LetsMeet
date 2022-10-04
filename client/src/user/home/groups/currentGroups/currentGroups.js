import IndivGroup from './indivGroup'
import "./currentGroups.css"

import DeleteGroup from './deleteGroup'

const CurrentGroups = (props)=>{
    const groups = props.groups
    const populateCurrentGroups = ()=>{
        if(groups.length===0)
            return(
                <div>
                    You are not in any group!
                </div>
            )
        return groups.map(group=>{
            return(
                <div className='groups-page-content-main-current-individualDisplay' key={group}>
                    <h4>{group.name}</h4>
                    <div className='groups-page-content-main-current-individualDisplay-buttons'>
                        <IndivGroup userInfo={props.userInfo} group={group}/>
                        <DeleteGroup rerender={props.rerender} userInfo={props.userInfo} group={group}/>
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