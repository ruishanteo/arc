import { Alert, Box, Snackbar, Stack } from "@mui/material";

import { useNotificationStore } from "./NotificationsStore.js";

export const Notifications = () => {
  const { notifications, dismissNotification } = useNotificationStore();

  return (
    <Box sx={{ width: "100%" }} display="flex" flexDirection="column">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={true}
        sx={{ minWidth: "40vw" }}
      >
        <Box sx={{ width: "100%" }}>
          {notifications.map((notif, i, _) => (
            <Alert
              key={i}
              sx={{ mt: 1 }}
              severity={notif.severity}
              onClose={() => dismissNotification(notif.id)}
            >
              {notif.message}
            </Alert>
          ))}
        </Box>
      </Snackbar>
    </Box>
  );
};
