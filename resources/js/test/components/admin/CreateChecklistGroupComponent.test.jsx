import ChecklistGroupService from '@services/ChecklistGroupService';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CreateChecklistGroupComponent from '@components/admin/CreateChecklistGroupComponent';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { afterEach } from 'vitest';

vi.mock('@services/ChecklistGroupService');


describe('CreateChecklistGroupComponent', () => {
    const mockOnFetchChecklistGroups = vi.fn();
    const navigate = vi.fn();

    beforeEach(() => {
        vi.mock("@services/CheckListService.js");

        vi.mock("react-router-dom", async () => {
            const mod = await vi.importActual("react-router-dom");
            return {
                ...mod,
                useParams: vi.fn(),
                useNavigate: vi.fn(),
            };
        });

        useParams.mockImplementation(() => ({ checklistGroupId: 1 }));
        useNavigate.mockImplementation(() => navigate);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should render the form', async () => {
        const { container } = render(
            <CreateChecklistGroupComponent onFetchChecklistGroups={mockOnFetchChecklistGroups} />
        );

        await waitFor(() => {
            expect(container.querySelector('.container-lg')).toBeDefined();
        });
    });

    it('should submit the form and call onFetchChecklistGroups', async () => {
        const mockFormData = {
            name: 'Test Checklist',
        };

        vi.mocked(ChecklistGroupService.storeChecklistGroup).mockResolvedValue();

        const { container } = render(
            <CreateChecklistGroupComponent
                onFetchChecklistGroups={mockOnFetchChecklistGroups}
            />
        );

        await waitFor(() => {
            let input = container.querySelector('.container-lg .card-body input');
            let submit = container.querySelector('.container-lg .card-footer button');

            expect(input).toBeDefined();
            expect(submit).toBeDefined();

            fireEvent.change(input, {
                target: { value: mockFormData.name },
            });

            fireEvent.click(submit);

            expect(ChecklistGroupService.storeChecklistGroup).toHaveBeenCalledWith(
                mockFormData
            );

            expect(mockOnFetchChecklistGroups).toHaveBeenCalled();
            expect(navigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('should handle form submission error', async () => {
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

        vi.mocked(ChecklistGroupService.storeChecklistGroup).mockRejectedValue(mockError);

        const { container } = render(
            <CreateChecklistGroupComponent
                onFetchChecklistGroups={mockOnFetchChecklistGroups}
            />
        );

        await waitFor(() => {
            let input = container.querySelector('.container-lg .card-body input');
            let submit = container.querySelector('.container-lg .card-footer button');

            expect(input).toBeDefined();
            expect(submit).toBeDefined();

            fireEvent.change(input, {
                target: { value: mockFormData.name },
            });

            fireEvent.click(submit);

            expect(ChecklistGroupService.storeChecklistGroup).toHaveBeenCalledWith(
                mockFormData
            );

            expect(mockOnFetchChecklistGroups).not.toHaveBeenCalled();
            expect(navigate).not.toHaveBeenCalled();
            expect(container.querySelector('.invalid-feedback')).toBeDefined();
        });
    });
});