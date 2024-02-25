import EditChecklistComponent from "@components/admin/EditChecklistComponent";
import CheckListService from "@services/CheckListService";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateTaskComponent from "@components/admin/CreateTaskComponent";
import { expect } from "vitest";


describe('EditChecklistComponent', () => {
    const mockOnFetchChecklistGroups = vi.fn();
    const navigate = vi.fn();


    const mockChecklist = {
        checklistGroupId: 1,
        name: 'Test Checklist',
        tasks: [],
    };

    const mockParams = {
        checklistGroupId: 1,
        checklistId: 1,
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

    beforeEach(() => {
        vi.mock("react-router-dom", async () => {
            const mod = await vi.importActual("react-router-dom");
            return {
                ...mod,
                useParams: vi.fn(),
                useNavigate: vi.fn(),
            };
        });

        useParams.mockImplementation(() => (mockParams));
        useNavigate.mockImplementation(() => navigate);

        // ckeditor

        vi.mock("@components/admin/CreateTaskComponent");
        CreateTaskComponent.mockImplementation(() => <div>Create Task</div>);
    });

    // afterEach(() => {
    //     vi.clearAllMocks();
    // });

    it('renders the form', async () => {
        const { container } = render(
            <EditChecklistComponent onFetchChecklistGroups={mockOnFetchChecklistGroups} />
        );

        await waitFor(() => console.log(screen.debug()));

        let times = 0;
        await waitFor(() => {
            times++;
            expect(container.querySelectorAll('.container-lg').length).toBe(1);
            expect(times).toBe(1);
            // screen.debug();
            // screen.debug();12
            // expect(screen.getByText('Save Checklist')).toBeInTheDocument();1
        });
    });

    // it('submits the form and navigates to dashboard', async () => {
    //     render(<EditChecklistComponent onFetchChecklistGroups={mockOnFetchChecklistGroups} />);

    //     await waitFor(() => {
    //         const saveButton = screen.getByText('Save Checklist');
    //         fireEvent.click(saveButton);

    //         expect(CheckListService.updateChecklist).toHaveBeenCalledWith(
    //             mockChecklist.checklistGroupId,
    //             mockChecklist
    //         );
    //         expect(mockOnFetchChecklistGroups).toHaveBeenCalled();
    //         expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    //     });
    // });

    // it('handles form submission error', async () => {
    //     jest.spyOn(CheckListService, 'updateChecklist').mockRejectedValue(mockError);

    //     render(<EditChecklistComponent onFetchChecklistGroups={mockOnFetchChecklistGroups} />);

    //     await waitFor(() => {
    //         const saveButton = screen.getByText('Save Checklist');
    //         fireEvent.click(saveButton);

    //         expect(mockSetErrors).toHaveBeenCalledWith(mockError.response.data.errors);
    //     });
    // });

    // it('deletes the checklist and navigates to dashboard', async () => {
    //     render(<EditChecklistComponent onFetchChecklistGroups={mockOnFetchChecklistGroups} />);

    //     await waitFor(() => {
    //         const deleteButton = screen.getByText('Delete this checklist');
    //         fireEvent.click(deleteButton);

    //         expect(window.confirm).toHaveBeenCalledWith("Are you sure?");
    //         expect(CheckListService.destroyChecklist).toHaveBeenCalledWith(
    //             mockChecklist.checklistGroupId,
    //             mockChecklist
    //         );
    //         expect(mockOnFetchChecklistGroups).toHaveBeenCalled();
    //         expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    //     });
    // });

    // it('handles checklist fetch error', async () => {
    //     jest.spyOn(CheckListService, 'getChecklist').mockRejectedValue(mockError);

    //     render(<EditChecklistComponent onFetchChecklistGroups={mockOnFetchChecklistGroups} />);

    //     await waitFor(() => {
    //         expect(mockSetErrors).toHaveBeenCalledWith(mockError.response.data.errors);
    //     });
    // });
});