import React, { useState, useEffect } from "react";
import PageService from "../services/PageService.js";

function PageComponent({ pageId, token }) {

    const [page, setPage] = useState(null);

    const fetchPage = async (pageId) => {
        const response = await PageService.getPage(pageId, token);
        setPage(response);
    }

    useEffect(() => {
        fetchPage(pageId);
    }, [pageId])

    return page && (
        <>
            <h4>{page.title}</h4>
            <hr></hr>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </>
    )
}

export default PageComponent
