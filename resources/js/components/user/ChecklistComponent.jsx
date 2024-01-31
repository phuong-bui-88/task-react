import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import CheckListService from "@services/CheckListService";
import TaskService from "@services/TaskService";
import TokenService from "@services/TokenService";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CountTaskComponent from "./CountTaskComponent";
import RightChecklistComponent from "./RightChecklistComponent";

function ChecklistComponent({
    token,
    checklistGroups,
    onFetchChecklistGroup,
    onCountUserCompletedTasks,
    onUserFaviroteTasks,
}) {
    const { checklistId } = useParams();
    const [checklist, setChecklist] = useState(null);
    const [tasks, setTasks] = useState(null);

    //  init
    const [expandedTasks, setExpandedTasks] = useState({});
    const [expandedTask, setExpandedTask] = useState({ task: null, status: null, index: null });

    const toggleSlide = (index) => {
        let task = {
            'task': tasks[index],
            'status': !expandedTasks[index],
            'index': index,
        }

        setExpandedTask(task);

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
        token = TokenService.getToken();

        TaskService.completeTask(taskId, e.target.checked, token);
        fetchChecklist(checklistId);
        let checked = e.target.checked ? 1 : -1;

        onCountUserCompletedTasks(checklist.checklistGroupId, checklistId, checked);
    };

    const handleFavoritedTask = (e, task, index) => {
        e.target.type = 'favorite'
        e.preventDefault();
        token = TokenService.getToken();
        TaskService.favoriteTask(task.id, !task.is_favorite, token);

        task.is_favorite = !task.is_favorite;
        setTasks((prevState) => {
            return prevState.map((taskItem, i) => (i == index ? task : taskItem));
        })

        onUserFaviroteTasks('count_user_favorite', (task.is_favorite == true ? 1 : -1));
    };

    useEffect(() => {
        fetchChecklist(checklistId);
        onFetchChecklistGroup(true);
        setExpandedTasks({});
    }, [checklistId]);

    useEffect(() => {
        if (checklist) {
            let tasks = [];
            checklist.tasks.forEach((task, index) => {
                tasks[index] = task;
            });

            setTasks(tasks);
        }
    }, [checklist]);

    return checklist && tasks ? (
        <div className="row col-12">
            <div className="col-8">
                <CountTaskComponent
                    checklistGroups={checklistGroups}
                    checklist={checklist}
                />

                <div className="card m-3">
                    <div className="card-header">
                        <h3>{checklist.name}</h3>
                    </div>
                    <div className="card-body">
                        <table className="table table-responsive">
                            <tbody>
                                {tasks.map((task, index) => (
                                    <React.Fragment key={"row" + index}>
                                        <tr
                                            onClick={(e) => {
                                                if (e.target.type !== "checkbox" && e.target.type != "favorite") {
                                                    toggleSlide(index);
                                                }
                                            }}
                                        >
                                            <td className="col-1">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="isCompleted"
                                                    value=""
                                                    onChange={(e) => {
                                                        handleCompletedTask(
                                                            e,
                                                            tasks[index].id
                                                        );
                                                    }}
                                                    checked={tasks[index].is_completed}
                                                />
                                            </td>
                                            <td className="w-75">{tasks[index].name}</td>
                                            <td className="align-middle">
                                                {expandedTasks[index] ? (
                                                    <ExpandLessIcon />
                                                ) : (
                                                    <ExpandMoreIcon />
                                                )}
                                            </td>
                                            <td>
                                                <a className="info-color" onClick={(e) => handleFavoritedTask(e, tasks[index], index)}>
                                                    {task.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                </a>
                                            </td>
                                        </tr>
                                        <tr
                                            className={
                                                expandedTasks[index] ? "" : "d-none"
                                            }
                                        >
                                            <td
                                                className="ck-content"
                                                colSpan="4"
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

            <RightChecklistComponent expandedTask={expandedTask} onFavoritedTask={handleFavoritedTask} />
        </div>
    ) : (
        ""
    );
}

export default ChecklistComponent;
