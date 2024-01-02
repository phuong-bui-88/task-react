import React, { useEffect, useState } from "react";
import ChecklistGroupService from "../../services/ChecklistGroupService.js";

import { Link, useNavigate, useParams } from "react-router-dom";
import CheckListService from "../../services/CheckListService.js";
import CKEditorComponent from "../intergrate/CKEditorComponent.jsx";
import TaskListComponent from "./TaskListComponent.jsx";

function EditChecklistComponent({
    onEditChecklist,
    onDeleteChecklist,
    onCreateTask,
    onDeleteTask,
    token,
}) {
    const navigate = useNavigate();
    const [checklist, setChecklist] = useState(null);
    const { checklistGroupId, checklistId } = useParams();

    const [taskData, setTaskData] = useState({
        name: "",
        description: "",
    });

    const handleInputChange = (e) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditorInputChange = (newData) => {
        setTaskData({ ...taskData, description: newData });
    };

    const updatePositionTask = async (updatedTask) => {
        const taskToUpdate = updatedTask.map((task, index) => ({
            id: task.id,
            position: index + 1,
        }));

        CheckListService.updatePositionTask(checklistId, taskToUpdate, token);

        fetchChecklist(checklistGroupId, checklistId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onEditChecklist(checklist);
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        onCreateTask(checklistId, taskData);

        setTaskData({
            name: "",
            description: "",
        });

        fetchChecklist(checklistGroupId, checklistId);
    };

    const handleDeletedSubmit = async (e) => {
        e.preventDefault();

        if (window.confirm("Are you sure?")) {
            onDeleteChecklist(checklist);
        }
    };

    const deletedTaskSubmit = async (event, task) => {
        event.preventDefault();
        if (window.confirm("Are you sure?")) {
            onDeleteTask(task);
            fetchChecklist(checklistGroupId, checklistId);
        }
    };

    const fetchChecklist = async (checklistGroupId, checklistId) => {
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

    // Check if checklistGroup is null before accessing its properties
    if (checklist == null) {
        return <div>Loading...</div>; // Or render a loading indicator
    }

    return (
        <div className="container-lg">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <form method="POST" onSubmit={handleSubmit}>
                            <div className="card-header">
                                <strong>Edit checklist</strong>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="Checklist group name"
                                        value={checklist ? checklist.name : ""}
                                        onChange={(e) =>
                                            setChecklist({
                                                ...checklist,
                                                name: e.target.value,
                                            })
                                        }
                                    />
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
                                    onUpdatePositionTask={updatePositionTask}
                                    onDeletedTaskSubmit={deletedTaskSubmit}
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
                    <div className="card mb-4">
                        <form method="POST" onSubmit={handleTaskSubmit}>
                            <div className="card-header">
                                <strong>New Task</strong>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="Task name"
                                        value={taskData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <div className="form-label">
                                        Description
                                    </div>
                                    <CKEditorComponent
                                        data={taskData.description}
                                        onChange={handleEditorInputChange}
                                    />
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="col-12">
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        Save Task
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

export default EditChecklistComponent;
