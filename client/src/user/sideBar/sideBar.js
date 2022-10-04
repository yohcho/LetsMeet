import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from "../../assets/logo.png"

import "./sideBar.css"

function Sidebar (props) {
    const navigate= useNavigate()
    const {state} = useLocation();

    const handleNavigate=(destination)=>{
        navigate(destination,{state:state})
    }

    return (
        <div className={`sidebar ${props.action && "sidebar-show"}`}>
            {/*<button className='sidebar-close-button'>X</button>*/}
            <div className='sidebar-content'>
                <img src={logo} alt="logo"></img>
                <hr></hr>
                <button onClick={()=>{handleNavigate("/dashboard")}}>Home</button> <br></br>
                <button onClick={()=>{handleNavigate("/")}}>Logout</button> <br></br>
            </div>
        </div>
    )
  };
  //<button onClick={()=>{handleNavigate("/settings")}}>Settings</button> <br></br>
  
  export default Sidebar;