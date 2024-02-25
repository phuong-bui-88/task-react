import { render, screen, waitFor } from "@testing-library/react";
import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd'; // Import the DragDropContext component
import TaskListComponent from '@components/admin/TaskListComponent';
import { expect } from "vitest";
import { BrowserRouter as Router } from 'react-router-dom';


test('renders TaskListComponent', async () => {
    const checklistId = 1;
    const tasks = [
        { id: 1, name: 'Task 1' },
        { id: 2, name: 'Task 2' },
        { id: 3, name: 'Task 3' },
    ];
    const onFetchChecklist = vi.fn();

    const { container } = render(
        <Router>
            <DragDropContext onDragEnd={vi.fn()}>
                <TaskListComponent
                    checklistId={checklistId}
                    tasks={tasks}
                    onFetchChecklist={onFetchChecklist}
                />
            </DragDropContext>
        </Router>
    );

    await waitFor(() => {
        expect(container.querySelector('table')).not.toBeNull();
        expect(container.querySelectorAll('tbody tr').length).toBe(3);
    });

});
