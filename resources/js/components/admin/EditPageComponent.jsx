import React, { useEffect, useState } from "react";

import PageService from "@services/PageService.js";
import { useNavigate, useParams } from "react-router-dom";
import CKEditorComponent from "../intergrate/CKEditorComponent.jsx";
import HelperService from "@services/HelperService.js";
import ErrorComponent from "@components/intergrate/ErrorComponent.jsx";

function EditPageComponent({ onFetchPages }) {

    const [page, setPage] = useState(null);
    const { pageId } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await PageService.updatePage(page);
            onFetchPages();
            navigate("/dashboard");
        } catch (error) {
            setErrors(error.response.data.errors);
        }
    }

    const handleInputChange = (e) => {
        setPage({
            ...page,
            [e.target.name]: e.target.value
        })
    };

    const handleEditorInputChange = (newData) => {
        setPage({ ...page, content: newData });
    }

    useEffect(() => {
        const fetchPage = async (pageId) => {
            const response = await PageService.getPage(pageId);
            setPage(response);
        }

        fetchPage(pageId);
    }, [pageId]);

    return (page &&
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
                                    <input type="text" className={HelperService.addInvalid(null, errors?.title)} name="title" placeholder="Title"
                                        value={page.title ?? ''}
                                        onChange={handleInputChange}
                                    />
                                    <ErrorComponent error={errors?.title} />
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
