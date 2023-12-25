import React, { useState, useEffect } from "react";
import ChecklistGroupService from "../../services/ChecklistGroupService.js";

import { useNavigate, useParams } from "react-router-dom";


function CreateChecklistComponent({ onCreateChecklist }) {

    const { checklistGroupId } = useParams();
    const navigate = useNavigate();
    const [checklistGroup, setChecklistGroup] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        onCreateChecklist(checklistGroupId, formJson);

    }

    useEffect(() => {
        const fetchChecklistGroup = async (id) => {
                // try {
            const response = await ChecklistGroupService.getChecklistGroup(id);
            setChecklistGroup(response);
                // } catch (error) {
                //     console.error('Error fetching checklist groups:', error);
                //     // Handle the error (e.g., show an error message to the user)
                // }
        };

        fetchChecklistGroup(checklistGroupId);

    }, [checklistGroupId]);

    // Check if checklistGroup is null before accessing its properties
    if (checklistGroup == null) {
        return <div>Loading...</div>; // Or render a loading indicator
    }

    return (
        <div className="container-lg">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <form method="POST" onSubmit={handleSubmit}>
                            <div className="card-header">
                                <strong>New checklist in { checklistGroup.name }</strong>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" name="name" placeholder="Checklist name"></input>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="col-12">
                                    <button className="btn btn-primary" type="submit">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CreateChecklistComponent
