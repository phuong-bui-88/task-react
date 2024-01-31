import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

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
    const [analyticChecklistGroups, setAnalyticChecklistGroups] = useState(null);
    const [pages, setPages] = useState();
    const [leftSidebarActive, setLeftSidebarActive] = useState(true);

    const token = localStorage.getItem("token");

    function handleLeftSibarActive() {
        setLeftSidebarActive(!leftSidebarActive);
    }

    const fetchChecklistGroups = async (isUser = false) => {
        const response = await ChecklistGroupService.getChecklistGroups(
            isUser,
            token
        );
        setChecklistGroups(response.data);
        setAnalyticChecklistGroups(response.analytic);
    };

    const fetchPages = async () => {
        const response = await PageService.getPages(token);
        setPages(response);
    };

    const handleCountUserCompletedTasks = (checklistGroupId, checklistId, checked) => {
        let { groupIndex, checklistIndex } =
            ChecklistGroupService.findIndexesByChecklistId(
                checklistGroups,
                checklistId
            );

        let newValue =
            checklistGroups[groupIndex].checklists[checklistIndex]
                .count_user_completed_tasks + checked;

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

    const handleUserFaviroteTasks = (keyName, checked) => {
        let newValue = analyticChecklistGroups[keyName] + checked;

        setAnalyticChecklistGroups((prevState) => {
            return {
                ...prevState,
                [keyName]: newValue,
            }
        })
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
                        analyticChecklistGroups={analyticChecklistGroups}
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
                        element={<EditPageComponent onFetchPages={fetchPages} />}
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
                                onUserFaviroteTasks={
                                    handleUserFaviroteTasks
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
