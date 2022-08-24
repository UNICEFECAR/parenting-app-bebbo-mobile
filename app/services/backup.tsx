import { googleAuth } from "./googleAuth";
import { googleDrive } from "./googleDrive";
import RNFS from 'react-native-fs';
import { userRealmCommon } from "../database/dbquery/userRealmCommon";
import { backupGDriveFileName, backupGDriveFolderName } from "@assets/translations/appOfflineData/apiConstants";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { ConfigSettingsEntity, ConfigSettingsSchema } from "../database/schema/ConfigSettingsSchema";
import { getAllChildren, setActiveChild } from "./childCRUD";
import Realm from 'realm';
import { getChild } from "./Utils";
import { ChildEntity, ChildEntitySchema } from "../database/schema/ChildDataSchema";
import { setInfoModalOpened } from "../redux/reducers/utilsSlice";
/**
 * Export / import user realm to GDrive in order to create backup.
 */
class Backup {
    private static instance: Backup;
    importedrealm?: Realm;
    private constructor(){ 
     console.log("initialized")
    }
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
        if (!userRealmPath) return false;

        // Get realmContent
        const realmContent = await RNFS.readFile(userRealmPath, 'base64');
        // Get backupFolderId
        const backupFolderId = await googleDrive.safeCreateFolder({
            name: backupGDriveFolderName,
            parentFolderId: 'root'
        });
        if (backupFolderId instanceof Error) {
            return false;
        }

        // Get backup file ID if exists on GDrive
        let backupFileId: string | null = null;
        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${backupGDriveFileName}') and ('${backupFolderId}' in parents)`,
        });
        if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            backupFileId = backupFiles[0].id;
        }
        // Delete backupFileId
        if (backupFileId) {
            await googleDrive.deleteFile(backupFileId);
        }
        // Create file on gdrive
        const response = await googleDrive.createFileMultipart({
            name: backupGDriveFileName,
            content: realmContent,
            contentType: 'application/realm',
            parentFolderId: backupFolderId,
            isBase64: true,
        });
        if (typeof response !== 'string') {
           return false;
        }
        return true;
    }

    public closeImportedRealm():any {
        if (this.importedrealm) {
            this.importedrealm.close();
            delete this.importedrealm;
        }
    }
    public async importFromFile(oldChildrenData:any,navigation:any,genders:any,dispatch:any,child_age:any,langCode:any): Promise<any> {
        if (oldChildrenData?.length > 0) {
            const resolvedPromises = oldChildrenData.map(async (item: any) => {
                if(item.birthDate!=null && item.birthDate!=undefined){
                const itemnew = await getChild(item, genders);
                const childData: any = [];
                childData.push(itemnew);
                console.log(childData, "..childData..");
                const createresult = await userRealmCommon.create<ChildEntity>(ChildEntitySchema, childData);
                console.log(createresult, "..createresult");
                }
            });
            const notiFlagObj = { key: 'generateNotifications', value: true };
            dispatch(setInfoModalOpened(notiFlagObj));
            await Promise.all(resolvedPromises).then(async item => {
                console.log("importfromfile--",item);
                const allChildren = await getAllChildren(dispatch, child_age,1);
                let childId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
                this.closeImportedRealm();
                    
                if (allChildren.length > 0) {
                    if (childId?.length > 0) {
                    childId = childId[0].value;
                    const activeChildData = allChildren.filter((x:any)=>x.uuid == childId);
                    if(activeChildData.length>0){
                        await setActiveChild(langCode,childId, dispatch, child_age,false);
                        navigation.navigate('LoadingScreen', {
                            apiJsonData: [],
                            prevPage: 'ImportScreen'
                        });
                        try {
                            Realm.deleteFile({ path:  RNFS.TemporaryDirectoryPath + '/' + 'user1.realm' });
                        } catch (error) {
                            console.log("error");
                        }
                        return "Imported";
                    }
                    else{
                        await setActiveChild(langCode, '', dispatch, child_age,false);
                        navigation.navigate('LoadingScreen', {
                            apiJsonData: [],
                            prevPage: 'ImportScreen'
                        });
                        try {
                            Realm.deleteFile({ path:  RNFS.TemporaryDirectoryPath + '/' + 'user1.realm' });
                        } catch (error) {
                            console.log("error");
                        }
                        return "Imported";
                    }
                    }
                    else{
                        await setActiveChild(langCode, '', dispatch, child_age,false);
                        navigation.navigate('LoadingScreen', {
                            apiJsonData: [],
                            prevPage: 'ImportScreen'
                        });
                        try {
                            Realm.deleteFile({ path:  RNFS.TemporaryDirectoryPath + '/' + 'user1.realm' });
                        } catch (error) {
                            console.log("error");
                        }
                        return "Imported";
                        
                    }
                }
                else {
                    return new Error('No Data');
                }
            }).catch(error => {
                console.log("error-",error);
                return new Error('No Import Succeded');
            })


        }
    }
    public async import1(navigation: any, langCode: any, dispatch: any, child_age: any, genders: any): Promise<any> {
        console.log("import1-",navigation,langCode,dispatch, child_age, genders);
        const tokens = await googleAuth.getTokens();

        // Sign in if neccessary
        if (!tokens) {
            const user = await googleAuth.signIn();
            if (!user) return new Error('loginCanceled');
        }

        // Get backupFolderId
        const backupFolderId = await googleDrive.safeCreateFolder({
            name: backupGDriveFolderName,
            parentFolderId: 'root'
        });
        if (backupFolderId instanceof Error) {
            return new Error('Backup folder doesnt exist on GDrive');
        }

        // Get backup file ID if exists on GDrive
        let backupFileId: string | null = null;

        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${backupGDriveFileName}') and ('${backupFolderId}' in parents)`,
        });
        if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            backupFileId = backupFiles[0].id;
        }
        if (!backupFileId) {
            return new Error("..Error coming..");
        }
        // Download file from GDrive
        const downloadres = await googleDrive.downloadAndReadFile({
            fileId: backupFileId,
            filePath: RNFS.DocumentDirectoryPath + '/' + 'user1.realm',
        });
        userRealmCommon.closeRealm();
        if (downloadres && downloadres.statusCode == 200) {
            this.closeImportedRealm();
            this.importedrealm = await new Realm({ path: 'user1.realm' });
            if (this.importedrealm) {
                await userRealmCommon.openRealm();
                await userRealmCommon.deleteAllAtOnce();
                 this.closeImportedRealm();
                this.importedrealm = await new Realm({ path: 'user1.realm' });
                const oldChildrenData = this.importedrealm.objects('ChildEntity');
               return oldChildrenData;

            }

        }
    }
    public async import(navigation: any, langCode: any, dispatch: any, child_age: any, genders: any): Promise<any> {
        const tokens = await googleAuth.getTokens();

        // Sign in if neccessary
        if (!tokens) {
            const user = await googleAuth.signIn();
            if (!user) return new Error('loginCanceled');
        }

        // Get backupFolderId
        const backupFolderId = await googleDrive.safeCreateFolder({
            name: backupGDriveFolderName,
            parentFolderId: 'root'
        });
        if (backupFolderId instanceof Error) {
            return new Error('Backup folder doesnt exist on GDrive');
        }

        // Get backup file ID if exists on GDrive
        let backupFileId: string | null = null;

        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${backupGDriveFileName}') and ('${backupFolderId}' in parents)`,
        });
         if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            backupFileId = backupFiles[0].id;
        }
        if (!backupFileId) {
            return new Error("..Error coming..");
        }
        // Download file from GDrive
        const downloadres = await googleDrive.downloadAndReadFile({
            fileId: backupFileId,
            filePath: RNFS.DocumentDirectoryPath + '/' + 'user1.realm',
        });
        userRealmCommon.closeRealm();
        if (downloadres && downloadres.statusCode == 200) {
            this.closeImportedRealm();
            this.importedrealm = await new Realm({ path: 'user1.realm' });
            if (this.importedrealm) {
                await userRealmCommon.openRealm();
                await userRealmCommon.deleteAllAtOnce();
                this.closeImportedRealm();
                this.importedrealm = await new Realm({ path: 'user1.realm' });
                const oldChildrenData = this.importedrealm.objects('ChildEntity');
                if (oldChildrenData?.length > 0) {
                    const resolvedPromises = oldChildrenData.map(async (item: any) => {
                        if(item.birthDate!=null && item.birthDate!=undefined){
                        const itemnew = await getChild(item, genders);
                        const childData: any = [];
                        childData.push(itemnew);
                        await userRealmCommon.create<ChildEntity>(ChildEntitySchema, childData);
                        }
                    });
                    const notiFlagObj = { key: 'generateNotifications', value: true };
                    dispatch(setInfoModalOpened(notiFlagObj));
                    await Promise.all(resolvedPromises).then(async item => {
                        console.log("item-",item);
                        const allChildren = await getAllChildren(dispatch, child_age,1);
                        let childId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
                        this.closeImportedRealm();
                            try {
                                Realm.deleteFile({ path: 'user1.realm' });
                            } catch (error) {
                                console.log("error");
                            }
                        if (allChildren.length > 0) {
                            if (childId?.length > 0) {
                            childId = childId[0].value;
                            const activeChildData = allChildren.filter((x:any)=>x.uuid == childId);
                            if(activeChildData.length>0){
                                 await setActiveChild(langCode,childId, dispatch, child_age,false);
                                 navigation.navigate('LoadingScreen', {
                                    apiJsonData: [],
                                    prevPage: 'ImportScreen'
                                });
                                return "Imported";
                            }
                            else{
                                await setActiveChild(langCode, '', dispatch, child_age,false);
                                navigation.navigate('LoadingScreen', {
                                    apiJsonData: [],
                                    prevPage: 'ImportScreen'
                                });
                                return "Imported";
                            }
                            }
                            else{
                                 await setActiveChild(langCode, '', dispatch, child_age,false);
                                 navigation.navigate('LoadingScreen', {
                                    apiJsonData: [],
                                    prevPage: 'ImportScreen'
                                });
                                return "Imported";
                            }
     
                        }
                        else {
                            return new Error('No Data');
                        }
                    }).catch(error => {
                        console.log("error-",error);
                        return new Error('No Import Succeded');
                    })


                }
            }

        }
    }
}

export const backup = Backup.getInstance();