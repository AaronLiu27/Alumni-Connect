import '@testing-library/jest-dom'

import React from 'react'
import {render, fireEvent, cleanup, screen} from '@testing-library/react'

import MainPage from './mainpage'

test('test log out', () => {
    render(<MainPage />)
    fireEvent.click(screen.getByText('Logout'))
    const loginState = screen.getByText('logout')

    expect(loginState.className).toBe('test')
});

test('test open profile', () => {
    render(<MainPage />)
    fireEvent.click(screen.getByText('My Profile'))
    const updateBtn = screen.getByText('Update')

    expect(updateBtn.value).toBe('Update')
});

test('test open post list', () => {
    render(<MainPage />)
    fireEvent.click(screen.getByText('MainPage'))
    const newPostBtn = screen.getByText('New Post')

    expect(newPostBtn.className).toBe('newPost btn btn-outline-success')
});
