import '@testing-library/jest-dom'

import React from 'react'
import {render, fireEvent, cleanup, screen} from '@testing-library/react'

import LoginForm from './login/loginForm'
import UserStore from './stores/UserStore';
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import App from './App';
import { BrowserRouter } from 'react-router-dom'

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

test('test input username and password', () => {
    render(<LoginForm />)
    const username = 'username'
    const password = 'password'
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
});

const apiUrl = 'http://localhost:5000/api/auth/login'
const fakeUserResponse = {access_token : "1", refresh_token: "2"}
const server = setupServer(
    rest.post(apiUrl, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(fakeUserResponse))
    }),
)

test('allows the user to login successfully', async() => {
    render(<LoginForm />)

    const inputUsername = screen.getByLabelText(/username/i)
    fireEvent.change(inputUsername, {
        target: {value: 'username'},
    })
    const inputPassword = screen.getByLabelText(/password/i)
    fireEvent.change(inputPassword, {
        target: {value: 'password'},
    })
    fireEvent.click(screen.getByText(/Login/i))

    const t = await screen.findByText('username')

    expect(inputUsername.value).toBe('')
})
