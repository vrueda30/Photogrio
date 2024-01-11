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

export const timeToString = (hour: number, minutes: number) => {
    const ampm = hour >= 12 ? "pm" : "am";
    const actualHour = hour > 12 ? hour - 12 : hour;
    const hourPadded = actualHour.toString().padStart(2, "0")
    const minutesPadded = minutes.toString().padEnd(2, "0")
    const timeAsString = `${hourPadded}:${minutesPadded}${ampm}`
    return timeAsString === "00:00am" ? "12:00am" : timeAsString
}
