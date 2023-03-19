import React, {FC, useEffect, useState} from 'react';
import {ITeacher} from "../../models/ITeacher";
import {Alert, Button, Form, Modal, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";

interface TeachersModalProps {
    show: boolean;
    handlerClose: (save: boolean) => void;
    teacher: ITeacher;
    setTeacher: (teacher: ITeacher) => void;
}

const TeacherModal: FC<TeachersModalProps> = ({show, handlerClose, teacher, setTeacher}) => {
    const {t} = useTranslation();

    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        setAlertMessage('');
    }, [show]);

    const handlerSaveChangesButton = () => {
        if (teacher.name === '') {
            setAlertMessage(String(t("alert_message.enter_teacher_name")));
            return;
        }

        if (teacher.surname === '') {
            setAlertMessage(String(t("alert_message.enter_teacher_surname")));
            return;
        }

        if (teacher.patronymic === '') {
            setAlertMessage(String(t("alert_message.enter_teacher_patronymic")));
            return;
        }

        handlerClose(true);
    }

    return (
        <Modal show={show} onHide={() => handlerClose(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{t("modal_names.teacher")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Form.Group className="col-md-4 pe-md-2 col-12">
                            <Form.Label>{t("header.person_surname")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={teacher.surname}
                                onChange={e => setTeacher({...teacher, surname: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-4 px-md-2 col-12">
                            <Form.Label>{t("header.person_name")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={teacher.name}
                                onChange={e => setTeacher({...teacher, name: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-4 ps-md-2 col-12">
                            <Form.Label>{t("header.person_patronymic")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={teacher.patronymic}
                                onChange={e => setTeacher({...teacher, patronymic: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.contact_phone")}</Form.Label>
                            <Form.Control
                                type="text" value={teacher.contactPhone}
                                onChange={e => setTeacher({...teacher, contactPhone: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.telegram_nickname")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={teacher.telegramNickname}
                                onChange={e => setTeacher({...teacher, telegramNickname: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="col-md-6 pe-md-2 col-12">
                            <Form.Label>{t("header.email")}</Form.Label>
                            <Form.Control
                                type="email"
                                value={teacher.email}
                                onChange={e => setTeacher({...teacher, email: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6 ps-md-2 col-12">
                            <Form.Label>{t("header.fit_email")}</Form.Label>
                            <Form.Control
                                type="email"
                                value={teacher.fitEmail}
                                onChange={e => setTeacher({...teacher, fitEmail: e.target.value})}
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

export default TeacherModal;