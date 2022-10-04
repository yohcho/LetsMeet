import React,{useState} from 'react';
import axios from "axios"

import { useNavigate } from 'react-router-dom';

import { Link } from "react-router-dom";

import "./login.css"

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const submitLogin = ()=>{
        const creds = JSON.stringify({
            email:email,
            password:password
        })

        var config ={
            method: "post",
            url: '/api/landing/login',
            headers: {
                'Content-Type':'application/json',
            },
            data: creds
        }
        axios(config)
        .then((res)=>{
            const user = res.data.user
            if(user){
                navigate("/dashboard",{state:{email:user.email, name:user.name}})
            }
            else{
                alert("Invalid Login Credentials")
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <form className='login-form'>
            <label htmlFor="email">Email <br></br>
                <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                ></input>
            </label>
            <label htmlFor="password">Password <br></br>
                <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key==="Enter")
                        submitLogin()
                }}
                required
                ></input>
            </label>
            <p>No Account? <Link to="/signUp">Create New Account</Link></p>
            <div className='login-submit'>
                <button onClick={submitLogin} type="Button">
                    Sign in
                </button>
            </div>
        </form>
    )
}

export default LoginForm;