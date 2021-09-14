import React from "react";
import { useDrop } from "react-dnd";
import itemTypes from "../../utils/Types";


const DropWrapper = ({ onDrop, children, status, boards }) => {
    const [{ isOver }, drop] = useDrop({
        accept: itemTypes.TASK,
        canDrop: (item, monitor) => {
            const itemIndex = boards.findIndex(si => si.header === item.status);
            const statusIndex = boards.findIndex(si => si.header === status);
            return [itemIndex + 1, itemIndex - 1, itemIndex].includes(statusIndex)
        },
        drop: (item, monitor) => {
            onDrop(item, monitor, status);
        },
        collect: monitor => ({
            isOver: monitor.isOver()
        })
    });

    return (
        <div ref={drop} >
            {React.cloneElement(children, { isOver })}
        </div>
    )
};

export default DropWrapper;