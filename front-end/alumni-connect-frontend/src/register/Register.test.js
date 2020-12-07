import '@testing-library/jest-dom'

import React from 'react'
import {render, fireEvent, cleanup, screen} from '@testing-library/react'

import RegisterForm from './register';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

beforeAll(
    () => server.listen()
)

beforeAll(() => {
    // JSDom does not implement this and an error was being
    // thrown from jest-axe because of it.
    window.getComputedStyle = () => {};
  });
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())
window.alert = () => {};
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

const apiUrl = 'http://nyu-devops-alumniconnect.herokuapp.com/api/users/'
const fakeUserResponse = {username : "username11", passwd: "passwd"}
const server = setupServer(
    rest.post(apiUrl, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(fakeUserResponse))
    }),
)

test('test register api', async () => {
    render(<RegisterForm />)
    const username = 'username11'
    const password = 'password'
    const email = 'email'
    const inputUsername = screen.getByLabelText(/username/i)
    fireEvent.change(inputUsername, {
        target: {value: username},
    })
    const inputPassword = screen.getByLabelText(/password/i)
    fireEvent.change(inputPassword, {
        target: {value: password},
    })
    const inputEmail = screen.getByLabelText(/email/i)
    fireEvent.change(inputEmail, {
        target: {value: email},
    })
    fireEvent.click(screen.getByText(/Register/i))

    // const t = await screen.findByText('username11')
    const t = screen.findByRole(alert)

    expect(inputUsername.value).toBe('username11')
})