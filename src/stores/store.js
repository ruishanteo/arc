import { configureStore } from "@reduxjs/toolkit";
import { notificationsReducer } from "../Notifications";
import { forumReducer } from "../Forum/ForumStore";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    forum: forumReducer,
  },
});
