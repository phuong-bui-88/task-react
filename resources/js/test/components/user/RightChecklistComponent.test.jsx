import RightChecklistComponent from '@components/user/RightChecklistComponent';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { expect, vi } from 'vitest';
import { format } from 'date-fns';

describe('RightChecklistComponent', () => {
    const expandedTask = {
        task: {
            id: 1,
            name: 'Task 1',
            due_date: null,
            remind_at: '2025-12-15',
            remainder_format: '2025-12-15',
            due_date: '2025-12-15',
            note: 'something',
            is_favorite: false,
        },
        index: 0,
        status: true,
    };

    const onFavoritedTask = vi.fn();
    const onUpdateExpandTask = vi.fn();

    it('renders the component with expanded task', async () => {
        const { container } = render(
            <RightChecklistComponent
                expandedTask={expandedTask}
                onFavoritedTask={onFavoritedTask}
                onUpdateExpandTask={onUpdateExpandTask}
            />
        );

        await waitFor(() => expect(container.querySelector('.remain-at-session .show')).toBeDefined());
        await waitFor(() => expect(container.querySelector('.due-date-session .show')).toBeDefined());
        await waitFor(() => expect(container.querySelector('.note-session .show')).toBeDefined());
    });

    it('adds due date when clicked', async () => {
        const { container } = render(
            <RightChecklistComponent
                expandedTask={expandedTask}
                onFavoritedTask={onFavoritedTask}
                onUpdateExpandTask={onUpdateExpandTask}
            />
        );

        fireEvent.click(screen.getByText('Add Due Date'));

        fireEvent.click(screen.getByText('Today'));

        let times = 0;
        await waitFor(() => {
            times++;
            let toggle = container.querySelector('.due-date-session .link-unstyled');
            fireEvent.click(toggle);

            expect(container.querySelector('.due-date-session .add')).toBeDefined();

            // // click on today
            let dateValue = new Date();
            let options = container.querySelectorAll('.due-date-session .add .col');
            fireEvent.click(options[0]);
            expect(container.querySelector('.due-date-session .show').textContent).contains(dateValue.toDateString());
        });

        times = 0;
        await waitFor(() => {
            times++;
            let toggle = container.querySelector('.due-date-session .link-unstyled');
            fireEvent.click(toggle);

            let dateValue = new Date();
            dateValue.setDate(dateValue.getDate() + 1);
            let options = container.querySelectorAll('.due-date-session .add .col');

            // click on tomorrow
            fireEvent.click(options[1]);
            expect(container.querySelector('.due-date-session .show').textContent).contains(dateValue.toDateString());
        });

        times = 0;
        await waitFor(() => {
            times++;
            let toggle = container.querySelector('.due-date-session .link-unstyled');
            fireEvent.click(toggle);

            let dateValue = new Date();
            dateValue.setDate(dateValue.getDate() + 7);
            let options = container.querySelectorAll('.due-date-session .add .col');

            // click on tomorrow
            fireEvent.click(options[2]);
            expect(container.querySelector('.due-date-session .show').textContent).contains(dateValue.toDateString());
            expect(times).toBe(1);
        });

        await waitFor(() => {
            let toggle = container.querySelector('.due-date-session .link-unstyled');
            fireEvent.click(toggle);
            // set value for select date
            let selectDate = container.querySelector('.due-date-session .add .select-date');
            // //  change value input date
            fireEvent.change(selectDate, { target: { value: '2025-12-15' } });

            // fireEvent.click(container.querySelector('.due-date-session .add .btn-primary'));
            // expect(container.querySelector('.due-date-session .show').textContent);
        });
    });

    it('remove due date when clicked', async () => {
        const { container } = render(
            <RightChecklistComponent
                expandedTask={expandedTask}
                onFavoritedTask={onFavoritedTask}
                onUpdateExpandTask={onUpdateExpandTask}
            />
        );

        await waitFor(() => {
            let toggle = container.querySelector('.due-date-session .link-unstyled');
            fireEvent.click(toggle);
            // set value for select date
            let removeDate = container.querySelector('.due-date-session .remove');
            // //  change value input date
            fireEvent.click(removeDate);
        });
    });

    it('remove remain at when clicked', async () => {
        const { container } = render(
            <RightChecklistComponent
                expandedTask={expandedTask}
                onFavoritedTask={onFavoritedTask}
                onUpdateExpandTask={onUpdateExpandTask}
            />
        );

        await waitFor(() => {
            let toggle = container.querySelector('.remain-at-session .link-unstyled');
            fireEvent.click(toggle);
            // set value for select date
            let removeDate = container.querySelector('.remain-at-session .remove');
            // //  change value input date
            fireEvent.click(removeDate);
        });
    });

    it('adds remain at when clicked', async () => {
        const { container } = render(
            <RightChecklistComponent
                expandedTask={expandedTask}
                onFavoritedTask={onFavoritedTask}
                onUpdateExpandTask={onUpdateExpandTask}
            />
        );

        await waitFor(() => {
            let toggle = container.querySelector('.remain-at-session .link-unstyled');
            fireEvent.click(toggle);

            expect(container.querySelector('.remain-at-session .add')).toBeDefined();

            // // click on today
            let dateValue = new Date();
            const defaultTime = '08:00';
            const dateFormatFullValue = 'yyyy-MM-dd HH:mm';

            dateValue.setHours(defaultTime.split(':')[0], defaultTime.split(':')[1]);
            dateValue.setDate(dateValue.getDate());
            dateValue = format(dateValue, dateFormatFullValue);
            let options = container.querySelectorAll('.remain-at-session .add .col');
            fireEvent.click(options[0]);
            expect(container.querySelector('.remain-at-session .show').textContent).contains(dateValue);
        });

        await waitFor(() => {
            let toggle = container.querySelector('.remain-at-session .link-unstyled');
            fireEvent.click(toggle);

            let dateValue = new Date();
            const defaultTime = '08:00';
            const dateFormatFullValue = 'yyyy-MM-dd HH:mm';

            dateValue.setHours(defaultTime.split(':')[0], defaultTime.split(':')[1]);
            dateValue.setDate(dateValue.getDate() + 1);
            dateValue = format(dateValue, dateFormatFullValue);
            let options = container.querySelectorAll('.remain-at-session .add .col');

            // click on tomorrow
            fireEvent.click(options[1]);
            expect(container.querySelector('.remain-at-session .show').textContent).contains(dateValue);
        });

        await waitFor(() => {
            let toggle = container.querySelector('.remain-at-session .link-unstyled');
            fireEvent.click(toggle);

            let dateValue = new Date();
            const defaultTime = '08:00';
            const dateFormatFullValue = 'yyyy-MM-dd HH:mm';

            dateValue.setHours(defaultTime.split(':')[0], defaultTime.split(':')[1]);
            dateValue.setDate(dateValue.getDate() + 7);
            dateValue = format(dateValue, dateFormatFullValue);
            let options = container.querySelectorAll('.remain-at-session .add .col');

            // click on tomorrow
            fireEvent.click(options[2]);
            expect(container.querySelector('.remain-at-session .show').textContent).contains(dateValue);
        });

        await waitFor(() => {
            let toggle = container.querySelector('.remain-at-session .link-unstyled');
            fireEvent.click(toggle);
            // set value for select date
            let selectDate = container.querySelector('.remain-at-session .add .select-date');
            // //  change value input date
            fireEvent.change(selectDate, { target: { value: '2025-12-15' } });

            fireEvent.click(container.querySelector('.remain-at-session .add .btn-primary'));
            // expect(container.querySelector('.due-date-session .show').textContent);
        });
    });

});