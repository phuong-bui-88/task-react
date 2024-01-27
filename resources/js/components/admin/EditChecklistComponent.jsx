import React, { useEffect, useState } from "react";

import ErrorComponent from "@components/intergrate/ErrorComponent.jsx";
import HelperService from "@services/HelperService.js";
import TokenService from "@services/TokenService.js";
import { useNavigate, useParams } from "react-router-dom";
import CheckListService from "../../services/CheckListService.js";
import CreateTaskComponent from "./CreateTaskComponent.jsx";
import TaskListComponent from "./TaskListComponent.jsx";

function EditChecklistComponent({
    onFetchChecklistGroups,
}) {
    const navigate = useNavigate();
    const [checklist, setChecklist] = useState(null);
    const { checklistGroupId, checklistId } = useParams();
    const token = TokenService.getToken();
    const [errors, setErrors] = useState([]);

    const handleUpdatedSubmit = async (e) => {
        e.preventDefault();

        try {
            await CheckListService.updateChecklist(
                checklist.checklistGroupId,
                checklist,
                token
            );

            onFetchChecklistGroups();
            navigate("/home");
        }
        catch (error) {
            setErrors(error.response.data.errors);
        }
    };

    const handleDeletedSubmit = async (e) => {
        e.preventDefault();

        if (!window.confirm("Are you sure?")) {
            return;
        }

        try {
            await CheckListService.destroyChecklist(
                checklist.checklistGroupId,
                checklist,
                token
            );

            onFetchChecklistGroups();

            navigate("/home");
        }
        catch (error) {
            setErrors(error.response.data.errors);
        }
    };

    const fetchChecklist = async () => {
        const response = await CheckListService.getChecklist(
            checklistGroupId,
            checklistId,
            token
        );

        setChecklist(response);
    };

    useEffect(() => {
        fetchChecklist(checklistGroupId, checklistId);
    }, [checklistId]);

    return (checklist &&
        <div className="container-lg">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <form method="POST" onSubmit={handleUpdatedSubmit}>
                            <div className="card-header">
                                <strong>Edit checklist</strong>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className={HelperService.addInvalid(null, errors?.name)}
                                        name="checklist_name"
                                        placeholder="Checklist group name"
                                        value={checklist ? checklist.name : ""}
                                        onChange={(e) =>
                                            setChecklist({
                                                ...checklist,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <ErrorComponent error={errors?.name} />
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="col-12">
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        Save Checklist
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <form method="POST" onSubmit={handleDeletedSubmit}>
                        <button className="btn btn-danger" type="submit">
                            Delete this checklist
                        </button>
                    </form>
                </div>
            </div>

            <hr className="my-3" />

            <div className="row">
                <div className="col-12">
                    {checklist.tasks ? (
                        <div className="card mb-4">
                            <div className="card-header">
                                <strong>List of Tasks</strong>
                            </div>

                            <div className="card-body">
                                <TaskListComponent
                                    checklistId={checklistId}
                                    tasks={checklist.tasks}
                                    onFetchChecklist={fetchChecklist}
                                />
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <CreateTaskComponent checklistGroupId={checklistGroupId} checklistId={checklistId} onFetchChecklist={fetchChecklist} />
                </div>
            </div>
        </div>
    );
}

export default EditChecklistComponent;
