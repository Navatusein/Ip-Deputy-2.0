import {IGroup} from "./IGroup";
import { ISubmissionWork } from "./ISubmissionWork";

export interface ISubmissionConfig {
    id: number;
    subjectId: number;
    subjectTypeId: number;
    subgroupId: number | undefined;
    groups: IGroup[];
    submissionWorks: ISubmissionWork[];
}