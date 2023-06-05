import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

import { forumReducer } from "../Forum/ForumStore";
import { notificationsReducer } from "../Notifications";
import { userReducer } from "../UserAuth/UserStore";
import { calculatorReducer } from "../GradeCalculator/GradeStore";
import { plannerDegReducer, plannerSemReducer } from "../ModulePlanner/PlannerStore"
import { feedbackReducer } from "../FeedbackForm/FeedbackStore";

export const store = configureStore({
  reducer: {
    forum: forumReducer,
    notifications: notificationsReducer,
    users: userReducer,
    calculator: calculatorReducer,
    plannerDeg: plannerDegReducer,
    plannerSem: plannerSemReducer,
    feedback: feedbackReducer,
  },
},
  applyMiddleware(thunk)
);
