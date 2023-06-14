import React, { useState, useEffect, useRef} from "react";

import InstructionWindow from './InstructionWindow'

export function PlannerInstructions({
    visible,
    setVisible
}) {
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setVisible(false);
            }
        }

        const showInstructions = localStorage.getItem('showInstructions');
        setVisible(showInstructions !== 'true');

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setVisible]);

    function toggleVisibility(v) {
        setVisible(v);
    }


    return (
        <div ref = { ref } >
            <InstructionWindow visible={visible} toggleVisibility={toggleVisibility}/>
        </div>
    )
}
