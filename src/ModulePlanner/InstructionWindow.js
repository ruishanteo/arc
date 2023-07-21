import React from "react";

import { styles } from "./styles";

import Instructions from "./Instructions.js";

const InstructionWindow = ({ visible, toggleVisibility }) => {
  return (
    <div
      className="transition-5"
      style={{
        ...styles.supportWindow,
        ...{ opacity: visible ? "1" : "0" },
        ...{ pointerEvents: visible ? "auto" : "none" },
      }}
    >
      {visible && <Instructions toggleVisibility={toggleVisibility} />}
    </div>
  );
};

export default InstructionWindow;
