import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NoteIcon from '@mui/icons-material/Note';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LightModeIcon from '@mui/icons-material/LightMode';
import TaskService from '@services/TaskService';
import TokenService from '@services/TokenService';
import { format } from 'date-fns';
import 'flatpickr/dist/themes/material_blue.css';
import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';

const RightChecklistComponent = ({ expandedTask, onFavoritedTask, onUpdateExpandTask }) => {
    const dateType = {
        TODAY: 'Today',
        TOMORROW: 'Tomorrow',
        NEXT_WEEK: 'Next Week',
        PICK_A_DATE: 'Or pick a date'
    }

    const defaultTime = '08:00';
    const dateFormatValue = 'Y-m-d H:i';
    const dateFormatFullValue = 'yyyy-MM-dd HH:mm';

    const expandedType = {
        REMIND_AT: 'remind_at',
        DUE_DATE: 'due_date',
        NOTE: 'note',
    }

    const [dueDate, setDueDate] = useState(null);
    const [remindAt, setRemindAt] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [expanded, setExpanded] = useState({
        [expandedType.REMIND_AT]: false,
        [expandedType.DUE_DATE]: false,
        [expandedType.NOTE]: false,
    });

    const [note, setNote] = useState('');

    useEffect(() => {
        if (!expandedTask.task) return;

        setDueDate(null);
        setRemindAt(null);
        setNote('');

        if (expandedTask.task.due_date) {
            setDueDate(new Date(expandedTask.task.due_date));
        }

        if (expandedTask.task.remind_at) {
            setRemindAt(new Date(expandedTask.task.remainder_format));
        }

        if (expandedTask.task.note) {
            setNote(expandedTask.task.note);
        }
    }, [expandedTask]);

    const addDueDate = (type, event) => {
        let dateValue = new Date();

        if (type === dateType.TODAY) {
            setDueDate(dateValue);
        }

        if (type === dateType.TOMORROW) {
            dateValue.setDate(dateValue.getDate() + 1);
            setDueDate(dateValue);
        }

        if (type === dateType.NEXT_WEEK) {
            dateValue.setDate(dateValue.getDate() + 7);
            setDueDate(dateValue);
        }

        if (type === dateType.PICK_A_DATE) {
            dateValue = new Date(event.target.value);
            setDueDate(dateValue);
        }

        expandedTask.task.due_date = dateValue;
        onUpdateExpandTask(expandedTask);
        let token = TokenService.getToken();
        TaskService.dueDateTask(expandedTask.task.id, dateValue, token);
        expandedToggle(null, expandedType.DUE_DATE);
    }

    const removeDueDate = () => {
        setDueDate(null);
        let token = TokenService.getToken();
        expandedTask.task.due_date = null;
        onUpdateExpandTask(expandedTask);
        TaskService.dueDateTask(expandedTask.task.id, null, token);
    }

    const addRemindAt = (type, value, event = null) => {
        let dateValue = new Date();
        dateValue.setHours(defaultTime.split(':')[0], defaultTime.split(':')[1]);

        if (type === dateType.TODAY) {
            dateValue.setDate(dateValue.getDate() + 1);
            setRemindAt(dateValue);
        }

        if (type === dateType.TOMORROW) {
            // get date 0:00 and add default time
            dateValue.setDate(dateValue.getDate() + 1);
            setRemindAt(dateValue);
        }

        if (type === dateType.NEXT_WEEK) {
            dateValue.setDate(dateValue.getDate() + 7);
            setRemindAt(dateValue);
        }

        if (type === dateType.PICK_A_DATE) {
            event.preventDefault();
            setRemindAt(value);
            dateValue = value;
        }

        expandedTask.task.remind_at = dateValue;
        onUpdateExpandTask(expandedTask);
        let token = TokenService.getToken();
        TaskService.remindAtTask(expandedTask.task.id, dateValue, token);
        expandedToggle(null, expandedType.REMIND_AT);
    }

    const removeRemindAt = (e) => {
        e.preventDefault();
        setRemindAt(null);
        expandedTask.task.remaind_at = null;
        onUpdateExpandTask(expandedTask);
        let token = TokenService.getToken();
        TaskService.remindAtTask(expandedTask.task.id, null, token);
    }

    const expandedToggle = (e = null, type) => {
        if (e) e.preventDefault();
        setExpanded({ ...expanded, [type]: !expanded[type] })
    }

    const saveNote = () => {
        let note = document.getElementById('note-task').value;
        expandedTask.task.note = note;
        onUpdateExpandTask(expandedTask);
        let token = TokenService.getToken();
        TaskService.noteTask(expandedTask.task.id, note, token);
        expandedToggle(null, expandedType.NOTE);
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
                        <div>
                            <a href='#' onClick={(e) => expandedToggle(e, expandedType.REMIND_AT)} className='link-unstyled'>
                                <EmailIcon className="info-color me-3" />Remind me
                            </a>

                            {(remindAt != null) && (
                                <div className='d-block mt-2'>
                                    {format(new Date(remindAt), dateFormatFullValue)}
                                    <a className='ms-2' href="#" onClick={(e) => removeRemindAt(e)}>Remove</a>
                                </div>
                            )}
                        </div>
                        {(expanded[expandedType.REMIND_AT]) && (
                            <div>
                                <div className="col cursor-pointer" onClick={() => addRemindAt(dateType.TODAY)}>
                                    <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                    Today {defaultTime}
                                </div>
                                <div className="col cursor-pointer" onClick={() => addRemindAt(dateType.TOMORROW)}>
                                    <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                    Tomorrow {defaultTime}
                                </div>
                                <div className="col cursor-pointer" onClick={() => addRemindAt(dateType.NEXT_WEEK)}>
                                    <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                    Next Week {defaultTime}
                                </div>
                                <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                Or pick a date
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        dateFormat: dateFormatValue,
                                        time_24hr: true,
                                        theme: 'material_blue'
                                    }}
                                    onChange={(date) => setSelectedDate(date[0])}
                                    className="mt-1"
                                />
                                <button type="button" className="btn btn-primary ms-2 btn-info" onClick={(e) => addRemindAt(dateType.PICK_A_DATE, selectedDate, e)}>Save</button>
                            </div>
                        )}
                    </div>

                    <hr className="border-2 border-secondary" />
                    <div>
                        <div>
                            <a href='#' onClick={(e) => expandedToggle(e, expandedType.DUE_DATE)} className='link-unstyled'>
                                <CheckBoxIcon className="info-color me-3" />Add Due Date
                            </a>

                            {(dueDate != null) && (
                                <div className='d-block mt-2'>
                                    {dueDate.toDateString()}
                                    <a className='ms-2' href="#" onClick={() => removeDueDate()}>Remove</a>
                                </div>
                            )}
                        </div>
                        {(expanded[expandedType.DUE_DATE]) && (
                            <div>
                                <div className="col" onClick={() => addDueDate(dateType.TODAY)}>
                                    <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                    Today
                                </div>
                                <div className="col" onClick={() => addDueDate(dateType.TOMORROW)}>
                                    <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                    Tomorrow
                                </div>
                                <div className="col" onClick={() => addDueDate(dateType.NEXT_WEEK)}>
                                    <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                    Next Week
                                </div>
                                <FiberManualRecordIcon className="info-color ms-5 me-3" />
                                Or pick a date
                                <input type="date" name="date" min={new Date().toISOString().substr(0, 10)} className="ms-5"
                                    onChange={(event) => addDueDate(dateType.PICK_A_DATE, event)} />
                            </div>
                        )}
                    </div>
                </div>
            </div >

            <div className='card m-3'>
                <div className="card-body">
                    <a href='#' onClick={(e) => expandedToggle(e, expandedType.NOTE)} className='link-unstyled'>
                        <NoteIcon className="info-color me-3" />Note
                    </a>

                    {(expanded[expandedType.NOTE]) &&
                        <div>
                            <textarea className="form-control mt-3" id="note-task" rows="3" onChange={(e) => changeNote(e)} value={note}></textarea>
                            <button type="button" className="btn btn-primary mt-3 btn-info" onClick={saveNote}>Save</button>
                        </div>
                    }

                    {(!expanded[expandedType.NOTE]) &&
                        <div>
                            {note}
                            {(note) && <a href="#" className="d-block info-color" onClick={(e) => expandedToggle(e, expandedType.NOTE)}>Edit</a>}
                        </div>
                    }
                </div>
            </div>
        </div >
    );
};

export default RightChecklistComponent;
