import React, {FC} from 'react';
import {Form, Table} from "react-bootstrap";
import {ISubgroup} from '../../models/ISubgroup';
import {useTranslation} from "react-i18next";

interface SubgroupsTableProps {
    subgroups: ISubgroup[];
    selectedSubgroup: ISubgroup;
    setSelectedSubgroup: (group: ISubgroup) => void;
}

const SubgroupsTable: FC<SubgroupsTableProps> = ({subgroups, selectedSubgroup, setSelectedSubgroup}) => {
    const {t} = useTranslation();

    return (
        <div className="overflow-auto">
            <Table striped bordered hover className="mb-0 text-nowrap align-middle">
                <thead>
                <tr>
                    <th className="text-center cell-fit">#</th>
                    <th className="text-center cell-fit">{t("header.check")}</th>
                    <th>{t("header.name")}</th>
                    <th>{t("header.index")}</th>
                </tr>
                </thead>
                <tbody>
                {subgroups.map((subgroup, index) =>
                    <tr key={subgroup.id} onClick={() => setSelectedSubgroup(subgroup)}>
                        <td className="text-center cell-fit">{index}</td>
                        <td className="text-center cell-fit">
                            <Form.Check
                                name="student-table-group"
                                type="radio"
                                checked={selectedSubgroup.id === subgroup.id}
                                onChange={() => setSelectedSubgroup(subgroup)}
                            />
                        </td>
                        <td>{subgroup.name}</td>
                        <td>{subgroup.index}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default SubgroupsTable;