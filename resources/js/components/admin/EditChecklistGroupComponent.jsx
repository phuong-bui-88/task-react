import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import TokenService from "@services/TokenService.js";
import ChecklistGroupService from "@services/ChecklistGroupService";
import HelperService from "@services/HelperService";
import ErrorComponent from "@components/intergrate/ErrorComponent";


function EditChecklistGroupComponent({ checklistGroups, onFetchChecklistGroups }) {

    const navigate = useNavigate();
    const [checklistGroup, setChecklistGroup] = useState(null);
    const [errors, setErrors] = useState(null);
    const { checklistGroupId } = useParams();
    const token = TokenService.getToken();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await ChecklistGroupService.updateChecklistGroup(
                checklistGroup,
                token
            );

            onFetchChecklistGroups();
            navigate("/home");
        }
        catch (error) {
            setErrors(error.response.data.errors);
        }

    }

    const handleDeletedSubmit = async (e) => {
        e.preventDefault();

        if (!window.confirm('Are you sure?')) {
            return
        }

        try {
            await ChecklistGroupService.destroyChecklistGroup(
                checklistGroup,
                token
            );

            onFetchChecklistGroups();

            navigate("/home");
        }
        catch (error) {
            setErrors(error.response.data.errors);
        }
    }

    useEffect(() => {
        if (!checklistGroups) return;

        let checklistGroupIndex = ChecklistGroupService.findIndexesByGroupId(checklistGroups, checklistGroupId);
        setChecklistGroup(checklistGroups[checklistGroupIndex]);
    }, [checklistGroups, checklistGroupId]);

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
                                    <input type="text" className={HelperService.addInvalid(null, errors?.name)} name="name" placeholder="Checklist group name"
                                        value={checklistGroup ? checklistGroup.name : ''}
                                        onChange={(e) => setChecklistGroup({ ...checklistGroup, name: e.target.value })}
                                    />
                                    <ErrorComponent error={errors?.name} />
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
