import moment from 'moment';
import momentBiz from 'moment-business-days';

export const getNextDayNoWeekend = (day, jumpDays) => {
    if (!jumpDays) jumpDays = 0;
    let nextDay = moment(day).add(jumpDays, 'days').format('YYYY-MM-DD');
    let weekend = [moment(day).day(6).format('YYYY-MM-DD'), moment(day).day(7).format('YYYY-MM-DD')];
    
    if (weekend.indexOf(nextDay) != -1) {
        nextDay = moment(weekend[1]).add(1, 'days').format('YYYY-MM-DD');
    }

    return nextDay;
}

export const getPrevDayNoWeekend = (day, jumpDays) => {
    if (!jumpDays) jumpDays = 0;
    let prevDay = moment(day).subtract(jumpDays, 'days').format('YYYY-MM-DD');
    let weekend = [moment(day).day(6).format('YYYY-MM-DD'), moment(day).day(7).format('YYYY-MM-DD')];
    
    if (weekend.indexOf(prevDay) != -1) {
        prevDay = moment(weekend[0]).subtract(1, 'days').format('YYYY-MM-DD');
    }

    return prevDay;
}

export const addBizDays = (date, jump) => {
    return momentBiz(date).businessAdd(jump).format('YYYY-MM-DD');
}

export const subBizDays = (date, jump) => {
    return momentBiz(date).businessSubtract(jump).format('YYYY-MM-DD');
}

export const getToday = getNextDayNoWeekend(moment().format('YYYY-MM-DD'));
