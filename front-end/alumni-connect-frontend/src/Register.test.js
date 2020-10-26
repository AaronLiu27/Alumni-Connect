import '@testing-library/jest-dom'

import React from 'react'
import {render, fireEvent, cleanup, screen} from '@testing-library/react'

import LoginForm from './loginForm'
import RegisterForm from './register';

afterEach(cleanup);

test('test input username and password and email', () => {
    render(<RegisterForm />)
    const username = 'username'
    const password = 'password'
    const email = 'email'
    const inputUsername = screen.getByLabelText(/username/i)
    fireEvent.change(inputUsername, {
        target: {value: username},
    })
    expect(inputUsername.value).toBe(username)
    
    const inputPassword = screen.getByLabelText(/password/i)
    fireEvent.change(inputPassword, {
        target: {value: password},
    })
    expect(inputPassword.value).toBe(password)

    const inputEmail = screen.getByLabelText(/email/i)
    fireEvent.change(inputEmail, {
        target: {value: email},
    })
    expect(inputEmail.value).toBe(email)
});
