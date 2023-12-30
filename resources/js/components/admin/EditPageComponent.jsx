import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import TaskService from "../../services/TaskService.js";
import CKEditorComponent from "../intergrate/CKEditorComponent.jsx";
import PageService from "../../services/PageService.js";
function EditPageComponent({ onEditPage, onUploadImage }) {

    const [page, setPage] = useState(null);
    const { pageId} = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        onEditPage(page);
    }

    const handleInputChange = (e) => {
        setPage({
            ...page,
            [e.target.name]: e.target.value
        })
    };

    const handleEditorInputChange = (newData) => {
        setPage({...page,  content: newData });
    }

    useEffect(() => {
        const fetchPage = async (pageId) => {
            const response = await PageService.getPage(pageId, token);
            setPage(response);
        }

        fetchPage(pageId);
    }, [pageId]);

    // Check if checklistGroup is null before accessing its properties
    if (page == null) {
        return <div>Loading...</div>; // Or render a loading indicator
    }

    return (
        <div className="container-lg">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <form method="POST" onSubmit={handleSubmit}>
                            <div className="card-header">
                                <strong>Edit page</strong>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input type="text" className="form-control" name="title" placeholder="Title"
                                           value={page.title ?? ''}
                                           onChange={handleInputChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Content</label>
                                    {/*{ page.content }*/}
                                    <CKEditorComponent key={page.id} data={page.content} onChange={handleEditorInputChange} />
                                </div>

                            </div>

                            <div className="card-footer">
                                <div className="col-12">
                                    <button className="btn btn-primary" type="submit">Save Page</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditPageComponent
