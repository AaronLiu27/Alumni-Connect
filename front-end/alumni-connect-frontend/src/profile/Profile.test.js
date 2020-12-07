import '@testing-library/jest-dom'

import React from 'react'
import {render, fireEvent, cleanup, screen} from '@testing-library/react'

import Profile from './profile';
import {rest} from 'msw'

test('test convert display form to update form', () => {
    render(<Profile />)
    fireEvent.click(screen.getByText('Update'))
    const updateBtn = screen.getByText('Confirm')

    expect(updateBtn.value).toBe('Confirm')
});