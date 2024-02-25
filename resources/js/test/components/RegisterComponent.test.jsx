import RegisterComponent from '@components/RegisterComponent';
import UserService from '@services/UserService';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from 'react';
import { expect } from 'vitest';
import { emailRight } from '@test/mocks/handlers';

const navigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const mod = await vi.importActual("react-router-dom");
    return {
        ...mod,
        useNavigate: () => navigate,
    };
});

describe('RegisterComponent', () => {
    test('renders RegisterComponent', () => {
        render(<RegisterComponent />);
        const label = screen.getByText('Create your account');
        expect(label).toBeDefined();
    });

    test('submits form successfully then redirect to dashboard page', async () => {
        render(<RegisterComponent />);
        const nameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Repeat password');
        const submitButton = screen.getByText('Create Account');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: emailRight } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(navigate).toHaveBeenCalledWith('/dashboard'));
    });

    test('displays form errors', async () => {
        const { container } = render(<RegisterComponent />);
        const nameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Repeat password');
        const submitButton = screen.getByText('Create Account');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'wrong@gmail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(container.getElementsByClassName('invalid-feedback').length).toBe(2));
    });
});