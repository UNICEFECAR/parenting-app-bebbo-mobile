import {
    GDrive,
    MIME_TYPES
} from "@robinbobin/react-native-google-drive-api-wrapper";
import { googleAuth } from "./googleAuth";
import { appConfig } from "../instances";
const _urlFiles = "https://www.googleapis.com/drive/v3";
const FILE_METADATA_FIELDS = 'id,name,mimeType,kind,parents,trashed,version,originalFilename,fileExtension,modifiedTime';
const queryValue = (value: string) => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const asError = (error: unknown): Error => error instanceof Error ? error : new Error('Google Drive request failed');
const gdrive = new GDrive();
// The wrapper defaults to 1.5 seconds, which can abort normal Drive requests.
gdrive.fetchTimeout = 60_000;
import RNFS from 'react-native-fs';
import { PermissionsAndroidLocal } from "../android/sharedAndroid.android";
/**
 * Access Google drive API.
 */
async function requestWriteStoragePermission(): Promise<any> {
    try {
        const granted = await PermissionsAndroidLocal.request(
            PermissionsAndroidLocal.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                'title': 'Write your android storage Permission',
                'message': 'Write your android storage to save your data'
            }
        )
        if (granted === PermissionsAndroidLocal.RESULTS.GRANTED) {
            console.log("storage permission granted")
        } else {
            console.log("storage permission not granted")
        }
    } catch (err) {
        console.warn(err)
    }
}


/**
 * * require read storage permission
 */
async function requestReadStoragePermission(): Promise<any> {
    try {
        const granted = await PermissionsAndroidLocal.request(
            PermissionsAndroidLocal.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                'title': 'Read your android storage Permission',
                'message': 'Read your android storage to save your data'
            }
        )
        if (granted === PermissionsAndroidLocal.RESULTS.GRANTED) {
            console.log("read storage permission granted")
        } else {
            console.log("read storage permission not granted")
        }
    } catch (err) {
        console.warn(err)
    }
}
class ErrorAccessTokenNotSet extends Error {
    static defaultMessage = 'You need to log in';

    public constructor(message: string = ErrorAccessTokenNotSet.defaultMessage) {
        super(message);
    }
}
class GoogleDrive {
    private static instance: GoogleDrive;
    checkPermission = (): any => {
        PermissionsAndroidLocal.check(PermissionsAndroidLocal.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((writeGranted: any) => {
            if (!writeGranted) {
                requestWriteStoragePermission()
            }
            PermissionsAndroidLocal.check(PermissionsAndroidLocal.PERMISSIONS.READ_EXTERNAL_STORAGE).then((readGranted: any) => {
                if (!readGranted) {
                    requestReadStoragePermission()
                }
            })
        })
    }
    private constructor() {
        console.log("constructor");

    }
    public configureGetOptions(): any {
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${gdrive.accessToken}`)
        return {
            method: 'GET',
            headers,
        }
    }

    /**
     * create download url based on id
     */
    public downloadFile = (fileId: any): any => {
        if (!fileId) throw new Error('Didn\'t provide a valid file id.')
        return `${_urlFiles}/files/${fileId}?alt=media`
    }
    downloadAndReadFile = async (args: any): Promise<any> => {
        if (!(await this.setAccessToken())) throw new ErrorAccessTokenNotSet();
        const fromUrl = this.downloadFile(args.fileId)
        const downloadFileOptions: any = {
            fromUrl: fromUrl,
            toFile: args.filePath,
        }
        downloadFileOptions.headers = Object.assign({
            "Authorization": `Bearer ${gdrive.accessToken}`
        }, downloadFileOptions.headers);

        const fileresult = await RNFS.downloadFile(downloadFileOptions);
        const downloadResult = await fileresult.promise;
        if (downloadResult.statusCode !== 200) {
            throw new Error(`Google Drive download failed (${downloadResult.statusCode})`);
        }
        return downloadResult;
    }
    static getInstance(): GoogleDrive {
        if (!GoogleDrive.instance) {
            GoogleDrive.instance = new GoogleDrive();
        }
        return GoogleDrive.instance;
    }

    private async setAccessToken(): Promise<any> {
        let rval: any = false;
        const tokens = await googleAuth.getTokens();

        if (tokens && tokens.accessToken) {
            gdrive.accessToken = tokens.accessToken;
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
            const response: any = (
                await gdrive.files
                    .newMultipartUploader()
                    .setData(args.content, args.contentType)
                    .setRequestBody({
                        name: args.name,
                        mimeType: args.contentType,
                        parents: [args.parentFolderId],   // folderId , if you want to upload to folder
                    })
                    .setIsBase64(args.isBase64)
                    .execute()
            ).id;
            if (response != "" && response != null && response != undefined) {
                return response;
            } else {
                return new Error('GDrive file was not created');
            }
        } catch (e) {
            return asError(e);
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

            const responseJson = await response.json();

            if (response.status === 200) {
                return responseJson;
            } else {
                return new Error(responseJson?.error?.message);
            }
        } catch (e) {
            return new Error('Permissions not created');
        }
    }

    public async deleteFile(fileId: string): Promise<boolean | Error> {
        // Set Google access token
        const isAccessTokenSet = await this.setAccessToken();
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }
        await gdrive.files.delete(fileId);
        return true;
    }

    /**
     * Create folder on GDrive and return folder ID if it was created.
     * 
     * If folder exists, it simply returns its id.
     */
    public async safeCreateFolder(args: SafeCreateFolderArgs): Promise<string | Error> {
        try {
            const folders = await this.findFolders(args.name, args.parentFolderId);
            if (folders instanceof Error) return folders;
            if (folders.length) return folders[0].id;
            const folder = await gdrive.files.newMetadataOnlyUploader().setRequestBody({
                name: args.name,
                mimeType: MIME_TYPES.application.vndGoogleAppsFolder,
                parents: [args.parentFolderId],
            }).execute();
            if (!folder.id) throw new Error('GDrive folder was not created');
            return folder.id;
        } catch (error) {
            return asError(error);
        }
    }

    public async findFolders(name: string, parentFolderId = 'root'): Promise<FileMetadata[] | Error> {
        return this.list({
            filter: `trashed=false and name='${queryValue(name)}' and mimeType='${MIME_TYPES.application.vndGoogleAppsFolder}' and '${queryValue(parentFolderId)}' in parents`,
            orderBy: 'modifiedTime desc',
        });
    }

    public async findBackupFiles(): Promise<FileMetadata[] | Error> {
        const folders = await this.findFolders(appConfig.backupGDriveFolderName);
        if (folders instanceof Error) return folders;
        const files: FileMetadata[] = [];
        for (const folder of folders) {
            const matches = await this.list({
                filter: `trashed=false and name contains '${queryValue(appConfig.backupGDriveFileName)}' and '${queryValue(folder.id)}' in parents`,
                orderBy: 'modifiedTime desc',
            });
            if (matches instanceof Error) return matches;
            files.push(...matches);
        }
        return files.sort((a, b) => (b.modifiedTime || '').localeCompare(a.modifiedTime || '') || a.id.localeCompare(b.id));
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
            const files: FileMetadata[] = [];
            let pageToken: string | undefined;
            do {
                const response = await gdrive.files.list({
                    fields: `nextPageToken,files(${FILE_METADATA_FIELDS})`,
                    q: args.filter,
                    orderBy: args.orderBy,
                    // The Drive wrapper stringifies every supplied query value.
                    // Omit pageToken on the first request instead of passing undefined.
                    ...(pageToken ? { pageToken } : {}),
                });
                if (!Array.isArray(response.files)) throw new Error('Invalid Google Drive listing');
                files.push(...response.files as FileMetadata[]);
                pageToken = response.nextPageToken;
            } while (pageToken);
            return files;
        } catch (error) {
            return asError(error);
        }
    }

    /**
     * Download GDrive file to given local path.
     */
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
    modifiedTime?: string;
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
