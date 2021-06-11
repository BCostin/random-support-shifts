/**
 * ------------------------------------------------------------------------------------------
 * Create the initial data set with 10 workers
 * ------------------------------------------------------------------------------------------
 */

let names = ['Albert', 'Alfred', 'John', 'Batman', 'Wallie', 'Larisa', 'Hanna', 'Natalia', 'Jessica', 'Messi'];

export const engineers = names.map((item, i) => {
    return {
        id: i + 1,
        name: item,
        available: 1,
    }
});