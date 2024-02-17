import BaseService from "./BaseService";

const baseService = new BaseService();

/**
 * Retrieves checklist groups from the API.
 *
 * @param {boolean} isUser - Indicates whether to retrieve checklist groups for a specific user.
 * @param {string} token - The authentication token.
 * @returns {Promise<Array>} - A promise that resolves to an array of checklist groups.
 * @throws {Error} - If an error occurs while retrieving the checklist groups.
 */
const getChecklistGroups = async (isUser = false) => {
    let url = "/api/checklist-groups";
    if (isUser) {
        url += "?is_user=true";
    }

    return baseService.get(url, true);
};

const getChecklistGroup = async (id) => {
    return baseService.get("/checklist-groups/" + id);
};

const storeChecklistGroup = async (formData) => {
    return baseService.post("/api/checklist-groups", formData);
};

const updateChecklistGroup = async (checklistGroup) => {
    return baseService.put("/api/checklist-groups/" + checklistGroup.id, {
        name: checklistGroup.name,
    });
};

const destroyChecklistGroup = async (checklistGroup) => {
    return baseService.delete("/api/checklist-groups/" + checklistGroup.id);
};

export default {
    getChecklistGroups,
    getChecklistGroup,
    storeChecklistGroup,
    updateChecklistGroup,
    destroyChecklistGroup,
};
