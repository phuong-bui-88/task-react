
import axios from "axios";

const getTasks = async (checklistId) => {
    try {
        const response = await axios.get('/api/checklists/' + checklistId + '/tasks');
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

const getTask = async (checklistId ,taskId) => {
    // try {
        const response = await axios.get('/api/checklists/' + checklistId + '/tasks/' + taskId);
        return response.data.data;
    // } catch (error) {
    //     throw error.response.data;
    // }
}

const storeTask = async (checklistId, formData) => {
    try {
        const response = await axios.post('/api/checklists/' + checklistId + '/tasks', formData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const updateTask = async (task) => {
    try {
        const response = await axios.put('/api/checklists/' + task.checklistId + '/tasks/' + task.id, {name: task.name, description: task.description});
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


const destroyTask = async (task) => {
    try {
        const response = await axios.delete('/api/checklists/' + task.checklistId + '/tasks/' + task.id);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export default { getTasks, getTask, storeTask, updateTask, destroyTask };
