import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, Form, Modal, Row} from "react-bootstrap";
import {ISubject} from "../../models/ISubject";
import {useTranslation} from "react-i18next";

interface SubjectModalProps {
    show: boolean;
    handlerClose: (save: boolean) => void;
    subject: ISubject;
    setSubject: (subject: ISubject) => void;
}

const SubjectModal: FC<SubjectModalProps> = ({show, handlerClose, subject, setSubject}) => {
    const {t} = useTranslation();

    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        setAlertMessage('');
    }, [show]);

    const handlerSaveChangesButton = () => {
        if (subject.name === '') {
            setAlertMessage(String(t("alert_message.enter_subject_name")));
            return;
        }

        handlerClose(true);
    }

    return (
        <Modal show={show} onHide={() => handlerClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{t("modal_names.subject")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.name")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={subject.name}
                                onChange={e => setSubject({...subject, name: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.short_name")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={subject.shortName}
                                onChange={e => setSubject({...subject, shortName: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group className="col-md-6 pe-md-2 col-12">
                            <Form.Label>{t("header.laboratory_count")}</Form.Label>
                            <Form.Control
                                type="number"
                                value={subject.laboratoryCount}
                                onChange={e => setSubject({...subject, laboratoryCount: Number(e.target.value)})}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-6 ps-md-2 col-12">
                            <Form.Label>{t("header.practical_count")}</Form.Label>
                            <Form.Control
                                type="number"
                                value={subject.practicalCount}
                                onChange={e => setSubject({...subject, practicalCount: Number(e.target.value)})}
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

export default SubjectModal;