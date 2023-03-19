import React, {FC} from 'react';
import {Routes, Route} from 'react-router-dom';
import {useAppSelector} from "../hooks/redux";
import AuthenticationPage from "../pages/AuthenticationPage";
import GroupsPage from "../pages/dashboard/GroupsPage";
import StudentsPage from "../pages/dashboard/StudentsPage";
import TeachersPage from "../pages/dashboard/TeachersPage";
import SubjectsPage from "../pages/dashboard/SubjectsPage";
import SchedulePage from "../pages/dashboard/SchedulePage";
import SubgroupsPage from "../pages/dashboard/SubgroupsPage";
import FullSchedulePage from "../pages/bot/FullSchedulePage";
import SubmissionConfigsPage from "../pages/dashboard/SubmissionConfigsPage";
import RegistrationSubmissionPage from "../pages/bot/RegistrationSubmissionPage";
import ControlSubmissionPage from "../pages/bot/ControlSubmissionPage";

const AppRouter: FC = () => {
    const {user} = useAppSelector(state => state.userReducer);
    return (
        <Routes>
            {user !== null ?
                <>
                    <Route path="*" element={<StudentsPage/>}/>
                    <Route path="/dashboard/groups" element={<GroupsPage/>}/>
                    <Route path="/dashboard/subgroups" element={<SubgroupsPage/>}/>
                    <Route path="/dashboard/students" element={<StudentsPage/>}/>
                    <Route path="/dashboard/teachers" element={<TeachersPage/>}/>
                    <Route path="/dashboard/subjects" element={<SubjectsPage/>}/>
                    <Route path="/dashboard/schedule" element={<SchedulePage/>}/>
                    <Route path="/dashboard/submission-config" element={<SubmissionConfigsPage/>}/>
                </>:
                <>
                    <Route path="*" element={<AuthenticationPage/>}/>
                    <Route path="/login" element={<AuthenticationPage/>}/>
                </>
            }
            <Route path="/bot/full-schedule/:userBase64" element={<FullSchedulePage/>}/>
            <Route path="/bot/register-submission/:userBase64" element={<RegistrationSubmissionPage/>}/>
            <Route path="/bot/control-submission/:userBase64" element={<ControlSubmissionPage/>}/>
        </Routes>
    );
};

export default AppRouter;