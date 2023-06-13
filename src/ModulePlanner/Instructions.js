import React, { useEffect, useState } from "react"

import { styles } from "./styles"

import { 
    Box,
    Button, 
} from "@mui/material";

const Instructions = ({ toggleVisibility }) => {    
    const [openForFutureVisits, setOpenForFutureVisits] = useState(true);

    useEffect(() => {
        const showInstructions = localStorage.getItem('showInstructions');
        if (showInstructions === 'false') {
          setOpenForFutureVisits(false);
        }
      }, []);
    

    function handleCheckboxChange(event) {
        const checked = event.target.checked;
        setOpenForFutureVisits(checked);
        localStorage.setItem('showInstructions', checked ? 'true' : 'false');
    }

    function handleExitButtonClick() {
        toggleVisibility(false);
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

            <div style={{ position: 'absolute', height: '100%', width: '100%', textAlign: 'center' }}>
                
                <div style={styles.topText}>
                    Welcome to the planner page! 📝
                </div>

                <div style={styles.bottomText}>
                    <label htmlFor="checkbox-input">
                        <input
                            id="checkbox-input"
                            type="checkbox"
                            checked={openForFutureVisits}
                            onChange={handleCheckboxChange}
                        />
                        Don't Show Again
                    </label>
                </div>

                <Box style={styles.bottomButton}>
                    <Button
                    variant="contained"
                    onClick={handleExitButtonClick}>
                        Exit
                    </Button>
                </Box>
                
            </div>

            
            
        </div>
    )
}

export default Instructions;