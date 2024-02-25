import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LeftSidebarAdminComponent from '@components/admin/LeftSidebarAdminComponent';
import { expect } from 'vitest';
import React from 'react';

describe('LeftSidebarAdminComponent', () => {
    const checklistGroups = [
        {
            id: 1,
            name: 'Checklist Group 1',
            checklists: [
                { id: 1, name: 'Checklist 1' },
                { id: 2, name: 'Checklist 2' },
            ],
        },
        {
            id: 2,
            name: 'Checklist Group 2',
            checklists: [
                { id: 3, name: 'Checklist 3' },
                { id: 4, name: 'Checklist 4' },
            ],
        },
    ];

    const pages = [
        { id: 1, title: 'Page 1' },
        { id: 2, title: 'Page 2' },
    ];

    it('renders checklist groups and pages', async () => {
        const { container } = render(
            <Router>
                <LeftSidebarAdminComponent checklistGroups={checklistGroups} pages={pages} />
            </Router>
        );

        await waitFor(() => {
            expect(container.querySelector('li.nav-title')).not.toBeNull();
        });

    });
});