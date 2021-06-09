import { getNextDayNoWeekend, getToday } from '../../helpers/date';
import { DB } from '../db';
import { DbListSupport } from './SaveSupport';

/**
 * Get all engineers
 * 
 * @return - OBJECT - return same as DbGetWorkers, acts as wrapper
 */
export const ListAll = async () => {
    return await DbGetWorkers();
}


/**
 * 'Model' function to get data from sqlite
 * 
 * @return - OBJECT - return object with 3 keys (workers, support, nextSupportDay)
 */
export const DbGetWorkers = async () => {
    // Get all saved support first
    let support = await DbListSupport();

    return new Promise((resolve) => {
        let sql = `
            SELECT 
                e.*,
                (
                    SELECT 
                    COUNT(*) 
                    FROM shifts s 
                    WHERE 
                        s.worker_id = e.id
                        AND s.status = 1
                ) as totalShifts
            FROM employees e
        `;

        DB.serialize(() => {
            DB.all(sql, (err, rows ) => {
                let nextSupportDay = getToday;
                if (support) {
                    support.forEach(item => {
                        if (item.support_day >= nextSupportDay) nextSupportDay = getNextDayNoWeekend(item.support_day, 1);
                    });
                }

                resolve({
                    workers: rows,
                    support: support,
                    nextSupportDay: nextSupportDay,
                });
            });
        });
    })
}