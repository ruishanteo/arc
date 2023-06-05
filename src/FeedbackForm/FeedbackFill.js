import React, { useState } from "react"

import { styles } from "./styles"

import { store } from "../stores/store.js";

import { CircularProgress } from '@mui/material'
import { Button, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";

const FeedbackFill = props => {    
    const [feedback, setFeedback] = useState('')
    const [loading, setLoading] = useState(false)

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
    }

    return (
        <div 
            style={{
                ...styles.emailFormWindow,
                ...{ 
                    height: '100%',
                    opacity: '1',
                }
            }}
        >
            <div style={{ height: '0px' }}>
                <div style={styles.stripe} />
            </div>

            <div 
                className='transition-5'
                style={{
                    ...styles.loadingDiv,
                    ...{ 
                        zIndex: loading ? '10' : '-1',
                        opacity: loading ? '0.33' : '0',
                    }
                }}
            />
            <CircularProgress
                className='transition-5'
                style={{
                    ...styles.loadingIcon,
                    ...{ 
                        zIndex: loading ? '10' : '-1',
                        opacity: loading ? '1' : '0',
                        fontSize: '82px',
                        top: 'calc(50% - 41px)', 
                        left: 'calc(50% - 31px)',  
                    }
                }}
            />

            <div style={{ position: 'absolute', height: '100%', width: '100%', textAlign: 'center' }}>
                
                <div style={styles.topText}>
                    Welcome to the <br /> feedback form 👋
                </div>

                <form 
                    onSubmit={e => handleSubmit(e)}
                    style={{ position: 'relative', width: '100%', top: '10%', opacity: '1' }}
                >
                    <TextField
                    type="text"
                    name="feedback"
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback here."
                    sx={{ mt: 2 }}
                    multiline
                    rows={10}
                    style={styles.emailInput}
                    />
                </form>

                <div style={styles.bottomText}>
                    <Button 
                    sx={{ backgroundColor: "#cff8df", 
                    color: "black",
                    "&:hover": {
                        color: "white",
                    }, }}
                    variant="contained"
                    disabled={!feedback}>
                        Submit<Send />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default FeedbackFill;