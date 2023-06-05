import React, { useState, useEffect, useRef} from "react";

import Avatar from './Avatar.js'
import FeedbackWindow from "./FeedbackWindow.js";


const FeedbackForm = () => {
    const ref = useRef(null);
    useOutsideAlerter(ref);
    const [visible, setVisible] = useState(false)
    
    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setVisible(false)
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    function toggleVisibility() {
        if (visible === false) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }

    return (
        <div>
        <div ref = { ref }>
            <FeedbackWindow visible={visible} />
            <Avatar 
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                }}
                onClick = {() => toggleVisibility()}
            />
        </div>
        </div>
    )
}

export default FeedbackForm;