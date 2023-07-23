import React, { useEffect, useState } from "react";

import { styles } from "./styles";

import { Box, Button } from "@mui/material";

const Instructions = ({ toggleVisibility }) => {
  const [openForFutureVisits, setOpenForFutureVisits] = useState(true);

  useEffect(() => {
    const showInstructions = localStorage.getItem("showInstructions");
    if (showInstructions === "false") {
      setOpenForFutureVisits(false);
    }
  }, []);

  function handleCheckboxChange(event) {
    const checked = event.target.checked;
    setOpenForFutureVisits(checked);
    localStorage.setItem("showInstructions", checked ? "true" : "false");
  }

  function handleExitButtonClick() {
    toggleVisibility(false);
  }

  return (
    <div
      style={{
        ...styles.emailFormWindow,
        ...{
          height: "100%",
          opacity: "1",
        },
      }}
    >
      <div style={{ height: "0px" }}>
        <div style={styles.stripe} />
      </div>

      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={styles.topText}>Welcome to the planner page! 📝</div>

        <div style={styles.instructionContainer}>
          <div
            style={{
              ...styles.instructionText,
            }}
          >
            1. Select your primary degree, second degree/ major and programme if
            applicable. <br></br>
            <br></br>
            2. Click on the + SEMESTERS button to add a new semester and -
            SEMESTERS to remove the latest one.<br></br>
            <br></br>
            3. Click on the + MODULE button to add a new module and the X button
            to remove that module. <br></br>
            <br></br>
            4. Select the module that you plan to take as well as the category
            it belongs under, ie GE or UE.<br></br>
            The table below will indicate green if that requirement is cleared.
            <br></br>
            <br></br>
            5. Don't forget to save before leaving the page.<br></br>
            <br></br>
          </div>
        </div>

  </div>
        <div style={styles.bottomContainer}>
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
            id="instruction-clear-button"
            variant="contained"
            onClick={handleExitButtonClick}>
                Exit
           </Button>
          </Box>
        </div>
    </div>
  );
};

export default Instructions;
