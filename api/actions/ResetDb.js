import { initDatabase } from "../db";
import { ListAll } from "./ListAll";

/**
 * Save random humans for support
 * 
 * @param - STRING - the support day for which we pick the engineers
 * @return - ARRAY - a set of 2 random distinct IDs
 */
export const StartOver = async () => {
    await DbReset();
    return await ListAll();
}

/**
 * Model function to re-create the db
 * @return - OBJECT - just to return something for now
 */
const DbReset = async () => {
    return new Promise((resolve) => {
        let result = initDatabase();
        resolve({ result: result });
    })
}