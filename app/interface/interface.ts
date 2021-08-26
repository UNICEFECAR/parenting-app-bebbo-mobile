import { AxiosResponse } from "axios";

export interface commonApiInterface {(apiEndpoint:string,method:string,postdata:object): Promise<AxiosResponse>
}
export interface Child {
    childId: string,
    birthDay: string,
    name: string,
    photo: string | null,
    gender: string,
    isCurrentActive: boolean
    id: string
}
