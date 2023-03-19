import React, {FC, useEffect, useState} from 'react';
import {Badge, Form} from "react-bootstrap";
import {ISchedule} from "../../models/ISchedule";
import {useAppSelector} from "../../hooks/redux";
import {ISubject} from "../../models/ISubject";
import {ITeacher} from "../../models/ITeacher";
import {ISubjectType} from "../../models/ISubjectType";

interface ScheduleCardProps {
    schedule: ISchedule;
    selectedSchedule: ISchedule;
    setSelectedSchedule: (schedule: ISchedule) => void;
}

const ScheduleCard: FC<ScheduleCardProps> = ({schedule, selectedSchedule, setSelectedSchedule}) => {
    const {subjects} = useAppSelector(state => state.subjectsReducer);
    const {teachers} = useAppSelector(state => state.teachersReducer);
    const {subjectTypes} = useAppSelector(state => state.subjectTypesReducer);

    const [currentSubject, setCurrentSubject] = useState<ISubject>();
    const [currentTeacher, setCurrentTeacher] = useState<ITeacher>();
    const [currentSubjectType, setCurrentSubjectType] = useState<ISubjectType>();

    useEffect(() => {
        setCurrentSubject(subjects.find(x => x.id == schedule.subjectId));
        setCurrentTeacher(teachers.find(x => x.id == schedule.teacherId));
        setCurrentSubjectType(subjectTypes.find(x => x.id == schedule.subjectTypeId));
    }, [schedule]);

    return (
        <div className="p-2 bg-light" onClick={() => {setSelectedSchedule(schedule)}}>
            <Form.Check type="radio">
                <Form.Check.Input
                    type="radio"
                    checked={selectedSchedule.id === schedule.id}
                    onChange={() => {setSelectedSchedule(schedule)}}
                />
                <Form.Check.Label>
                    <h6 className="m-0">
                        {currentSubject?.shortName !== undefined ?
                            currentSubject?.shortName :
                            currentSubject?.name
                        }
                        <Badge bg="primary" className="ms-1">{currentSubjectType?.shortName}</Badge>
                    </h6>
                </Form.Check.Label>
            </Form.Check>
            <div>
                {schedule.startDate &&
                <>
                    {schedule.startDate!.substring(5).split("-").reverse().join(".")}
                    -
                    {schedule.endDate!.substring(5).split("-").reverse().join(".")}
                </>
                }
                {schedule.isRolling && <Badge bg="secondary" className="ms-1">Ч/Т</Badge>}
                {schedule.additionalDates.length !== 0 &&
                    <>
                        та [
                        {schedule.additionalDates.map((date) =>
                            <span key={date.date}>
                                {date.date.substring(5).split("-").reverse().join(".")}
                            </span>
                        )}
                        ]
                    </>
                }
                {schedule.removedDates.length !== 0 &&
                    <>
                        крім [
                        {schedule.removedDates.map((date) =>
                            <span key={date.date}>
                                {date.date.substring(5).split("-").reverse().join(".")}
                            </span>
                        )}
                        ]
                    </>
                }
            </div>
            <div>
                {currentTeacher?.surname + ' '}
                {currentTeacher?.name.substring(0, 1)}.
                {currentTeacher?.patronymic.substring(0, 1)}.
            </div>
        </div>
    );
};

export default ScheduleCard;