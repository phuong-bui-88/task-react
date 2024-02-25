import ChecklistIcon from '@mui/icons-material/Checklist';
import React from 'react';
import { Link } from 'react-router-dom';

const LeftSidebarRemindUserComponent = ({ analyticChecklistGroups }) => {
    return analyticChecklistGroups && (
        <ul className="nav-group-items">
            <li className="nav-item">
                <a href="#" className="nav-link ps-4">
                    <small>
                        <ChecklistIcon className="pe-2" />My Day
                        <span className="badge bg-info ms-2">0</span>
                    </small>
                </a>
            </li>
            <li className="nav-item">
                <Link className="nav-link ps-4" to={`/important`}>
                    <small>
                        <ChecklistIcon className="pe-2" />Important
                        <span className="badge bg-info ms-2">{analyticChecklistGroups.count_user_favorite}</span>
                    </small>
                </Link>
            </li>
            <li className="nav-item">
                <a href="#" className="nav-link ps-4">
                    <small>
                        <ChecklistIcon className="pe-2" />Planned
                        <span className="badge bg-info ms-2">0</span>
                    </small>
                </a>
            </li>
        </ul>
    )
};

export default LeftSidebarRemindUserComponent;
