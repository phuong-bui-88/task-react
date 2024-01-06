import React, { useState, useEffect } from "react";

import { useNavigate, Link } from 'react-router-dom';


// https://mui.com/material-ui/material-icons/?query=Dash
import ChecklistIcon from '@mui/icons-material/Checklist';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

function LeftSidebarUserComponent({ checklistGroups }) {
    const [isActive, setIsActive] = useState(false);

    const handleChecklistGroupClick = (id) => {
        setIsActive((prevIsActive) => ({
          ...prevIsActive,
          [id]: !prevIsActive[id]
        }));
    }

    return (
        <div>
            { checklistGroups && checklistGroups.map((checklistGroup) => (
                <li key={checklistGroup.id}>
                    <div className={`nav-title show ${isActive[checklistGroup.id] ? 'show' : ''}`} >
                        {checklistGroup.name}

                        {checklistGroup.is_new && (
                            <span className="badge bg-info ms-2">NEW</span>
                        )}

                        {checklistGroup.is_update && (
                            <span className="badge bg-info ms-2">UPD</span>
                        )}
                    </div>
                    
                    <ul className="nav-group-items" key={checklistGroup.id + '-checklist'}>
                        {
                            checklistGroup.checklists && checklistGroup.checklists.map((checklist) => (
                                <li className="nav-item" key={checklist.id}>
                                    <Link className="nav-link ps-4" to={`/checklists/${checklist.id}`}>
                                        <ChecklistIcon className="pe-2"/>
                                        <small>
                                        {checklist.name}

                                        {(checklist.count_tasks) && (
                                            <span className="badge bg-info ms-2">{checklist.count_user_completed_tasks}/{checklist.count_tasks}</span>
                                        )}

                                        {checklist.is_new && (
                                            <span className="badge bg-info ms-2">NEW</span>
                                        )}

                                        {checklist.is_update && (
                                            <span className="badge bg-info ms-2">UPD</span>
                                        )}
                                        </small>
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </li>
            ))}
        </div>
    )
}

export default LeftSidebarUserComponent
