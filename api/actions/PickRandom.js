import { getToday } from "../../helpers/date";
import { DB } from "../db";

/**
 * Return maximum 2 random Engineer IDs
 * 
 * @param - STRING - support day for which we pick the engineers
 * @return - ARRAY - a set of max 2 random distinct IDs
 */
export const PickRandom = async (supportDay) => {
    // Update all shifts that have available on equal or greater than today
    // let update = await updateShifts(supportDay);
    // console.log(update);

    let availableWorkers = await DbGetAvailableHumans(supportDay);
    
    // Here we generate 2 indexes with a max value 
    // based on total available workers
    let generateRand = async (workers) => {
        let total = workers.length;
        let randomIds = [];
        for (let i = 0; i < total; i = i + 1) {
            let rand = Math.floor(Math.random() * total);
            let randomId = workers[rand].id;
            if (randomIds.indexOf(randomId) == -1 && randomIds.length < 2) {
                randomIds.push(randomId);
            }
    
            rand = null;
        };

        return randomIds;
    }
    
    let twoIds = [];
    while (twoIds.length < 2) {
        twoIds = await generateRand(availableWorkers);
    }
    
    return twoIds;
}


/**
 * Get available engineers and we also apply some business conditions
 * - max 2 shifts
 * - check availability date (which is calculated on 'SaveSupport' action)
 * 
 * @param - STRING - support day for which we pick the engineers
 * @return - ARRAY - a set of max 2 random distinct IDs
 */
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

const updateShifts = async (supportDay) => {
    console.log('supportDay: ', supportDay);
    let cb = (resolve) => {
        let sql = `
            SELECT 
                rowid,
                worker_id,
                max(support_day) as support_day,
                available_on,
                COUNT(support_day) as totalShifts
            FROM shifts 
            GROUP BY support_day
            HAVING 
                date("${supportDay}") >= date(available_on)
                AND status = 1
            
        `;

        DB.serialize(() => {
            DB.all(sql, async (err, rows ) => {
                let orIdConds = '';
                for (let k in rows) {
                    orIdConds += 'rowid=' + rows[k].rowid;
                    orIdConds += k == rows.length - 1 ? '' : ' OR ';
                }

                console.log('ids: ', orIdConds);

                let sqlUpdate = `
                    UPDATE shifts 
                    SET 
                        status = 0 
                    WHERE 
                        date("${supportDay}") >= date(available_on)
                `;
        
                resolve(rows);
            });
        });
    }

    return await new Promise(cb);
}