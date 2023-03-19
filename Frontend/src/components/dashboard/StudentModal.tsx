import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, Form, Modal, Row} from "react-bootstrap";
import {IStudent} from "../../models/IStudent";
import {IGroup} from "../../models/IGroup";
import {useTranslation} from "react-i18next";

interface StudentModalProps {
    show: boolean;
    handlerClose: (save: boolean) => void;
    student: IStudent;
    setStudent: (student: IStudent) => void;
    group: IGroup
}

const StudentModal: FC<StudentModalProps> = ({show, handlerClose, student, setStudent, group}) => {
    const {t} = useTranslation();

    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        setAlertMessage('');
    }, [show]);

    const handlerSaveChangesButton = () => {
        if (student.name === '') {
            setAlertMessage(String(t("alert_message.enter_student_name")));
            return;
        }

        if (student.surname === '') {
            setAlertMessage(String(t("alert_message.enter_student_surname")));
            return;
        }

        if (student.patronymic === '') {
            setAlertMessage(String(t("alert_message.enter_student_patronymic")));
            return;
        }

        if (student.subgroupId === 0) {
            setAlertMessage(String(t("alert_message.select_student_subgroup")));
            return;
        }

        if (student.email === '') {
            setAlertMessage(String(t("alert_message.enter_student_email")));
            return;
        }

        if (student.fitEmail === '') {
            setAlertMessage(String(t("alert_message.enter_student_fit_email")));
            return;
        }

        if (student.telegramPhone === '') {
            setAlertMessage(String(t("alert_message.enter_student_telegram_phone")));
            return;
        }

        if (student.contactPhone === '') {
            setAlertMessage(String(t("alert_message.enter_student_contact_phone")));
            return;
        }

        if (student.birthday === '') {
            setAlertMessage(String(t("alert_message.enter_student_birthday")));
            return;
        }

        handlerClose(true);
    }

    return (
        <Modal show={show} onHide={() => handlerClose(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{t("modal_names.student")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Form.Group className="col-md-4 pe-md-2 col-12">
                            <Form.Label>{t("header.person_surname")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={student.surname}
                                onChange={e => setStudent({...student, surname: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-4 px-md-2 col-12">
                            <Form.Label>{t("header.person_name")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={student.name}
                                onChange={e => setStudent({...student, name: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-4 ps-md-2 col-12">
                            <Form.Label>{t("header.person_patronymic")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={student.patronymic}
                                onChange={e => setStudent({...student, patronymic: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="col-6 pe-2">
                            <Form.Label>{t("header.index")}</Form.Label>
                            <Form.Control
                                type="number"
                                min={1}
                                value={student.index}
                                onChange={e => setStudent({...student, index: Number(e.target.value)})}
                            />
                        </Form.Group>
                        <Form.Group className="col-6 ps-2">
                            <Form.Label>{t("header.subgroup")}</Form.Label>
                            <Form.Select
                                value={student.subgroupId}
                                onChange={e => setStudent({...student, subgroupId: Number(e.target.value)})}
                            >
                                <option disabled value={0}>Select subgroup</option>
                                {group?.subgroups.map((subgroup) =>
                                    <option key={subgroup.id} value={subgroup.id}>{subgroup.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="col-md-6 pe-md-2 col-12">
                            <Form.Label>{t("header.email")}</Form.Label>
                            <Form.Control
                                type="email"
                                value={student.email}
                                onChange={e => setStudent({...student, email: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6 ps-md-2 col-12">
                            <Form.Label>{t("header.fit_email")}</Form.Label>
                            <Form.Control
                                type="email"
                                value={student.fitEmail}
                                onChange={e => setStudent({...student, fitEmail: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="col-md-6 pe-md-2 col-12">
                            <Form.Label>{t("header.telegram_phone")}</Form.Label>
                            <Form.Control
                                type="text" value={student.telegramPhone}
                                onChange={e => setStudent({...student, telegramPhone: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6 ps-md-2 col-12">
                            <Form.Label>{t("header.contact_phone")}</Form.Label>
                            <Form.Control
                                type="text" value={student.contactPhone}
                                onChange={e => setStudent({...student, contactPhone: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.telegram_nickname")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={student.telegramNickname}
                                onChange={e => setStudent({...student, telegramNickname: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.birthday")}</Form.Label>
                            <Form.Control
                                type="date"
                                value={student.birthday}
                                onChange={e => setStudent({...student, birthday: e.target.value})}
                            />
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

export default StudentModal;