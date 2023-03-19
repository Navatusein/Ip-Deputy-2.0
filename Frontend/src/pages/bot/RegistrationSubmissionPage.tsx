import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {userSlice} from "../../store/reducers/UserSlice";
import {useTelegram} from "../../hooks/useTelegram";
import {useParams} from "react-router-dom";
import {IUser} from "../../models/IUser";
import jwt_decode from "jwt-decode";
import {Alert, Card, Form} from "react-bootstrap";
import CardTokenExpire from "../../components/bot/CardTokenExpire";
import {IJwtToken} from "../../models/IJwtToken";
import {fetchAllSubmissionConfigs, fetchSubmissionConfigsForStudent} from "../../services/SubmissionConfigsService";
import {fetchAllSubjects} from "../../services/SubjectsService";
import {fetchAllSubjectTypes} from "../../services/SubjectTypesService";
import {ISubmission} from "../../models/ISubmission";
import {ISubmissionConfig} from "../../models/ISubmissionConfig";
import api from "../../http";


const RegistrationSubmissionPage = () => {
    const dispatch = useAppDispatch();

    const {setUser} = userSlice.actions;

    const {user} = useAppSelector(state => state.userReducer);
    const {submissionConfigs, submissionConfigsError} = useAppSelector(state => state.submissionConfigsReducer);
    const {subjects, subjectsError} = useAppSelector(state => state.subjectsReducer);
    const {subjectTypes, subjectTypesError} = useAppSelector(state => state.subjectTypesReducer);

    const {telegram} = useTelegram();
    const {userBase64} = useParams();

    const [tokenActive, setTokenActive] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const [selectedSubmissionConfig, setSelectedSubmissionConfig] = useState<ISubmissionConfig>();

    const submissionInitialState: ISubmission = {
        id: 0,
        submissionWorkId: 0,
        studentId: 0,
        submissionConfigId: 0
    }

    const [submission, setSubmission] = useState<ISubmission>(submissionInitialState);

    // Main button click handler
    const mainButtonHandler = () => {
        submission.studentId = user!.studentId;
        submission.submissionConfigId = selectedSubmissionConfig!.id;

        api.post<string>('submissions', submission).then(() => {
            telegram.showPopup({
                title: "Успіх!",
                message: "Ви успішно записались на захист.",
                buttons: [
                    {id: "Continue", type: "default", text: "Продовжити"},
                    {id: "Close", type: "destructive", text: "Закрити"},
                ]
            },
            (id: string) => {
                switch (id) {
                    case "Continue":
                        setSubmission(submissionInitialState);
                        setSelectedSubmissionConfig(undefined);
                        dispatch(fetchSubmissionConfigsForStudent(user!.studentId));
                        break;
                    case "Close":
                        telegram.close();
                        break;
                }
            });
        }).catch(error => {
            let error_message = error.response.data;

            switch (error_message) {
                case "This submission already exists":
                    setErrorMessage("Ви вже записані на захист цієї роботи");
                    break;
                default:
                    setErrorMessage("Невідома помилка");
                    break;
            }

        });
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

        dispatch(fetchSubmissionConfigsForStudent(user!.studentId));
        dispatch(fetchAllSubjects());
        dispatch(fetchAllSubjectTypes());
        telegram.ready();
    }, [tokenActive]);

    // If token invalid setTokenActive to false
    useEffect(() => {
        if (submissionConfigsError.includes('401'))
            setTokenActive(false);

        if (subjectsError.includes('401'))
            setTokenActive(false);

        if (subjectTypesError.includes('401'))
            setTokenActive(false);

    }, [submissionConfigsError, subjectsError, subjectTypesError]);

    // Change main button state
    useEffect(() => {
        if (submission.submissionWorkId === 0) {
            telegram.MainButton.hide();
            return;
        }

        if (submission.submissionWorkId === 0) {
            telegram.MainButton.hide();
            return;
        }

        telegram.MainButton.text = 'Записатись'
        telegram.MainButton.show();

    }, [submission]);

    if (tokenActive) {
        return (
            <div className="p-3 bot-bg flex-grow-1">
                <Card className="bot-card-bg">
                    <Card.Body>
                        <Card.Title className="bot-text-color">
                            Реестрація на захист роботи
                        </Card.Title>
                        {errorMessage !== '' &&
                            <Alert variant="danger" className="mt-3" onClose={() => setErrorMessage('')} dismissible>
                                {errorMessage}
                            </Alert>
                        }
                        <Form.Group className="mb-3">
                            <Form.Label className="bot-hint-color">Вибери куди записатись:</Form.Label>
                            <Form.Select
                                className="bot-select"
                                value={selectedSubmissionConfig ? selectedSubmissionConfig.id : -1}
                                onChange={e => setSelectedSubmissionConfig(submissionConfigs.find(x => x.id == Number(e.target.value)))}
                            >
                                <option disabled value={-1}>
                                    Вибери куди записатись
                                </option>
                                {submissionConfigs.map((submissionConfig) =>
                                    <option key={submissionConfig.id} value={submissionConfig.id}>
                                        {subjects.find(x => x.id == submissionConfig.subjectId)?.shortName ?
                                            subjects.find(x => x.id == submissionConfig.subjectId)?.shortName :
                                            subjects.find(x => x.id == submissionConfig.subjectId)?.name
                                        }
                                        &nbsp;
                                        {
                                            subjectTypes.find(x => x.id == submissionConfig.subjectTypeId)?.shortName
                                        }
                                    </option>
                                )}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="bot-hint-color">Вибери роботу:</Form.Label>
                            <Form.Select
                                className="bot-select"
                                disabled={!selectedSubmissionConfig}
                                value={submission.submissionWorkId}
                                onChange={e => setSubmission({...submission, submissionWorkId: Number(e.target.value)})}
                            >
                                <option disabled value={0}>
                                    Вибери роботу
                                </option>
                                {selectedSubmissionConfig?.submissionWorks.map((submissionWork) =>
                                    <option key={submissionWork.id} value={submissionWork.id} disabled={submissionWork.isSubmission}>
                                        {submissionWork.name}
                                    </option>
                                )}
                            </Form.Select>
                        </Form.Group>
                        {/*<Form.Group className="mb-3">*/}
                        {/*    <Form.Label className="bot-hint-color">Користувач:</Form.Label>*/}
                        {/*    <Form.Control type="text" className="bot-input" value={userBase64}/>*/}
                        {/*</Form.Group>*/}
                    </Card.Body>
                </Card>
            </div>
        );
    }
    else {
        return (
            <CardTokenExpire buttonName='➕ Записатись' menuName='🧾 Захист робіт'/>
        );
    }
};

export default RegistrationSubmissionPage;