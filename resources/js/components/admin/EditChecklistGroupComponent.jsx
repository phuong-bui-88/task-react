import React, { useState, useEffect } from "react";
import ChecklistGroupService from "../../services/ChecklistGroupService.js";

import { useNavigate, useParams } from "react-router-dom";


function EditChecklistGroupComponent({ onEdit, onDelete, token }) {

    const navigate = useNavigate();
    const [checklistGroup, setChecklistGroup] = useState(null);
    const { checklistGroupId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        onEdit(checklistGroup);
    }

    const handleDeletedSubmit = async (e) => {
        e.preventDefault();

        if (window.confirm('Are you sure?')) {
            onDelete(checklistGroup);
        }
    }

    // if (checklistGroupId) {
    //     const checklistGroup = fetchChecklistGroup(checklistGroupId);
    // }

    // console.log(checklistGroup, 'e');

    useEffect(() => {
        const fetchChecklistGroup = async (id) => {
            const response = await ChecklistGroupService.getChecklistGroup(id, token);
            setChecklistGroup(response);
        };

        fetchChecklistGroup(checklistGroupId);

    }, [checklistGroupId]);

    // Check if checklistGroup is null before accessing its properties
    if (checklistGroup == null) {
        return <div>Loading...</div>; // Or render a loading indicator
    }

    return (checklistGroup &&
        <div className="container-lg">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <form method="POST" onSubmit={handleSubmit}>
                            <div className="card-header">
                                <strong>Edit checklist group</strong>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" name="name" placeholder="Checklist group name"
                                        value={checklistGroup ? checklistGroup.name : ''}
                                        onChange={(e) => setChecklistGroup({ ...checklistGroup, name: e.target.value })}
                                    />

                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="col-12">
                                    <button className="btn btn-primary" type="submit">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <form method="POST" onSubmit={handleDeletedSubmit}>
                        <button className="btn btn-danger" type="submit">Delete this checklist group</button>
                    </form>

                </div>
            </div>
        </div>

    )
}

export default EditChecklistGroupComponent
