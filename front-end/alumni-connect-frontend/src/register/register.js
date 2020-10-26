import React from 'react';
import InputField from '../component/inputField';
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

            <InputField
                type='text'
                plcaeholder='Email'
                value={email ? email : ''}
                onChange={(val) => setEmail(val)}
            />

            <SubmitButton
                text='Register'
                disabled={buttonDisabled}
                onClick={ () => doRegister() }
            />

        </div>
    );

}

export default RegisterForm;
