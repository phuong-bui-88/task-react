import LocalStorageService from "@services/LocalStorageService.js";
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from '@layouts/AppLayout';

import ChecklistGroupService from '@services/ChecklistGroupService';
import PageService from "@services/PageService";
import UserService from "@services/UserService";
import React from 'react';
import { expect } from "vitest";

const navigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const mod = await vi.importActual("react-router-dom");
    return {
        ...mod,
        useNavigate: () => navigate,
    };
});

it('fetches user, checklist groups, and pages if token is present', async () => {
    const getChecklistGroupsSpy = vi.spyOn(ChecklistGroupService, 'getChecklistGroups')
    const getPagesSpy = vi.spyOn(PageService, 'getPages')

    LocalStorageService.setToken('user-token');
    const { container } = render(<Router><AppLayout /></Router>);

    await waitFor(() => expect(container.querySelector('#left-sidebar')).toBeDefined());
    await waitFor(() => expect(container.querySelector('#header-sidebar')).toBeDefined());

    await waitFor(() => expect(getChecklistGroupsSpy.mock.calls.length).toBe(1));
    await waitFor(() => expect(getPagesSpy.mock.calls.length).toBe(1));
});

it('fetches checklist groups admin if token is admin present', async () => {
    const getChecklistGroupsSpy = vi.spyOn(ChecklistGroupService, 'getChecklistGroups')

    LocalStorageService.setToken('admin-token');
    render(<Router><AppLayout /></Router>)
    await waitFor(() => expect(getChecklistGroupsSpy).toHaveBeenCalledWith(false));
})


it('does not fetch user, checklist groups, or pages if token is not present and redirect to login page', async () => {
    const getChecklistGroupsSpy = vi.spyOn(ChecklistGroupService, 'getChecklistGroups')
    const getPagesSpy = vi.spyOn(PageService, 'getPages')
    const logoutUserSpy = vi.spyOn(UserService, 'logoutUser')

    LocalStorageService.removeToken();
    render(<Router><AppLayout /></Router>);

    await waitFor(() => expect(logoutUserSpy.mock.calls.length).toBe(1));
    await waitFor(() => expect(getChecklistGroupsSpy.mock.calls.length).toBe(0));
    await waitFor(() => expect(getPagesSpy.mock.calls.length).toBe(0));
    expect(navigate).toHaveBeenCalledWith('/login');
});

it('when the token is invalid then redirect to login page', async () => {
    LocalStorageService.setToken('wrong-token');
    render(<Router><AppLayout /></Router>);
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/login'));
});

it('handles sidebar toggle', async () => {
    LocalStorageService.setToken('user-token');
    const { container } = render(<Router><AppLayout /></Router>);

    await waitFor(() => {
        const sidebarToggleButton = container.querySelector('#header-sidebar .header-toggler');
        fireEvent.click(sidebarToggleButton);
        const leftSideBarWrapper = container.querySelector('#left-sidebar-wrapper');
        expect(leftSideBarWrapper.classList).toContain('hide');
    });

    await waitFor(() => {
        const sidebarToggleButton = container.querySelector('#header-sidebar .header-toggler');
        fireEvent.click(sidebarToggleButton);
        const leftSideBarWrapper = container.querySelector('#left-sidebar-wrapper');
        expect(leftSideBarWrapper.classList).not.toContain('hide');
    });
});

it('when user click logout then should navigate to login', async () => {
    LocalStorageService.setToken('user-token');
    const { container } = render(<Router><AppLayout /></Router>);
    await waitFor(() => screen.debug());

    const logoutButton = container.querySelector('#logoutUser');
    console.log(logoutButton, 'logoutButton');
    fireEvent.click(logoutButton);

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/login'));
});