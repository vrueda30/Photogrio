export interface Props{
    month: string,
    day: string | number,
    year: string
    imageIndex?: number | undefined
}

export interface Task{
    name: string,
    type: number
}
