import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../UserAuth/Firebase.js";

import { styles } from './styles'
import background from "../Images/bubble2.png";

const Avatar = props => {
    const [user] = useAuthState(auth);
    const [hovered, setHovered] = useState(false)

    if (!user) {
        return null;
    }

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
                    ...{ border: hovered ? '1px solid #f9f0ff' : '5px solid #FFFFFF',
                    backgroundImage: `url(${background})`,  }
                }}
            />
        </div>
    )
}

export default Avatar;