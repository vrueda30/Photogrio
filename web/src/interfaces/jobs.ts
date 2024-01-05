export interface JobsCreateDTO{
    id: number,
    name: string,
    location: string,
    jobDateStart: Date,
    jobDateEnd: Date,
    allDay: boolean,
    notes: string,
    jobType: number,
    client: number
}