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
import { useNavigate } from 'react-router-dom';
import CreateChecklistComponent from "../components/admin/CreateChecklistComponent.jsx";
import CheckListService from "../services/CheckListService.js";
import EditChecklistComponent from "../components/admin/EditChecklistComponent.jsx";
import {formToJSON} from "axios";
import TaskService from "../services/TaskService.js";
import PageService from "../services/PageService.js";
import EditPageComponent from "../components/admin/EditPageComponent.jsx";
import PageComponent from "../components/PageComponent.jsx";

let count = 0

function AppLayout() {
    console.log('app layout ' + count++);
    const navigate = useNavigate();

    const [checklistGroups, setChecklistGroups] = useState(null);
    const [pages, setPages] = useState();
    const [checklist, setChecklist] = useState(null);


    const createChecklistGroup = async (formJson) => {
        const responseData = await ChecklistGroupService.storeChecklistGroup(formJson);

        fetchChecklistGroups();

        // navigate('/home');
    };

    const createChecklist = async (checklistGroupId, formJson) => {
        const responseData = await CheckListService.storeChecklist(checklistGroupId, formJson);

        fetchChecklistGroups();

        navigate('/home');
    };

    const createTask = async (checklistId, formJson) => {
        const responseData = await TaskService.storeTask(checklistId, formJson);
    }

    const editChecklistGroup = async (checklistGroup) => {
        const responseData = await ChecklistGroupService.updateChecklistGroup(checklistGroup);

        fetchChecklistGroups();

        navigate('/home');
    };

    const editChecklist = async (checklist) => {
        const responseData = await CheckListService.updateChecklist(checklist.checklistGroupId, checklist);

        fetchChecklistGroups();

        navigate('/home');
    };

    const editTask = async (task) => {
        const responseData = await TaskService.updateTask(task);

        navigate(-1);
    }

    const editPage = async (page) => {
        const responseData = await PageService.updatePage(page);
        fetchPages();
        navigate('/home');
    }

    const deleteChecklistGroup = async (checklistGroup) => {
        const responseData = await ChecklistGroupService.destroyChecklistGroup(checklistGroup);

        fetchChecklistGroups();

        navigate('/home');
    }

    const deleteChecklist = async (checklist) => {
        const responseData = await CheckListService.destroyChecklist(checklist.checklistGroupId, checklist);

        fetchChecklistGroups();

        navigate('/home');
    };

    const deleteTask = async (taskData) => {
        const responseData = await TaskService.destroyTask(taskData);
    }

    const fetchChecklistGroups = async () => {
        const response = await ChecklistGroupService.getChecklistGroups();
        setChecklistGroups(response);
        // console.log('t1');
    };

    const fetchPages = async () => {
        const response = await PageService.getPages();
        setPages(response);
    };

    const fetchChecklist = async (checklistId) => {
        const response = await CheckListService.getChecklist(checklistId);
        setChecklist(response);
    };



    useEffect(() => {
        fetchChecklistGroups();
        fetchPages();
    }, []);

    return (
        <div>
            <div className="sidebar sidebar-fixed" style={{ height: '100%', overflow: 'hidden scroll' }}>
                <LeftSidebarComponent checklistGroups={checklistGroups} pages={pages}/>
            </div>

            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <div className="header header-sticky mb-4">
                    <HeaderSidebarComponent/>
                </div>

                <Routes>
                    <Route path="/welcome"
                           element={<PageComponent pageId={1}/> } />
                    <Route path="/consulation"
                           element={<PageComponent pageId={2}/> } />
                    <Route path="/admin/pages/:pageId/edit"
                           element={<EditPageComponent onEditPage={editPage}/>} />
                    <Route path="/admin/checklists/:checklistId/tasks/:taskId/edit"
                           element={<EditTaskComponent onEditTask={editTask}/>} />
                    <Route path="/admin/checklist-groups/:checklistGroupId/checklists/:checklistId/edit"
                           element={<EditChecklistComponent checklist={checklist} onEditChecklist={editChecklist} onDeleteChecklist={deleteChecklist} onCreateTask ={createTask} onDeleteTask={deleteTask}/>}/>
                    <Route path="/admin/checklist-groups/:checklistGroupId/edit"
                           element={<EditChecklistGroupComponent onEdit={editChecklistGroup} onDelete={deleteChecklistGroup}/>}/>
                    <Route path="/admin/checklist-groups/create"
                           element={<CreateChecklistGroupComponent onCreate={createChecklistGroup}/>}/>
                    <Route path="/admin/checklist-groups/:checklistGroupId/checklists/create"
                           element={<CreateChecklistComponent onCreateChecklist={createChecklist}/>}/>
                    <Route path="/admin/page" element={<ExampleComponent/>}/>
                    <Route path="/register" element={<RegisterComponent/>}/>
                    <Route path="/login" element={<LoginComponent/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default AppLayout
