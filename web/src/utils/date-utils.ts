import * as dateMath from 'date-arithmetic'

export const firstVisible = (date:Date) => {
    const d =  dateMath.startOf(date, 'month');
    const day = d.getDay();
    if (day > 0) {
        d.setDate(d.getDate() - day)
    }
    return d;
}

export const lastVisible = (date:Date) => {
    const lastDate = dateMath.endOf(date, 'month');
    const dayOfWeek = lastDate.getDay();
    if (dayOfWeek < 6) {
        const incAmount = 6 - dayOfWeek;
        lastDate.setDate(lastDate.getDate() + incAmount)
    }

    return lastDate
}

export const localToUTC = (date:Date) => {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(),
        date.getUTCMinutes(), date.getUTCSeconds())
}