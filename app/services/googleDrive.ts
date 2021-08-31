// @ts-ignore

import {
    GDrive,
    MimeTypes,
    ListQueryBuilder
  } from "@robinbobin/react-native-google-drive-api-wrapper";
import { googleAuth } from "./googleAuth";
import { backupGDriveFolderName } from "@assets/translations/appOfflineData/apiConstants";
import { PermissionsAndroid, Platform } from "react-native";
const _urlFiles = "https://www.googleapis.com/drive/v3";
const FILE_METADATA_FIELDS = 'id,name,mimeType,kind,parents,trashed,version,originalFilename,fileExtension';
const gdrive = new GDrive();
import RNFS from 'react-native-fs';
/**
 * Access Google drive API.
 */
 async function requestWriteStoragePermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                'title': 'Write your android storage Permission',
                'message': 'Write your android storage to save your data'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can write storage")
        } else {
            console.log("Write Storage permission denied")
        }
    } catch (err) {
        console.warn(err)
    }
}


/**
 * * require read storage permission
 */
async function requestReadStoragePermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                'title': 'Read your android storage Permission',
                'message': 'Read your android storage to save your data'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can Read storage")
        } else {
            console.log("Read Storage permission denied")
        }
    } catch (err) {
        console.warn(err)
    }
}
class GoogleDrive {
    private static instance: GoogleDrive;
    checkPermission = () => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((writeGranted) => {
            console.log('writeGranted', writeGranted)
            if (!writeGranted) {
                requestWriteStoragePermission()
            }
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((readGranted) => {
                console.log('readGranted', readGranted)
                if (!readGranted) {
                    requestReadStoragePermission()
                }
            })
        })
    }
    private constructor() {
        
       
     }
     public configureGetOptions(){
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${gdrive.apiToken}`)
        return {
            method: 'GET',
            headers,
        }
    }
    
    /**
     * create download url based on id
     */
     public downloadFile=(fileId:any)=>{
        const options = this.configureGetOptions()
        console.log(fileId)
        if (!fileId) throw new Error('Didn\'t provide a valid file id.')
        return `${_urlFiles}/files/${fileId}?alt=media`
    }
     downloadAndReadFile = async (args:any) => {
        // if(Platform.OS=="android"){
        //     this.checkPermission();
        // }
        const fromUrl = this.downloadFile(args.fileId)
        let downloadFileOptions:any = {
            fromUrl: fromUrl,
            toFile: args.filePath,
        }
        downloadFileOptions.headers = Object.assign({
            "Authorization": `Bearer ${gdrive.accessToken}`
        }, downloadFileOptions.headers);

        console.log('downloadFileOptions', downloadFileOptions)
        let fileresult= RNFS.downloadFile(downloadFileOptions);
        let downloadResult = await fileresult.promise;
        return downloadResult;
        // RNFS.downloadFile(downloadFileOptions).promise.then((res: any) => {
        //     console.log(res,"..res");
        //     return "success";
        // }).catch((err: any) => {
        //     console.log('error', err)
        //     return "2error";
        // });
    }
    static getInstance(): GoogleDrive {
        if (!GoogleDrive.instance) {
            GoogleDrive.instance = new GoogleDrive();
        }
        return GoogleDrive.instance;
    }

    private async setAccessToken() {
        let rval: any = false;
        const tokens = await googleAuth.getTokens();

        if (tokens && tokens.accessToken) {
            // GDrive.setAccessToken(tokens.accessToken);
            // GDrive.accessToken =tokens.accessToken;
            gdrive.accessToken =tokens.accessToken;
            // GDrive.init();
            rval = tokens.accessToken;
        }
        return rval;
    }

    /**
     * Create file on GDrive and return file ID if it was created.
     * 
     * [Google API](https://bit.ly/3atW5DJ)
     */
    public async createFileMultipart(args: CreateFileMultipartArgs): Promise<string | Error> {
        // Default args
        if (!args.contentType) args.contentType = 'text/plain';

        if (args.isBase64 === undefined) {
            args.isBase64 = false;
        }

        // Set Google access token
        const isAccessTokenSet = await this.setAccessToken();
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }

        try {
            // CREATE: https://bit.ly/3atW5DJ
            // const response: Response = await gdrive.files.createFileMultipart(
            //     args.content,
            //     args.contentType,
            //     {
            //         parents: [args.parentFolderId],
            //         name: args.name
            //     },
            //     args.isBase64,
            // );
            const response: any  = (
                await gdrive.files
                  .newMultipartUploader()
                  .setData(args.content, args.contentType)
                  .setRequestBody({
                    name: args.name,
                    mimeType:args.contentType,
                    parents: [args.parentFolderId],   // folderId , if you want to upload to folder
                  })
                  .setIsBase64(true)
                  .execute()
              ).id;
            console.log(response,"..11response")
            if (response!="" && response!=null && response!=undefined) {
                return response;
            } else {
                return new Error('GDrive file was not created');
            }
        } catch (e) {
            return new Error('GDrive file was not created');
        }
    }

    /**
     * Create permissions on a file or folder.
     * 
     * [Google API](https://bit.ly/3ejth32)
     */
    public async createPermissions(fileId: string, params: CreatePermissionsParams, queryParams?: CreatePermissionsQueryParams): Promise<void | Error> {
        // Set Google access token
        const isAccessTokenSet = await this.setAccessToken();
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }

        try {
            // CREATE PERMISSIONS: https://bit.ly/3ejth32
            const response: Response = await GDrive.permissions.create(
                fileId,
                params,
                queryParams
            );

            let responseJson = await response.json();

            if (response.status === 200) {
                return responseJson;
            } else {
                return new Error(responseJson?.error?.message);
            }
        } catch (e) {
            console.log(e);
            return new Error('Permissions not created');
        }
    }

    public async deleteFile(fileId: string): Promise<boolean | Error> {
        // Set Google access token
        const isAccessTokenSet = await this.setAccessToken();
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }
        const response: Response = await gdrive.files.delete(fileId);
        console.log(response,"..response");
        return true;
        // Delete file
        // try {
          
            
        //     if (response.status >= 200 && response.status < 300) {
        //         return true;
        //     } else {
        //         return new Error('GDrive file was not deleted');
        //     }
        // } catch (e) {
        //     return new Error('GDrive file was not deleted');
        // }
    }

    /**
     * Create folder on GDrive and return folder ID if it was created.
     * 
     * If folder exists, it simply returns its id.
     */
    public async safeCreateFolder(args: SafeCreateFolderArgs): Promise<string | Error> {
        // Set Google access token
       
       const isAccessTokenSet = await this.setAccessToken();
       console.log(isAccessTokenSet,"..isAccessTokenSet")
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }
            try {
            const filenew = await gdrive.files.createIfNotExists({
                q: new ListQueryBuilder()
                  .e("name", backupGDriveFolderName)
                  .and()
                  .e("trashed", false)
                  .and()
                  .e("mimeType", MimeTypes.FOLDER)
                  .and()
                  .in("root", "parents")
              },
                gdrive.files.newMetadataOnlyUploader()
                  .setRequestBody({
                    name: backupGDriveFolderName,
                    mimeType: MimeTypes.FOLDER,
                    parents: ["root"]
                  }
                )
              )
              console.log(filenew,"..filenew..")
            if(filenew.result && filenew.result.id!='' && filenew.result.id!=null &&  filenew.result.id!=undefined){
            return filenew.result.id;
            }
              else{
                return new Error('GDrive folder was not created');
              }
            //   console.log("22idset..",file)
            //   console.log(await gdrive.files.list());
            //   return id;
            } catch (e) {
                return new Error('GDrive folder was not created');
            }
     
    }

    /**
     * Get file metadata.
     * 
     * Check what fields can be returned [here](https://bit.ly/3eIpXzG)
     */
    public async getMetadata(
        fileId: string,
        fields: string = FILE_METADATA_FIELDS
    ): Promise<FileMetadata | Error> {
        // Set Google access token
        const isAccessTokenSet = await this.setAccessToken();
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }

        // Get file
        try {
            const response = await gdrive.files.get(
                fileId,
                // Fields: https://bit.ly/3eIpXzG
                { 'fields': fields }, // query params
            );

            if (response.status === 200) {
                const results = await response.json();
                return results;
            } else {
                return new Error('There is no item with that id');
            }
        } catch (e) {
            return new Error('Can not get GDrive file metadata');
        }
    }

    public async getId(args: GetIdArgs): Promise<string | Error> {
        // Default args
        if (args.trashed === undefined) args.trashed = false;
        if (!args.mimeType) args.mimeType = undefined;

        // Set Google access token
        const isAccessTokenSet = await this.setAccessToken();
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }

        // Get ID
        try {
            const id: string = await gdrive.files.getId(
                args.name, // name
                [args.parentFolderId], // parents
                args.mimeType, // mimeType
                args.trashed // trashed
            );

            if (id) {
                return id;
            } else {
                return new Error('There is no item for given args');
            }
        } catch (e) {
            return new Error('Can not get file ID');
        }
    }

    /**
     * Search files with given filter.
     * 
     * ### FILTER EXAMPLE
     * 
     * `trashed=false and (name contains 'file1') and ('root' in parents) and (mimeType contains 'text/plain') or (mimeType contains 'folder')`
     * 
     * ### ORDER BY EXAMPLE
     * 
     * `name asc`
     * 
     * ### HELP
     * 
     * - [Filter](https://bit.ly/3ax8TJI)
     * - [Order by](https://bit.ly/34ZczTf)
     */
    public async list(args: ListArgs = {}): Promise<FileMetadata[] | Error> {
        // Default args
       
        if (!args.filter) {
            args.filter = `trashed=false`;
        }

        if (!args.orderBy) {
            args.orderBy = 'name asc';
        }

        // Set Google access token
        const isAccessTokenSet = await this.setAccessToken();
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }
        // List files metadata
        try {
            // LIST: https://bit.ly/2xGQw7T
            // await gdrive.files.list({
            //     q: "trashed=false and (name contains 'my.backup') and ('1CIjwbhxqlC98IyKw0OwdlQF_g-xzg6Dv' in parents)",
            //     });
            const response: Response =await gdrive.files.list({
                // Fields: https://bit.ly/3eIpXzG
                fields: `files(${FILE_METADATA_FIELDS})`,
                // fields: '*', // Use only during development!

                // Filter: https://bit.ly/3ax8TJI
                q: args.filter,
                // q: `trashed=false and (name contains 'file1') and ('root' in parents) and (mimeType contains 'text/plain') or (mimeType contains 'folder')`,

                // Order: https://bit.ly/34ZczTf
                orderBy: args.orderBy,
            });
            console.log(response,"..old response..")
            let results:any = await response;
            if (results && results.files.length>0) {
                return results.files;
            } else {
                return new Error('Error listing files: ' + results?.error?.message);
            }
        } catch (e) {
            return new Error('Can not list files');
        }
      
    }
    //   static _stringifyQueryParams(queryParams, prefix = "?", separator = "&", quoteIfString) {
    //     const array = [];
      
    //     Object.keys(queryParams).forEach(key => array.push(
    //        `${key}=${StaticUtils.safeQuoteIfString(queryParams[key], quoteIfString)}`));
        
    //     return new ArrayStringifier(array)
    //        .setPrefix(prefix)
    //        .setSeparator(separator)
    //        .process();
    //   }
  
    /**
     * Download GDrive file to given local path.
     */
}

class ErrorAccessTokenNotSet extends Error {
    static defaultMessage = 'You need to log in';

    public constructor(message: string = ErrorAccessTokenNotSet.defaultMessage) {
        super(message);
    }
}

interface CreateFileMultipartArgs {
    name: string;
    content: any;
    /**
     * 'text/plain' by default
     */
    contentType?: string;
    /**
     * id of parent folder. 'root' has special meaning.
     */
    parentFolderId: string;
    isBase64?: boolean;
}

/**
 * API: https://bit.ly/3fndEsD
 */
interface CreatePermissionsParams {
    role: string;
    type: string;
    emailAddress?: string;
    allowFileDiscovery?: boolean;
    domain?: string;
}

/**
 * API: https://bit.ly/300mTbM
 */
interface CreatePermissionsQueryParams {
    emailMessage?: string;
    enforceSingleParent?: boolean;
    fields?: string;
    moveToNewOwnersRoot?: boolean;
    sendNotificationEmail?: boolean;
    supportsAllDrives?: boolean;
    transferOwnership?: boolean;
    useDomainAdminAccess?: boolean;
}

interface SafeCreateFolderArgs {
    name: string;
    /**
     * id of parent folder. 'root' has special meaning.
     */
    parentFolderId: string;
}

interface FileMetadata {
    kind: string;
    id: string;
    name: string;
    mimeType: string;
    trashed: boolean;
    parents: string[];
    version: string;
    originalFilename: string;
    fileExtension: string;
}

interface GetIdArgs {
    name: string;
    parentFolderId: string;
    mimeType?: string;
    trashed?: boolean;
}

interface ListArgs {
    filter?: string;
    orderBy?: string;
}

interface DownloadArgs {
    fileId: string;
    filePath: string;
}

export const googleDrive = GoogleDrive.getInstance();