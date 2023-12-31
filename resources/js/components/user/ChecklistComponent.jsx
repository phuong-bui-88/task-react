import React, { useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import CheckListService from "../../services/CheckListService.js";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ChecklistComponent({ token, onFetchChecklistGroup }) {
    const { checklistId } = useParams();
    const [ checklist, setChecklist ] = useState(null);

    const [expandedTasks, setExpandedTasks] = useState({});

    const toggleSlide = (index) => {
        setExpandedTasks((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    useEffect(() => {
        const fetchChecklist = async (checklistId) => {
            const response = await CheckListService.showChecklist(checklistId, token);
            setChecklist(response);
        }

        fetchChecklist(checklistId);
        onFetchChecklistGroup(true);
        setExpandedTasks({});
    }, [checklistId]);

    return checklist ? (
        <div>
            <div className="card m-3">
                <div className="card-header">
                    <h3>{checklist.name}</h3>
                </div>
                <div className="card-body">
                    <table className="table table-responsive">
                        <tbody>
                            {checklist.tasks.map((task, index) => (
                                <React.Fragment key={'row' + index}>
                                    <tr onClick={() => toggleSlide(index)}>
                                        <td className="w-75">{task.name}</td>
                                        <td className="align-middle">
                                            {expandedTasks[index] ? (
                                                <ExpandLessIcon/>
                                            ) : (
                                                <ExpandMoreIcon/>
                                            )}
                                        </td>
                                    </tr>
                                    <tr className={expandedTasks[index] ? '' : 'd-none'}>
                                        <td className="ck-content" colSpan="2" dangerouslySetInnerHTML={{ __html: task.description }}></td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ) : ''
}

export default ChecklistComponent
