import React, {FC, useEffect, useState} from 'react';
import {Alert, Button, ButtonGroup, Form, InputGroup, ListGroup, Modal, Row} from "react-bootstrap";
import {ISubmissionConfig} from "../../models/ISubmissionConfig";
import {useAppSelector} from "../../hooks/redux";
import {FaEdit, FaPlus, FaRegTrashAlt} from "react-icons/fa";
import {ISubmissionWork} from "../../models/ISubmissionWork";
import {useTranslation} from "react-i18next";

interface SubmissionConfigsProps {
    show: boolean;
    handlerClose: (save: boolean) => void;
    submissionConfig: ISubmissionConfig;
    setSubmissionConfig: (submissionConfig: ISubmissionConfig) => void;
}

const SubmissionConfigsModal: FC<SubmissionConfigsProps> = ({
                                                                show,
                                                                handlerClose,
                                                                submissionConfig,
                                                                setSubmissionConfig
                                                            }) => {
    const {t} = useTranslation();

    const {subjects} = useAppSelector(state => state.subjectsReducer);
    const {subjectTypes} = useAppSelector(state => state.subjectTypesReducer);
    const {subgroups} = useAppSelector(state => state.subgroupsReducer);
    const {groups} = useAppSelector(state => state.groupsReducer);

    const [alertMessage, setAlertMessage] = useState('');

    const [forWhoType, setForWhoType] = useState(0);

    const [selectedGroupId, setSelectedGroupId] = useState(0);
    const [selectedSubgroupId, setSelectedSubgroupId] = useState(0);

    const [submissionWorkName, setSubmissionWorkName] = useState('');

    const availableTypes = [
        'Лабораторне',
        'Практика',
    ]

    useEffect(() => {
        if (submissionConfig.subgroupId) {
            setForWhoType(3);
            setSelectedSubgroupId(submissionConfig.subgroupId);
        }
        else if (submissionConfig.groups.length === 1) {
            setForWhoType(2);
            setSelectedGroupId(submissionConfig.groups[0].id);
        }
        else if (submissionConfig.groups.length > 1) {
            setForWhoType(1);
            setSelectedGroupId(0);
            setSelectedSubgroupId(0);
        }
        else {
            setForWhoType(0);
            setSelectedGroupId(0);
            setSelectedSubgroupId(0);
        }
    }, [show]);

    useEffect(() => {
        if (forWhoType === 1) {
            setSubmissionConfig({
                ...submissionConfig,
                groups: groups,
                subgroupId: selectedSubgroupId
            });
        }
        else if (forWhoType === 2) {
            setSubmissionConfig({
                ...submissionConfig,
                groups: [groups.find(x => x.id === selectedGroupId)!],
                subgroupId: undefined
            });
        }
        else if (forWhoType === 3) {
            setSubmissionConfig({
                ...submissionConfig,
                groups: groups.filter(x => x.subgroups.find(x => x.id === selectedSubgroupId)),
                subgroupId: selectedSubgroupId
            });
        }
    }, [forWhoType, selectedSubgroupId, selectedGroupId])

    const sortSubmissionWorks = (a: ISubmissionWork, b: ISubmissionWork) => {
        return a.name.localeCompare(b.name);
    };

    const handlerAddSubmissionWorkButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();

        if (submissionWorkName == '')
            return;

        if (submissionConfig.submissionWorks.find(x => x.name == submissionWorkName)) {
            setAlertMessage(String(t("alert_message.work_already_in_list")));
            return;
        }

        let submissionWork: ISubmissionWork = {
            id: 0,
            submissionConfigId: submissionConfig.id,
            name: submissionWorkName
        }

        setSubmissionConfig({
            ...submissionConfig, submissionWorks:
                [...submissionConfig.submissionWorks, submissionWork].sort(sortSubmissionWorks)
        })
    };

    const handlerEditSubmissionWork = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, work: ISubmissionWork) => {
        e.stopPropagation();
        e.preventDefault()

        let workOldName = work.name;
        let newName = prompt(String(t("prompt.enter_new_name")), workOldName);

        if (newName === null)
            return;

        setSubmissionConfig({
            ...submissionConfig,
            submissionWorks: [...submissionConfig.submissionWorks.filter(x => x.name !== workOldName), {
                ...work,
                name: newName
            }].sort(sortSubmissionWorks)
        });
    };

    const handlerRemoveSubmissionWork = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, work: ISubmissionWork) => {
        e.stopPropagation();
        e.preventDefault()

        setSubmissionConfig({
            ...submissionConfig,
            submissionWorks: [...submissionConfig.submissionWorks.filter(x => x.name !== work.name)]
        });
    };

    const handlerSaveChangesButton = () => {

        if (submissionConfig.subjectId === 0) {
            setAlertMessage(String(t("alert_message.select_subject")));
            return;
        }

        if (submissionConfig.subjectTypeId === 0) {
            setAlertMessage(String(t("alert_message.select_subject_type")));
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

        handlerClose(true);
    }

    return (
        <Modal show={show} onHide={() => handlerClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{t("modal_names.submission_config")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.subject")}</Form.Label>
                            <Form.Select
                                value={submissionConfig.subjectId}
                                onChange={e => setSubmissionConfig({
                                    ...submissionConfig,
                                    subjectId: Number(e.target.value)
                                })}
                            >
                                <option disabled value={0}>Select subject</option>
                                {subjects.map((subject) =>
                                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>{t("header.subject_type")}</Form.Label>
                            <Form.Select
                                value={submissionConfig.subjectTypeId}
                                onChange={e => setSubmissionConfig({
                                    ...submissionConfig,
                                    subjectTypeId: Number(e.target.value)
                                })}
                            >
                                <option disabled value={0}>{t("selects.subject_type.default")}e</option>
                                {subjectTypes.filter(x => availableTypes.includes(x.name)).map((types) =>
                                    <option key={types.id} value={types.id}>{types.name}</option>
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
                            <Form.Label>{t("header.works")}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    value={submissionWorkName}
                                    onChange={e => setSubmissionWorkName(e.target.value)}
                                />
                                <button className='btn btn-primary' onClick={(e) => handlerAddSubmissionWorkButton(e)}>
                                    <FaPlus/>
                                </button>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <ListGroup>
                                {submissionConfig.submissionWorks?.map((work, index) =>
                                    <ListGroup.Item
                                        key={'works-' + index}
                                        className="d-flex justify-content-between p-2"
                                    >
                                        <div className="my-auto">
                                            {work.name}
                                        </div>
                                        <ButtonGroup>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={(e) => handlerEditSubmissionWork(e, work)}
                                            >
                                                <FaEdit/>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={(e) => handlerRemoveSubmissionWork(e, work)}
                                            >
                                                <FaRegTrashAlt/>
                                            </button>
                                        </ButtonGroup>
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

export default SubmissionConfigsModal;