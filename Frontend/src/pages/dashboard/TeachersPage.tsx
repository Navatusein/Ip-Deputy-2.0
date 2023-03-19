import React, {FC, useEffect, useState} from 'react';
import PageTemplate from "../../components/UI/PageTemplate";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {ITeacher} from "../../models/ITeacher";
import {addTeacher, deleteTeacher, fetchAllTeachers, updateTeacher} from "../../services/TeachersService";
import {Alert, Button, ButtonGroup, Card, Spinner} from "react-bootstrap";
import TeachersTable from "../../components/dashboard/TeachersTable";
import {FaEdit, FaPlus, FaRedo, FaRegTrashAlt} from "react-icons/fa";
import DefaultConfirmationModal from "../../components/UI/DefaultConfirmationModal";
import TeacherModal from "../../components/dashboard/TeacherModal";
import {useTranslation} from "react-i18next";

const TeachersPage: FC = () => {
    const {t} = useTranslation();

    const dispatch = useAppDispatch();
    const {teachers, teachersIsLoading, teachersError} = useAppSelector(state => state.teachersReducer);

    const teacherInitState: ITeacher = {
        id: 0,
        name: '',
        surname: '',
        patronymic: '',
        contactPhone: '',
        telegramNickname: '',
        email: '',
        fitEmail: ''
    }

    const [selectedTeacher, setSelectedTeacher] = useState<ITeacher>(teacherInitState);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllTeachers());
    },[]);

    // Buttons handlers
    const handlerRefreshButtonClick = () => {
        dispatch(fetchAllTeachers());
    };

    const handlerAddButtonClick = () => {
        setSelectedTeacher(teacherInitState);
        handlerTeacherModalShow();
    };

    const handlerEditButtonClick = () => {
        if (selectedTeacher.id === 0)
            return;

        handlerTeacherModalShow();
    };

    const handlerDeleteButtonClick = () => {
        if (selectedTeacher.id === 0)
            return;

        handlerConfirmationModalShow();
    };

    // Teacher modal handlers
    const handlerTeacherModalShow = () => {
        setShowTeacherModal(true);
    };

    const handlerTeacherModalClose = (save: boolean) => {
        setShowTeacherModal(false);

        if (!save)
            return;

        if (teachers.find(x => x.id == selectedTeacher.id)) {
            dispatch(updateTeacher(selectedTeacher));
        }
        else {
            dispatch(addTeacher(selectedTeacher));
        }
    };

    // Confirmation modal handlers
    const handlerConfirmationModalShow = () => {
        setShowConfirmationModal(true);
    };


    const handlerConfirmationModalClose = () => {
        setShowConfirmationModal(false);
    };

    const handlerConfirmationModalOnClose = () => {
        dispatch(deleteTeacher(selectedTeacher.id));
    };

    return (
        <PageTemplate>
            <Card className="my-4">
                <Card.Header>{t('pages.teacher.name')}</Card.Header>
                <Card.Body>
                    <ButtonGroup className="mb-3">
                        <Button variant="primary" onClick={() => handlerRefreshButtonClick()}>
                            <FaRedo/>
                        </Button>
                        <Button variant="warning" onClick={() => handlerAddButtonClick()}>
                            <FaPlus/>
                        </Button>
                        <Button variant="success" onClick={() => handlerEditButtonClick()}>
                            <FaEdit/>
                        </Button>
                        <Button variant="danger" onClick={() => handlerDeleteButtonClick()}>
                            <FaRegTrashAlt/>
                        </Button>
                    </ButtonGroup>
                    {teachersIsLoading && <Spinner animation="border" className="ms-3"/>}
                    {teachersError && <Alert variant="danger" className="mt-3">{teachersError}</Alert>}
                    <TeachersTable
                        teachers={teachers}
                        selectedTeacher={selectedTeacher}
                        setSelectedTeacher={setSelectedTeacher}
                    />
                    <TeacherModal
                        show={showTeacherModal}
                        handlerClose={handlerTeacherModalClose}
                        teacher={selectedTeacher}
                        setTeacher={setSelectedTeacher}
                    />
                    <DefaultConfirmationModal
                        show={showConfirmationModal}
                        handlerClose={handlerConfirmationModalClose}
                        onConfirm={handlerConfirmationModalOnClose}
                        value={t("pages.teacher.confirm_modal", {surname: selectedTeacher.surname, name: selectedTeacher.name})}
                    />
                </Card.Body>
            </Card>
        </PageTemplate>
    );
};

export default TeachersPage;