import { rootReducer } from "../redux";
import { selectRoleAction, RoleErrorAction, RoleModel, LoginAction, LoginErrorAction, UserModel } from "../interfaces/interface";
import { PERMISSIONS, PermissionStatus } from "react-native-permissions";
import { Platform } from "react-native";
import { DateTime } from "luxon";
import { DocumentDirectoryPath } from "react-native-fs";
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

export const PICKER_TYPE = {
  // FOR CAMERA
  CAMERA: "CAMERA",
  CAMERA_WITH_CROPPING: "CAMERA_WITH_CROPPING",
  CAMERA_BINARY_DATA: "CAMERA_BINARY_DATA",
  CAMERA_WITH_CROPPING_BINARY_DATA: "CAMERA_WITH_CROPPING_BINARY_DATA",

  // FOR GALLERY
  GALLERY: "GALLERY",
  GALLERY_WITH_CROPPING: "GALLERY_WITH_CROPPING",
  GALLERY_BINARY_DATA: "GALLERY_BINARY_DATA",
  GALLERY_WITH_CROPPING_BINARY_DATA: "GALLERY_WITH_CROPPING_BINARY_DATA",

  // FOR MULTI PICK
  MULTI_PICK: "MULTI_PICK",
  MULTI_PICK_BINARY_DATA: "MULTI_PICK_BINARY_DATA",
};
export const CROPPED_IMAGE_WIDTH = 800;
export const CROPPED_IMAGE_HEIGHT = 800;
export const CHILDREN_PATH=`${DocumentDirectoryPath}/children`;
export const IMAGE_PICKER_OPTIONS = {
  cropping: true,
  // includeExif: false, // Include image details in the response
  includeBase64: false, // (default false) | image as a base64-encoded string in the data property
  // mediaType: "photo", // default 'any' | ('photo', 'video', or 'any')
  // useFrontCamera: false, // (default false) 'front' or 'selfie' camera when opened

  // /* multiple selection  */
  // waitAnimationEnd: false, // (ios only) default true
  // forceJpg: true, // (ios only) default false

  /* Should be use without cropping, just resizing after selection  */
  compressImageMaxWidth: 500,
  compressImageMaxHeight: 500,
  //compressImageQuality: 0.5, // default 1 (Android) | 0.8 (iOS))

  /* Should be used when cropping */
  // Metrics.screenWidth
  width: CROPPED_IMAGE_WIDTH, // only work with cropping
  height: CROPPED_IMAGE_HEIGHT, // only work with cropping
  // cropping: false,
  // cropperCircleOverlay: false, // Enable or disable circular cropping mask.
  // enableRotationGesture: false, // (android only) default false
   freeStyleCropEnabled: true, // (android only) default false | Enable custom rectangle area for cropping
   showCropGuidelines: true,
   multiple: false
};
export const dobMin = DateTime.local().plus({ years: -5,months:-11,day:2}).toISODate();
export const dobMax = DateTime.local().plus({ months: +9 }).toISODate();
export const maxDue=5;
export const minDue=4;
export const CAMERA_PERMISSION =
  Platform.OS === "android"
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA;

export const GALLERY_PERMISSION =
  Platform.OS === "android"
    ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.PHOTO_LIBRARY;

