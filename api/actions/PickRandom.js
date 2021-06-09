import moment from "moment";
import { getPrevDayNoWeekend, getToday } from "../../helpers/date";
import { DB } from "../db";

/**
 * Return Random numbers
 * 
 * @param - STRING - the support day for which we pick the engineers
 * @return - ARRAY - a set of max 2 random distinct IDs
 */
export const PickRandom = async (supportDay) => {
    let availableWorkers = await DbGetAvailableHumans(supportDay);
    let randomIds = [];
    
    // Here we generate 2 indexes with a max value 
    // based on total available workers
    let total = availableWorkers.length;
    for (let i = 0; i < total; i = i + 1) {
        let rand = Math.floor(Math.random() * total);
        let randomId = availableWorkers[rand].id;
        if (randomIds.indexOf(randomId) == -1 && randomIds.length < 2) {
            randomIds.push(randomId);
        }
  
        rand = null;
    };

    return randomIds;
}


const DbGetAvailableHumans = (supportDay) => {
    return new Promise((resolve) => {
        let sql = `
            SELECT 
                e.id,
                s.*,
                (select count(*) from shifts where worker_id = e.id and status = 1) as totalShifts
            FROM employees e
            LEFT JOIN shifts s ON e.id = s.worker_id
        `;

        DB.serialize(() => {
            DB.all(sql, async (err, rows ) => {
                let result = [];
                if (rows) {
                    rows.forEach(item => {
                        if ((item.totalShifts < 2)
                            && (item.available_on == null || item.available_on <= supportDay)
                        ) {
                            result.push(item);
                        }
                    })
                }
                resolve(result);
            });
        });
    })
}

const DbGetShiftsDiff = (ids) => {
    return new Promise((resolve) => {
        let sql = `
            SELECT 
                s.worker_id,
                (select count(*) from shifts where worker_id = s.worker_id and status = 1) as totalShifts
            FROM shifts s
            WHERE 
                s.status = 1
                AND s.worker_id IN (${ids.join(',')});
        `;
        
        DB.serialize(() => {
            DB.all(sql, (err, rows ) => {
                resolve(rows);
            });
        });
    })
}