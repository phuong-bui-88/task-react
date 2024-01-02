import React, { useState } from "react";
import ChecklistGroupService from "../../services/ChecklistGroupService.js";

import { useNavigate } from "react-router-dom";

function CreateChecklistGroupComponent({ onCreate, token }) {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        onCreate(formJson);
        // try {
        //     const responseData = await ChecklistGroupService.storeChecklistGroup(formJson);
        //
        //     navigate('/home');
        // } catch (error) {
        //
        // }
    };

    return (
        <div className="container-lg">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <form method="POST" onSubmit={handleSubmit}>
                            <div className="card-header">
                                <strong>New checklist group</strong>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="Checklist group name"
                                    ></input>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="col-12">
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateChecklistGroupComponent;
