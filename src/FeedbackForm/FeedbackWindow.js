import React from "react";

import { styles } from "./styles";

import FeedbackFill from "./FeedbackFill.js";

const FeedbackWindow = props => {
    return (
        <div 
            className='transition-5'
            style={{
                ...styles.supportWindow,
                ...{ opacity: props.visible ? '1' : '0' },
                ...{ pointerEvents: props.visible ? 'auto' :'none'}
            }}
        >
            {props.visible && <FeedbackFill/>}
        </div>
    )
}

export default FeedbackWindow;