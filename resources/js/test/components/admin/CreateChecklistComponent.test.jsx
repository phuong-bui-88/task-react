import CreateChecklistComponent from '@components/admin/CreateChecklistComponent';
import CheckListService from "@services/CheckListService.js";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { afterEach, expect, vi } from 'vitest';

describe('CreateChecklistComponent', () => {
    const mockChecklistGroups = {
        1: { id: 1, name: 'Group 1' },
        2: { id: 2, name: 'Group 2' },
    };

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

    it('renders the form', async () => {
        const { container } = render(
            <CreateChecklistComponent
                checklistGroups={mockChecklistGroups}
                onFetchChecklistGroups={mockOnFetchChecklistGroups}
            />
        );

        await waitFor(() => {
            expect(container.querySelector('.container-lg')).toBeDefined();
        });
    });

    it('submits the form', async () => {
        const mockFormData = {
            name: 'Test Checklist',
        };


        vi.mocked(CheckListService.storeChecklist).mockResolvedValue();

        const { container } = render(
            <CreateChecklistComponent
                checklistGroups={mockChecklistGroups}
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

            expect(CheckListService.storeChecklist).toHaveBeenCalledWith(
                mockChecklistGroups[1].id,
                mockFormData
            );

            expect(mockOnFetchChecklistGroups).toHaveBeenCalled();
            expect(navigate).toHaveBeenCalledWith('/dashboard');
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

        vi.mocked(CheckListService.storeChecklist).mockRejectedValue(mockError);

        const { container } = render(
            <CreateChecklistComponent
                checklistGroups={mockChecklistGroups}
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

            expect(CheckListService.storeChecklist).toHaveBeenCalledWith(
                mockChecklistGroups[1].id,
                mockFormData
            );

            expect(mockOnFetchChecklistGroups).not.toHaveBeenCalled();
            expect(navigate).not.toHaveBeenCalled();
            expect(container.querySelector('.invalid-feedback')).toBeDefined();
        });
    });
});