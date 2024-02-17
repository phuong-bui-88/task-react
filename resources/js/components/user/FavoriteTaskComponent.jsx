import React, { useEffect, useState } from "react";
import ChecklistComponent from "./ChecklistComponent";
import TaskService from "@services/TaskService";

const FavoriteTaskComponent = ({ onCountUserCompletedTasks, onUserFaviroteTasks, user }) => {
    const [tasks, setTasks] = useState(null);

    useEffect(() => {
        if (tasks) {
            return;
        }

        TaskService.getFavoriteTasks().then((response) => {
            setTasks(response);
        });
    });

    return tasks && (
        <ChecklistComponent tasksList={tasks} onCountUserCompletedTasks={onCountUserCompletedTasks} onUserFaviroteTasks={onUserFaviroteTasks} user={user} />
    );
};

export default FavoriteTaskComponent;