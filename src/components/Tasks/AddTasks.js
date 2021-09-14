import React, { useEffect, useState,useRef } from 'react';
import {Card, Button} from 'react-bootstrap'
import './AddTask.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit,faTrashAlt,faSave} from '@fortawesome/free-solid-svg-icons';
import { useDrag, useDrop } from "react-dnd";
import itemTypes from '../../utils/Types';

const AddTasks = (props) => {
    const {index, item,deleteTask,editTask,moveItem,handleChange,addTask,showTask,editTaskToggle} = props;

    const [title,setTitle] = useState()
    const [taskShow, setTaskShow] = useState(showTask)

    const ref = useRef(null);
    const [, drop] = useDrop({
        accept: itemTypes.TASK,
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoveredRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
            const mousePosition = monitor.getClientOffset();
            const hoverClientY = mousePosition.y - hoveredRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: itemTypes.TASK,
        item: { type: itemTypes.TASK, ...item, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });
    drag(drop(ref));
    
    const handleEdit = () => {
        editTask(item.id)
    }

    const handleDelete = () => {
        deleteTask(item.id)
    }
    
    return (
        <div>
            <Card
                className="task-card"
                ref={ref}
                style={{ opacity: isDragging ? 0.3 : 1 }}
            >
                <Card.Body className="task-card-body">
                    <Card.Title className="todos-title">
                        {item.task}
                        <div>
                            <button
                                onClick={handleEdit}
                                className="button"
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="button delete"
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </div>
                    </Card.Title>
                </Card.Body>
            </Card>
        </div>
    )
}

export default AddTasks
