import { DB } from "../db";

/**
 * Return maximum 2 random Engineer IDs
 * 
 * @param - STRING - support day for which we pick the engineers
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
