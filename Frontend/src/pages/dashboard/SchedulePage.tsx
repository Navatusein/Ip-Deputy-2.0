import React, {useEffect, useState} from 'react';
import PageTemplate from "../../components/UI/PageTemplate";
import {Alert, Button, Card, Form, Row, Spinner} from "react-bootstrap";
import ScheduleTable from "../../components/dashboard/ScheduleTable";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {fetchAllGroups} from '../../services/GroupsService';
import {fetchAllSubjects} from "../../services/SubjectsService";
import {fetchAllTeachers} from "../../services/TeachersService";
import {fetchAllCoupleTimes} from "../../services/CoupleTimesService";
import {fetchAllSubjectTypes} from "../../services/SubjectTypesService";
import {addSchedule, deleteSchedule, fetchScheduleByDayOfWeek, updateSchedule} from "../../services/SchedulesService";
import {ISchedule} from "../../models/ISchedule";
import {FaEdit, FaPlus, FaRegTrashAlt} from "react-icons/fa";
import DefaultConfirmationModal from "../../components/UI/DefaultConfirmationModal";
import ScheduleModal from "../../components/dashboard/ScheduleModal";
import {fetchAllSubgroups} from "../../services/SubgroupsService";
import {useTranslation} from "react-i18next";

const SchedulePage = () => {
    const {t} = useTranslation();

    const dispatch = useAppDispatch();

    const {schedules, schedulesIsLoading, schedulesError} = useAppSelector(state => state.schedulesReducer)

    const scheduleInitialState: ISchedule = {
        id: 0,
        subjectId: 0,
        subjectTypeId: 0,
        dayOfWeekId: 0,
        coupleTimeId: 0,
        isRolling: false,
        teacherId: 0,
        groups: [],
        additionalDates: [],
        removedDates: []
    }

    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
    const [selectedSchedule, setSelectedSchedule] = useState<ISchedule>(scheduleInitialState);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllGroups());
        dispatch(fetchAllSubgroups());
        dispatch(fetchAllSubjects());
        dispatch(fetchAllSubjectTypes());
        dispatch(fetchAllTeachers());
        dispatch(fetchAllCoupleTimes());
    }, []);

    useEffect(() => {
        if (selectedDayOfWeek === 0)
            return;

        setSelectedSchedule(scheduleInitialState);
        dispatch(fetchScheduleByDayOfWeek(selectedDayOfWeek));
    },[selectedDayOfWeek]);

    // Buttons handlers
    const handlerAddButtonClick = () => {
        setSelectedSchedule(scheduleInitialState);
        handlerScheduleModalShow();
    };

    const handlerEditButtonClick = () => {
        if (selectedSchedule.id === 0)
            return;

        handlerScheduleModalShow();
    };

    const handlerDeleteButtonClick = () => {
        if (selectedSchedule.id === 0)
            return;

        handlerConfirmationModalShow();
    };

    // Schedule modal handlers
    const handlerScheduleModalShow = () => {
        setShowScheduleModal(true);
    };

    const handlerScheduleModalClose = (save: boolean) => {
        setShowScheduleModal(false);

        if (!save)
            return;

        console.log(selectedSchedule);

        if (schedules.find(x => x.id === selectedSchedule.id)) {
            dispatch(updateSchedule(selectedSchedule));
        }
        else {
            dispatch(addSchedule(selectedSchedule));
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
        dispatch(deleteSchedule(selectedSchedule.id));
    };

    return (
        <PageTemplate>
            <Card className="my-4">
                <Card.Header>{t("pages.schedule.name")}</Card.Header>
                <Card.Body>
                    <Row>
                        <div className="d-flex justify-content-between">
                            <div className="w-100 d-flex">
                                <div className="col-md-3 col-sm-4 col-7">
                                    <Form.Select
                                        value={selectedDayOfWeek}
                                        onChange={e => {setSelectedDayOfWeek(Number(e.target.value))}}
                                    >
                                        <option disabled value={0}>{t("selects.days_of_week.default")}</option>
                                        <option value={1}>{t("days_of_week.monday")}</option>
                                        <option value={2}>{t("days_of_week.tuesday")}</option>
                                        <option value={3}>{t("days_of_week.wednesday")}</option>
                                        <option value={4}>{t("days_of_week.thursday")}</option>
                                        <option value={5}>{t("days_of_week.friday")}</option>
                                        <option value={6}>{t("days_of_week.saturday")}</option>
                                        <option value={7}>{t("days_of_week.sunday")}</option>
                                    </Form.Select>
                                </div>
                                {schedulesIsLoading && <Spinner className="ms-3" animation="border"/>}
                            </div>
                            <div className="btn-group">
                                <Button variant="warning" onClick={() => handlerAddButtonClick()}>
                                    <FaPlus/>
                                </Button>
                                <Button variant="success" onClick={() => handlerEditButtonClick()}>
                                    <FaEdit/>
                                </Button>
                                <Button variant="danger" onClick={() => handlerDeleteButtonClick()}>
                                    <FaRegTrashAlt/>
                                </Button>
                            </div>
                        </div>
                    </Row>
                    {schedulesError && <Alert variant="danger" className="mt-3">{schedulesError}</Alert>}
                    {selectedDayOfWeek !== 0 &&
                        <ScheduleTable
                            schedules={schedules}
                            selectedSchedule={selectedSchedule}
                            setSelectedSchedule={setSelectedSchedule}
                        />
                    }
                    <ScheduleModal
                        show={showScheduleModal}
                        handlerClose={handlerScheduleModalClose}
                        schedule={selectedSchedule}
                        setSchedule={setSelectedSchedule}
                        dayOfWeek={selectedDayOfWeek}
                    />
                    <DefaultConfirmationModal
                        show={showConfirmationModal}
                        handlerClose={handlerConfirmationModalClose}
                        onConfirm={handlerConfirmationModalOnClose}
                        value={t("pages.schedule.confirm_modal")}
                    />
                </Card.Body>
            </Card>
        </PageTemplate>
    );
};

export default SchedulePage;