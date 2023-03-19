import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./reducers/UserSlice";
import studentsReducer from "./reducers/StudentsSlice";
import groupsReducer from "./reducers/GroupsSlice";
import subjectsReducer from "./reducers/SubjectsSlice";
import teachersReducer from "./reducers/TeachersSlice";
import subgroupsReducer from "./reducers/SubgroupsSlice";
import schedulesReducer from "./reducers/SchedulesSlice";
import coupleTimesReducer from "./reducers/CouplesTimesSlice";
import subjectTypesReducer from "./reducers/SubjectTypesSlice";
import submissionConfigsReducer from "./reducers/SubmissionConfigsSlice";
import submissionsReducer from "./reducers/SubmissionsSlice"

const rootReducer = combineReducers({
    userReducer,
    studentsReducer,
    groupsReducer,
    subjectsReducer,
    teachersReducer,
    subgroupsReducer,
    schedulesReducer,
    coupleTimesReducer,
    subjectTypesReducer,
    submissionConfigsReducer,
    submissionsReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        devTools: import.meta.env.DEV
    });
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
