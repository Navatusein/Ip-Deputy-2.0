export interface IStudent {
    id: number;
    groupId: number;
    subgroupId: number;
    index: number;
    name: string;
    surname: string;
    patronymic: string;
    telegramPhone: string;
    contactPhone: string;
    email: string;
    fitEmail: string;
    telegramNickname: string;
    telegramId: number | undefined;
    birthday: string;
    lastCongratulations: string | undefined;
    lastActivity: string | undefined;
}