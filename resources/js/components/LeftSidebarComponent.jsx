import React from "react";


// https://mui.com/material-ui/material-icons/?query=Dash
import LeftSidebarAdminComponent from "./admin/LeftSidebarAdminComponent.jsx";
import LeftSidebarUserComponent from "./user/LeftSidebarUserComponent.jsx";

function LeftSidebarComponent({ checklistGroups, analyticChecklistGroups, user, pages }) {

    return (
        <div>
            <ul className="sidebar-nav">
                <div data-simplebar="init" id="0">
                    <div className="simplebar-wrapper" style={{ margin: '0px' }}>
                        <div className="simplebar-height-auto-observer-wrapper">
                            <div className="simplebar-height-auto-observer"></div>
                        </div>
                        <div className="simplebar-mask">
                            <div className="simplebar-offset" style={{ right: '0px', bottom: '0px' }}>
                                <div className="simplebar-content-wrapper" tabIndex="0" role="region"
                                    aria-label="scrollable content" style={{ height: 'auto', 'overflow': 'hidden' }}>
                                    <div className="simplebar-content" style={{ padding: '0px' }}>
                                        {user && user.is_admin ? (
                                            <LeftSidebarAdminComponent checklistGroups={checklistGroups} pages={pages} />
                                        ) : (
                                            <>
                                                <LeftSidebarUserComponent checklistGroups={checklistGroups} analyticChecklistGroups={analyticChecklistGroups} />
                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="simplebar-placeholder" style={{ width: 'auto', height: '790px' }}></div>
                    </div>

                    <div className="simplebar-track simplebar-vertical" style={{ visibility: 'hidden' }}>
                        <div className="simplebar-scrollbar" style={{ height: '0px', display: 'none' }}></div>
                    </div>
                </div>
            </ul>
            <button className="sidebar-toggler d-none d-lg-flex"></button>
        </div>
    )
}

export default LeftSidebarComponent
