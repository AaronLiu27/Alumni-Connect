import React from 'react';
import UserStore from '../stores/UserStore';
import axios from 'axios';
import { useState } from "react";
import {useHistory} from "react-router-dom";
import { runInAction } from 'mobx';
import './login.css'
import {Button} from 'react-bootstrap'

function LoginForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setButtonDisabled(false);
    }
    // const history = useHistory();
    const doLogin = async () => {
        if (!username) {
            return;
        }
        if(!password) {
            return;
        }

        setButtonDisabled(true);

        runInAction(() => {
            if(username === 'user' && password === 'password') {
                UserStore.isLoggedIn = true;
                UserStore.username = username;
                console.log('log in true')
                return;
            }
        });

        try {
            const apiUrl = 'localhost:5000/api/auth/login';
            let res = await axios.post(apiUrl, {
                "username": username,
                "passwd": password,
            });
            console.log(res)
            runInAction(() => {
                if (res.status === 200) {
                    UserStore.isLoggedIn = true;
                    UserStore.username = username;
                    //console.log(res)
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
               
                    <input 
                        className="input"
                        id="usernameInput" 
                        type='text'
                        plcaeholder='Username'
                        value={username ? username : ''}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                
            </div>

            <div className='inputTool'>
                <label htmlFor="passwordInput">Password</label>
                
                    <input 
                        className="input"
                        id="passwordInput" 
                        type='password'
                        plcaeholder='Password'
                        value={password ? password : ''}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                
            </div>

            <div className='submitBtn'>
                <Button
                className='submitButn'
                    text='Login'
                    disabled={buttonDisabled}
                    onClick={ () => doLogin() }
                    bsStyle = "primary"
                >
                    Login
                </Button>
            </div>

        </div>
    );

}

export default LoginForm;
