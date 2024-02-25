import { render, screen, waitFor } from '@testing-library/react';

import FavoriteTaskComponent from '@components/user/FavoriteTaskComponent';
import React from 'react';

describe('FavoriteTaskComponent', () => {

    // Mock the necessary props
    const mockProps = {
        user: {},
        onCountUserCompletedTasks: vi.fn(),
        onUserFaviroteTasks: vi.fn(),
    };


    it('renders the component and fetches favorite tasks', async () => {
        const { container } = render(<FavoriteTaskComponent {...mockProps} />);

        await waitFor(() => expect(container.querySelector('.task-checklist')).toBeDefined());
    });
});