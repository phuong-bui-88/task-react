import React, { useState, useEffect } from "react";

import { useNavigate, Link } from 'react-router-dom';


// https://mui.com/material-ui/material-icons/?query=Dash
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ChecklistGroupService from "../services/ChecklistGroupService.js";

function LeftSidebarComponent({ checklistGroups, pages }) {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));


    // const handleClick = () => {
    //     setIsActive(!isActive)
    // };

    const handleChecklistGroupClick = (id) => {
        setIsActive((prevIsActive) => ({
          ...prevIsActive,
          [id]: !prevIsActive[id]
        }));
    }

    return (
        <div>
            <ul className="sidebar-nav">
                <div data-simplebar="init" id="0">
                    <div className="simplebar-wrapper" style={{margin: '0px'}}>
                        <div className="simplebar-height-auto-observer-wrapper">
                            <div className="simplebar-height-auto-observer"></div>
                        </div>
                        <div className="simplebar-mask">
                            <div className="simplebar-offset" style={{right: '0px', bottom: '0px'}}>
                                <div className="simplebar-content-wrapper" tabIndex="0" role="region"
                                     aria-label="scrollable content" style={{height: 'auto', 'overflow': 'hidden'}}>
                                    <div className="simplebar-content" style={{padding: '0px'}}>
                                        <li className="nav-item">
                                            <a className="nav-link active" href="#/dashboard" aria-current="page">

                                                <DashboardCustomizeIcon className="pe-1"/>
                                                Dashboard<span className="badge bg-info ms-auto">NEW</span></a>
                                        </li>

                                        {user && user.is_admin ? (
                                                <div>
                                                    <li className="nav-title">Manager checklist</li>
                                                    { checklistGroups && checklistGroups.map((checklistGroup) => (
                                                        <li className={`nav-group show ${isActive[checklistGroup.id] ? 'show' : ''}`} key={checklistGroup.id}>
                                                            {/*<a className="nav-link nav-group-toggle" onClick={() => handleChecklistGroupClick(checklistGroup.id)}>*/}
                                                            <Link className="nav-link" to={`/admin/checklist-groups/${checklistGroup.id}/edit`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                     viewBox="0 0 512 512"
                                                                     className="nav-icon" role="img">
                                                                    <path fill="var(--ci-primary-color, currentColor)"
                                                                          d="M491.693,256.705l-54.957-49.461,16.407-13.406a80.491,80.491,0,0,0,18.363-21.522c18.148-31.441,12.867-70.042-13.144-96.052S393.75,44.973,362.311,63.122a80.513,80.513,0,0,0-21.52,18.362L327.383,97.891,277.922,42.935l-.579-.611a24.028,24.028,0,0,0-33.941,0l-65.6,65.605,1.19,23.7L212.1,158.685a48.6,48.6,0,0,1,11.079,12.889c10.807,18.722,7.57,41.8-8.056,57.426s-38.7,18.862-57.426,8.058a48.66,48.66,0,0,1-12.9-11.086l-27.047-33.1-23.7-1.189-71.26,71.26a24,24,0,0,0,0,33.942L198.147,472.244a80,80,0,0,0,113.138,0L492.3,291.225a24.029,24.029,0,0,0,0-33.94ZM288.657,449.617a48,48,0,0,1-67.883,0L51.069,279.911l53.1-53.095,15.91,19.473.1.119a80.487,80.487,0,0,0,21.521,18.363c31.441,18.149,70.041,12.867,96.052-13.144s31.291-64.61,13.143-96.05a80.482,80.482,0,0,0-18.363-21.521l-19.591-16.01,47.124-47.124,56.018,62.241,24.282-.579,25.062-30.67a48.611,48.611,0,0,1,12.888-11.078c18.722-10.807,41.8-7.569,57.426,8.056s18.864,38.7,8.057,57.426a48.591,48.591,0,0,1-11.079,12.889l-30.67,25.061-.58,24.282,62.243,56.018Z"
                                                                          className="ci-primary"></path>
                                                                </svg>
                                                                {checklistGroup.name}
                                                            </Link>
                                                            {/*</a>*/}

                                                            <ul className="nav-group-items" key={checklistGroup.id + '-checklist'}>
                                                                {
                                                                    checklistGroup.checklists && checklistGroup.checklists.map((checklist) => (
                                                                        <li className="nav-item" key={checklist.id}>
                                                                            <Link className="nav-link " to={`/admin/checklist-groups/${checklistGroup.id}/checklists/${checklist.id}/edit`}>
                                                                                {checklist.name}
                                                                            </Link>
                                                                        </li>
                                                                    ))
                                                                }

                                                                <li className="nav-item">
                                                                    <Link className="nav-link" to={`/admin/checklist-groups/${checklistGroup.id}/checklists/create`}>
                                                                        Create new check list
                                                                    </Link>
                                                                </li>
                                                            </ul>

                                                        </li>
                                                    ))}

                                                    <li className="nav-item">
                                                        <Link to="/admin/checklist-groups/create" className="nav-link">New
                                                            checklist group</Link>
                                                    </li>

                                                    <li className="nav-title">Pages</li>
                                                    { pages && pages.map((page) => (
                                                        <li className={`nav-group show`} key={page.id}>
                                                            <Link className="nav-link" to={`/admin/pages/${page.id}/edit`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                     viewBox="0 0 512 512"
                                                                     className="nav-icon" role="img">
                                                                    <path fill="var(--ci-primary-color, currentColor)"
                                                                          d="M491.693,256.705l-54.957-49.461,16.407-13.406a80.491,80.491,0,0,0,18.363-21.522c18.148-31.441,12.867-70.042-13.144-96.052S393.75,44.973,362.311,63.122a80.513,80.513,0,0,0-21.52,18.362L327.383,97.891,277.922,42.935l-.579-.611a24.028,24.028,0,0,0-33.941,0l-65.6,65.605,1.19,23.7L212.1,158.685a48.6,48.6,0,0,1,11.079,12.889c10.807,18.722,7.57,41.8-8.056,57.426s-38.7,18.862-57.426,8.058a48.66,48.66,0,0,1-12.9-11.086l-27.047-33.1-23.7-1.189-71.26,71.26a24,24,0,0,0,0,33.942L198.147,472.244a80,80,0,0,0,113.138,0L492.3,291.225a24.029,24.029,0,0,0,0-33.94ZM288.657,449.617a48,48,0,0,1-67.883,0L51.069,279.911l53.1-53.095,15.91,19.473.1.119a80.487,80.487,0,0,0,21.521,18.363c31.441,18.149,70.041,12.867,96.052-13.144s31.291-64.61,13.143-96.05a80.482,80.482,0,0,0-18.363-21.521l-19.591-16.01,47.124-47.124,56.018,62.241,24.282-.579,25.062-30.67a48.611,48.611,0,0,1,12.888-11.078c18.722-10.807,41.8-7.569,57.426,8.056s18.864,38.7,8.057,57.426a48.591,48.591,0,0,1-11.079,12.889l-30.67,25.061-.58,24.282,62.243,56.018Z"
                                                                          className="ci-primary"></path>
                                                                </svg>
                                                                {page.title}
                                                            </Link>
                                                        </li>
                                                    )) }
                                                </div>
                                            )
                                            : ''}


                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="simplebar-placeholder" style={{width: 'auto', height: '790px'}}></div>
                    </div>

                    <div className="simplebar-track simplebar-vertical" style={{visibility: 'hidden'}}>
                        <div className="simplebar-scrollbar" style={{height: '0px', display: 'none'}}></div>
                    </div>
                </div>
            </ul>
            <button className="sidebar-toggler d-none d-lg-flex"></button>
        </div>
    )
}

export default LeftSidebarComponent
