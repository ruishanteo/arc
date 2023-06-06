import { configureStore } from "@reduxjs/toolkit";
import { forumReducer } from "../Forum/ForumStore";
import { notificationsReducer } from "../Notifications";
import { userReducer } from "../UserAuth/UserStore";

export const store = configureStore({
  reducer: {
    forum: forumReducer,
    notifications: notificationsReducer,
    users: userReducer,
  },
});
