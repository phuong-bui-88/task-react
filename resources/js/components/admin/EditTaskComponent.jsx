import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import TaskService from "../../services/TaskService.js";
import CKEditorComponent from "../intergrate/CKEditorComponent.jsx";
function EditTaskComponent({ onEditTask, token }) {

    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const { checklistId, taskId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        onEditTask(task);
    }

    const handleInputChange = (e) => {
        setTask({
            ...task,
            [e.target.name]: e.target.value
        })
    };

    const handleEditorInputChange = (newData) => {
        setTask({...task, description: newData });
    }

    useEffect(() => {
        const fetchTask = async (checklistId, taskId) => {
            //     // try {
            const response = await TaskService.getTask(checklistId, taskId, token);
            setTask(response);
            //     // } catch (error) {
            //     //     console.error('Error fetching checklist groups:', error);
            //     //     // Handle the error (e.g., show an error message to the user)
            //     // }
        };

        fetchTask(checklistId, taskId);

    }, [taskId]);

    // Check if checklistGroup is null before accessing its properties
    if (task == null) {
        return <div>Loading...</div>; // Or render a loading indicator
    }

    return (
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
                                    <input type="text" className="form-control" name="name" placeholder="Checklist group name"
                                           value={task.name}
                                           onChange={handleInputChange}
                                    />
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
