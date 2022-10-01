import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';

import Sidebar from '../sideBar/sideBar';
import Content from "./home-mainContent"

import burgerMenu from "../../assets/burger-menu.png"
import './home.css'

const Groups = () => {
    const {state} = useLocation();
    const [openSideBar, setOpenSideBar] = useState(false)
    
    return(
        <div className='groups-page'>
            <Sidebar userInfo={state} action={openSideBar}/>
            <div className={`groups-page-content ${openSideBar && "groups-page-content-hide"}`} onClick={()=>{openSideBar && setOpenSideBar(false)}}>
                <div className='groups-page-content-top'>
                    <h1>Dashboard</h1>
                    <button onClick={()=>setOpenSideBar(true)} className='groups-page-content-top-button'>
                        <img src={burgerMenu}></img>
                    </button>
                </div>
                <Content userInfo={state}/>
            </div>
        </div>
    )
}

export default Groups;