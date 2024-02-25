import UserListComponent from '@components/admin/UserListComponent';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from 'react';
import { expect } from 'vitest';


test('renders UserListComponent', async () => {
    const { container } = render(<UserListComponent />);

    await waitFor(() => {
        expect(container.querySelector('table')).not.toBeNull();
        expect(container.querySelectorAll('tbody tr').length).toBe(2);
        let pageLink = container.querySelector('.page-item .page-link');
        fireEvent.click(pageLink);
    });
});
