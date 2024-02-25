import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from 'react';
import ChecklistComponent from '@components/user/ChecklistComponent';

import { useParams } from "react-router-dom";
import { expect, vi } from "vitest";
import { checklistGroupsResponse } from "@test/mocks/handlers";

// Mock the necessary props
const mockProps = {
    checklistGroups: checklistGroupsResponse.data,
    user: {},
    onCountUserCompletedTasks: vi.fn(),
    onUserFaviroteTasks: vi.fn(),
};

vi.mock("react-router-dom", async () => {
    const mod = await vi.importActual("react-router-dom");
    return {
        ...mod,
        useParams: vi.fn(),
    };
});


describe('ChecklistComponent', () => {
    test('renders ChecklistComponent', async () => {
        useParams.mockImplementation(() => ({ checklistId: 1 }));

        const { container } = render(<ChecklistComponent {...mockProps} />);
        await waitFor(() => {
            expect(container.querySelector('#count-task')).toBeDefined();
            expect(container.querySelector('#user-task-list')).toBeDefined();
            expect(container.querySelector('right-user-checklist')).toBeDefined();
        });
    });

    test('handles completed task', async () => {

        const { container } = render(<ChecklistComponent {...mockProps} />);
        // await waitFor(() => expect(screen.debug()));

        let times = 0;
        await waitFor(() => {
            expect(container.querySelectorAll('.complete-task').length).toBe(2);

            times++;
            let firstElement = container.querySelector('.complete-task');
            fireEvent.click(firstElement);
            expect(firstElement.checked).toBe(true);
            expect(times).toBe(1);
        });

    });

    test('handles favorited task', async () => {

        // case has checklist id
        useParams.mockImplementation(() => ({ checklistId: 1 }));

        const { container } = render(<ChecklistComponent {...mockProps} />);

        let times = 0;
        await waitFor(() => {
            expect(container.querySelectorAll('.favorite-task').length).toBe(2);

            times++;
            let firstElement = container.querySelector('.favorite-task');
            fireEvent.click(firstElement);
            expect(screen.getByTestId('FavoriteBorderIcon')).toBeDefined();

            expect(times).toBe(1);
        });
    });

    test('handles unfavorited task in favorited page and remove task', async () => {
        mockProps.tasksList = [
            {
                id: 1,
                name: 'Task List 1',
                description: 'Task List 1 description',
                is_completed: false,
                is_favorite: true,
                checklist_name: 'Checklist name 1',
                due_date: '2021-10-10',
            },
            {
                id: 2,
                name: 'Task List 2',
                description: 'Task List 2 description',
                is_completed: false,
                is_favorite: true,
                checklist_name: 'Checklist name 2',
                due_date: '2021-10-10',
            },
        ];

        useParams.mockImplementation(() => ({ checklistId: null }));

        const { container } = render(<ChecklistComponent {...mockProps} />);

        let times = 0;
        await waitFor(() => {
            expect(container.querySelectorAll('.favorite-task').length).toBe(2);

            expect(screen.getAllByTestId('due_date').length).toBe(2);
            expect(screen.getAllByTestId('FavoriteIcon').length).toBe(2);
            times++;
            let firstElement = container.querySelector('.favorite-task');
            fireEvent.click(firstElement);
            expect(screen.getAllByTestId('FavoriteIcon').length).toBe(1);
            expect(times).toBe(1);
        });
    })

    test('toggles task description', async () => {
        useParams.mockImplementation(() => ({ checklistId: 1 }));

        const { container } = render(<ChecklistComponent {...mockProps} />);

        await waitFor(() => {
            let rowTitle = screen.getAllByTestId('row-title');
            let rowContent = screen.getAllByTestId('row-content');
            expect(rowTitle.length).toBe(2);
            expect(rowContent.length).toBe(2);
            expect(rowContent[0].classList).toContain('d-none');
            fireEvent.click(rowTitle[0]);

            expect(container.querySelectorAll('.right-user-checklist').length).toBe(1);
            expect(rowContent[0].classList).not.toContain('d-none');
        });
    });

    test('expanded task and filled note then click note submit then unexpend task', async () => {
        useParams.mockImplementation(() => ({ checklistId: 1 }));

        const { container } = render(<ChecklistComponent {...mockProps} />);

        let times = 0;
        await waitFor(() => {
            let rowTitle = screen.getAllByTestId('row-title');
            let rowContent = screen.getAllByTestId('row-content');
            expect(rowTitle.length).toBe(2);
            expect(rowContent.length).toBe(2);
            expect(rowContent[0].classList).toContain('d-none');
            fireEvent.click(rowTitle[0]);
            expect(container.querySelectorAll('.right-user-checklist').length).toBe(1);

            fireEvent.click(container.querySelector('.expanded-note-toggle'));

            let noteTask = container.querySelector('#note-task')
            expect(noteTask).toBeDefined();
            fireEvent.change(noteTask, { target: { value: 'This is a note task' } });
            fireEvent.click(container.querySelector('#note-task-submit'));

            times++;
            expect(times).toBe(1);
        });
    });

    test('if task more than 2 items then show payment button', async () => {
        useParams.mockImplementation(() => ({ checklistId: null }));

        mockProps.tasksList = [
            {
                id: 1,
                name: 'Task List 1',
                description: 'Task List 1 description',
                is_completed: false,
                is_favorite: true,
            },
            {
                id: 2,
                name: 'Task List 2',
                description: 'Task List 2 description',
                is_completed: false,
                is_favorite: true,
            },
            {
                id: 3,
                name: 'Task List 3',
                description: 'Task List 3 description',
                is_completed: false,
                is_favorite: true,
            },
            {
                id: 4,
                name: 'Task List 3',
                description: 'Task List 3 description',
                is_completed: false,
                is_favorite: true,
            },
        ];


        const { container } = render(<ChecklistComponent {...mockProps} />);
        await waitFor(() => {
            let rowTitle = screen.getAllByTestId('row-title');
            expect(rowTitle.length).toBe(2);
            let paymentRequired = screen.queryByTestId('payment-is-required');
            expect(paymentRequired).toBeDefined();
        });
    });
});