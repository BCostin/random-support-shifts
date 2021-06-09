/**
 * Create the initial data set with 10 workers
 * 
 * By default, they will all start with status AVAILABLE
 * and only after we start picking them up for shifts they will
 * become unavailable.
 * 
 * This data set only serves as initial input, we will do all updates in react
 * 
 * This file is just a sample replacement for a real table/collection since
 * there's no db usage in this project and even if it was, it would have
 * had the same design and data. 
 * For simplicity, we use this method.
 */

let names = ['Albert', 'Alfred', 'John', 'Batman', 'Wallie', 'Larisa', 'Hanna', 'Natalia', 'Jessica', 'Messi'];

export const engineers = names.map((item, i) => {
    return {
        id: i + 1,
        name: item,
        available: 1,
    }
});