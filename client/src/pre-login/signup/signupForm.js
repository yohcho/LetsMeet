import React,{useState} from 'react';
import axios from 'axios'
import { Link } from "react-router-dom";

import "./signup.css"

const SignUpForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitSignUp = ()=>{
        var config ={
            method: "post",
            url: '/api/landing/signup',
            headers: {
                'Content-Type':'application/json',
            },
            data: {
                name:`${firstName} ${lastName}`,
                email:email,
                password:password
            }
        }
        axios(config)
        .then((res)=>{
            window.location.href='/login'
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <form className='signup-form'>
            <label required htmlFor="firstName">Fist Name <br></br>
                <input 
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                ></input>
                <br></br>
            </label>
            <label required htmlFor="lastName">Last Name <br></br>
                <input 
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                ></input>
                <br></br>
            </label>
            <label required htmlFor="email">Email <br></br>
                <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                ></input>
                <br></br>
            </label>
            <label required htmlFor="password">Password <br></br>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                ></input>
                <br></br>
            </label>
            <label required htmlFor="confirmPassword">Confirm Password <br></br>
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                ></input>
                <br></br>
            </label>
            <br></br>
            <p>Already have account? <Link to="/login">Back to Login</Link></p>
            <div className='signup-submit'>
                <button 
                onClick={submitSignUp}
                type="button"
                >Submit</button>
            </div>
        </form>
    )
}

export default SignUpForm;