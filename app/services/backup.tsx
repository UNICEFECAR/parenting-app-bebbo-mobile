import { googleAuth } from "./googleAuth";
import { googleDrive } from "./googleDrive";
import RNFS from 'react-native-fs';
import { userRealmCommon } from "../database/dbquery/userRealmCommon";
import { backupGDriveFileName, backupGDriveFolderName } from "@assets/translations/appOfflineData/apiConstants";
import { DateTime } from "luxon";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { ConfigSettingsEntity, ConfigSettingsSchema } from "../database/schema/ConfigSettingsSchema";
import { Child } from "../interface/interface";
import { getAllChildren, addPrefixForAndroidPaths, setActiveChild } from "./childCRUD";

/**
 * Export / import user realm to GDrive in order to create backup.
 */
class Backup {
    private static instance: Backup;

    private constructor() { }

    static getInstance(): Backup {
        if (!Backup.instance) {
            Backup.instance = new Backup();
        }
        return Backup.instance;
    }

    public async export(): Promise<boolean> {
        await googleAuth.signOut();
        const tokens = await googleAuth.getTokens();

        // Sign in if neccessary
        if (!tokens) {
            const user = await googleAuth.signIn();
            if (!user) return false;
        }

        // Get userRealmPath
        const userRealmPath = userRealmCommon.realm?.path;
        console.log(userRealmPath, "..userRealmPath")
        if (!userRealmPath) return false;

        // Get realmContent
        const realmContent = await RNFS.readFile(userRealmPath, 'base64');
        console.log(realmContent, "..11realmContent")
        // Get backupFolderId
        let backupFolderId = await googleDrive.safeCreateFolder({
            name: backupGDriveFolderName,
            parentFolderId: 'root'
        });
        console.log(backupFolderId, "..backupFolderId..")
        if (backupFolderId instanceof Error) {
            return false;
        }

        // Get backup file ID if exists on GDrive
        let backupFileId: string | null = null;

        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${backupGDriveFileName}') and ('${backupFolderId}' in parents)`,
        });
        console.log(backupFiles, "..backupFiles")
        if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            backupFileId = backupFiles[0].id;
        }
        console.log(backupFileId, "..backupFileId")
        // Delete backupFileId
        if (backupFileId) {
            const deleteset = await googleDrive.deleteFile(backupFileId);
            console.log(deleteset, "..deleteset")
        }

        // Create file on gdrive
        const response = await googleDrive.createFileMultipart({
            name: backupGDriveFileName,
            content: realmContent,
            contentType: 'application/realm',
            parentFolderId: backupFolderId,
            isBase64: true,
        });
        console.log(typeof response, "..finl response")
        if (typeof response !== 'string') {
            // utils.setMyDebbugTxt(response.message);
            return false;
        }

        return true;
    }


    public async import(navigation: any, langCode: any, dispatch: any, child_age: any): Promise<any> {

        const tokens = await googleAuth.getTokens();

        // Sign in if neccessary
        if (!tokens) {
            const user = await googleAuth.signIn();
            console.log(user, "..backupFiles")
            if (!user) return new Error('loginCanceled');
        }

        // Get backupFolderId
        let backupFolderId = await googleDrive.safeCreateFolder({
            name: backupGDriveFolderName,
            parentFolderId: 'root'
        });
        console.log(backupFolderId, "..backupFolderId..")
        if (backupFolderId instanceof Error) {
            return new Error('Backup folder doesnt exist on GDrive');
        }

        // Get backup file ID if exists on GDrive
        let backupFileId: string | null = null;

        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${backupGDriveFileName}') and ('${backupFolderId}' in parents)`,
        });
        console.log(backupFiles, "..backupFiles")
        if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            backupFileId = backupFiles[0].id;
        }
        console.log(backupFileId, "..backupFileId")
        if (!backupFileId) {
            return new Error("..Error coming..");
        }
        //const downloadres="dd";
        // Download file from GDrive
        const downloadres = await googleDrive.downloadAndReadFile({
            fileId: backupFileId,
            filePath: RNFS.DocumentDirectoryPath + '/' + 'user.realm',
        });
        console.log(downloadres, "..downloadres..")
        try{
        if(downloadres && downloadres.statusCode==200){
        let allChildren=await getAllChildren(dispatch,child_age);
        console.log(allChildren,"..allChildren..")
        let childId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
        let allChildrenList: Child[] = [];
        if (allChildren.length>0) {
            allChildrenList = allChildren.map((child:any) => {
                if (childId?.length > 0) {
                    childId = childId[0].value;
                    if (childId === child.uuid) {
                        setActiveChild(langCode, child.uuid, dispatch, child_age);
                        navigation.navigate('LoadingScreen', {
                            apiJsonData:[], 
                            prevPage: 'ImportScreen'
                        });
                        return downloadres;
                    }
                    else{
                        setActiveChild(langCode,'', dispatch, child_age);
                        navigation.navigate('LoadingScreen', {
                            apiJsonData:[], 
                            prevPage: 'ImportScreen'
                        });
                        return downloadres;
                    }
                }
                else{
                    setActiveChild(langCode,'', dispatch, child_age);
                    navigation.navigate('LoadingScreen', {
                        apiJsonData:[], 
                        prevPage: 'ImportScreen'
                    });
                    return downloadres;
                }
            });
        };
       
        }  
       
    } catch (e) {
        return new Error('file not downloaded..');
    }
        // Open user realm  
        // return downloadres;
    }
}

export const backup = Backup.getInstance();