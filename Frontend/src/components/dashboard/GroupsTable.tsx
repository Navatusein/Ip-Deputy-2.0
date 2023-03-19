import React, {FC} from 'react';
import {IGroup} from "../../models/IGroup";
import {Badge, Form, Table} from "react-bootstrap";
import {useTranslation} from 'react-i18next';

interface GroupsTableProps {
    groups: IGroup[];
    selectedGroup: IGroup;
    setSelectedGroup: (group: IGroup) => void;
}

const GroupsTable: FC<GroupsTableProps> = ({groups, selectedGroup, setSelectedGroup}) => {
    const {t} = useTranslation();

    return (
        <div className="overflow-auto">
            <Table striped bordered hover className="mb-0 text-nowrap align-middle">
                <thead>
                <tr>
                    <th className="text-center cell-fit">#</th>
                    <th className="text-center cell-fit">{t("header.check")}</th>
                    <th>{t("header.name")}</th>
                    <th>{t("header.subgroups")}</th>
                </tr>
                </thead>
                <tbody>
                {groups.map((group, index) =>
                    <tr key={group.id} onClick={() => setSelectedGroup(group)}>
                        <td className="text-center cell-fit">{index}</td>
                        <td className="text-center cell-fit">
                            <Form.Check
                                name="student-table-group"
                                type="radio"
                                checked={selectedGroup.id === group.id}
                                onChange={() => setSelectedGroup(group)}
                            />
                        </td>
                        <td>{group.name}</td>
                        <td>
                            {group.subgroups?.map((subgroup) =>
                                <Badge key={subgroup.id} className="me-2">{subgroup.name}</Badge>
                            )}
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default GroupsTable;