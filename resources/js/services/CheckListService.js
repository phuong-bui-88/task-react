import BaseService from "./BaseService";

const baseService = new BaseService();

const getChecklist = async (checklistGroupId, checklistId) => {
    return baseService.get(
        "/api/checklist-groups/" +
            checklistGroupId +
            "/checklists/" +
            checklistId
    );
};

const showChecklist = async (checklistId) => {
    return baseService.get("/api/checklists/" + checklistId);
};

const storeChecklist = async (checklistGroupId, formData) => {
    return baseService.post(
        "/api/checklist-groups/" + checklistGroupId + "/checklists",
        formData
    );
};

const updateChecklist = async (checklistGroupId, checklist) => {
    return baseService.put(
        "/api/checklist-groups/" +
            checklistGroupId +
            "/checklists/" +
            checklist.id,
        { name: checklist.name }
    );
};

const updatePositionTask = async (checklistId, tasks) => {
    return baseService.put(
        "/api/checklists/" + checklistId + "/task-positions",
        { tasks: tasks }
    );
};

const destroyChecklist = async (checklistGroupId, checklist) => {
    return baseService.delete(
        "/api/checklist-groups/" +
            checklistGroupId +
            "/checklists/" +
            checklist.id
    );
};

export default {
    getChecklist,
    showChecklist,
    storeChecklist,
    updateChecklist,
    updatePositionTask,
    destroyChecklist,
};
