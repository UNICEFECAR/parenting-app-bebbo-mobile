import { AxiosResponse } from "axios";

export interface commonApiInterface {(apiEndpoint:string,method:string,postdata:object): Promise<AxiosResponse>
}