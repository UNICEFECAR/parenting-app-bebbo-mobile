import { rootReducer } from "../redux";
import { selectRoleAction, RoleErrorAction, RoleModel, LoginAction, LoginErrorAction, UserModel } from "../interfaces/interface";
export const On_Login:string = "On_Login";
export const On_Login_Error:string = "On_Login_Error";
export const On_Role:string = "On_Role";
export const On_Role_Error:string = "On_Role_Error";
export type UserActionList = LoginAction | LoginErrorAction;
export type RoleActionList = selectRoleAction | RoleErrorAction;

export type UserState={
    user:UserModel,
    error:string|undefined|null
}
//RoleState
export type RoleState={
    roles:RoleModel,
    error:string|undefined|null
}
export type UserProps = {
    user: string,
    token:string,
    jti:string,
    getRoles:Function,
    roles:Array<RoleModel>
}
  export type RoleProps = {
    roles: []
  }
export type ApplicationState= ReturnType<typeof rootReducer>

export type ApiImageData = {
  srcUrl: string;
  destFolder: string;
  destFilename: string;
};

