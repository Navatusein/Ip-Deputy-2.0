import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, ButtonGroup, Card, ListGroup} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {userSlice} from "../../store/reducers/UserSlice";
import {useTelegram} from "../../hooks/useTelegram";
import {useParams} from "react-router-dom";
import CardTokenExpire from "../../components/bot/CardTokenExpire";
import {IUser} from "../../models/IUser";
import {IJwtToken} from "../../models/IJwtToken";
import jwt_decode from "jwt-decode";
import {deleteSubmissions, fetchSubmissionsForStudent} from "../../services/SubmissionsService";
import {fetchSubmissionConfigsForStudent} from "../../services/SubmissionConfigsService";
import {fetchAllSubjects} from "../../services/SubjectsService";
import {fetchAllSubjectTypes} from "../../services/SubjectTypesService";
import {FaEdit, FaRegTrashAlt} from "react-icons/fa";

const ControlSubmissionPage: FC = () => {
    const dispatch = useAppDispatch();

    const {setUser} = userSlice.actions;

    const {user} = useAppSelector(x => x.userReducer);
    const {submissions, submissionsError} = useAppSelector(x => x.submissionsReducer);
    const {submissionConfigs, submissionConfigsError} = useAppSelector(x => x.submissionConfigsReducer);
    const {subjects, subjectsError} = useAppSelector(x => x.subjectsReducer);

    const {telegram} = useTelegram();
    const {userBase64} = useParams();

    const [tokenActive, setTokenActive] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    // Main button click handler
    const mainButtonHandler = () => {
        telegram.close();
    }

    // Fix telegram web app bug
    useEffect(() => {
        telegram.MainButton.onClick(mainButtonHandler);

        return () => {
            telegram.MainButton.offClick(mainButtonHandler);
        }
    }, [mainButtonHandler]);

    // Parse user data and check token
    useEffect(() => {
        if (userBase64 == undefined)
            return;

        const obj = JSON.parse(atob(userBase64));

        const userData: IUser = {
            studentId: obj.StudentId,
            userName: obj.UserName,
            jwtToken: obj.JwtToken
        }

        const decodedToken: IJwtToken = jwt_decode(userData.jwtToken);

        if (decodedToken.exp * 1000 < Date.now())
            return;

        setTokenActive(true);
        dispatch(setUser(userData));
    }, []);

    // If token correct fetch
    useEffect(() => {
        if (!tokenActive)
            return;

        dispatch(fetchSubmissionsForStudent(user!.studentId));
        dispatch(fetchSubmissionConfigsForStudent(user!.studentId));
        dispatch(fetchAllSubjects());
        dispatch(fetchAllSubjectTypes());

        telegram.ready();

        telegram.MainButton.text = 'Закрити'
        telegram.MainButton.show();

    }, [tokenActive]);

    // If token invalid setTokenActive to false
    useEffect(() => {
        if (submissionsError.includes('401'))
            setTokenActive(false);

        if (submissionConfigsError.includes('401'))
            setTokenActive(false);

        if (subjectsError.includes('401'))
            setTokenActive(false);
    }, []);

    const handleSubmissionDeleteButton = (submissionId: number) => {
        telegram.showConfirm('Видалти запис?', (confirm: boolean) => {
            if (confirm)
                dispatch(deleteSubmissions(submissionId));
        });
    }

    if (tokenActive) {
        return (
            <div className="p-3 bot-bg flex-grow-1">
                <Card className="bot-card-bg">
                    <Card.Body>
                        <Card.Title className="bot-text-color">
                            Мої записи
                        </Card.Title>
                        {errorMessage !== '' &&
                            <Alert variant="danger" className="mt-3" onClose={() => setErrorMessage('')} dismissible>
                                {errorMessage}
                            </Alert>
                        }
                        <ListGroup>
                            {submissions.length == 0 ?
                                <div className="bot-text-color">
                                    У вас не має записів на захист!
                                </div> :
                                submissions.map((submission) => (
                                    <ListGroup.Item
                                        key={submission.id}
                                        className="d-flex justify-content-between p-2 bot-list"
                                    >
                                        <div className="my-auto bot-text-color">
                                            {subjects.find(x => x.id == submissionConfigs.find(y => y.id == submission.submissionConfigId)?.subjectId)?.shortName}
                                            &nbsp;
                                            {submissionConfigs.find(y => y.id == submission.submissionConfigId)?.submissionWorks.find(x => x.id == submission.submissionWorkId)?.name}
                                        </div>
                                        <ButtonGroup>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleSubmissionDeleteButton(submission.id)}
                                            >
                                                <FaRegTrashAlt/>
                                            </button>
                                        </ButtonGroup>
                                    </ListGroup.Item>
                                )
                            )}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        );
    }
    else {
        return (
            <CardTokenExpire buttonName='🧾 Мої записи' menuName='🧾 Захист робіт'/>
        );
    }
};

export default ControlSubmissionPage;