export interface Props{
    month: string,
    day: string | number,
    year: string,
    monthNumber: number,
    imageIndex?: number | undefined | null,
    temp?: number | undefined | null
}

export interface Task{
    id?: number
    name: string,
    type: number,
    start: string
}
