import React, {FC, useEffect, useState} from 'react';
import {Table} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {fetchScheduleByDayOfWeek} from "../../services/SchedulesService";
import {ISchedule} from "../../models/ISchedule";
import ScheduleCard from "./ScheduleCard";
import {useTranslation} from "react-i18next";

interface ScheduleTableProps {
    schedules: ISchedule[];
    selectedSchedule: ISchedule;
    setSelectedSchedule: (schedule: ISchedule) => void;
}

interface DescriptorElement {
    id: number;
    name: string;
    colSpan: number;
}

interface Descriptor {
    groups: DescriptorElement[];
    subgroups: DescriptorElement[];
    hiddenCols: JSX.Element[];
}

interface ContentCard {
    colSpan: number;
    type: string;
    schedule?: ISchedule;
}

interface Content {
    index?: number;
    time?: string;
    rowSpan?: number;
    cards: ContentCard[];
}

const ScheduleTable: FC<ScheduleTableProps> = ({schedules, selectedSchedule, setSelectedSchedule}) => {
    const {t} = useTranslation();

    const dispatch = useAppDispatch();

    //TODO Add loadings and errors
    const {groups, groupsIsLoading, groupsError} = useAppSelector(state => state.groupsReducer);
    const {coupleTimes, coupleTimesIsLoading, coupleTimesError} = useAppSelector(state => state.coupleTimesReducer);

    const [tableDescriptor, setTableDescriptor] = useState<Descriptor>();
    const [tableContent, setTableContent] = useState<Content[]>([]);

    // Generate table descriptor
    useEffect(() => {
        let localTableDescriptor: Descriptor = {
            groups: [],
            subgroups: [],
            hiddenCols: []
        };

        let hiddenColsCount = 0;

        for (let i = 0; i < groups.length; i++) {
            let groupTemplate: DescriptorElement = {
                id: groups[i].id,
                name: groups[i].name,
                colSpan: 0
            }

            groups[i].subgroups?.forEach((subgroup) => {
                if (localTableDescriptor.subgroups.find(x => x.name === subgroup.name)) {
                    hiddenColsCount -= 1;
                    localTableDescriptor.groups[i - 1].colSpan -= 1;
                    groupTemplate.colSpan += 1;
                }
                else {
                    localTableDescriptor.subgroups.push({id: subgroup.id, name: subgroup.name, colSpan: 2})
                    groupTemplate.colSpan += 2;
                }
            });

            hiddenColsCount += groupTemplate.colSpan;
            localTableDescriptor.groups.push(groupTemplate);
        }

        // Generating hidden cols
        for (let i = 0; i < hiddenColsCount; i++) {
            localTableDescriptor.hiddenCols.push(<td key={i} className="p-0"/>)
        }

        console.log(localTableDescriptor);
        setTableDescriptor(localTableDescriptor);
    }, [groups]);

    // Generate table context
    useEffect(() => {
        if (!tableDescriptor)
            return;

        const localTableContent: Content[] = [];

        coupleTimes.forEach((coupleTime) => {
            let rowsCards: ContentCard[][] = [];

            const schedulesByCouple = schedules.filter(x => x.coupleTimeId === coupleTime.id);

            if (schedulesByCouple.length) {
                for (const schedule of schedulesByCouple) {
                    const cards: ContentCard[] = [];

                    if (schedule.subgroupId) {
                        const subgroupIndex = tableDescriptor.subgroups
                            .indexOf(tableDescriptor.subgroups.find(x => x.id == schedule.subgroupId)!);

                        const subgroupRow = rowsCards.find(x => x[0].type === 'subgroup' &&
                            x[subgroupIndex].schedule === undefined);

                        if (subgroupRow) {
                            const subgroupRowIndex = rowsCards.indexOf(subgroupRow);

                            if (!rowsCards[subgroupRowIndex][subgroupIndex].schedule) {
                                rowsCards[subgroupRowIndex][subgroupIndex].schedule = schedule;
                                continue;
                            }
                        }

                        tableDescriptor.subgroups.forEach(() => {
                            cards.push({schedule: undefined, colSpan: 2, type: 'subgroup'});
                        })

                        cards[subgroupIndex].schedule = schedule;
                        rowsCards.push(cards);
                    }
                    else if (schedule.groups.length === 1) {
                        const groupIndex = tableDescriptor.groups
                            .indexOf(tableDescriptor.groups.find(x => x.id == schedule.groups[0].id)!);

                        const groupRow = rowsCards.find(x => x[0].type === 'group' &&
                            x[groupIndex].schedule === undefined);


                        if (groupRow) {
                            const groupRowIndex = rowsCards.indexOf(groupRow);

                            if (!rowsCards[groupRowIndex][groupIndex].schedule) {
                                rowsCards[groupRowIndex][groupIndex].schedule = schedule;
                                continue;
                            }
                        }

                        tableDescriptor.groups.forEach((group) => {
                            cards.push({schedule: undefined, colSpan: group.colSpan, type: 'group'});
                        })

                        cards[groupIndex].schedule = schedule;
                        rowsCards.push(cards);
                    }
                    else {
                        rowsCards.push([{
                            schedule: schedule,
                            colSpan: tableDescriptor.hiddenCols.length,
                            type: 'stream'
                        }]);
                    }
                }
            }
            else {
                let cards: ContentCard[] = [];

                tableDescriptor.subgroups.forEach(() => {
                    cards.push({schedule: undefined, colSpan: 2, type: 'subgroup'});
                })

                rowsCards.push(cards);
            }

            let tableContent: Content;

            rowsCards.map((cards, index) => {
                tableContent = {cards: cards}

                if (index === 0) {
                    tableContent = {
                        ...tableContent,
                        index: coupleTime.index,
                        time: coupleTime.timeStart.substring(0, 5) + '-' + coupleTime.timeEnd.substring(0, 5),
                        rowSpan: rowsCards.length,
                    }
                }

                localTableContent.push(tableContent);
            });
        });

        setTableContent(localTableContent);
    }, [schedules]);

    return (
        <div className="overflow-auto mt-3">
            {groupsIsLoading ?
                <div>Loading</div> :
                <Table bordered className="mb-0 text-nowrap align-middle">
                    <thead>
                    <tr>
                        <th rowSpan={2} className="text-center cell-fit">#</th>
                        <th rowSpan={2} className="text-center cell-fit">{t("header.time")}</th>
                        {tableDescriptor?.groups.map((group, index) =>
                            <th key={index} colSpan={group.colSpan} className="text-center">{group.name}</th>
                        )}
                    </tr>
                    <tr>
                        {tableDescriptor?.subgroups.map((subgroup, index) =>
                            <th key={index} colSpan={subgroup.colSpan} className="text-center">{subgroup.name}</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {tableContent.map((row, index) =>
                        <tr key={'row-' + index}>
                            {row?.rowSpan && <td rowSpan={row?.rowSpan} className="text-center">{row.index}</td>}
                            {row?.rowSpan && <td rowSpan={row?.rowSpan} className="text-center">{row.time}</td>}
                            {row.cards.map((card, index) =>
                                <td key={'card-' + index} className="p-0" colSpan={card.colSpan}>
                                    {card.schedule &&
                                        <ScheduleCard
                                            schedule={card.schedule}
                                            selectedSchedule={selectedSchedule}
                                            setSelectedSchedule={setSelectedSchedule}
                                        />
                                    }
                                </td>
                            )}
                        </tr>
                    )}
                    </tbody>
                    <tfoot>
                    <tr style={{
                        borderBottomColor: "transparent",
                        borderLeftColor: "transparent",
                        borderRightColor: "transparent"
                    }}>
                        <td className="p-0"/>
                        <td className="p-0"/>
                        {tableDescriptor?.hiddenCols}
                    </tr>
                    </tfoot>
                </Table>
            }
        </div>
    );
};

export default ScheduleTable;
