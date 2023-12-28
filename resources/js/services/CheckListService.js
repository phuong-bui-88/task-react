
import axios from "axios";


const getChecklist = async (checklistGroupId, checklistId, token) => {
    try {
        const response = await axios.get('/api/checklist-groups/' + checklistGroupId + '/checklists/' + checklistId, { headers: { Authorization: `Bearer ${token}` } });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

const showChecklist = async (checklistId, token) => {
    try {
        const response = await axios.get(`/api/checklists/${checklistId}`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

const storeChecklist = async (checklistGroupId, formData, token) => {
    try {
        const response = await axios.post('/api/checklist-groups/' + checklistGroupId + '/checklists', formData, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const updateChecklist = async (checklistGroupId, checklist, token) => {
    try {
        const response = await axios.put('/api/checklist-groups/' + checklistGroupId + '/checklists/' + checklist.id, { name: checklist.name}, { headers: { Authorization: `Bearer ${token}` } }   );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const updatePositionTask = async (checklistId, tasks, token) => {

    // try {
        const response = await axios.put('/api/checklists/' + checklistId + '/task-positions', {tasks: tasks}, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    // } catch (error) {
    //     throw error.response.data;
    // }
}

const destroyChecklist = async (checklistGroupId, checklist, token) => {
    try {
        const response = await axios.delete('/api/checklist-groups/' + checklistGroupId + '/checklists/' + checklist.id, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export default { getChecklist, showChecklist, storeChecklist, updateChecklist, updatePositionTask, destroyChecklist };
