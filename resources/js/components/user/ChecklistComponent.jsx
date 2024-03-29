import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import CheckListService from "@services/CheckListService";
import TaskService from "@services/TaskService";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CountTaskComponent from "./CountTaskComponent";
import RightChecklistComponent from "./RightChecklistComponent";
import UserService from "@services/UserService";

function ChecklistComponent({
    checklistGroups,
    user,
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
        const response = await CheckListService.showChecklist(
            checklistId,
        );

        setChecklist(response);
    };

    const handleCompletedTask = (e, task, index) => {
        TaskService.completeTask(task.id, e.target.checked);

        task.is_completed = e.target.checked;
        setTasks((prevState) => {
            return prevState.map((taskItem, i) => (i == index ? task : taskItem));
        },)

        let checked = e.target.checked ? 1 : -1;

        onCountUserCompletedTasks(checklist.checklistGroupId, checklistId, checked);
    };

    const handleFavoritedTask = (e, task, index) => {
        e.target.type = 'favorite';
        e.preventDefault();
        TaskService.favoriteTask(task.id, !task.is_favorite);

        task.is_favorite = !task.is_favorite;
        setTasks((prevState) => {
            return prevState.map((taskItem, i) => (i == index ? task : taskItem));
        },)

        onUserFaviroteTasks('count_user_favorite', (task.is_favorite == true ? 1 : -1));

        if (tasksList) {
            removeTask(index);
        }
    };

    const handleUpdateExpandTask = (expandTask) => {
        setTasks((prevState) => {
            return prevState.map((taskItem, i) => (i == expandTask.index ? expandTask.task : taskItem));
        },)
    }

    // remove tasks and null expandedTask
    const removeTask = (index) => {
        tasks.splice(index, 1);
        setTasks(tasks);
        setExpandedTask({ task: null, status: null, index: null });
    };

    useEffect(() => {
        if (!checklistId) {
            return;
        }

        if (checklistId) {
            fetchChecklist(checklistId);
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


    const handlePayment = async () => {
        let response = await UserService.paymentUser();

        // redirect to response url
        if (response.checkoutUrl) {
            window.location.href = response.checkoutUrl;
        }
    }

    return tasks && (
        <div className="row col-12 task-checklist">
            <div className="col-8">

                {checklist && (<CountTaskComponent
                    checklistGroups={checklistGroups}
                    checklist={checklist}
                />)}

                <div className="card m-3">
                    <div className="card-header">
                        <h3>{checklist?.name}</h3>
                    </div>
                    <div className="card-body" id="user-task-list">
                        <table className="table table-responsive">
                            <tbody>
                                {tasks.map((task, index) => (
                                    (
                                        (index > 2 && !user?.subscribe) ? "" :
                                            (index == 2 && !user?.subscribe) ?
                                                (<React.Fragment key={"row" + index}>
                                                    <tr data-testid="payment-is-required">
                                                        <td colSpan="4" className="text-center">
                                                            <p>
                                                                You are limit at {index} task per checklist<br></br>
                                                                Unclock all now
                                                            </p>
                                                            <button className="btn btn-primary" onClick={handlePayment}>
                                                                5000 VND
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>)
                                                :
                                                (<React.Fragment key={"row" + index}>
                                                    <tr
                                                        onClick={(e) => {
                                                            if (e.target.type !== "checkbox" && e.target.type != "favorite") {
                                                                toggleSlide(index);
                                                            }
                                                        }}
                                                        data-testid="row-title"
                                                    >
                                                        <td className="col-1">
                                                            <input
                                                                className="form-check-input complete-task"
                                                                type="checkbox"
                                                                name="isCompleted"
                                                                value=""
                                                                onChange={(e) => {
                                                                    handleCompletedTask(e, tasks[index], index);
                                                                }}
                                                                checked={task.is_completed}
                                                            />
                                                        </td>
                                                        <td className="w-75">
                                                            {tasks[index].name}
                                                            {(tasksList) &&
                                                                <small className="d-block" data-testid="due_date">
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
                                                            <a className="info-color favorite-task" onClick={(e) => handleFavoritedTask(e, tasks[index], index)}>
                                                                {task.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        className={
                                                            expandedTasks[index] ? "" : "d-none"
                                                        }
                                                        data-testid="row-content"
                                                    >
                                                        <td
                                                            className="ck-content"
                                                            colSpan="4"
                                                            dangerouslySetInnerHTML={{
                                                                __html: task.description,
                                                            }}
                                                        ></td>
                                                    </tr>
                                                </React.Fragment>)
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <RightChecklistComponent expandedTask={expandedTask} onFavoritedTask={handleFavoritedTask} onUpdateExpandTask={handleUpdateExpandTask} />
        </div >
    )
}

export default ChecklistComponent;
