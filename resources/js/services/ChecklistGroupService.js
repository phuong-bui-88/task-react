
import axios from "axios";

const getChecklistGroups = async () => {
    try {
        const response = await axios.get('/api/checklist-groups');
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

const getChecklistGroup = async (id) => {
    try {
        const response = await axios.get('/api/checklist-groups/' + id);
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

const storeChecklistGroup = async (formData) => {
    try {
        const response = await axios.post('/api/checklist-groups', formData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const updateChecklistGroup = async (checklistGroup) => {
    try {
        const response = await axios.put('/api/checklist-groups/' + checklistGroup.id, {'name': checklistGroup.name});
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const destroyChecklistGroup = async (checklistGroup) => {
    try {
        const response = await axios.delete('/api/checklist-groups/' + checklistGroup.id);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export default { getChecklistGroups, getChecklistGroup, storeChecklistGroup, updateChecklistGroup, destroyChecklistGroup };
