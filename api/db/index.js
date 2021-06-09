import sqlite3 from 'sqlite3';
import { engineers } from '../data/engineers';

const sqlite = sqlite3.verbose();
const DB_FILE = './support.db';

export const DB = new sqlite.Database(DB_FILE);

export const initDatabase = () => {
    dropAll();
    initTables();
    addEmployees();
    showShifts();
}

const initTables = () => {
    DB.serialize(() => {
        DB.run(`CREATE TABLE IF NOT EXISTS employees (id INT, name TEXT, available INT)`);
        DB.run(`CREATE TABLE IF NOT EXISTS shifts (worker_id INT, support_day TEXT, available_on TEXT, status INT)`);
    });
}

const dropAll = () => {
    DB.serialize(() => {
        DB.run("DROP TABLE IF EXISTS employees");
        DB.run("DROP TABLE IF EXISTS shifts");
    });
}

const addEmployees = () => {
    
    const getInsertString = () => {    
        let insertValues = '';
        engineers.forEach((item, i) => {
            insertValues += `(${item.id}, "${item.name}", ${item.available})`;
            if (i < engineers.length - 1) {
                insertValues += ',';
            } else {
                insertValues += ';';
            }
        })

        return insertValues;
    }

    let values = getInsertString();
    let sql = `INSERT INTO employees(id, name, available) VALUES${values}`;
    DB.serialize(() => {
        DB.run(sql);
    })
}

const showShifts = () => {
    let sql = `
        SELECT 
            s.worker_id as id,
            s.support_day,
            s.active_on,
            (SELECT name FROM employees WHERE id = s.worker_id) as name
        FROM shifts s
    `;

    // ADUCEM COUNT DIRECT DIN SELECT SIMPLU
    
    // let sql = `
    //     SELECT e.*, s.*
    //     FROM employees e
    //     LEFT JOIN shifts s
    //         on e.id = s.worker_id
    // `;

    DB.serialize(() => {
        DB.all(sql, (err, rows ) => {
            console.log(rows);
        });
    });
}
