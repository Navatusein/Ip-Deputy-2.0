import React, {FC, useEffect, useState} from 'react';
import PageTemplate from "../../components/UI/PageTemplate";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {Alert, Button, ButtonGroup, Card, Form, Spinner} from "react-bootstrap";
import {IStudent} from "../../models/IStudent";
import StudentsTable from "../../components/dashboard/StudentsTable";
import {fetchAllGroups} from "../../services/GroupsService";
import {addStudent, deleteStudent, fetchStudentsByGroup, updateStudent} from "../../services/StudentsService";
import StudentModal from "../../components/dashboard/StudentModal";
import {FaRedo} from "react-icons/fa";
import DefaultConfirmationModal from "../../components/UI/DefaultConfirmationModal";
import {FaEdit, FaRegTrashAlt, FaPlus} from "react-icons/fa";
import {studentsSlice} from "../../store/reducers/StudentsSlice";
import {IGroup} from "../../models/IGroup";
import {useTranslation} from "react-i18next";

const StudentsPage: FC = () => {
    const {t} = useTranslation();

    const dispatch = useAppDispatch();

    const {groups, groupsIsLoading} = useAppSelector(state => state.groupsReducer)
    const {students, studentsIsLoading, studentsError} = useAppSelector(state => state.studentsReducer)

    const [selectedGroup, setSelectedGroup] = useState<IGroup>();

    const studentInitState: IStudent = {
        id: 0,
        groupId: selectedGroup ? selectedGroup.id : 0,
        subgroupId: 0,
        index: students.length ? students[students?.length - 1]?.index! + 1 : 1,
        name: '',
        surname: '',
        patronymic: '',
        telegramPhone: '',
        contactPhone: '',
        email: '',
        fitEmail: '',
        telegramNickname: '',
        telegramId: undefined,
        birthday: '',
        lastCongratulations: undefined,
        lastActivity: undefined,
    }

    const [selectedStudent, setSelectedStudent] = useState<IStudent>(studentInitState);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllGroups());
    }, []);

    useEffect(() => {
        if (selectedGroup)
            dispatch(fetchStudentsByGroup(selectedGroup.id));
        else
            dispatch(studentsSlice.actions.clear())
    }, [selectedGroup]);


    // Buttons handlers
    const handlerRefreshButtonClick = () => {
        dispatch(fetchAllGroups());

        if (selectedGroup)
            dispatch(fetchStudentsByGroup(selectedGroup.id));
    };

    const handlerAddButtonClick = () => {
        if (!selectedGroup)
            return;

        setSelectedStudent(studentInitState);
        handlerStudentModalShow();
    };

    const handlerEditButtonClick = () => {
        if (selectedStudent.id === 0)
            return;

        handlerStudentModalShow();
    };

    const handlerDeleteButtonClick = () => {
        if (selectedStudent.id === 0)
            return;

        handlerConfirmationModalShow();
    };

    // Student modal handlers
    const handlerStudentModalShow = () => {
        setShowStudentModal(true);
    };

    const handlerStudentModalClose = (save: boolean) => {
        setShowStudentModal(false);

        if (!save)
            return;

        if (students.find(x => x.id == selectedStudent.id)) {
            dispatch(updateStudent(selectedStudent));
        }
        else {
            dispatch(addStudent(selectedStudent));
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
        dispatch(deleteStudent(selectedStudent.id));
    };

    return (
        <PageTemplate>
            <Card className="my-4">
                <Card.Header>{t("pages.student.name")}</Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-between">
                        <div className="w-100 d-flex">
                            <div className="col-md-3 col-sm-4 col-5">
                                <Form.Select
                                    value={selectedGroup ? selectedGroup.id : 0}
                                    onChange={e => setSelectedGroup(groups.find(x => x.id === Number(e.target.value)))}
                                >
                                    <option disabled value={0}>Select group</option>
                                    {groups.map((group) =>
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    )}
                                </Form.Select>
                            </div>
                            {(groupsIsLoading || studentsIsLoading) && <Spinner className="ms-3" animation="border"/>}
                        </div>
                        <ButtonGroup className="ms-2">
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
                    </div>
                    {studentsError && <Alert variant="danger" className="mt-3">{studentsError}</Alert>}
                    <StudentsTable
                        students={students}
                        selectedStudent={selectedStudent}
                        setSelectedStudent={setSelectedStudent}
                        group={selectedGroup!}
                    />
                    <StudentModal
                        show={showStudentModal}
                        handlerClose={handlerStudentModalClose}
                        student={selectedStudent}
                        setStudent={setSelectedStudent}
                        group={selectedGroup!}
                    />
                    <DefaultConfirmationModal
                        show={showConfirmationModal}
                        handlerClose={handlerConfirmationModalClose}
                        onConfirm={handlerConfirmationModalOnClose}
                        value={t("pages.student.confirm_modal", {surname: selectedStudent.surname, name: selectedStudent.name})}
                    />
                </Card.Body>
            </Card>
        </PageTemplate>
    );
};

export default StudentsPage;