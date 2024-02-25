import React from 'react';

import LoginComponent from '@components/LoginComponent';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { errorsResponse } from '@test/mocks/handlers';
import { BrowserRouter as Router } from 'react-router-dom';
// import mockRoute from '../mocks/mockRouter';


const navigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const mod = await vi.importActual("react-router-dom");
    return {
        ...mod,
        useNavigate: () => navigate,
        // useParams: () => ({
        //     taskId: 123,
        // }),
    };
});

describe('LoginComponent', () => {
    let container;
    afterEach(() => {
        vi.restoreAllMocks()
    })

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

    it('submits the form and logs in the user right then redirect to dashboard', async () => {
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

        expect(navigate).toHaveBeenCalledWith('/dashboard');
    });

    it('displays errors if login fails', async () => {
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');
        const loginButton = screen.getByRole('button', { name: 'Login' });

        const formJson = {
            email: 'test_wrong_email@example.com',
            password: 'password123',
        };

        fireEvent.change(emailInput, { target: { value: formJson.email } });
        fireEvent.change(passwordInput, { target: { value: formJson.password } });

        fireEvent.click(loginButton);
    });
});