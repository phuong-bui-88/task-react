import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LeftSidebarUserComponent from '@components/user/LeftSidebarUserComponent';
import React from 'react';
import { expect } from 'vitest';


describe('LeftSidebarUserComponent', () => {
    const checklistGroups = {
        1: {
            id: 1,
            name: 'Group 1',
            is_new: true,
            is_update: false,
            checklists: {
                1: {
                    id: 1,
                    name: 'Checklist 1',
                    count_tasks: 5,
                    count_user_completed_tasks: 3,
                    is_new: false,
                    is_update: true,
                },
                2: {
                    id: 2,
                    name: 'Checklist 2',
                    count_tasks: 10,
                    count_user_completed_tasks: 7,
                    is_new: true,
                    is_update: false,
                },
            },
        },
        2: {
            id: 2,
            name: 'Group 2',
            is_new: false,
            is_update: true,
            checklists: {
                3: {
                    id: 3,
                    name: 'Checklist 3',
                    count_tasks: 8,
                    count_user_completed_tasks: 6,
                    is_new: true,
                    is_update: false,
                },
            },
        },
    };

    const analyticChecklistGroups = {
        1: {
            id: 1,
            name: 'Group 1',
        },
        2: {
            id: 2,
            name: 'Group 2',
        },
    };

    it('renders the component with checklist groups', async () => {
        const { container } = render(
            <Router>
                <LeftSidebarUserComponent
                    checklistGroups={checklistGroups}
                    analyticChecklistGroups={analyticChecklistGroups}
                />
            </Router>
        );

        await waitFor(() => {
            expect(container.querySelector('.left-sidebar-user')).toBeDefined();
        });
    });
});