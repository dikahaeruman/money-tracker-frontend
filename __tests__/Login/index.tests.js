import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from '../../src/app/login/page';

describe('Login Page', () => {
  it('updates email input value on change', () => {
    const { getByLabelText } = render(<Login />);
    const input = getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'test@test.com' } });
    expect(input.value).toBe('test@test.com');
  });

  it('updates password input value on change', () => {
    const { getByLabelText } = render(<Login />);
    const input = getByLabelText('Password');
    fireEvent.change(input, { target: { value: 'password' } });
    expect(input.value).toBe('password');
  });

  it('calls handleSubmit on form submission', () => {
    const { getByLabelText, getByText } = render(<Login />);
    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const button = getByText('Sign in');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const consoleSpy = jest.spyOn(console, 'log');
    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith('Credentials:', { email: 'test@test.com', password: 'password' });
    consoleSpy.mockRestore();
  });
});