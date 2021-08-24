// @ts-ignore
import GDrive from "react-native-google-drive-api-wrapper";
import { googleAuth } from "./googleAuth";
import { DownloadResult } from "react-native-fs";

const FILE_METADATA_FIELDS = 'id,name,mimeType,kind,parents,trashed,version,originalFilename,fileExtension';

/**
 * Access Google drive API.
 */
class GoogleDrive {
    private static instance: GoogleDrive;

    private constructor() { }

    static getInstance(): GoogleDrive {
        if (!GoogleDrive.instance) {
            GoogleDrive.instance = new GoogleDrive();
        }
        return GoogleDrive.instance;
    }

    private async setAccessToken() {
        let rval: boolean = false;
        const tokens = await googleAuth.getTokens();

        if (tokens && tokens.accessToken) {
            GDrive.setAccessToken(tokens.accessToken);
            GDrive.init();
            rval = true;
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
            const response: Response = await GDrive.files.createFileMultipart(
                args.content,
                args.contentType,
                {
                    parents: [args.parentFolderId],
                    name: args.name
                },
                args.isBase64,
            );

            let responseJson = await response.json();

            if (response.status === 200) {
                return responseJson?.id;
            } else {
                return new Error(responseJson?.error?.message);
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

        // Delete file
        try {
            const response: Response = await GDrive.files.delete(fileId);

            if (response.status >= 200 && response.status < 300) {
                return true;
            } else {
                return new Error('GDrive file was not deleted');
            }
        } catch (e) {
            return new Error('GDrive file was not deleted');
        }
    }

    /**
     * Create folder on GDrive and return folder ID if it was created.
     * 
     * If folder exists, it simply returns its id.
     */
    public async safeCreateFolder(args: SafeCreateFolderArgs): Promise<string | Error> {
        // Set Google access token
        const isAccessTokenSet = await this.setAccessToken();
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }

        // Create folder
        try {
            const id: string = await GDrive.files.safeCreateFolder({
                name: args.name,
                parents: [args.parentFolderId]
            });

            return id;
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
            const response = await GDrive.files.get(
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
            const id: string = await GDrive.files.getId(
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
            const response: Response = await GDrive.files.list({
                // Fields: https://bit.ly/3eIpXzG
                fields: `files(${FILE_METADATA_FIELDS})`,
                // fields: '*', // Use only during development!

                // Filter: https://bit.ly/3ax8TJI
                q: args.filter,
                // q: `trashed=false and (name contains 'file1') and ('root' in parents) and (mimeType contains 'text/plain') or (mimeType contains 'folder')`,

                // Order: https://bit.ly/34ZczTf
                orderBy: args.orderBy,
            });

            let results = await response.json();

            if (response.status === 200) {
                return results.files;
            } else {
                return new Error('Error listing files: ' + results?.error?.message);
            }
        } catch (e) {
            return new Error('Can not list files');
        }
    }

    /**
     * Download GDrive file to given local path.
     */
    public async download(args: DownloadArgs): Promise<string | Error> {
        // Set Google access token
        const isAccessTokenSet = await this.setAccessToken();
        if (!isAccessTokenSet) {
            return new ErrorAccessTokenNotSet();
        }

        // Download file
        try {
            let response: { jobId: number, promise: Promise<DownloadResult> } = GDrive.files.download(
                // File ID
                args.fileId,

                // Download file options: https://bit.ly/2S5CeEu
                {
                    toFile: args.filePath
                },

                // Query params
                {},
            );

            let downloadResult = await response.promise;

            if (downloadResult.statusCode === 200) {
                return args.filePath;
            } else {
                return new Error('File was not downloaded');
            }
        } catch (e) {
            return new Error('Could not download file');
        }
    }
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