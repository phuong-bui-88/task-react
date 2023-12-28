import React, { useState, useEffect } from "react";

import { useNavigate, Link } from 'react-router-dom';


// https://mui.com/material-ui/material-icons/?query=Dash
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import LeftSidebarAdminComponent from "./admin/LeftSidebarAdminComponent.jsx";
import LeftSidebarUserComponent from "./user/LeftSidebarUserComponent.jsx";

function LeftSidebarComponent({ checklistGroups, user, pages }) {
    const [isActive, setIsActive] = useState(false);

    const navigate = useNavigate();

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
                                            <LeftSidebarAdminComponent checklistGroups={checklistGroups} pages={pages} />
                                        ) : (
                                            <>
                                                <LeftSidebarUserComponent checklistGroups={checklistGroups} />
                                            </>
                                        ) }

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
