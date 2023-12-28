
import axios from "axios";

const getChecklistGroups = async (isUser = false, token) => {
    try {
        let url = '/api/checklist-groups';
        if (isUser) {
            url += '?is_user=true';
        }

        const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

const getChecklistGroup = async (id, token) => {
    try {
        const response = await axios.get('/api/checklist-groups/' + id, { headers: { 'Authorization': `Bearer ${token}` } });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

const storeChecklistGroup = async (formData, token) => {
    try {
        const response = await axios.post('/api/checklist-groups', formData, { headers: { 'Authorization': `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const updateChecklistGroup = async (checklistGroup, token) => {
    try {
        const response = await axios.put('/api/checklist-groups/' + checklistGroup.id, {'name': checklistGroup.name}, { headers: { 'Authorization': `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const destroyChecklistGroup = async (checklistGroup, token) => {
    try {
        const response = await axios.delete('/api/checklist-groups/' + checklistGroup.id, { headers: { 'Authorization': `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export default { getChecklistGroups, getChecklistGroup, storeChecklistGroup, updateChecklistGroup, destroyChecklistGroup };
