import TaskService from '@services/TaskService.js';
import React, { useState } from 'react';
import CKEditorComponent from "../intergrate/CKEditorComponent.jsx";
import HelperService from '@services/HelperService.js';
import ErrorComponent from '@components/intergrate/ErrorComponent.jsx';

const CreateTaskComponent = ({ checklistGroupId, checklistId, onFetchChecklist }) => {
    const [taskData, setTaskData] = useState({
        name: "",
        description: "",
    });

    const [errors, setErrors] = useState(null);

    const handleInputChange = (e) => {
        setTaskData(prevTaskData => ({
            ...prevTaskData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEditorInputChange = (newData) => {
        setTaskData(prevTaskData => ({ ...prevTaskData, description: newData }));
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();

        try {
            await TaskService.storeTask(
                checklistId,
                taskData,
            );

            onFetchChecklist(checklistGroupId, checklistId);

            setTaskData({
                name: "",
                description: "",
            });

            setErrors(null);
        }
        catch (error) {
            setErrors(error.response.data.errors);
        }
    };

    return (
        <>
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
                                className={HelperService.addInvalid(null, errors?.name)}
                                name="name"
                                placeholder="Task name"
                                value={taskData.name}
                                onChange={handleInputChange}
                            />
                            <ErrorComponent error={errors?.name} />
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
                            <button className="btn btn-primary" type="submit">
                                Save Task
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateTaskComponent;
