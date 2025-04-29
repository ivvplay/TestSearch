import {IResponseData} from "./IResponceData.ts";
import {IPosition} from "../IPosition.ts";

export interface IResponceSortData {
    updateItem: IResponseData | undefined;
    positions: IPosition | undefined;
}