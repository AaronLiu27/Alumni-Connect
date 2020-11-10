import React from 'react';
import UserStore from '../stores/UserStore';
import axios from 'axios';
import { useState } from "react";
import {useHistory} from "react-router-dom";
import { runInAction } from 'mobx';
import './login.css'
import {Button} from 'react-bootstrap'
import CryptoJs from 'crypto-js';

function LoginForm() {

    let history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setButtonDisabled(false);
    }
    
    const doLogin = async () => {
        if (!username) {
            return;
        }
        if(!password) {
            return;
        }

        setButtonDisabled(true);

        try {
            const apiUrl = 'http://nyu-devops-alumniconnect.herokuapp.com/api/auth/login';
            const pwd = CryptoJs.MD5(password).toString();
            let res = await axios.post(apiUrl, {
                "username": username,
                "passwd": pwd,
            });
            //console.log(res)
            runInAction(() => {
                if (res.status === 200) {
                    UserStore.isLoggedIn = true;
                    UserStore.username = username;
                    UserStore.token = 'Bearer '+res.data.access_token;
                    UserStore.id = res.data.user_id;
                    UserStore.setDataFromSessionStorage();
                    setUsername('success');
                    // console.log(username);
                    history.push("/mainpage");
                } else {
                    resetForm();
                    alert(res.statusText);
                }
            })

        } catch(e) {
            resetForm();
            console.log(e);
        }

    }

    return (
        <div className="loginForm">
            <div className='title'>
                Log In
            </div>
            <div className='inputTool'>
                <label htmlFor="usernameInput">Username</label>
                <div>
                    <input 
                        className="input"
                        id="usernameInput" 
                        type='text'
                        plcaeholder='Username'
                        value={username ? username : ''}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
            </div>

            <div className='inputTool'>
                <label htmlFor="passwordInput">Password</label>
                <div>
                    <input 
                        className="input"
                        id="passwordInput" 
                        type='password'
                        plcaeholder='Password'
                        value={password ? password : ''}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <div className='submitBtn'>
                <Button
                    className='submitButn'
                    text='Login'
                    disabled={buttonDisabled}
                    onClick={ () => doLogin() }
                >
                    Login
                </Button>
            </div>

            <div hidden role="alert">{UserStore.username}</div>

            {/* {username === 'success' ? <div hidden role="alert">alert</div> : null} */}
        </div>
    
    );

}

export default LoginForm;
