import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, Form, InputGroup, ListGroup, Modal, Row} from "react-bootstrap";
import {ISchedule} from "../../models/ISchedule";
import {useAppSelector} from "../../hooks/redux";
import {FaPlus, FaRegTrashAlt} from "react-icons/fa";
import {IScheduleDate} from "../../models/IScheduleDate";
import {useTranslation} from "react-i18next";

interface ScheduleModalProps {
    show: boolean;
    handlerClose: (save: boolean) => void;
    schedule: ISchedule;
    setSchedule: (schedule: ISchedule) => void;
    dayOfWeek: number;
}

const ScheduleModal: FC<ScheduleModalProps> = ({show, handlerClose, schedule, setSchedule, dayOfWeek}) => {
    const {t} = useTranslation();

    const {subjects} = useAppSelector(state => state.subjectsReducer);
    const {subjectTypes} = useAppSelector(state => state.subjectTypesReducer);
    const {coupleTimes} = useAppSelector(state => state.coupleTimesReducer);
    const {teachers} = useAppSelector(state => state.teachersReducer);
    const {groups} = useAppSelector(state => state.groupsReducer);
    const {subgroups} = useAppSelector(state => state.subgroupsReducer);

    // TODO Write comments

    const [alertMessage, setAlertMessage] = useState("");

    const [forWhoType, setForWhoType] = useState(0);

    const [hasStartEndDate, setHasStartEndDate] = useState(false);

    const [selectedGroupId, setSelectedGroupId] = useState(0);
    const [selectedSubgroupId, setSelectedSubgroupId] = useState(0);

    const [additionalDate, setAdditionalDate] = useState("");
    const [removedDate, setRemovedDate] = useState("");

    useEffect(() => {
        setAlertMessage('');

        if (schedule.subgroupId) {
            setForWhoType(3);
            setSelectedSubgroupId(schedule.subgroupId);
        }
        else if (schedule.groups.length === 1) {
            setForWhoType(2);
            setSelectedGroupId(schedule.groups[0].id);
        }
        else if (schedule.groups.length > 1) {
            setForWhoType(1);
            setSelectedGroupId(0);
            setSelectedSubgroupId(0);
        }
        else {
            setForWhoType(0);
            setSelectedGroupId(0);
            setSelectedSubgroupId(0);
        }

        setHasStartEndDate(schedule.startDate !== undefined);
    }, [show]);

    useEffect(() => {
        if (forWhoType === 1) {
            setSchedule({
                ...schedule,
                groups: groups,
                subgroupId: undefined
            });
        }
        else if (forWhoType === 2) {
            setSchedule({
                ...schedule,
                groups: [groups.find(x => x.id === selectedGroupId)!],
                subgroupId: undefined
            });
        }
        else if (forWhoType === 3) {
            setSchedule({
                ...schedule,
                groups: groups.filter(x => x.subgroups.find(x => x.id === selectedSubgroupId)),
                subgroupId: selectedSubgroupId
            });
        }
    }, [forWhoType, selectedSubgroupId, selectedGroupId])

    const sortDates = (a: IScheduleDate, b: IScheduleDate) => {
        let aDate = new Date(a.date);
        let bDate = new Date(b.date);
        return aDate.getTime() - bDate.getTime();
    }

    const handlerAddAdditionalDateButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();

        if (additionalDate == '') {
            return;
        }

        let dateObj = new Date(additionalDate);

        if (dateObj.getDay() !== dayOfWeek) {
            setAlertMessage(String(t("alert_message.date_not_match_week_day")));
            return;
        }

        if (schedule.additionalDates.find(x => x.date == additionalDate)) {
            setAlertMessage(String(t("alert_message.additional_date_in_additional_dates")));
            return;
        }

        if (schedule.removedDates.find(x => x.date == additionalDate)) {
            setAlertMessage(String(t("alert_message.additional_date_in_removed_dates")));
            return;
        }

        let date: IScheduleDate = {
            id: 0,
            date: additionalDate
        }

        setSchedule({...schedule, additionalDates: [...schedule.additionalDates, date].sort(sortDates)})
        setAdditionalDate("");
    };

    const handlerAddRemovedDateButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();

        if (removedDate == '')
            return;

        let dateObj = new Date(removedDate);

        if (dateObj.getDay() !== dayOfWeek) {
            setAlertMessage(String(t("alert_message.date_not_match_week_day")));
            return;
        }

        if (schedule.removedDates.find(x => x.date == removedDate)) {
            setAlertMessage(String(t("alert_message.removed_date_in_removed_dates")));
            return;
        }

        if (schedule.additionalDates.find(x => x.date == removedDate)) {
            setAlertMessage(String(t("alert_message.removed_date_in_additional_dates")));
            return;
        }

        let date: IScheduleDate = {
            id: 0,
            date: removedDate
        }

        setSchedule({...schedule, removedDates: [...schedule.removedDates, date].sort(sortDates)})
        setRemovedDate("");
    };

    const handlerRemoveAdditionalDateButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, date: IScheduleDate) => {
        e.stopPropagation();
        e.preventDefault()

        setSchedule({...schedule, additionalDates: [...schedule.additionalDates.filter(x => x.date !== date.date)]})
    };

    const handlerRemoveRemovedDateButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, date: IScheduleDate) => {
        e.stopPropagation();
        e.preventDefault();

        setSchedule({...schedule, removedDates: [...schedule.removedDates.filter(x => x.date !== date.date)]})
    };

    const handlerSaveChangesButton = () => {
        if (schedule.subjectId === 0) {
            setAlertMessage(String(t("alert_message.select_subject")));
            return;
        }

        if (schedule.subjectTypeId === 0) {
            setAlertMessage(String(t("alert_message.select_subject_type")));
            return;
        }

        if (schedule.coupleTimeId === 0) {
            setAlertMessage(String(t("alert_message.select_couple")));
            return;
        }

        if (forWhoType === 0) {
            setAlertMessage(String(t("alert_message.select_for_who")));
            return;
        }
        else if (forWhoType === 2 && selectedGroupId === 0) {
            setAlertMessage(String(t("alert_message.select_group")));
            return;
        }
        else if (forWhoType === 3 && selectedSubgroupId === 0) {
            setAlertMessage(String(t("alert_message.select_subgroup")));
            return;
        }

        if (schedule.teacherId === 0) {
            setAlertMessage(String(t("alert_message.select_teacher")));
            return;
        }

        if (hasStartEndDate) {
            if (schedule.startDate === '') {
                setAlertMessage(String(t("alert_message.enter_start_date")));
                return;
            }

            if (schedule.endDate === '') {
                setAlertMessage(String(t("alert_message.enter_end_date")));
                return;
            }
        }
        else {
            if (!schedule.additionalDates.length) {
                setAlertMessage(String(t("alert_message.enter_additional_date")));
                return;
            }

            schedule.startDate = undefined;
            schedule.endDate = undefined;
        }

        schedule.dayOfWeekId = dayOfWeek;

        handlerClose(true);
    };

    return (
        <Modal show={show} onHide={() => handlerClose(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{t("modal_names.schedule")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.subject")}</Form.Label>
                            <Form.Select
                                value={schedule.subjectId}
                                onChange={e => setSchedule({...schedule, subjectId: Number(e.target.value)})}
                            >
                                <option disabled value={0}>{t("selects.subject.default")}</option>
                                {subjects.map((subject) =>
                                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="col-6 pe-2">
                            <Form.Label>{t("header.subject_type")}</Form.Label>
                            <Form.Select
                                value={schedule.subjectTypeId}
                                onChange={e => setSchedule({...schedule, subjectTypeId: Number(e.target.value)})}
                            >
                                <option disabled value={0}>{t("selects.subject_type.default")}</option>
                                {subjectTypes.map((types) =>
                                    <option key={types.id} value={types.id}>{types.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-6 ps-2">
                            <Form.Label>{t("header.couple")}</Form.Label>
                            <Form.Select
                                value={schedule.coupleTimeId}
                                onChange={e => setSchedule({...schedule, coupleTimeId: Number(e.target.value)})}
                            >
                                <option disabled value={0}>{t("selects.couple.default")}</option>
                                {coupleTimes.map((coupleTime) =>
                                    <option key={coupleTime.id} value={coupleTime.id}>
                                        {`[${coupleTime.index}] ${coupleTime.timeStart.substring(0, 5)} - 
                                        ${coupleTime.timeEnd.substring(0, 5)}`}
                                    </option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className={forWhoType > 1 ? "col-6 pe-2" : ""}>
                            <Form.Label>{t("header.for_who")}</Form.Label>
                            <Form.Select
                                value={forWhoType}
                                onChange={e => setForWhoType(Number(e.target.value))}
                            >
                                <option disabled value={0}>{t("selects.for_who.default")}</option>
                                <option value={1}>{t("selects.for_who.for_cohort")}</option>
                                <option value={2}>{t("selects.for_who.for_group")}</option>
                                <option value={3}>{t("selects.for_who.for_subgroup")}</option>
                            </Form.Select>
                        </Form.Group>
                        {forWhoType === 2 &&
                            <Form.Group className="col-6 ps-2">
                                <Form.Label>{t("header.group")}</Form.Label>
                                <Form.Select
                                    value={selectedGroupId}
                                    onChange={e => setSelectedGroupId(Number(e.target.value))}
                                >
                                    <option disabled value={0}>{t("selects.group.default")}</option>
                                    {groups.map((group) =>
                                        <option key={group.id} value={group.id}>{group.name}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        }
                        {forWhoType === 3 &&
                            <Form.Group className="col-6 ps-2">
                                <Form.Label>{t("header.subgroup")}</Form.Label>
                                <Form.Select
                                    value={selectedSubgroupId}
                                    onChange={e => setSelectedSubgroupId(Number(e.target.value))}
                                >
                                    <option disabled value={0}>{t("selects.subgroup.default")}</option>
                                    {subgroups.map((subgroup) =>
                                        <option key={subgroup.id} value={subgroup.id}>{subgroup.name}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        }
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.teacher")}</Form.Label>
                            <Form.Select
                                value={schedule.teacherId}
                                onChange={e => setSchedule({...schedule, teacherId: Number(e.target.value)})}
                            >
                                <option disabled value={0}>{t("selects.teacher.default")}</option>
                                {teachers.map((teacher) =>
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.surname} {teacher.name[0]}. {teacher.patronymic[0]}.
                                    </option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="col-6 pe-2">
                            <Form.Label>{t("header.link")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={schedule.link ? schedule.link : ''}
                                onChange={(e) => setSchedule({...schedule, link: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="col-6 ps-2">
                            <Form.Label>{t("header.additional_information")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={schedule.additionalInformation ? schedule.additionalInformation : ''}
                                onChange={(e) => setSchedule({...schedule, additionalInformation: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="col-6 pe-2">
                            <Form.Check
                                type='checkbox'
                                label={t("checkboxes.start_end_date")}
                                checked={hasStartEndDate}
                                onChange={() => setHasStartEndDate(!hasStartEndDate)}
                            />
                        </Form.Group>
                        {hasStartEndDate &&
                            <Form.Group className="col-6 ps-2">
                                <Form.Check
                                    type='checkbox'
                                    label={t("checkboxes.rolling")}
                                    checked={schedule.isRolling}
                                    onChange={() => setSchedule({...schedule, isRolling: !schedule.isRolling})}
                                />
                            </Form.Group>
                        }
                    </Row>
                    {hasStartEndDate &&
                        <Row className="mb-3">
                            <Form.Group className="col-6 pe-2">
                                <Form.Label>{t("header.start_date")}</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={schedule.startDate === undefined ? "" : schedule.startDate}
                                    onChange={e => setSchedule({...schedule, startDate: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group className="col-6 ps-2">
                                <Form.Label>{t("header.end_date")}</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={schedule.endDate === undefined ? "" : schedule.endDate}
                                    onChange={e => setSchedule({...schedule, endDate: e.target.value})}
                                />
                            </Form.Group>
                        </Row>
                    }
                    <Row className="mb-3">
                        <Form.Group className="col-6 pe-2">
                            <Form.Label>{t("header.additional_date")}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="date"
                                    value={additionalDate}
                                    onChange={e => setAdditionalDate(e.target.value)}
                                />
                                <button className='btn btn-primary' onClick={(e) => handlerAddAdditionalDateButton(e)}>
                                    <FaPlus/>
                                </button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="col-6 ps-2">
                            <Form.Label>{t("header.removed_date")}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="date"
                                    value={removedDate}
                                    onChange={e => setRemovedDate(e.target.value)}
                                />
                                <button className='btn btn-primary' onClick={(e) => handlerAddRemovedDateButton(e)}>
                                    <FaPlus/>
                                </button>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="col-6 pe-2">
                            <ListGroup>
                                {schedule.additionalDates.map((additionalDate, index) =>
                                    <ListGroup.Item
                                        key={'add-date-' + index}
                                        className="d-flex justify-content-between p-2"
                                    >
                                        <div className="my-auto">
                                            {additionalDate.date.split('-').reverse().join('.')}
                                        </div>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={(e) => handlerRemoveAdditionalDateButton(e, additionalDate)}
                                        >
                                            <FaRegTrashAlt/>
                                        </button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Form.Group>
                        <Form.Group className="col-6 ps-2">
                            <ListGroup>
                                {schedule.removedDates.map((removedDate, index) =>
                                    <ListGroup.Item
                                        key={'remove-date-' + index}
                                        className="d-flex justify-content-between p-2"
                                    >
                                        <div className="my-auto">
                                            {removedDate.date.split('-').reverse().join('.')}
                                        </div>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={(e) => handlerRemoveRemovedDateButton(e, removedDate)}
                                        >
                                            <FaRegTrashAlt/>
                                        </button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Form.Group>
                    </Row>
                    {alertMessage !== '' &&
                        <Alert variant="danger" className="mt-3" onClose={() => setAlertMessage('')} dismissible>
                            {alertMessage}
                        </Alert>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handlerClose(false)}>
                    {t("buttons.close")}
                </Button>
                <Button variant="primary" onClick={() => handlerSaveChangesButton()}>
                    {t("buttons.save_changes")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ScheduleModal