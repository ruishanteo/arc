import React, { useState } from "react";

import { styles } from './styles'
import background from "../Images/feedback_logo.png";

const Avatar = props => {
    const [hovered, setHovered] = useState(false)

    return (
        <div style={props.style}>
            <div 
                className='transition-3'
                style={{
                    ...styles.avatarHello,
                    ...{ opacity: hovered ? '1' : '0' }
                }}
            >
                Any feedback? 😊
            </div>

            <div 
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => props.onClick && props.onClick()}
                className='transition-3'
                style={{
                    ...styles.chatWithMeButton,
                    ...{ border: hovered ? '1px solid #f9f0ff' : '5px solid #DFD1F5',
                    backgroundImage: `url(${background})`,  }
                }}
            />
        </div>
    )
}

export default Avatar;