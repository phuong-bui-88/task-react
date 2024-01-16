import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ExampleComponent from "../components/ExampleComponent.jsx";
import HeaderSidebarComponent from "../components/HeaderSidebarComponent.jsx";
import LeftSidebarComponent from "../components/LeftSidebarComponent.jsx";
import LoginComponent from "../components/LoginComponent.jsx";
import RegisterComponent from "../components/RegisterComponent.jsx";
import CreateChecklistGroupComponent from "../components/admin/CreateChecklistGroupComponent.jsx";
import EditChecklistGroupComponent from "../components/admin/EditChecklistGroupComponent.jsx";
import EditTaskComponent from "../components/admin/EditTaskComponent.jsx";

import { useNavigate } from "react-router-dom";
import CreateChecklistComponent from "../components/admin/CreateChecklistComponent.jsx";
import EditChecklistComponent from "../components/admin/EditChecklistComponent.jsx";
import ChecklistGroupService from "../services/ChecklistGroupService.js";

import PageService from "../services/PageService.js";
import TaskService from "../services/TaskService.js";
import UserService from "../services/UserService.js";

import { useLocation } from "react-router-dom";
import PageComponent from "../components/PageComponent.jsx";
import EditPageComponent from "../components/admin/EditPageComponent.jsx";
import UserListComponent from "../components/admin/UserListComponent.jsx";
import ChecklistComponent from "../components/user/ChecklistComponent.jsx";

function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [checklistGroups, setChecklistGroups] = useState(null);
    const [pages, setPages] = useState();
    const [leftSidebarActive, setLeftSidebarActive] = useState(true);

    const token = localStorage.getItem("token");

    function handleLeftSibarActive() {
        setLeftSidebarActive(!leftSidebarActive);
    }

    const editPage = async (page) => {
        const responseData = await PageService.updatePage(page, token);
        fetchPages();
        navigate("/home");
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

    const handleCountUserCompletedTasks = (checklistGroupId, checklistId) => {
        let { groupIndex, checklistIndex } =
            ChecklistGroupService.findIndexesByChecklistId(
                checklistGroups,
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

        // or page is register or login

        if (!token && location.pathname != "/register") {
            UserService.logoutUser();
            setUser(null);
            navigate("/login");
        }

        if (token) {
            fetchUser(token);
        }
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
                    className={`sidebar de sidebar-fixed ${!leftSidebarActive ? "hide" : ""
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
                            onLogout={() => {
                                setUser(null);
                            }}
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
                        element={<EditPageComponent onEditPage={editPage} token={token} />}
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
                        element={<EditTaskComponent />}
                    />
                    <Route
                        path="/admin/checklist-groups/:checklistGroupId/checklists/:checklistId/edit"
                        element={
                            <EditChecklistComponent
                                onFetchChecklistGroups={fetchChecklistGroups}
                            />
                        }
                    />
                    <Route
                        path="/admin/checklist-groups/:checklistGroupId/edit"
                        element={
                            <EditChecklistGroupComponent
                                checklistGroups={checklistGroups}
                                onFetchChecklistGroups={fetchChecklistGroups}
                            />
                        }
                    />
                    <Route
                        path="/admin/checklist-groups/create"
                        element={
                            <CreateChecklistGroupComponent onFetchChecklistGroups={fetchChecklistGroups} />
                        }
                    />
                    <Route
                        path="/admin/checklist-groups/:checklistGroupId/checklists/create"
                        element={
                            <CreateChecklistComponent checklistGroups={checklistGroups} onFetchChecklistGroups={fetchChecklistGroups} />
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
