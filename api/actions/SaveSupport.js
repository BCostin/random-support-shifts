import momentBiz from 'moment-business-days';
import { getNextDayNoWeekend } from "../../helpers/date";
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
        rows[i].available_on = getNextDayNoWeekend(rows[i].supportDay, 2);

        if (theirShifts && theirShifts.length) {
            for (let k in theirShifts) {
                if (item.worker_id == theirShifts[k].worker_id) {
                    rows[i].available_on = SetMaxTwoWeeks(theirShifts[k].support_day);
                }
            }
        }
    });

    // Create insert values from final adjusted rows
    rows.forEach((item, i) => {
        insertValues += `(${item.worker_id}, "${item.supportDay}", "${item.available_on}", 1)`;
        insertValues += i < rows.length - 1 ? ', ' : ';';
    })

    // Here we would need to actually UPDATE all shifts to status 0
    // where available_on is less or equal to today. Otherwise we hit a cap when all have 2 shifts
    // !!! NOT-IMPLEMENTED YET

    // Save hummans for support on day X
    await DbSaveHumans(rows, insertValues);
    return await ListAll();
}

/**
 * If one human must have 2 shifts total in 2 weeks
 * we would have 2 days for support and another 8 free
 * so we'll just add 8 business days
 * 
 * @param - STRING - first support day which we from 'DbCheckShifts'
 *          for 2 humans, the ones we're about to set for support shift
 * @return - STRING - date string
 */
const SetMaxTwoWeeks = (firstSupportDay) => {
    return momentBiz(firstSupportDay).businessAdd(8).format('YYYY-MM-DD');
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
