import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
const CreateTask = (props) => {
    const {handleChange, addTask,editTaskToggle, status,token,task} = props;
    const [title,setTitle] = useState()

    const changeHandler = (e) => {
        handleChange(e.target.value)
    }

    return (
        <div>
            <div className="mt-20">
                <input type="text" name="tasks" className="input-box" value={task} onChange={changeHandler} />
            </div>
            {!editTaskToggle ?
                <Button
                    onClick={() => addTask(status,token)}
                    className="addTask mt-10">
                    +
                </Button>
                :
                <button
                    onClick={() => addTask(status)}
                    className="button mt-10"
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>
            }
        </div>
    )
}

export default CreateTask;