export interface Props{
    month: string,
    day: string | number,
    year: string,
    monthNumber: number,
    imageIndex?: number | undefined,
    temp?: number
}

export interface Task{
    id?: number
    name: string,
    type: number,
    start: string
}
