import React, {FC} from 'react';
import {IStudent} from "../../models/IStudent";
import {Badge, Form, Table} from "react-bootstrap";
import {IGroup} from '../../models/IGroup';
import {useTranslation} from "react-i18next";

interface StudentsTableProps {
    students: IStudent[];
    selectedStudent: IStudent;
    setSelectedStudent: (student: IStudent) => void;
    group: IGroup;
}

const StudentsTable: FC<StudentsTableProps> = ({students, selectedStudent, setSelectedStudent, group}) => {
    const {t} = useTranslation();

    return (
        <div className="overflow-auto mt-3">
            <Table striped bordered hover className="mb-0 text-nowrap align-middle">
                <thead>
                <tr>
                    <th className="cell-fit text-center">#</th>
                    <th className="cell-fit text-center">{t("header.check")}</th>
                    <th>{t("header.person_surname")}</th>
                    <th>{t("header.person_name")}</th>
                    <th>{t("header.person_patronymic")}</th>
                    <th>{t("header.subgroup")}</th>
                    <th>{t("header.email")}</th>
                    <th>{t("header.fit_email")}</th>
                    <th>{t("header.telegram_phone")}</th>
                    <th>{t("header.contact_phone")}</th>
                    <th>{t("header.telegram_nickname")}</th>
                    <th>{t("header.birthday")}</th>
                </tr>
                </thead>
                <tbody>
                {students.map((student) =>
                    <tr key={student.id} onClick={() => setSelectedStudent(student)}>
                        <td className="text-center">{student.index}</td>
                        <td className="text-center">
                            <Form.Check
                                name="student-table-group"
                                type="radio"
                                checked={selectedStudent.id === student.id}
                                onChange={() => setSelectedStudent(student)}
                            />
                        </td>
                        <td>{student.surname}</td>
                        <td>{student.name}</td>
                        <td>{student.patronymic}</td>
                        <td><Badge>{group?.subgroups.find(x => x.id === student.subgroupId)?.name}</Badge></td>
                        <td>{student.email}</td>
                        <td>{student.fitEmail}</td>
                        <td>{student.telegramPhone}</td>
                        <td>{student.contactPhone}</td>
                        <td>{student.telegramNickname}</td>
                        <td>{student.birthday.split("-").reverse().join(".")}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default StudentsTable;