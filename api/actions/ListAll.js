import { getNextDayNoWeekend, getToday } from '../../helpers/date';
import { DB } from '../db';
import { DbListSupport } from './SaveSupport';

/**
 * Get all engineers
 * 
 * Normally we would do some query here but we already have
 * our 'special' data file
 * 
 * So this api request will just return us the results
 */
export const ListAll = async () => {
    return await DbGetWorkers();
}

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