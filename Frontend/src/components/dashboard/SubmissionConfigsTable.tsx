import React, {FC} from 'react';
import {Badge, Form, Table} from "react-bootstrap";
import {ISubmissionConfig} from "../../models/ISubmissionConfig";
import {useAppSelector} from "../../hooks/redux";
import {useTranslation} from "react-i18next";

interface SubmissionConfigsTableProps {
    submissionConfigs: ISubmissionConfig[];
    selectedSubmissionConfig: ISubmissionConfig;
    setSelectedSubmissionConfig: (submissionConfig: ISubmissionConfig) => void;
}

const SubmissionConfigsTable: FC<SubmissionConfigsTableProps> = ({
                                                                     submissionConfigs,
                                                                     selectedSubmissionConfig,
                                                                     setSelectedSubmissionConfig
                                                                 }) => {
    const {t} = useTranslation();

    const {subjects} = useAppSelector(state => state.subjectsReducer);
    const {subjectTypes} = useAppSelector(state => state.subjectTypesReducer);
    const {subgroups} = useAppSelector(state => state.subgroupsReducer);

    return (
        <div className="overflow-auto">
            <Table bordered hover className="mb-0 align-middle">
                <thead>
                <tr>
                    <th className="text-center cell-fit">#</th>
                    <th className="text-center cell-fit">{t("header.check")}</th>
                    <th className="text-nowrap">{t("header.name")}</th>
                    <th className="text-nowrap">{t("header.subject_type")}</th>
                    <th>{t("header.works")}</th>
                    <th>{t("header.subgroup")}</th>
                    <th>{t("header.groups")}</th>
                </tr>
                </thead>
                <tbody>
                {submissionConfigs.map((submissionConfig, index) =>
                    <tr key={submissionConfig.id} onClick={() => setSelectedSubmissionConfig(submissionConfig)}>
                        <td className="text-center cell-fit">{index}</td>
                        <td className="text-center cell-fit">
                            <Form.Check
                                name="student-table-group"
                                type="radio"
                                checked={selectedSubmissionConfig.id === submissionConfig.id}
                                onChange={() => setSelectedSubmissionConfig(submissionConfig)}
                            />
                        </td>
                        <td className="text-nowrap">
                            {subjects.find(x => x.id === submissionConfig.subjectId)?.name}
                        </td>
                        <td className="text-nowrap">
                            {subjectTypes.find(x => x.id === submissionConfig.subjectTypeId)?.name}
                        </td>
                        <td>
                            {submissionConfig.submissionWorks?.map((works) =>
                                <Badge key={works.id} className="me-2">{works.name}</Badge>
                            )}
                        </td>
                        <td>
                            {subgroups.find(x => x.id === submissionConfig.subgroupId) ?
                                <Badge>{subgroups.find(x => x.id === submissionConfig.subgroupId)?.name}</Badge> :
                                <Badge>None</Badge>
                            }
                        </td>
                        <td>
                            {submissionConfig.groups?.map((group) =>
                                <Badge key={group.id} className="me-2">{group.name}</Badge>
                            )}
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default SubmissionConfigsTable;