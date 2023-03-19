import React, {FC, useEffect, useState} from 'react';
import PageTemplate from "../../components/UI/PageTemplate";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import DefaultConfirmationModal from "../../components/UI/DefaultConfirmationModal";
import {Alert, Button, ButtonGroup, Card, Spinner} from "react-bootstrap";
import {FaEdit, FaPlus, FaRedo, FaRegTrashAlt} from "react-icons/fa";
import {ISubgroup} from "../../models/ISubgroup";
import {addSubgroup, deleteSubgroup, fetchAllSubgroups, updateSubgroup} from "../../services/SubgroupsService";
import SubgroupsModal from "../../components/dashboard/SubgroupsModal";
import SubgroupsTable from "../../components/dashboard/SubgroupsTable";
import {useTranslation} from "react-i18next";

const SubgroupsPage: FC = () => {
    const {t} = useTranslation();

    const dispatch = useAppDispatch();
    const {subgroups, subgroupsIsLoading, subgroupsError} = useAppSelector(state => state.subgroupsReducer);

    const subgroupsInitState: ISubgroup = {
        id: 0,
        name: '',
        index: 1
    }

    const [selectedSubgroup, setSelectedSubgroup] = useState<ISubgroup>(subgroupsInitState);
    const [showSubgroupModal, setShowSubgroupModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllSubgroups());
    }, []);

    // Buttons handlers
    const handlerRefreshButtonClick = () => {
        dispatch(fetchAllSubgroups());
    };

    const handlerAddButtonClick = () => {
        setSelectedSubgroup(subgroupsInitState);
        handlerSubgroupModalShow();
    };

    const handlerEditButtonClick = () => {
        if (selectedSubgroup.id === 0)
            return;

        handlerSubgroupModalShow();
    };

    const handlerDeleteButtonClick = () => {
        if (selectedSubgroup.id === 0)
            return;

        handlerConfirmationModalShow();
    };

    // Subgroup modal handlers
    const handlerSubgroupModalShow = () => {
        setShowSubgroupModal(true);
    };

    const handlerSubgroupModalClose = (save: boolean) => {
        setShowSubgroupModal(false);

        if (!save)
            return;

        if (subgroups.find(x => x.id == selectedSubgroup.id)) {
            dispatch(updateSubgroup(selectedSubgroup));
        }
        else {
            dispatch(addSubgroup(selectedSubgroup));
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
        dispatch(deleteSubgroup(selectedSubgroup.id));
    };

    return (
        <PageTemplate>
            <Card className="my-4">
                <Card.Header>{t("pages.subgroup.name")}</Card.Header>
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
                    {subgroupsIsLoading && <Spinner animation="border" className="ms-3"/>}
                    {subgroupsError && <Alert variant="danger" className="mt-3">{subgroupsError}</Alert>}
                    <SubgroupsTable
                        subgroups={subgroups}
                        selectedSubgroup={selectedSubgroup}
                        setSelectedSubgroup={setSelectedSubgroup}
                    />
                    <SubgroupsModal
                        show={showSubgroupModal}
                        handlerClose={handlerSubgroupModalClose}
                        subgroup={selectedSubgroup}
                        setSubgroup={setSelectedSubgroup}
                    />
                    <DefaultConfirmationModal
                        show={showConfirmationModal}
                        handlerClose={handlerConfirmationModalClose}
                        onConfirm={handlerConfirmationModalOnClose}
                        value={t("pages.subgroup.confirm_modal", {text: selectedSubgroup.name})}
                    />
                </Card.Body>
            </Card>
        </PageTemplate>
    );
};

export default SubgroupsPage;