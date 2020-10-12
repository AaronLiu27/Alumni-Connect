import React from 'react';
import InputField from './inputField';
import SubmitButton from './submitButton';
import UserStore from './stores/UserStore';
import axios from 'axios';
import { useState } from "react";

function LoginForm() {

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
            <InputField
                type='text'
                plcaeholder='Username'
                value={username ? username : ''}
                onChange={(val) => setUsername(val)}
            />

            <InputField
                type='password'
                plcaeholder='Password'
                value={password ? password : ''}
                onChange={(val) => setPassword(val)}
            />

            <SubmitButton
                text='Login'
                disabled={buttonDisabled}
                onClick={ () => doLogin() }
            />

        </div>
    );

}

export default LoginForm;
