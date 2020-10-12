import React from 'react';
import InputField from './inputField';
import SubmitButton from './submitButton';
import UserStore from './stores/UserStore';
import axios from 'axios';

class LoginForm extends React.Component {

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
            buttonDisabled: false
        })
    }

    async doLogin() {

        if (!this.state.username) {
            return;
        }
        if(!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        if(this.state.username === 'user' && this.state.password === 'password') {
            UserStore.isLoggedIn = true;
            UserStore.username = this.state.username;
            return;
        }

        try {
            const apiUrl = '/auth';
            let res = await axios.post(apiUrl, {
                "username": this.state.username,
                "passwd": this.state.password,
            });

            if (res.status === 200) {
                UserStore.isLoggedIn = true;
                UserStore.username = this.state.username;
            } else {
                this.resetForm();
                alert(res.statusText);
            }
        } catch(e) {
            this.resetForm();
            console.log(e);
        }

    }

    render() {
        return (
            <div className="loginForm">
                Log In
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

                <SubmitButton
                    text='Login'
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.doLogin() }
                />

            </div>
        );
    }

}

export default LoginForm;
