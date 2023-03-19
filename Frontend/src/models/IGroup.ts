import {ISubgroup} from "./ISubgroup";

export interface IGroup {
    id: number;
    name: string;
    subgroups: ISubgroup[];
}