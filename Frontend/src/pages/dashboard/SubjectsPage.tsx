import React, {FC, useEffect, useState} from 'react';
import PageTemplate from "../../components/UI/PageTemplate";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {addSubject, deleteSubject, fetchAllSubjects, updateSubject} from "../../services/SubjectsService";
import SubjectsTable from "../../components/dashboard/SubjectsTable";
import {ISubject} from '../../models/ISubject';
import {FaEdit, FaRegTrashAlt, FaPlus, FaRedo} from "react-icons/fa";
import {Alert, Button, ButtonGroup, Card, Spinner} from "react-bootstrap";
import DefaultConfirmationModal from "../../components/UI/DefaultConfirmationModal";
import SubjectModal from "../../components/dashboard/SubjectModal";
import {useTranslation} from "react-i18next";

const SubjectsPage: FC = () => {
    const {t} = useTranslation();

    const dispatch = useAppDispatch();
    const {subjects, subjectsIsLoading, subjectsError} = useAppSelector(state => state.subjectsReducer);

    const subjectInitState: ISubject = {
        id: 0,
        name: '',
        shortName: '',
        laboratoryCount: 0,
        practicalCount: 0
    }

    const [selectedSubject, setSelectedSubject] = useState<ISubject>(subjectInitState);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllSubjects());
    },[]);

    // Buttons handlers
    const handlerRefreshButtonClick = () => {
        dispatch(fetchAllSubjects());
    };

    const handlerAddButtonClick = () => {
        setSelectedSubject(subjectInitState);
        handlerSubjectModalShow();
    };

    const handlerEditButtonClick = () => {
        if (selectedSubject.id === 0)
            return;

        handlerSubjectModalShow();
    };

    const handlerDeleteButtonClick = () => {
        if (selectedSubject.id === 0)
            return;

        handlerConfirmationModalShow();
    };

    // Subject modal handlers
    const handlerSubjectModalShow = () => {
        setShowSubjectModal(true);
    };

    const handlerSubjectModalClose = (save: boolean) => {
        setShowSubjectModal(false);

        if (!save)
            return;

        if (subjects.find(x => x.id == selectedSubject.id)) {
            dispatch(updateSubject(selectedSubject));
        }
        else {
            dispatch(addSubject(selectedSubject));
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
        dispatch(deleteSubject(selectedSubject.id));
    };

    return (
        <PageTemplate>
            <Card className="my-4">
                <Card.Header>{t("pages.subject.name")}</Card.Header>
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
                    {subjectsIsLoading && <Spinner animation="border" className="ms-3"/>}
                    {subjectsError && <Alert variant="danger" className="mt-3">{subjectsError}</Alert>}
                    <SubjectsTable
                        subjects={subjects}
                        selectedSubject={selectedSubject}
                        setSelectedSubject={setSelectedSubject}
                    />
                    <SubjectModal
                        show={showSubjectModal}
                        handlerClose={handlerSubjectModalClose}
                        subject={selectedSubject}
                        setSubject={setSelectedSubject}
                    />
                    <DefaultConfirmationModal
                        show={showConfirmationModal}
                        handlerClose={handlerConfirmationModalClose}
                        onConfirm={handlerConfirmationModalOnClose}
                        value={t("pages.subject.confirm_modal", {text: selectedSubject.name})}
                    />
                </Card.Body>
            </Card>
        </PageTemplate>
    );
};

export default SubjectsPage;