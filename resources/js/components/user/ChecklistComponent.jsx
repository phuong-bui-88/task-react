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
    checklistGroups,
    onFetchChecklistGroup,
    onCountUserCompletedTasks,
    onUserFaviroteTasks,
    tasksList,
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
        let token = TokenService.getToken();

        const response = await CheckListService.showChecklist(
            checklistId,
            token
        );

        setChecklist(response);
    };

    const handleCompletedTask = (e, taskId) => {
        let token = TokenService.getToken();

        TaskService.completeTask(taskId, e.target.checked, token);
        fetchChecklist(checklistId);
        let checked = e.target.checked ? 1 : -1;

        onCountUserCompletedTasks(checklist.checklistGroupId, checklistId, checked);
    };

    const handleFavoritedTask = (e, task, index) => {
        e.target.type = 'favorite';
        e.preventDefault();
        let token = TokenService.getToken();
        TaskService.favoriteTask(task.id, !task.is_favorite, token);

        task.is_favorite = !task.is_favorite;
        setTasks((prevState) => {
            return prevState.map((taskItem, i) => (i == index ? task : taskItem));
        })

        onUserFaviroteTasks('count_user_favorite', (task.is_favorite == true ? 1 : -1));

        if (tasksList) {
            removeTask(index);
        }
    };

    const handleUpdateExpandTask = (expandTask) => {
        setTasks((prevState) => {
            return prevState.map((taskItem, i) => (i == expandTask.index ? expandTask.task : taskItem));
        })
    }

    // remove tasks and null expandedTask
    const removeTask = (index) => {
        tasks.splice(index, 1);
        setTasks(tasks);
        setExpandedTask({ task: null, status: null, index: null });
    };

    useEffect(() => {
        if (checklistId) {
            fetchChecklist(checklistId);
            onFetchChecklistGroup(true);
        }
        setExpandedTasks({});
        setExpandedTask({ task: null, status: null, index: null });
    }, [checklistId]);

    useEffect(() => {
        if (checklist || tasksList) {
            let tasksMap = (checklist) ? checklist.tasks : tasksList;
            let tasks = [];
            tasksMap.forEach((task, index) => {
                tasks[index] = task;
            });

            setTasks(tasks);
        }
    }, [checklist, tasksList]);

    return tasks && (
        <div className="row col-12">
            <div className="col-8">

                {checklist && (<CountTaskComponent
                    checklistGroups={checklistGroups}
                    checklist={checklist}
                />)}

                <div className="card m-3">
                    <div className="card-header">
                        <h3>{(checklist) ? checklist.name : 'Important'}</h3>
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
                                            <td className="w-75">
                                                {tasks[index].name}
                                                {(tasksList) &&
                                                    <small className="d-block">
                                                        <i>{tasks[index].checklist_name}
                                                            {(tasks[index].due_date) && ' / ' +
                                                                new Date(tasks[index].due_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
                                                            }</i></small>
                                                }
                                            </td>
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

            <RightChecklistComponent expandedTask={expandedTask} onFavoritedTask={handleFavoritedTask} onUpdateExpandTask={handleUpdateExpandTask} />
        </div>
    )
}

export default ChecklistComponent;
