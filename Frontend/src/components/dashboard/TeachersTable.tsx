import React, {FC} from 'react';
import {ITeacher} from "../../models/ITeacher";
import {Form, Table} from "react-bootstrap";
import {useTranslation} from "react-i18next";

interface TeachersTableProps {
    teachers: ITeacher[];
    selectedTeacher: ITeacher;
    setSelectedTeacher: (teacher: ITeacher) => void;
}

const TeachersTable: FC<TeachersTableProps> = ({teachers, selectedTeacher, setSelectedTeacher}) => {
    const {t} = useTranslation();

    return (
        <div className="overflow-auto">
            <Table striped bordered hover className="mb-0 text-nowrap align-middle">
                <thead>
                <tr>
                    <th className="cell-fit text-center">#</th>
                    <th className="cell-fit text-center">{t("header.check")}</th>
                    <th>{t("header.person_surname")}</th>
                    <th>{t("header.person_name")}</th>
                    <th>{t("header.person_patronymic")}</th>
                    <th>{t("header.contact_phone")}</th>
                    <th>{t("header.telegram_nickname")}</th>
                    <th>{t("header.email")}</th>
                    <th>{t("header.fit_email")}</th>
                </tr>
                </thead>
                <tbody>
                {teachers.map((teacher, index) =>
                    <tr key={teacher.id} onClick={() => setSelectedTeacher(teacher)}>
                        <td className="text-center">{index}</td>
                        <td className="text-center">
                            <Form.Check
                                name="student-table-group"
                                type="radio"
                                checked={selectedTeacher.id === teacher.id}
                                onChange={() => setSelectedTeacher(teacher)}
                            />
                        </td>
                        <td>{teacher.surname}</td>
                        <td>{teacher.name}</td>
                        <td>{teacher.patronymic}</td>
                        <td>{teacher.contactPhone}</td>
                        <td>{teacher.telegramNickname}</td>
                        <td>{teacher.email}</td>
                        <td>{teacher.fitEmail}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default TeachersTable;