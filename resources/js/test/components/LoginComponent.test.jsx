import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginComponent from '@components/LoginComponent';

import { BrowserRouter as Router } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';

const navigate = vi.fn();

describe('LoginComponent', () => {
    let container;

    vi.mock('react-router-dom', async () => {
        const mod = await vi.importActual('react-router-dom');
        return {
            ...mod,
            useNavigate: () => navigate,
            // useParams: () => ({
            //     taskId: 123,
            // }),
        };
    });

    beforeEach(() => {
        container = render(<Router><LoginComponent /></Router>).container;
    })

    it('renders the login form', () => {
        expect(screen.getByText('Sign In to your account')).to.exist;
        expect(screen.getByRole('button', { name: 'Login' })).to.exist;
        expect(screen.getByRole('button', { name: 'Forgot password?' })).to.exist;
    });

    it('render has token user and redirect to dashboard', () => {
        localStorage.setItem('token', 'test-token');
        render(<Router><LoginComponent /></Router>);
        expect(navigate).toHaveBeenCalledWith('/dashboard');
    });

    it('submits the form and logs in the user', async () => {
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        const formJson = {
            email: 'test@example.com',
            password: 'password123',
        };

        fireEvent.change(emailInput, { target: { value: formJson.email } });
        fireEvent.change(passwordInput, { target: { value: formJson.password } });

        fireEvent.click(loginButton);
    });

    // it('displays errors if login fails', async () => {
    //     const emailInput = screen.getByLabelText('Email');
    //     const passwordInput = screen.getByLabelText('Password');
    //     const loginButton = screen.getByRole('button', { name: 'Login' });

    //     const formJson = {
    //         email: 'test@example.com',
    //         password: 'password123',
    //     };

    //     fireEvent.change(emailInput, { target: { value: formJson.email } });
    //     fireEvent.change(passwordInput, { target: { value: formJson.password } });

    //     const error = {
    //         errors: {
    //             email: 'Invalid email',
    //             password: 'Invalid password',
    //         },
    //     };

    //     UserService.loginUser.mockRejectedValueOnce(error);

    //     fireEvent.click(loginButton);

    //     expect(UserService.loginUser).toHaveBeenCalledWith(formJson);
    //     expect(screen.getByText('Invalid email')).toBeInTheDocument();
    //     expect(screen.getByText('Invalid password')).toBeInTheDocument();
    // });
});