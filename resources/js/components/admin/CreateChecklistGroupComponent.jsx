/* eslint-disable react/prop-types */
import React, { useState } from "react";

import ErrorComponent from "@components/intergrate/ErrorComponent";
import HelperService from "@services/HelperService";
import { useNavigate } from "react-router-dom";
import ChecklistGroupService from "@services/ChecklistGroupService";


function CreateChecklistGroupComponent({ onFetchChecklistGroups }) {
    const navigate = useNavigate();
    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        try {
            await ChecklistGroupService.storeChecklistGroup(
                formJson,
            );

            onFetchChecklistGroups();

            navigate('/dashboard');
        } catch (error) {
            setErrors(error.response.data.errors);
        }
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
                                        className={HelperService.addInvalid(null, errors?.name)}
                                        name="name"
                                        placeholder="Checklist group name"
                                    ></input>
                                    <ErrorComponent error={errors?.name} />
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
