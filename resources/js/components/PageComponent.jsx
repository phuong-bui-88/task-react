import React, { useState, useEffect } from "react";
import PageService from "../services/PageService.js";

function PageComponent({ pageId }) {

    const [page, setPage] = useState(null);

    const fetchPage = async (pageId) => {
        const response = await PageService.getPage(pageId);
        setPage(response);
    }

    useEffect(() => {
        fetchPage(pageId);
    }, [pageId])

    return page && (
        <>
            <h4 className="title">{page.title}</h4>
            <hr></hr>
            <div className="content" dangerouslySetInnerHTML={{ __html: page.content }} />
        </>
    )
}

export default PageComponent
