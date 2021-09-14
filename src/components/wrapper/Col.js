import React from "react";

const Col = ({ isOver, children }) => {

    return (
        <div style={{backgroundColor: isOver ? "#223754" : "#132743"}}>
            {children}
        </div>
    );
};

export default Col;