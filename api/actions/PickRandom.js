import { DB } from '../db';
import { subBizDays } from '../../helpers/date';

/**
 * Return maximum 2 random Engineer IDs
 * 
 * @param - STRING - support day for which we pick the engineers
 * @return - ARRAY - a set of max 2 random distinct IDs
 */
export const PickRandom = async (supportDay) => {
    let availableWorkers = await DbGetAvailableHumans(supportDay);
    if (!availableWorkers || !availableWorkers.length) return [];

    // Here we generate 2 indexes with a max value 
    // based on total available workers
    let total = availableWorkers.length;
    
    let getIds = (workers, flag) => {
        let nr = [];
        for (let i = 0; i < total; i = i + 1) {
            let rand = Math.floor(Math.random() * total);
            let randomId = workers[rand].id;
            if (nr.indexOf(randomId) == -1 && nr.length < 2) {
                nr.push(randomId);
            }
    
            rand = null; randomId = null;
        };

        let idOne = nr[0];
        let shiftOne = availableWorkers.filter(item => item.id === idOne);
            shiftOne = shiftOne[0] ? shiftOne[0].totalShifts : 0;

        let idTwo = nr[1];
        let shiftTwo = availableWorkers.filter(item => item.id === idTwo);
            shiftTwo = shiftTwo[0] ? shiftTwo[0].totalShifts : 0;
        
        if (nr.length < 2 || idOne == idTwo || shiftOne != shiftTwo) {
            return getIds(workers, flag);
        } else {
            return nr;
        }
    }
    
    return await getIds(availableWorkers);
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
                e.name,
                support_day as orig_day,
                MAX(s.support_day) as support_day,
                MAX(s.available_on) as available_on,
                (select count(*) from shifts where worker_id = e.id and status = 1) as totalShifts
            FROM employees e
            LEFT JOIN shifts s ON e.id = s.worker_id
            GROUP BY e.id
            HAVING 
                date(s.support_day) < date("${supportDay}")
                OR date(s.support_day) = null OR totalShifts < 2 
            ORDER BY totalShifts DESC
        `;

        DB.serialize(() => {
            DB.all(sql, async (err, rows ) => {
                let result = [];
                if (rows) {
                    rows.forEach(item => {
                        if ((item.totalShifts < 2 && subBizDays(supportDay, 1) != item.support_day)
                            && (item.available_on == null || item.available_on <= supportDay || item.support_day < supportDay)
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