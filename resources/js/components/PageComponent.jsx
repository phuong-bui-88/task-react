import React, { useState, useEffect } from "react";
import PageService from "../services/PageService.js";

function PageComponent({ pageId }) {

    const [page, setPage] = useState(null);

    const fetchPage = async (pageId) => {
        const response =  await PageService.getPage(pageId);
        setPage(response);
    }

    useEffect(() => {
        fetchPage(pageId);
    }, [pageId])

    if (page == null) {
        return ( <div>Loading....</div> );
    }


    return (
        <>
            <h4>{ page.title }</h4>
            <hr></hr>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </>
    )
}

export default PageComponent
