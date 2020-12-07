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

