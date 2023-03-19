import React, {FC, useEffect, useState} from 'react';
import PageTemplate from "../../components/UI/PageTemplate";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {IGroup} from "../../models/IGroup";
import {addGroup, deleteGroup, fetchAllGroups, updateGroup} from "../../services/GroupsService";
import DefaultConfirmationModal from "../../components/UI/DefaultConfirmationModal";
import {Alert, Button, ButtonGroup, Card, Spinner} from "react-bootstrap";
import {FaEdit, FaPlus, FaRedo, FaRegTrashAlt} from "react-icons/fa";
import GroupsTable from "../../components/dashboard/GroupsTable";
import GroupModal from "../../components/dashboard/GroupModal";
import {fetchAllSubgroups} from "../../services/SubgroupsService";
import {useTranslation} from "react-i18next";

const GroupsPage: FC = () => {
    const {t} = useTranslation();

    const dispatch = useAppDispatch();
    const {groups, groupsIsLoading, groupsError} = useAppSelector(state => state.groupsReducer);

    const groupsInitState: IGroup = {
        id: 0,
        name: '',
        subgroups: []
    }

    const [selectedGroup, setSelectedGroup] = useState<IGroup>(groupsInitState);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllGroups());
        dispatch(fetchAllSubgroups());
    }, []);

    // Buttons handlers
    const handlerRefreshButtonClick = () => {
        dispatch(fetchAllGroups());
        dispatch(fetchAllSubgroups());
    };

    const handlerAddButtonClick = () => {
        setSelectedGroup(groupsInitState);
        handlerGroupModalShow();
    };

    const handlerEditButtonClick = () => {
        if (selectedGroup.id === 0)
            return;

        handlerGroupModalShow();
    };

    const handlerDeleteButtonClick = () => {
        if (selectedGroup.id === 0)
            return;

        handlerConfirmationModalShow();
    };

    // Group modal handlers
    const handlerGroupModalShow = () => {
        setShowGroupModal(true);
    };

    const handlerGroupModalClose = (save: boolean) => {
        setShowGroupModal(false);

        if (!save)
            return;

        if (groups.find(x => x.id == selectedGroup.id)) {
            dispatch(updateGroup(selectedGroup));
        }
        else {
            dispatch(addGroup(selectedGroup));
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
        dispatch(deleteGroup(selectedGroup.id));
    };

    return (
        <PageTemplate>
            <Card className="my-4">
                <Card.Header>{t("pages.groups.name")}</Card.Header>
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
                    {groupsIsLoading && <Spinner animation="border" className="ms-3"/>}
                    {groupsError && <Alert variant="danger" className="mt-3">{groupsError}</Alert>}
                    <GroupsTable
                        groups={groups}
                        selectedGroup={selectedGroup}
                        setSelectedGroup={setSelectedGroup}
                    />
                    <GroupModal
                        show={showGroupModal}
                        handlerClose={handlerGroupModalClose}
                        group={selectedGroup}
                        setGroup={setSelectedGroup}
                    />
                    <DefaultConfirmationModal
                        show={showConfirmationModal}
                        handlerClose={handlerConfirmationModalClose}
                        onConfirm={handlerConfirmationModalOnClose}
                        value={t("pages.groups.confirm_modal", {text: selectedGroup.name})}
                    />
                </Card.Body>
            </Card>
        </PageTemplate>
    );
};

export default GroupsPage;