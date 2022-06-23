export interface Medication {
    id: string,
    name: string,
    company: string,
    diagnosis: string,
    serial: string,
    type: string
}

export interface Schedule {
    id?: string,
    status: string,
    daily: boolean,
    weekly: boolean,
    monthly: boolean,
    custom: Array<string>,
    times: Array<string>,
    instructions: string,
    medication: Medication,
}