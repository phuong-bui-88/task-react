import CheckBoxIcon from '@mui/icons-material/CheckBox';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LightModeIcon from '@mui/icons-material/LightMode';
import TaskService from '@services/TaskService';
import TokenService from '@services/TokenService';
import React, { useEffect, useState } from 'react';

const RightChecklistComponent = ({ expandedTask, onFavoritedTask }) => {
    const [date, setDate] = useState(null);
    const [expandedNote, setExpandedNote] = useState(false);
    const [note, setNote] = useState('');

    const dateType = {
        TODAY: 'Today',
        TOMORROW: 'Tomorrow',
        NEXT_WEEK: 'Next Week',
        PICK_A_DATE: 'Or pick a date'
    }

    useEffect(() => {
        if (!expandedTask.task) return;

        if (expandedTask.task.due_date) {
            setDate(new Date(expandedTask.task.due_date));
        }

        if (expandedTask.task.note) {
            setNote(expandedTask.task.note);
        }
    }, [expandedTask]);

    const addRemainMe = (type, event) => {
        let dateValue = new Date();

        if (type === dateType.TODAY) {
            setDate(dateValue);
        }

        if (type === dateType.TOMORROW) {
            dateValue.setDate(dateValue.getDate() + 1);
            setDate(dateValue);
        }

        if (type === dateType.NEXT_WEEK) {
            dateValue.setDate(dateValue.getDate() + 7);
            setDate(dateValue);
        }

        if (type === dateType.PICK_A_DATE) {
            let dateValue = new Date(event.target.value);
            setDate(dateValue);
        }

        let token = TokenService.getToken();
        TaskService.dueDateTask(expandedTask.task.id, dateValue, token);
    }

    const removeRemainMe = () => {
        setDate(null);
        let token = TokenService.getToken();
        TaskService.dueDateTask(expandedTask.task.id, null, token);
    }

    const showNoteTask = (e) => {
        e.preventDefault();
        setExpandedNote(!expandedNote);
    }

    const saveNote = () => {
        let note = document.getElementById('note-task').value;
        let token = TokenService.getToken();
        TaskService.noteTask(expandedTask.task.id, note, token);
        setExpandedNote(false);
    }

    const changeNote = (e) => {
        setNote(e.target.value);
    }

    return expandedTask.status && (
        <div className='col-4'>
            <div className="card m-3">
                <div className="card-body">
                    <div className="text-medium-emphasis">
                        {expandedTask.task.name}

                        <a className='float-end info-color' onClick={(e) => onFavoritedTask(e, expandedTask.task, expandedTask.index)}>
                            {expandedTask.task.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </a>
                    </div>
                </div>
            </div>

            <div className="card m-3">
                <div className="card-body">
                    <div>
                        <a onClick={(e) => onFavoritedTask(e, expandedTask.task, expandedTask.index)}>
                            <LightModeIcon className='info-color me-3' />
                            Add to My Day
                        </a>
                    </div>
                </div>
            </div>

            <div className="card m-3">
                <div className="card-body">
                    <div>
                        <EmailIcon className="info-color me-3" />
                        Remain me
                    </div>
                    <hr className="border-2 border-secondary" />
                    <div>
                        <div>
                            <CheckBoxIcon className="info-color me-3" />
                            {(date == null) ? 'Add Due Date' : (
                                <div className='d-inline'>
                                    {date.toDateString()}
                                    <a className='ms-2' onClick={() => removeRemainMe()}>Remove</a>
                                </div>
                            )}
                        </div>
                        {(date == null) && (
                            <div>
                                <div className="col" onClick={() => addRemainMe(dateType.TODAY)}>
                                    <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                    Today
                                </div>
                                <div className="col" onClick={() => addRemainMe(dateType.TOMORROW)}>
                                    <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                    Tomorrow
                                </div>
                                <div className="col" onClick={() => addRemainMe(dateType.NEXT_WEEK)}>
                                    <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                    Next Week
                                </div>
                                <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                Or pick a date
                                <input type="date" name="date" min={new Date().toISOString().substr(0, 10)} className="ms-5"
                                    onChange={(event) => addRemainMe(dateType.PICK_A_DATE, event)} />
                            </div>
                        )}
                    </div>
                </div>
            </div >

            <div className='card m-3'>
                <div className="card-body">
                    <a href="#" className="info-color" onClick={(e) => showNoteTask(e)}>
                        Note
                    </a>
                    {(expandedNote) ?
                        <div>
                            <textarea className="form-control mt-3" id="note-task" rows="3" onChange={(e) => changeNote(e)} value={note}></textarea>
                            <button type="button" className="btn btn-primary mt-3 btn-info" onClick={saveNote}>Save</button>
                        </div>
                        :
                        <div>
                            {note}
                            {(note) && <a href="#" className="d-block info-color" onClick={(e) => showNoteTask(e)}>Edit</a>}
                        </div>
                    }
                </div>
            </div>
        </div >
    );
};

export default RightChecklistComponent;
