import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ExampleComponent from "../components/ExampleComponent.jsx";
import RegisterComponent from "../components/RegisterComponent.jsx";
import LoginComponent from "../components/LoginComponent.jsx";
import LeftSidebarComponent from "../components/LeftSidebarComponent.jsx";
import HeaderSidebarComponent from "../components/HeaderSidebarComponent.jsx";
import CreateChecklistGroupComponent from "../components/admin/CreateChecklistGroupComponent.jsx";
import EditChecklistGroupComponent from "../components/admin/EditChecklistGroupComponent.jsx";
import EditTaskComponent from "../components/admin/EditTaskComponent.jsx";

import ChecklistGroupService from "../services/ChecklistGroupService.js";
import { useNavigate } from "react-router-dom";
import CreateChecklistComponent from "../components/admin/CreateChecklistComponent.jsx";
import CheckListService from "../services/CheckListService.js";
import EditChecklistComponent from "../components/admin/EditChecklistComponent.jsx";

import TaskService from "../services/TaskService.js";
import PageService from "../services/PageService.js";
import UserService from "../services/UserService.js";

import EditPageComponent from "../components/admin/EditPageComponent.jsx";
import PageComponent from "../components/PageComponent.jsx";
import UserListComponent from "../components/admin/UserListComponent.jsx";
import ChecklistComponent from "../components/user/ChecklistComponent.jsx";

function AppLayout() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [checklistGroups, setChecklistGroups] = useState(null);
    const [pages, setPages] = useState();
    const [checklist, setChecklist] = useState(null);
    const [leftSidebarActive, setLeftSidebarActive] = useState(true);

    const token = localStorage.getItem("token");

    function handleLeftSibarActive() {
        setLeftSidebarActive(!leftSidebarActive);
    }

    const createChecklistGroup = async (formJson) => {
        const responseData = await ChecklistGroupService.storeChecklistGroup(
            formJson,
            token
        );

        fetchChecklistGroups();

        // navigate('/home');
    };

    const createChecklist = async (checklistGroupId, formJson) => {
        const responseData = await CheckListService.storeChecklist(
            checklistGroupId,
            formJson,
            token
        );

        fetchChecklistGroups();

        navigate("/home");
    };

    const createTask = async (checklistId, formJson) => {
        const responseData = await TaskService.storeTask(
            checklistId,
            formJson,
            token
        );
    };

    const editChecklistGroup = async (checklistGroup) => {
        const responseData = await ChecklistGroupService.updateChecklistGroup(
            checklistGroup,
            token
        );

        fetchChecklistGroups();

        navigate("/home");
    };

    const editChecklist = async (checklist) => {
        const responseData = await CheckListService.updateChecklist(
            checklist.checklistGroupId,
            checklist,
            token
        );

        fetchChecklistGroups();

        navigate("/home");
    };

    const editTask = async (task) => {
        const responseData = await TaskService.updateTask(task, token);

        navigate(-1);
    };

    const editPage = async (page) => {
        const responseData = await PageService.updatePage(page, token);
        fetchPages();
        navigate("/home");
    };

    const deleteChecklistGroup = async (checklistGroup) => {
        const responseData = await ChecklistGroupService.destroyChecklistGroup(
            checklistGroup,
            token
        );

        fetchChecklistGroups();

        navigate("/home");
    };

    const deleteChecklist = async (checklist) => {
        const responseData = await CheckListService.destroyChecklist(
            checklist.checklistGroupId,
            checklist,
            token
        );

        fetchChecklistGroups();

        navigate("/home");
    };

    const deleteTask = async (taskData) => {
        const responseData = await TaskService.destroyTask(taskData, token);
    };

    const fetchChecklistGroups = async (isUser = false) => {
        const response = await ChecklistGroupService.getChecklistGroups(
            isUser,
            token
        );
        setChecklistGroups(response);
    };

    const fetchPages = async () => {
        const response = await PageService.getPages(token);
        setPages(response);
    };

    const fetchChecklist = async (checklistId) => {
        const response = await CheckListService.getChecklist(
            checklistId,
            token
        );
        setChecklist(response);
    };

    const handleCountUserCompletedTasks = (checklistGroupId, checklistId) => {
        let { groupIndex, checklistIndex } =
            ChecklistGroupService.findIndexesByChecklistIdAndGroupId(
                checklistGroups,
                checklistGroupId,
                checklistId
            );

        let newValue =
            checklistGroups[groupIndex].checklists[checklistIndex]
                .count_user_completed_tasks + 1;

        setChecklistGroups((prevChecklistGroups) => {
            const updatedGroups = [...prevChecklistGroups];
            updatedGroups[groupIndex] = {
                ...updatedGroups[groupIndex],
                checklists: [
                    ...updatedGroups[groupIndex].checklists.map(
                        (checklist, index) =>
                            index === checklistIndex
                                ? {
                                      ...checklist,
                                      count_user_completed_tasks: newValue,
                                  }
                                : checklist
                    ),
                ],
            };
            return updatedGroups;
        });
    };

    useEffect(() => {
        const fetchUser = async (token) => {
            const response = await UserService.getUser(token);
            setUser(response);
        };

        token && fetchUser(token);
    }, [token]);

    useEffect(() => {
        if (!user) {
            return;
        }

        if (user.is_admin) {
            fetchChecklistGroups();
        } else {
            fetchChecklistGroups(true);
        }
        fetchPages();
    }, [user]);

    return (
        <div>
            {user && (
                <div
                    className={`sidebar sidebar-fixed ${
                        !leftSidebarActive ? "hide" : ""
                    }`}
                    style={{ height: "100%", overflow: "hidden scroll" }}
                >
                    <LeftSidebarComponent
                        checklistGroups={checklistGroups}
                        user={user}
                        pages={pages}
                    />
                </div>
            )}

            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                {user && (
                    <div className="header header-sticky mb-4">
                        <HeaderSidebarComponent
                            onLeftSibarActive={handleLeftSibarActive}
                            user={user}
                        />
                    </div>
                )}

                <Routes>
                    <Route
                        path="/welcome"
                        element={<PageComponent pageId={1} token={token} />}
                    />
                    <Route
                        path="/consulation"
                        element={<PageComponent pageId={2} token={token} />}
                    />
                    <Route
                        path="/admin/users"
                        element={<UserListComponent token={token} />}
                    />
                    <Route
                        path="/admin/pages/:pageId/edit"
                        element={<EditPageComponent onEditPage={editPage} />}
                    />
                    <Route
                        path="/checklists/:checklistId"
                        element={
                            <ChecklistComponent
                                token={token}
                                checklistGroups={checklistGroups}
                                onFetchChecklistGroup={fetchChecklistGroups}
                                onCountUserCompletedTasks={
                                    handleCountUserCompletedTasks
                                }
                            />
                        }
                    />
                    <Route
                        path="/admin/checklists/:checklistId/tasks/:taskId/edit"
                        element={
                            <EditTaskComponent
                                onEditTask={editTask}
                                token={token}
                            />
                        }
                    />
                    <Route
                        path="/admin/checklist-groups/:checklistGroupId/checklists/:checklistId/edit"
                        element={
                            <EditChecklistComponent
                                checklist={checklist}
                                onEditChecklist={editChecklist}
                                onDeleteChecklist={deleteChecklist}
                                onCreateTask={createTask}
                                onDeleteTask={deleteTask}
                                token={token}
                            />
                        }
                    />
                    <Route
                        path="/admin/checklist-groups/:checklistGroupId/edit"
                        element={
                            <EditChecklistGroupComponent
                                onEdit={editChecklistGroup}
                                onDelete={deleteChecklistGroup}
                                token={token}
                            />
                        }
                    />
                    <Route
                        path="/admin/checklist-groups/create"
                        element={
                            <CreateChecklistGroupComponent
                                onCreate={createChecklistGroup}
                                token={token}
                            />
                        }
                    />
                    <Route
                        path="/admin/checklist-groups/:checklistGroupId/checklists/create"
                        element={
                            <CreateChecklistComponent
                                onCreateChecklist={createChecklist}
                                token={token}
                            />
                        }
                    />
                    <Route path="/admin/page" element={<ExampleComponent />} />
                    <Route path="/register" element={<RegisterComponent />} />
                    <Route path="/login" element={<LoginComponent />} />
                </Routes>
            </div>
        </div>
    );
}

export default AppLayout;
