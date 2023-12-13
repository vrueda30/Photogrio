export interface Contact {
    ID: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    accountId: number,
    contactType: number,
    birthDay?: Date,
    notes: string,
    profilePic: string,
    address:Address,
    state?:string,
    address1:string,
    address2: string,
    city: string,
    zip: string,
}

export interface Address {
    ID?: number | undefined,
    address1?: string,
    address2?: string,
    city?: string,
    state?: string,
    zip?: string
    accountId?: number
}