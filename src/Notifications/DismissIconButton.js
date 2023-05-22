import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";

export const DismissIconButton = ({ id }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton
      onClick={() => {
        closeSnackbar(id);
      }}
    >
      <Close htmlColor="white" />
    </IconButton>
  );
};
