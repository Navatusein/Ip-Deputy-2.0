import {IGroup} from "./IGroup";
import {IScheduleDate} from "./IScheduleDate";

export interface ISchedule {
    id: number;
    subjectId: number;
    subjectTypeId: number;
    dayOfWeekId: number;
    coupleTimeId: number;
    startDate?: string;
    endDate?: string;
    isRolling: boolean;
    subgroupId?: number;
    teacherId: number;
    additionalInformation?: string;
    link?: string;
    groups: IGroup[];
    additionalDates: IScheduleDate[];
    removedDates: IScheduleDate[];
}