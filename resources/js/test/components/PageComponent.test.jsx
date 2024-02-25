import PageComponent from '@components/PageComponent';
import PageService from '@services/PageService';
import { render, screen, waitFor } from "@testing-library/react";
import React from 'react';
// import { pageResponse } from "@test/mocks/handles";
import { pageResponse } from '@test/mocks/handlers';

it('renders PageComponent with page data', async () => {
    const pageId = 1;

    render(<PageComponent pageId={pageId} />);

    await waitFor(() => {
        const pageTitle = screen.getByText(pageResponse.data.title);
        expect(pageTitle).toBeDefined;
    });

});