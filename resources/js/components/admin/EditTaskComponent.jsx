import React, { useEffect, useState } from "react";

import HelperService from "@services/HelperService.js";
import { useNavigate, useParams } from "react-router-dom";
import TaskService from "../../services/TaskService.js";
import CKEditorComponent from "../intergrate/CKEditorComponent.jsx";
import ErrorComponent from "@components/intergrate/ErrorComponent.jsx";

function EditTaskComponent() {

    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const { checklistId, taskId } = useParams();
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await TaskService.updateTask(task);
            navigate(-1);
        }
        catch (error) {
            setErrors(error.response.data.errors);
        }
    }

    const handleInputChange = (e) => {
        setTask({
            ...task,
            [e.target.name]: e.target.value
        })
    };

    const handleEditorInputChange = (newData) => {
        setTask({ ...task, description: newData });
    }

    useEffect(() => {
        const fetchTask = async (checklistId, taskId) => {
            const response = await TaskService.getTask(checklistId, taskId);
            setTask(response);
        };

        fetchTask(checklistId, taskId);

    }, [taskId]);

    return (task &&
        <div className="container-lg">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <form method="POST" onSubmit={handleSubmit}>
                            <div className="card-header">
                                <strong>Edit task</strong>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className={HelperService.addInvalid(null, errors?.name)} name="name" placeholder="Checklist group name"
                                        value={task.name}
                                        onChange={handleInputChange}
                                    />
                                    <ErrorComponent error={errors?.name} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <CKEditorComponent data={task.description} onChange={handleEditorInputChange} />
                                </div>

                            </div>

                            <div className="card-footer">
                                <div className="col-12">
                                    <button className="btn btn-primary" type="submit">Save Task</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditTaskComponent
