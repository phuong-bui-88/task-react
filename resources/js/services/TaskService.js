import axios from "axios";

const getTasks = async (checklistId, token) => {
    const response = await axios.get(
        "/api/checklists/" + checklistId + "/tasks",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
};

const getTask = async (checklistId, taskId, token) => {
    // try {
    const response = await axios.get(
        "/api/checklists/" + checklistId + "/tasks/" + taskId,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
    // } catch (error) {
    //     throw error.response.data;
    // }
};

const storeTask = async (checklistId, formData, token) => {
    const response = await axios.post(
        "/api/checklists/" + checklistId + "/tasks",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

const updateTask = async (task, token) => {
    const response = await axios.put(
        "/api/checklists/" + task.checklistId + "/tasks/" + task.id,
        { name: task.name, description: task.description },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

const completeTask = async (taskId, isCompleted, token) => {
    const response = await axios.put(
        "/api/tasks/" + taskId + "/complete",
        { isCompleted: isCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

const destroyTask = async (task, token) => {
    const response = await axios.delete(
        "/api/checklists/" + task.checklistId + "/tasks/" + task.id,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export default {
    getTasks,
    getTask,
    storeTask,
    updateTask,
    completeTask,
    destroyTask,
};
