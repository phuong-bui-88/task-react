import BaseService from "./BaseService";

const baseService = new BaseService();

const getTasks = async (checklistId) => {
    return baseService.get("/api/checklists/" + checklistId + "/tasks");
};

const getTask = async (checklistId, taskId) => {
    return baseService.get(
        "/api/checklists/" + checklistId + "/tasks/" + taskId
    );
};

const storeTask = async (checklistId, formData) => {
    return baseService.post(
        "/api/checklists/" + checklistId + "/tasks",
        formData
    );
};

const updateTask = async (task) => {
    return baseService.put(
        "/api/checklists/" + task.checklistId + "/tasks/" + task.id,
        { name: task.name, description: task.description }
    );
};

const completeTask = async (taskId, isCompleted) => {
    return baseService.put("/api/tasks/" + taskId + "/complete", {
        isCompleted: isCompleted,
    });
};

const favoriteTask = async (taskId, isFavorite) => {
    return baseService.put("/api/tasks/" + taskId + "/favorite", {
        isFavorite: isFavorite,
    });
};

const noteTask = async (taskId, note) => {
    return baseService.put("/api/tasks/" + taskId + "/note", { note: note });
};

// get favorite tasks
const getFavoriteTasks = async () => {
    return baseService.get("/api/favorite-tasks");
};

const remindAtTask = async (taskId, remindAt) => {
    return baseService.put("/api/tasks/" + taskId + "/remind-at", {
        remindAt: remindAt,
    });
};

// post to due date task
const dueDateTask = async (taskId, dueDate) => {
    return baseService.put("/api/tasks/" + taskId + "/due-date", {
        dueDate: dueDate,
    });
};

const destroyTask = async (task) => {
    return baseService.delete(
        "/api/checklists/" + task.checklistId + "/tasks/" + task.id
    );
};

export default {
    getTasks,
    getFavoriteTasks,
    getTask,
    storeTask,
    updateTask,
    completeTask,
    remindAtTask,
    favoriteTask,
    noteTask,
    dueDateTask,
    destroyTask,
};
