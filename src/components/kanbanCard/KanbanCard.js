import React,{useState,useEffect,useRef} from 'react'
import {Card,Button} from 'react-bootstrap';
import AddTasks from '../Tasks/AddTasks';
import './KanbanCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit,faTrashAlt,faSave} from '@fortawesome/free-solid-svg-icons';
import { useDrag, useDrop } from "react-dnd";
import itemTypes from '../../utils/Types';
import CreateTask from '../CreateTask/CreateTask';

const KanbanCard = (props) => {
    const { status, boards,item} = props;
    const [task,setTask] = useState('');
    const [taskItem , setTaskItem] = useState([]);
    const [editTaskToggle,setEditTaskToggle] = useState(false);
    const [tempId,setTempId] = useState(null);
    const [showTask, setShowTask]= useState(false);

    useEffect(() => {
        loadTasksFromLocalStorage();
    },[])

    const [{ isOver }, drop] = useDrop({
        accept: itemTypes.TASK,
        canDrop: (item, monitor) => {
            const itemIndex = boards.findIndex(i => i.header === item.status);
            const statusIndex = boards.findIndex(i => i.header === status);
            return [itemIndex + 1, itemIndex - 1, itemIndex].includes(statusIndex)
        },
        drop: (item, monitor) => {
            onDrop(item, monitor, status);
        },
        collect: monitor => ({
            isOver: monitor.isOver()
        })
    });

    const onDrop = (item, monitor, status) => {
        setTaskItem(prevState => {
            const newItems = prevState.filter(i => i.id !== item.id)
            .concat({ ...item, status })
            saveTasksToLocalStorage(newItems)
            return [ ...newItems ]
        });
        window.location.reload(true)
    };


    const moveItem = (dragIndex, hoverIndex) => {
        const item = taskItem[dragIndex];
        setTaskItem(prevState => {
            const newItems = prevState.filter((i, idx) => idx !== dragIndex);
            newItems.splice(hoverIndex, 0, item);
            saveTasksToLocalStorage(newItems)
            return [ ...newItems ]
        });
    };

    const handleChange = (val) => {
        setTask(val)
    }

    const taskEditHandler = (id) => {
        setShowTask(true)
        let editTodo = taskItem.find((elem) => {
            return elem.id === id
        })
        setEditTaskToggle(!editTaskToggle)
        setTask(editTodo.task)
        setTempId(id)
    }

    const addTask = (status, token) => {
        if(!task){
            alert("add some tasks")
        } else if(task && editTaskToggle) {
            let editedTask = taskItem.map((ele) => {
                if (ele.id === tempId) {
                    return { ...ele, task: task }
                }
                return ele
            })
            setTaskItem(editedTask)
            saveTasksToLocalStorage(editedTask)
            setEditTaskToggle(!editTaskToggle)
            setTask('')
            setTempId(null)
        }else {
            const inputTask = {id:new Date().getTime().toString(), task:task, status: status,tokenId: token} 
            let newTask = [...taskItem,inputTask]
            setTaskItem(newTask)
            saveTasksToLocalStorage(newTask)
            setTask("")
        }
    }

    const handleEdit = () => {
        props.setEdit(props.item.id)
    }

    const handleDelete = () => {
        props.handleDelete(props.item.id)
    }

    const deleteTask = (id) => {
        const updatedTask = taskItem.filter((ele) => {
            return ele.id !== id;
        })
        setTaskItem(updatedTask)
        saveTasksToLocalStorage(updatedTask)
    }
    const saveTasksToLocalStorage = (tasks) => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    
    const loadTasksFromLocalStorage = () => {
        let loadedTasks = localStorage.getItem("tasks");
        const token = localStorage.getItem('token')
        let tasks = JSON.parse(loadedTasks);
        if (tasks) {
            let tokenId = tasks.map(item => item.tokenId)
            if (tokenId[0] == token) {
                setTaskItem(tasks);
            } else {
                setTaskItem([])
            }
        }
    }

    const handleTasks = () => {
        setShowTask(true)
    }


    return (
            <div>
                <Card className="mr-10 todos" 
                ref={drop} 
                >
                    <Card.Title className="board-title">
                        <div className="text-center pd-5">
                            <h2>{props.item.header}</h2>
                        </div>
                    <div className="mt-19">
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
                    <Card.Body>
                        {taskItem
                            .filter(i => i.status === status)
                            .map((i, idx) => 
                            <AddTasks
                                key={idx}
                                item={i}
                                index={idx}
                                moveItem={moveItem}
                                status={status}                               
                                deleteTask={deleteTask}
                                editTask={taskEditHandler}
                            />)
                        }
                    {showTask ?
                        <CreateTask
                            handleChange={handleChange}
                            addTask={addTask}
                            editTaskToggle={editTaskToggle}
                            status={item.header}
                            token={item.tokenId}
                            task={task}
                        /> : ""}
                        <Button variant="outline-dark"
                            className="board-btn mt-10" 
                            onClick={handleTasks}>
                            Add Tasks
                        </Button>
                    </Card.Body>
                </Card>
                </div>
    )
}

export default KanbanCard;