import { addBizDays } from "../../helpers/date";
import { DB } from "../db";
import { ListAll } from "./ListAll";

/**
 * Save the new support humans that have been randomly picked
 * 
 * @param - ARRAY - includes all shift objects
 * @param - STRING - day of support, not used anymore, probably will remove it
 * @return - OBJECT - same result as ListAll action
 */
export const SaveSupport = async (rows, supportDay) => {
    if (!rows || !rows.length) return null;
    let ids = rows && rows.map(item => item.worker_id);

    let theirShifts = await DbCheckShifts(ids);
    let insertValues = '';

    // Adjust rows to be inserted
    rows.forEach((item, i) => {
        rows[i].available_on = addBizDays(rows[i].supportDay, 2);

        if (theirShifts && theirShifts.length) {
            for (let k in theirShifts) {
                if (item.worker_id == theirShifts[k].worker_id) {
                    rows[i].available_on = addBizDays(theirShifts[k].support_day, 10);
                }
            }
        }
    });

    // Create insert values from final adjusted rows
    rows.forEach((item, i) => {
        insertValues += `(${item.worker_id}, "${item.supportDay}", "${item.available_on}", 1)`;
        insertValues += i < rows.length - 1 ? ', ' : ';';
    })

    // Save hummans for support on day X
    await DbSaveHumans(rows, insertValues);
    return await ListAll();
}

const DbSaveHumans = (rows, insertValues) => {
    return new Promise((resolve) => {
        let sql = `INSERT INTO shifts (worker_id, support_day, available_on, status) VALUES ${insertValues}`;
         
        DB.serialize(() => {
            DB.run(sql, (res, err) => {
                resolve({ success: 1 });
            });
        });
    })
}

const DbCheckShifts = (ids) => {
    let str = '';
    for (let k in ids) {
        str += 's.worker_id=' + ids[k];
        if (k < ids.length - 1) str += ' OR '
    }

    return new Promise((resolve) => {
        let sql = `
            SELECT s.*
            FROM shifts s
            WHERE
                s.status = 1 
                AND ${str}
        `;
        
        DB.serialize(() => {
            DB.all(sql, (err, rows ) => {
                resolve(rows);
            });
        });
    })
}

export const DbListSupport = () => {
    return new Promise((resolve) => {
        let sql = `
            SELECT 
                e.name,
                s.*
            FROM shifts s
            LEFT JOIN employees e ON s.worker_id = e.id
        `;
        
        DB.serialize(() => {
            DB.all(sql, (err, rows ) => {
                resolve(rows);
            });
        });
    })
}
