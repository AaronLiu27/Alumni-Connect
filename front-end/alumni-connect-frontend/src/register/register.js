import React from 'react';
import InputField from '../component/inputField';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import axios from 'axios';
import { useState } from "react";
import './register.css'
import {Button} from 'react-bootstrap'
import {useHistory} from "react-router-dom";

function RegisterForm() {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    let history = useHistory();

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
            
            const apiUrl = 'http://localhost:5000/api/users/';
            let res = await axios.post(apiUrl, {
                username: username,
                passwd  : password,
                email   : email,
            }).catch(error=>{
                alert(error.response.data.message);
            });

            if (res.status === 200) {
                UserStore.username = username;
                alert('register success!')
                history.push("/mainpage")
                setUsername('success');
            } else {
                resetForm();
                // if(res.status === 400 && res.data.message == "Usernmae already exists.")
                alert(res.data.message);
            }
        } catch(e) {
            resetForm();
            console.log(e);
        }

    }

    return (
        <div className="registerForm">
            <div className='title'>
                Resigter
            </div>
            <div className='inputTool'>
                <label htmlFor="usernameInput">Username</label>
                <div>
                <input 
                    className='input'
                    id="usernameInput" 
                    type='text'
                    plcaeholder='Username'
                    value={username ? username : ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>
            </div>

            <div  className='inputTool'>
                <label htmlFor="passwordInput">Password</label>
                <div>
                <input
                    className='input' 
                    id="passwordInput" 
                    type='password'
                    plcaeholder='Password'
                    value={password ? password : ''}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
            </div>

            <div className='inputTool'>
                <label htmlFor="emailInput">Email</label>
                <div>
                <input 
                    className='input' 
                    id="emailInput" 
                    type='text'
                    plcaeholder='Email'
                    value={email ? email: ''}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
            </div>
            <div className='submitBtn'>
            <Button
                className='submitButn'
                disabled={buttonDisabled}
                onClick={ () => doRegister() }
            >
                Register
            </Button>
            </div>
            {username === 'success' ? <div role="alert">alert</div> : null}
        </div>
    );

}

export default RegisterForm;
