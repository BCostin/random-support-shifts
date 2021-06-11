/**
 * ------------------------------------------------------------------------------------------
 * Format all support shifts to include both humans in same record
 * Used in both SupportList Component and SupportPeriod Component as well
 * ------------------------------------------------------------------------------------------
 */
export const formatSupportList = (data) => {
    if (!data || !data.length) return [];
    let format = [];
    let dates = {};
    data.forEach(item => {
        if (!dates[item.support_day]) {
            dates[item.support_day] = item.name;
        } else {
            dates[item.support_day] += ` + ${item.name}`;
        }
    })
    
    if (dates) {
        let keys = Object.keys(dates);
        for (let k in keys) {
            format.push({ day: keys[k], names: dates[keys[k]]});
        }

    }
    return format;
}