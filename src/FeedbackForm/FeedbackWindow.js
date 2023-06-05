import React from "react";

import { styles } from "./styles";

const FeedbackWindow = props => {
    return (
        <div 
            className='transition-5'
            style={{
                ...styles.supportWindow,
                ...{ opacity: props.visible ? '1' : '0' }
            }}
        >
        </div>
    )
}

export default FeedbackWindow;