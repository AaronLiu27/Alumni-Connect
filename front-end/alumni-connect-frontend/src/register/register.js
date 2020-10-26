import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import axios from 'axios';
import { useState } from "react";


function RegisterForm() {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);


    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setButtonDisabled(false);
    }

    const doRegister = async () => {

        if (!username) {
            return;
        }
        if(!password) {
            return;
        }

        setButtonDisabled(true);

        try {
            
            const apiUrl = '/api/users/';
            let res = await axios.post(apiUrl, {
                username: username,
                passwd  : password,
                _id     : 'New ID',
                email   : email,
                avatar  : ''
            });

            if (res.success) {
                UserStore.isLoggedIn = true;
                UserStore.username = res.data.username;
            } else {
                resetForm();
                alert('Register Failed');
            }
        } catch(e) {
            resetForm();
            console.log(e);
        }

    }

    return (
        <div className="loginForm">
            Resigter
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
                <label htmlFor="emailInput">Email</label>
                <input 
                    id="emailInput" 
                    type='text'
                    plcaeholder='Email'
                    value={email ? email: ''}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <SubmitButton
                text='Register'
                disabled={buttonDisabled}
                onClick={ () => doRegister() }
            />

        </div>
    );

}

export default RegisterForm;
