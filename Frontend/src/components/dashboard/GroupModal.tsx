import React, {FC, useEffect, useState} from 'react';
import {IGroup} from "../../models/IGroup";
import {Alert, Button, Form, Modal, Row} from "react-bootstrap";
import {ISubgroup} from "../../models/ISubgroup";
import {useAppSelector} from "../../hooks/redux";
import {useTranslation} from "react-i18next";

interface GroupModalProps {
    show: boolean;
    handlerClose: (save: boolean) => void;
    group: IGroup;
    setGroup: (group: IGroup) => void;
}

const GroupModal: FC<GroupModalProps> = ({show, handlerClose, group, setGroup}) => {
    const {t} = useTranslation();

    const {subgroups} = useAppSelector(state => state.subgroupsReducer);

    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        setAlertMessage('');
    }, [show]);

    const sortFunction = (a: ISubgroup, b: ISubgroup): number => {
        return a.name.localeCompare(b.name);
    }

    const handlerSaveChangesButton = () => {
        if (group.name === '') {
            setAlertMessage(String(t("alert_message.enter_group_name")));
            return;
        }

        setGroup({...group, subgroups: group.subgroups.sort(sortFunction)});
        handlerClose(true);
    }

    return (
        <Modal show={show} onHide={() => handlerClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{t("modal_names.groups")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.name")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={group.name}
                                onChange={e => setGroup({...group, name: e.target.value})}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.subgroup")}</Form.Label>
                            {subgroups?.map((subgroup) =>
                                <Form.Check
                                    key={subgroup.id} type="checkbox"
                                    label={subgroup.name}
                                    checked={group.subgroups.find(x => x.id === subgroup.id) !== undefined}
                                    onChange={() => {
                                        if (group.subgroups.find(x => x.id === subgroup.id)) {
                                            setGroup({
                                                ...group,
                                                subgroups: group.subgroups.filter(x => x.id !== subgroup.id)
                                            });
                                        }
                                        else {
                                            setGroup({...group, subgroups: [...group.subgroups, subgroup]});
                                        }
                                    }}
                                />
                            )}
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

export default GroupModal;