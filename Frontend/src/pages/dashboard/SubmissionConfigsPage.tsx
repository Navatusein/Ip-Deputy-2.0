import React, {FC, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {fetchAllGroups} from "../../services/GroupsService";
import PageTemplate from "../../components/UI/PageTemplate";
import {Alert, Button, ButtonGroup, Card, Spinner} from "react-bootstrap";
import {FaEdit, FaPlus, FaRedo, FaRegTrashAlt} from "react-icons/fa";
import DefaultConfirmationModal from "../../components/UI/DefaultConfirmationModal";
import {ISubmissionConfig} from "../../models/ISubmissionConfig";
import {
    addSubmissionConfigs,
    deleteSubmissionConfigs,
    fetchAllSubmissionConfigs,
    updateSubmissionConfigs
} from "../../services/SubmissionConfigsService";
import {fetchAllSubjects} from "../../services/SubjectsService";
import {fetchAllSubjectTypes} from "../../services/SubjectTypesService";
import SubmissionConfigsTable from "../../components/dashboard/SubmissionConfigsTable";
import {fetchAllSubgroups} from "../../services/SubgroupsService";
import SubmissionConfigsModal from "../../components/dashboard/SubmissionConfigsModal";
import {useTranslation} from "react-i18next";

const SubmissionConfigsPage: FC = () => {
    const {t} = useTranslation();

    const dispatch = useAppDispatch();
    const {submissionConfigs, submissionConfigsIsLoading, submissionConfigsError} =
        useAppSelector(state => state.submissionConfigsReducer);

    const submissionConfigsInitState: ISubmissionConfig = {
        id: 0,
        subjectId: 0,
        subjectTypeId: 0,
        subgroupId: undefined,
        groups: [],
        submissionWorks: []
    };

    const [selectedSubmissionConfig, setSelectedSubmissionConfig] = useState<ISubmissionConfig>(submissionConfigsInitState);
    const [showSubmissionConfigModal, setShowGroupModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllSubmissionConfigs());
        dispatch(fetchAllGroups());
        dispatch(fetchAllSubgroups());
        dispatch(fetchAllSubjects());
        dispatch(fetchAllSubjectTypes());
    }, []);

    // Buttons handlers
    const handlerRefreshButtonClick = () => {
        dispatch(fetchAllSubmissionConfigs());
        dispatch(fetchAllGroups());
        dispatch(fetchAllSubgroups());
        dispatch(fetchAllSubjects());
        dispatch(fetchAllSubjectTypes());
    };

    const handlerAddButtonClick = () => {
        setSelectedSubmissionConfig(submissionConfigsInitState);
        handlerSubmissionConfigModalShow();
    };

    const handlerEditButtonClick = () => {
        if (selectedSubmissionConfig.id === 0)
            return;

        handlerSubmissionConfigModalShow();
    };

    const handlerDeleteButtonClick = () => {
        if (selectedSubmissionConfig.id === 0)
            return;

        handlerConfirmationModalShow();
    };

    // Group modal handlers
    const handlerSubmissionConfigModalShow = () => {
        setShowGroupModal(true);
    };

    const handlerSubmissionConfigModalClose = (save: boolean) => {
        setShowGroupModal(false);

        if (!save)
            return;

        if (submissionConfigs.find(x => x.id == selectedSubmissionConfig.id)) {
            dispatch(updateSubmissionConfigs(selectedSubmissionConfig));
        }
        else {
            dispatch(addSubmissionConfigs(selectedSubmissionConfig));
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
        dispatch(deleteSubmissionConfigs(selectedSubmissionConfig.id));
    };

    return (
        <PageTemplate>
            <Card className="my-4">
                <Card.Header>{t("pages.submission_config.name")}</Card.Header>
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
                    {submissionConfigsIsLoading && <Spinner animation="border" className="ms-3"/>}
                    {submissionConfigsError &&
                        <Alert variant="danger" className="mt-3">{submissionConfigsError}</Alert>}
                    <SubmissionConfigsTable
                        submissionConfigs={submissionConfigs}
                        selectedSubmissionConfig={selectedSubmissionConfig}
                        setSelectedSubmissionConfig={setSelectedSubmissionConfig}
                    />
                    <SubmissionConfigsModal
                        show={showSubmissionConfigModal}
                        handlerClose={handlerSubmissionConfigModalClose}
                        submissionConfig={selectedSubmissionConfig}
                        setSubmissionConfig={setSelectedSubmissionConfig}
                    />
                    <DefaultConfirmationModal
                        show={showConfirmationModal}
                        handlerClose={handlerConfirmationModalClose}
                        onConfirm={handlerConfirmationModalOnClose}
                        value={t("pages.submission_config.confirm_modal")}

                    />
                </Card.Body>
            </Card>
        </PageTemplate>
    );
};

export default SubmissionConfigsPage;