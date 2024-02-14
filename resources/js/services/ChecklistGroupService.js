import axios from "axios";

/**
 * Retrieves checklist groups from the API.
 *
 * @param {boolean} isUser - Indicates whether to retrieve checklist groups for a specific user.
 * @param {string} token - The authentication token.
 * @returns {Promise<Array>} - A promise that resolves to an array of checklist groups.
 * @throws {Error} - If an error occurs while retrieving the checklist groups.
 */
const getChecklistGroups = async (isUser = false, token) => {
    try {
        let url = "/api/checklist-groups";
        if (isUser) {
            url += "?is_user=true";
        }

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const getChecklistGroup = async (id, token) => {
    try {
        const response = await axios.get("/api/checklist-groups/" + id, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

const storeChecklistGroup = async (formData, token) => {
    const response = await axios.post("/api/checklist-groups", formData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const updateChecklistGroup = async (checklistGroup, token) => {
    const response = await axios.put(
        "/api/checklist-groups/" + checklistGroup.id,
        { name: checklistGroup.name },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

const destroyChecklistGroup = async (checklistGroup, token) => {
    try {
        const response = await axios.delete(
            "/api/checklist-groups/" + checklistGroup.id,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export default {
    getChecklistGroups,
    getChecklistGroup,
    storeChecklistGroup,
    updateChecklistGroup,
    destroyChecklistGroup,
};
