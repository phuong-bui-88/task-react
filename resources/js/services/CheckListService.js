
import axios from "axios";


const getChecklist = async (checklistGroupId, checklistId) => {
    try {
        const response = await axios.get('/api/checklist-groups/' + checklistGroupId + '/checklists/' + checklistId);
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

const storeChecklist = async (checklistGroupId, formData) => {
    try {
        const response = await axios.post('/api/checklist-groups/' + checklistGroupId + '/checklists', formData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const updateChecklist = async (checklistGroupId, checklist) => {
    try {
        const response = await axios.put('/api/checklist-groups/' + checklistGroupId + '/checklists/' + checklist.id, {name: checklist.name});
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const updatePositionTask = async (checklistId, tasks) => {
    // try {
        const response = await axios.put('/api/checklists/' + checklistId + '/task-positions', {tasks: tasks});
        return response.data;
    // } catch (error) {
    //     throw error.response.data;
    // }
}

const destroyChecklist = async (checklistGroupId, checklist) => {
    try {
        const response = await axios.delete('/api/checklist-groups/' + checklistGroupId + '/checklists/' + checklist.id);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export default { getChecklist, storeChecklist, updateChecklist, updatePositionTask, destroyChecklist };
