import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import {Button, Row, Col} from 'react-bootstrap';
import { useState } from "react";
import "./profile.css";

function Profile() {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const[age, setAge] = useState(0);
    axios.get('http://nyu-devops-alumniconnect.herokuapp.com//api/profiles/profile/user/'+UserStore.id,
        {headers: { Authorization: UserStore.token }}
      )
      .then(function (response) {
        console.log(response);
        setAge(response.data.age);
      })
      .catch(function (error) {
        console.log(error);
      })

    return (
        <div>
             <Row>
                <Col xs={6}>
                    <div className='profileInput'>
                        <label className='profileTitle' htmlFor="usernameInput">Username</label>
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
                    <div className='profileInput'>
                        <label className='profileTitle' htmlFor="passwordInput">FirstName</label>
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
                    <div className='profileInput'>
                        <label className='profileTitle' htmlFor="passwordInput">Age</label>
                        <div>
                            <input 
                                className="input"
                                id="passwordInput" 
                                type='text'
                                
                                value={age}
                            />
                        </div>
                    </div>
                </Col>
                <Col xs={6}>
                    <div className='profileInput'>
                        <label className='profileTitle' htmlFor="passwordInput">Email</label>
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
                    <div className='profileInput'>
                        <label className='profileTitle' htmlFor="passwordInput">LastName</label>
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
                </Col>
            </Row>
            <div className='profileInput'>
                <label className='profileTitle' htmlFor="passwordInput">Discipline</label>
                <div>
                    <textarea 
                        className="textArea"
                        id="passwordInput" 
                        type='password'
                        plcaeholder='Password'
                        value=""
                    />
                </div>
            </div>

            <div className=''>
                <Button
                    className='saveBtn'
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
