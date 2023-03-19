import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, Form, Modal, Row} from "react-bootstrap";
import {ISubgroup} from "../../models/ISubgroup";
import {useTranslation} from "react-i18next";

interface SubgroupModalProps {
    show: boolean;
    handlerClose: (save: boolean) => void;
    subgroup: ISubgroup;
    setSubgroup: (subgroup: ISubgroup) => void;
}

const SubgroupModal: FC<SubgroupModalProps> = ({show, handlerClose, subgroup, setSubgroup}) => {
    const {t} = useTranslation();

    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        setAlertMessage('');
    }, [show]);

    const handlerSaveChangesButton = () => {
        if (subgroup.name === '') {
            setAlertMessage(String(t("alert_message.enter_subgroup_name")));
            return;
        }

        handlerClose(true);
    }

    return (
        <Modal show={show} onHide={() => handlerClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{t("modal_names.subgroup")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.name")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={subgroup.name}
                                onChange={e => setSubgroup({...subgroup, name: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.index")}</Form.Label>
                            <Form.Control
                                type="number"
                                min={1}
                                value={subgroup.index}
                                onChange={e => setSubgroup({...subgroup, index: Number(e.target.value)})}
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

export default SubgroupModal;