import React, { useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import CheckListService from "../../services/CheckListService.js";

function ChecklistComponent({ token }) {
    const { checklistId } = useParams();
    const [ checklist, setChecklist ] = useState(null);

    useEffect(() => {
        const fetchChecklist = async (checklistId) => {
            const response = await CheckListService.showChecklist(checklistId, token);
            setChecklist(response);
        }

        fetchChecklist(checklistId);
    }, [checklistId]);

    return checklist ? (
        <div>
            <h1>{ checklist. id } { checklist.name } </h1>
        </div>
    ) : ''
}

export default ChecklistComponent
