import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CheckListService from "@services/CheckListService";
import TaskService from "@services/TaskService";
import TokenService from "@services/TokenService";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ChecklistComponent({ token, onFetchChecklistGroup }) {
    const { checklistId } = useParams();
    const [checklist, setChecklist] = useState(null);

    //  init
    const [expandedTasks, setExpandedTasks] = useState({});

    const toggleSlide = (index) => {
        setExpandedTasks((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const fetchChecklist = async (checklistId) => {
        const response = await CheckListService.showChecklist(
            checklistId,
            token
        );
        setChecklist(response);
    };

    const handleCompletedTask = (e, taskId) => {
        e.stopPropagation();
        token = TokenService.getToken();

        TaskService.completeTask(taskId, token);
        fetchChecklist(checklistId);
    };

    useEffect(() => {
        fetchChecklist(checklistId);
        onFetchChecklistGroup(true);
        setExpandedTasks({});
    }, [checklistId]);

    return checklist ? (
        <div>
            <div className="card m-3">
                <div className="card-header">
                    <h3>{checklist.name}</h3>
                </div>
                <div className="card-body">
                    <table className="table table-responsive">
                        <tbody>
                            {checklist.tasks.map((task, index) => (
                                <React.Fragment key={"row" + index}>
                                    <tr
                                        onClick={(e) => {
                                            if (e.target.type !== "checkbox") {
                                                toggleSlide(index);
                                            }
                                        }}
                                    >
                                        <td className="w-10">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="completed"
                                                value=""
                                                onChange={(e) => {
                                                    handleCompletedTask(
                                                        e,
                                                        task.id
                                                    );
                                                }}
                                                checked={task.is_completed}
                                            />
                                        </td>
                                        <td className="w-75">{task.name}</td>
                                        <td className="align-middle oh">
                                            {expandedTasks[index] ? (
                                                <ExpandLessIcon />
                                            ) : (
                                                <ExpandMoreIcon />
                                            )}
                                        </td>
                                    </tr>
                                    <tr
                                        className={
                                            expandedTasks[index] ? "" : "d-none"
                                        }
                                    >
                                        <td
                                            className="ck-content"
                                            colSpan="2"
                                            dangerouslySetInnerHTML={{
                                                __html: task.description,
                                            }}
                                        ></td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
}

export default ChecklistComponent;
