import { DB } from "../db";
import { ListAll } from "./ListAll";

export const UpdateShifts = async (supportDay) => {
    return await DbUpdateShifts(supportDay);
}

const DbUpdateShifts = async (supportDay) => {
    let cb = (resolve) => {
        let sql = `
            SELECT 
                rowid,
                s.worker_id,
                s.available_on,
                s.status,
                s.support_day,
                count(rowid) as totalShifts
            FROM shifts s
            GROUP BY rowid
            HAVING 
                status = 1
                AND date("${supportDay}") >= date(available_on)
        `;

        DB.serialize(() => {
            DB.all(sql, (err, rows ) => {
                if (rows) {
                    let orIdConds = '';
                    for (let k in rows) {
                        orIdConds += 'worker_id=' + rows[k].worker_id;
                        orIdConds += k == rows.length - 1 ? '' : ' OR ';
                    }

                    let sqlClean = `UPDATE shifts SET status = 0 WHERE status = 1 AND ${orIdConds}`;
                    DB.run(sqlClean, async (err, up) => {
                        resolve(await ListAll());
                    });
                }
            });
        });
    }

    return await new Promise(cb);
}