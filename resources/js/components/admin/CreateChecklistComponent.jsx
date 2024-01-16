import React, { useEffect, useState } from "react";
import ChecklistGroupService from "../../services/ChecklistGroupService.js";

import CheckListService from "@services/CheckListService.js";
import HelperService from "@services/HelperService.js";
import { useNavigate, useParams } from "react-router-dom";
import TokenService from "@services/TokenService.js";
import ErrorComponent from "@components/intergrate/ErrorComponent.jsx";


function CreateChecklistComponent({ checklistGroups, onFetchChecklistGroups }) {

    const { checklistGroupId } = useParams();
    const navigate = useNavigate();
    const [checklistGroup, setChecklistGroup] = useState(null);

    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        const token = TokenService.getToken();

        try {
            await CheckListService.storeChecklist(
                checklistGroup.id,
                formJson,
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

        const checklistGroupIndex = ChecklistGroupService.findIndexesByGroupId(checklistGroups, checklistGroupId);
        setChecklistGroup(checklistGroups[checklistGroupIndex]);

    }, [checklistGroups]);

    return (checklistGroup &&
        <div className="container-lg">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <form method="POST" onSubmit={handleSubmit}>
                            <div className="card-header">
                                <strong>New checklist in {checklistGroup.name}</strong>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className={HelperService.addInvalid(null, errors?.name)} name="name" placeholder="Checklist name"></input>
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
                </div>
            </div>
        </div>

    )
}

export default CreateChecklistComponent
