import React, {useState, useEffect} from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {Link} from "react-router-dom";


const TaskListComponent = ({checklistId, tasks, onUpdatePositionTask, onDeletedTaskSubmit}) => {
    const [tasksList, setTasksList] = useState(tasks);

    useEffect(() => {
        setTasksList(tasks);
    }, [tasks]);

     const handleDragEnd = async (result) => {
         // Handle the drag end event here
         if (!result.destination) return; // Item was dropped outside a valid droppable area

         const updatedItems = Array.from(tasksList);
         const [reorderedItem] = updatedItems.splice(result.source.index, 1);
         updatedItems.splice(result.destination.index, 0, reorderedItem);
         setTasksList(updatedItems);
         onUpdatePositionTask(updatedItems);
     };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <table className="table table-responsive-sm">
                <Droppable droppableId="taskList" type="TASK">
                    {(provided) => (
                        <tbody ref={provided.innerRef} {...provided.droppableProps}>
                        {tasksList.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                {(provided) => (
                                    <tr
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        key={item.id}
                                    >
                                        <td>
                                            { item.name }
                                        </td>
                                        <td>
                                            <Link className="btn btn-primary me-3" to={`/admin/checklists/${checklistId}/tasks/${item.id}/edit`}>Edit</Link>

                                            <form method="POST" onSubmit={(e) => onDeletedTaskSubmit(e, item)} className="d-inline-block">
                                                <button className="btn btn-danger" type="submit">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        </tbody>
                    )}
                </Droppable>
            </table>
        </DragDropContext>
    );
}

export default TaskListComponent;
