import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import {Button} from 'react-bootstrap';
import { useState } from "react";
import "./profile.css";

function Profile() {
    const [buttonDisabled, setButtonDisabled] = useState(false);

    axios.get('/user', {
        params: {
          ID: UserStore.username
        }
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })

    return (
        <div>
           <div className='title'>
                Your profile
            </div>
            <div className='inputTool'>
                <label htmlFor="usernameInput">Username</label>
                <div>
                    <input 
                        className="input"
                        id="usernameInput" 
                        type='text'
                        value={UserStore.username}
                        disabled
                    />
                </div>
            </div>

            <div className='inputTool'>
                <label htmlFor="passwordInput">Email</label>
                <div>
                    <input 
                        className="input"
                        id="passwordInput" 
                        type='password'
                        plcaeholder='Password'
                        value=""
                    />
                </div>
            </div>

            <div className='submitBtn'>
                <Button
                    className='submitButn'
                    text='Login'
                    disabled={buttonDisabled}
                >
                    Save
                </Button>
            </div>
        </div>
    );

}

export default Profile;
