import { configureStore } from "@reduxjs/toolkit";

import { forumReducer } from "../Forum/ForumStore";
import { notificationsReducer } from "../Notifications";
import { userReducer } from "../UserAuth/UserStore";
import { calculatorReducer } from "../GradeCalculator/GradeStore";

export const store = configureStore({
  reducer: {
    forum: forumReducer,
    notifications: notificationsReducer,
    users: userReducer,
    calculator: calculatorReducer,
  },
});
