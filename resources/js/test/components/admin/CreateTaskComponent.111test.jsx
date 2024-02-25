import CreateTaskComponent from "@components/admin/CreateTaskComponent";
import TaskService from "@services/TaskService";

import CKEditorComponent from "@components/intergrate/CKEditorComponent";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';


describe('CreateTaskComponent', () => {

    const mockOnFetchChecklist = vi.fn();

    beforeEach(() => {
        vi.mock("@components/intergrate/CKEditorComponent");
        vi.mock("@services/TaskService.js");

        CKEditorComponent.mockImplementation(() => <div>CKEditorComponent</div>);
        vi.mock("@ckeditor/ckeditor5-build-classic", async () => {
            const mod = await vi.importActual("react-router-dom");
            return {
                ...mod,
                ClassicEditor: vi.fn(),
            };
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('renders the form', async () => {
        const { container } = render(
            <CreateTaskComponent
                checklistGroupId={1}
                checklistId={1}
                onFetchChecklist={mockOnFetchChecklist}
            />
        );

        await waitFor(() => {
            expect(container.querySelector('.container-lg')).toBeDefined();
        });
    });

    it('submits the form', async () => {
        let checklistId = 1;
        const mockFormData = {
            name: 'Test Checklist',
            description: '',
        };

        vi.mocked(TaskService.storeTask).mockResolvedValue();

        const { container } = render(
            <CreateTaskComponent
                checklistGroupId={1}
                checklistId={checklistId}
                onFetchChecklist={mockOnFetchChecklist}
            />
        );

        await waitFor(() => {
            // expect card not null
            expect(container.querySelector('.card')).toBeTruthy();
            let input = container.querySelector('.card .card-body input');
            let submit = container.querySelector('.card .card-footer button');

            expect(input).toBeTruthy();
            expect(submit).toBeTruthy();

            fireEvent.change(input, {
                target: { value: mockFormData.name },
            });

            fireEvent.click(submit);

            expect(TaskService.storeTask).toHaveBeenCalledWith(
                checklistId,
                mockFormData
            );
        });
    });

    it('handles form submission error', async () => {
        const mockFormData = {
            name: 'Test Checklist',
        };

        const mockError = {
            response: {
                data: {
                    errors: {
                        name: ['Error message']
                    },
                },
            },
        };

        vi.mocked(TaskService.storeTask).mockRejectedValue(mockError);

        const { container } = render(
            <CreateTaskComponent
                checklistGroupId={1}
                checklistId={1}
                onFetchChecklist={mockOnFetchChecklist}
            />
        );

        await waitFor(() => {
            // expect card not null
            expect(container.querySelector('.card')).toBeTruthy();
            let input = container.querySelector('.card .card-body input');
            let submit = container.querySelector('.card .card-footer button');

            expect(input).toBeTruthy();
            expect(submit).toBeTruthy();

            fireEvent.change(input, {
                target: { value: mockFormData.name },
            });

            fireEvent.click(submit);

            expect(mockOnFetchChecklist).not.toHaveBeenCalled();
        });
    });
});