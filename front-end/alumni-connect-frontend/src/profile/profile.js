import React, {useEffect} from 'react';
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
    const [age, setAge] = useState(0);
    const [user, setUser] = useState(UserStore.username);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [discipline, setDiscipline] = useState('');
    const [email, setEmail] = useState('');
    const updateProfile = () => {
        console.log('wwwwww')
        console.log(user);
        console.log(firstname);
        console.log(lastname);
        console.log(age);
        console.log(discipline);
        console.log('wwwwww') 
        axios.put('http://nyu-devops-alumniconnect.herokuapp.com/api/profiles/profile/user/'+UserStore.id,
            {
                "user": UserStore.username,
                "firstname": firstname,
                "lastname": lastname,
                "age": age,
                "discipline": discipline
            },
            {headers: { Authorization: UserStore.token }}
        ).then(function(response2) {
            console.log('1111111')
            console.log(response2);
            alert('update profile success!');
            
            alert('successful change!')
        }).catch(function (error) {
            console.log('22222222')
            console.log(error);
        })
    }
    
    const getProfile = () => {
        console.log("Id : " + UserStore.id);
        console.log("Token : " + UserStore.token);
        axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/profiles/profile/user/'+UserStore.id,
            {headers: { Authorization: UserStore.token }}
        )
        .then(function (response) {
            console.log(response);
            setAge(response.data.age);
            setEmail(response.data.email)
            setUser(response.data.user);
            setFirstname(response.data.firstname);
            setLastname(response.data.lastname);
            setDiscipline(response.data.discipline);
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    useEffect(() => {getProfile()}, []);
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
                        <label className='profileTitle' htmlFor="firstnameInput">FirstName</label>
                        <div>
                            <input 
                                className="input"
                                id="FirstNameInput" 
                                type='text'
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='profileInput'>
                        <label className='profileTitle' htmlFor="ageInput">Age</label>
                        <div>
                            <input 
                                className="input"
                                id="ageInput" 
                                type='text'
                                value={age}
                                onChange={(e) => {
                                    const newAge = e.target.value.replace(/[^\d]+/, '');
                                    setAge(Number(newAge));
                                }}
                                keyboardType='numeric'
                            />
                        </div>
                    </div>
                </Col>
                <Col xs={6}>
                    <div className='profileInput'>
                        <label className='profileTitle' htmlFor="emailInput">Email</label>
                        <div>
                            <input 
                                className="input"
                                id="emailInput" 
                                type='text'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='profileInput'>
                        <label className='profileTitle' htmlFor="lastInput">LastName</label>
                        <div>
                            <input 
                                className="input"
                                id="lastInput" 
                                type='text'
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <div className='profileInput'>
                <label className='profileTitle' htmlFor="disciplineInput">Discipline</label>
                <div>
                    <textarea 
                        className="textArea"
                        id="passwordInput" 
                        type='text'
                        value={discipline}
                        onChange={(e) => setDiscipline(e.target.value)}
                    />
                </div>
            </div>

            <div className=''>
                <Button
                    className='saveBtn'
                    text='Login'
                    disabled={buttonDisabled}
                    onClick={() => updateProfile()}
                >
                    Save
                </Button>
            </div>
        </div>
    );

}

export default Profile;
