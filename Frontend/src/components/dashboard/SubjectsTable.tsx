import React, {FC} from 'react';
import {Form, Table} from "react-bootstrap";
import {ISubject} from "../../models/ISubject";
import {useTranslation} from "react-i18next";

interface SubjectsTableProps {
    subjects: ISubject[];
    selectedSubject: ISubject;
    setSelectedSubject: (subject: ISubject) => void;
}

const SubjectsTable: FC<SubjectsTableProps> = ({subjects, selectedSubject, setSelectedSubject}) => {
    const {t} = useTranslation();

    return (
        <div className="overflow-auto">
            <Table striped bordered hover className="mb-0 text-nowrap align-middle">
                <thead>
                <tr>
                    <th className="text-center cell-fit">#</th>
                    <th className="text-center cell-fit">{t("header.check")}</th>
                    <th>{t("header.name")}</th>
                    <th>{t("header.short_name")}</th>
                    <th>{t("header.laboratory_count")}</th>
                    <th>{t("header.practical_count")}</th>
                </tr>
                </thead>
                <tbody>
                {subjects.map((subject, index) =>
                    <tr key={subject.id} onClick={() => setSelectedSubject(subject)}>
                        <td className="text-center">{index}</td>
                        <td className="text-center">
                            <Form.Check
                                name="student-table-group"
                                type="radio"
                                checked={selectedSubject.id === subject.id}
                                onChange={() => setSelectedSubject(subject)}
                            />
                        </td>
                        <td>{subject.name}</td>
                        <td>{subject.shortName}</td>
                        <td>{subject.laboratoryCount}</td>
                        <td>{subject.practicalCount}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default SubjectsTable;