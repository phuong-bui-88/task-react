import React, { useEffect, useState } from "react";
import ChecklistComponent from "./ChecklistComponent";
import TaskService from "@services/TaskService";
import TokenService from "@services/TokenService";

const FavoriteTaskComponent = ({ onCountUserCompletedTasks, onUserFaviroteTasks }) => {
    const [tasks, setTasks] = useState(null);

    useEffect(() => {
        if (tasks) {
            return;
        }
        ``
        let token = TokenService.getToken();
        TaskService.getFavoriteTasks(token).then((response) => {
            setTasks(response);
        });
    });

    return tasks && (
        <ChecklistComponent tasksList={tasks} onCountUserCompletedTasks={onCountUserCompletedTasks} onUserFaviroteTasks={onUserFaviroteTasks} />
    );
};

export default FavoriteTaskComponent;