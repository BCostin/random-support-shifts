import moment from "moment";
import { getNextDayNoWeekend } from "../../helpers/date";
import { DB, initDatabase } from "../db";
import { ListAll } from "./ListAll";

/**
 * Save random humans for support
 * 
 * @param - STRING - the support day for which we pick the engineers
 * @return - ARRAY - a set of 2 random distinct IDs
 */
export const StartOver = async () => {
    let reset = await DbReset();
    let newRows = await ListAll();
    return newRows;
}


const DbReset = async () => {
    return new Promise((resolve) => {
        let result = initDatabase();
        resolve({ result: result });
    })
}