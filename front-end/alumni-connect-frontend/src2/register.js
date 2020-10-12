import React from 'react';
import InputField from './inputField';
import SubmitButton from './submitButton';
import UserStore from './stores/UserStore';
import axios from 'axios';

class RegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            buttonDisabled: false
        }
    }

    setInputValue(property, val) {
        val = val.trim();
        if (val.length > 12) {
            return;
        }
        this.setState({
            [property]: val
        })
    }

    resetForm() {
        this.setState({
            username: '',
            password: '',
            email:    '',
            buttonDisabled: false
        })
    }

    async doRegister() {

        if (!this.state.username) {
            return;
        }
        if(!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {
            
            const apiUrl = '/api/users/';
            let res = await axios.post(apiUrl, {
                username: this.state.username,
                passwd  : this.state.password,
                _id     : 'New ID',
                email   : this.state.email,
                avatar  : ''
            });

            if (res.success) {
                UserStore.isLoggedIn = true;
                UserStore.username = res.data.username;
            } {
                this.resetForm();
                alert('Register Failed');
            }
        } catch(e) {
            this.resetForm();
            console.log(e);
        }

    }

    render() {
        return (
            <div className="loginForm">
                Resigter
                <InputField
                    type='text'
                    plcaeholder='Username'
                    value={this.state.username ? this.state.username : ''}
                    onChange={(val) => this.setInputValue('username', val)}
                />

                <InputField
                    type='password'
                    plcaeholder='Password'
                    value={this.state.password ? this.state.password : ''}
                    onChange={(val) => this.setInputValue('password', val)}
                />

                <InputField
                    type='text'
                    plcaeholder='Email'
                    value={this.state.email ? this.state.email : ''}
                    onChange={(val) => this.setInputValue('email', val)}
                />

                <SubmitButton
                    text='Register'
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.doRegister() }
                />

            </div>
        );
    }

}

export default RegisterForm;
