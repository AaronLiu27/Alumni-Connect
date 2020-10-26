import React from 'react';
import InputField from '../component/inputField';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import axios from 'axios';
import { useState } from "react";
import {useHistory} from "react-router-dom";

function LoginForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setButtonDisabled(false);
    }
    const history = useHistory();
    const doLogin = async () => {
        history.push("/mainpage");
        if (!username) {
            return;
        }
        if(!password) {
            return;
        }

        setButtonDisabled(true);

        if(username === 'user' && password === 'password') {
            UserStore.isLoggedIn = true;
            UserStore.username = username;
            return;
        }

        try {
            const apiUrl = '/auth';
            let res = await axios.post(apiUrl, {
                "username": username,
                "passwd": password,
            });

            if (res.status === 200) {
                UserStore.isLoggedIn = true;
                UserStore.username = username;
            } else {
                resetForm();
                alert(res.statusText);
            }
        } catch(e) {
            resetForm();
            console.log(e);
        }

    }

    return (
        <div className="loginForm">
            Log In
            <div>
                <label htmlFor="usernameInput">Username</label>
                <input 
                    id="usernameInput" 
                    type='text'
                    plcaeholder='Username'
                    value={username ? username : ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="passwordInput">Password</label>
                <input 
                    id="passwordInput" 
                    type='password'
                    plcaeholder='Password'
                    value={password ? password : ''}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div>
                <button
                    text='Login'
                    disabled={buttonDisabled}
                    onClick={ () => doLogin() }
                >
                    Login
                </button>
            </div>

        </div>
    );

}

export default LoginForm;
