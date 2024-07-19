import { googleAuth } from "./googleAuth";
import { googleDrive } from "./googleDrive";
import RNFS from 'react-native-fs';
import { userRealmCommon } from "../database/dbquery/userRealmCommon";
import { backupGDriveFileName, backupGDriveFolderName } from "@assets/translations/appOfflineData/apiConstants";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { ConfigSettingsEntity, ConfigSettingsSchema } from "../database/schema/ConfigSettingsSchema";
import { getAllChildren, setActiveChild } from "./childCRUD";
import Realm from 'realm';
import { ChildEntity, ChildEntitySchema } from "../database/schema/ChildDataSchema";
import { setInfoModalOpened } from "../redux/reducers/utilsSlice";
import AesCrypto from 'react-native-aes-crypto';
import { encryptionsIVKey, encryptionsKey } from 'react-native-dotenv';
import { getChild } from '../services/Utils';
/**
 * Export / import user realm to GDrive in order to create backup.
 */
class Backup {
    private static instance: Backup;
    importedrealm?: Realm;
   
    private constructor() {
        console.log("initialized")
    }
    static getInstance(): Backup {
        if (!Backup.instance) {
            Backup.instance = new Backup();
        }
        return Backup.instance;
    }
    public encryptData = (text: string, key: any): any => {
        return AesCrypto.encrypt(text, key, encryptionsIVKey, 'aes-256-cbc').then((cipher: any) => ({
          cipher
        }));
    }
    public decryptData = (text: string, key: any): any => {
        return AesCrypto.decrypt(text, key, encryptionsIVKey, 'aes-256-cbc');
    }
    public async export(): Promise<boolean> {
        await googleAuth.signOut();
        const tokens = await googleAuth.getTokens();

        // Sign in if neccessary
        if (!tokens) {
            const user = await googleAuth.signIn();
            if (!user) return false;
        }

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
        userRealmCommon.exportUserRealmDataToJson()
            .then(async (jsonData: any) => {
                this.encryptData(JSON.stringify(jsonData), encryptionsKey)
                .then(async (cipher: any) => {
                    const response = await googleDrive.createFileMultipart({
                        name: backupGDriveFileName,
                        content: cipher.cipher,
                        parentFolderId: backupFolderId,
                        isBase64: false,
                    });
                    if (typeof response !== 'string') {
                        return false;
                    }
                })
              .catch((error: any) => {
                console.error('Error exporting data:', error);
            });
    });
    return true;
}

    public closeImportedRealm(): any {
        if (this.importedrealm) {
            this.importedrealm.close();
            delete this.importedrealm;
        }
    }
    public async importFromFile(oldChildrenData: any, navigation: any, genders: any, dispatch: any, childAge: any, langCode: any): Promise<any> {
        console.log("oldchildrenresponse nwq",oldChildrenData)
        try {
            if (oldChildrenData?.length > 0) {
            const resolvedPromises = oldChildrenData.map(async (item: any) => {
                console.log('here log')
                if (item.birthDate != null && item.birthDate != undefined) {
                    console.log('here log 1',item,genders)
                    const itemnew = await getChild(item, genders);
                    console.log('here log itemnew',itemnew)
                     const childData: any = [];
                     childData.push(itemnew);
                    //await userRealmCommon.create<ChildEntity>(ChildEntitySchema, childData);
                    return userRealmCommon.create<ChildEntity>(ChildEntitySchema, childData).then(function(results){
                        console.log("results>>", results);
                        return results
                     })
                     
                }
            });
 
            const notiFlagObj = { key: 'generateNotifications', value: true };
            dispatch(setInfoModalOpened(notiFlagObj));
 
            await Promise.all(resolvedPromises).then(async (item:any) => {
                console.log("importfromfile--", item[0]);
                const allChildren:any = await getAllChildren(dispatch, childAge, 1);
                console.log('here log allChildren',allChildren)
                let childId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
                this.closeImportedRealm();
                console.log('here log childId',childId)
                
                if (allChildren?.length > 0) {
                    if (childId?.length > 0) {
                        childId = childId[0].value;
                        const activeChildData = allChildren.filter((x: any) => x.uuid == childId);
                        if (activeChildData?.length > 0) {
                            console.log("before setActiveChild");
                            await setActiveChild(langCode, childId, dispatch, childAge, false);
                            console.log("setActiveChild", childId);
                            navigation.navigate('LoadingScreen', {
                                apiJsonData: [],
                                prevPage: 'ImportScreen'
                            });
                            try {
                                Realm.deleteFile({ path: RNFS.TemporaryDirectoryPath + '/' + 'user1.realm' });
                                console.log("success");
                            } catch (error) {
                                console.log("error", error);
                            }
                            return "Imported";
                        }
                        else {
                            await setActiveChild(langCode, '', dispatch, childAge, false);
                            navigation.navigate('LoadingScreen', {
                                apiJsonData: [],
                                prevPage: 'ImportScreen'
                            });
                            try {
                                Realm.deleteFile({ path: RNFS.TemporaryDirectoryPath + '/' + 'user1.realm' });
                            } catch (error) {
                                console.log("error");
                            }
                            return "Imported";
                        }
                    }
                    else {
                        await setActiveChild(langCode, '', dispatch, childAge, false);
                        navigation.navigate('LoadingScreen', {
                            apiJsonData: [],
                            prevPage: 'ImportScreen'
                        });
                        try {
                            Realm.deleteFile({ path: RNFS.TemporaryDirectoryPath + '/' + 'user1.realm' });
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
                console.log("error-", error);
                return new Error('No Import Succeded');
            })
 
 
        }
 
    } catch (error) {
           console.log("importFromFile error", error);
            
    }
    }
    public async import1(navigation: any, langCode: any, dispatch: any, childAge: any, genders: any): Promise<any> {
        console.log("import1-", navigation, langCode, dispatch, childAge, genders);
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
        let backupFileName: string | null = null;

        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${backupGDriveFileName}') and ('${backupFolderId}' in parents)`,
        });
        if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            backupFileId = backupFiles[0].id;
            backupFileName = backupFiles[0].name;
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
            let oldChildrenData: any = [];
            if (backupFileName?.endsWith('.json')) {
                // Read the downloaded file content from drive
                const fileContent = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/' + 'user1.realm', 'utf8');
                const decryptedData = this.decryptData(fileContent, encryptionsKey)
                .then((text: any) => {
                  return text;
                })
                .catch((error: any) => {
                  console.log("Decrypted error", error);
                  throw error;
                });
                const jsonParseFileData = JSON.parse(await decryptedData);
                oldChildrenData = jsonParseFileData;
                return oldChildrenData;
            } else {
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
    }
    public async import(navigation: any, langCode: any, dispatch: any, childAge: any, genders: any): Promise<any> {
        const tokens = await googleAuth.getTokens();

        // Sign in if neccessary-
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
        let backupFileName: string | null = null;

        const backupFiles = await googleDrive.list({
            filter: `trashed=false and (name contains '${backupGDriveFileName}') and ('${backupFolderId}' in parents)`,
        });
        if (Array.isArray(backupFiles) && backupFiles.length > 0) {
            backupFileId = backupFiles[0].id;
            backupFileName = backupFiles[0].name;
        }
        console.log('backupFileName', backupFileName)
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
            let oldChildrenData: any = [];
            if (backupFileName?.endsWith('.json')) {
                // Read the downloaded file content from drive
                const fileContent = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/' + 'user1.realm', 'utf8');
                const decryptedData = this.decryptData(fileContent, encryptionsKey)
                .then((text: any) => {
                  return text;
                })
                .catch((error: any) => {
                  console.log("Decrypted error", error);
                  throw error;
                });
                const jsonParseFileData = JSON.parse(await decryptedData);
                oldChildrenData = jsonParseFileData;
            } else {
                this.importedrealm = await new Realm({ path: 'user1.realm' });
                if (this.importedrealm) {
                    await userRealmCommon.openRealm();
                    await userRealmCommon.deleteAllAtOnce();
                    this.closeImportedRealm();
                    this.importedrealm = await new Realm({ path: 'user1.realm' });
                    oldChildrenData = this.importedrealm.objects('ChildEntity');

                }
            }
            if (oldChildrenData?.length > 0) {
                const resolvedPromises = oldChildrenData.map(async (item: any) => {
                    if (item.birthDate != null && item.birthDate != undefined) {
                        const itemnew = await getChild(item, genders);
                        const childData: any = [];
                        childData.push(itemnew);
                        await userRealmCommon.create<ChildEntity>(ChildEntitySchema, childData);
                    }
                });
                const notiFlagObj = { key: 'generateNotifications', value: true };
                dispatch(setInfoModalOpened(notiFlagObj));
                await Promise.all(resolvedPromises).then(async item => {
                    console.log("item-", item);
                    const allChildren = await getAllChildren(dispatch, childAge, 1);
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
                            const activeChildData = allChildren.filter((x: any) => x.uuid == childId);
                            if (activeChildData.length > 0) {
                                await setActiveChild(langCode, childId, dispatch, childAge, false);
                                navigation.navigate('LoadingScreen', {
                                    apiJsonData: [],
                                    prevPage: 'ImportScreen'
                                });
                                return "Imported";
                            }
                            else {
                                await setActiveChild(langCode, '', dispatch, childAge, false);
                                navigation.navigate('LoadingScreen', {
                                    apiJsonData: [],
                                    prevPage: 'ImportScreen'
                                });
                                return "Imported";
                            }
                        }
                        else {
                            await setActiveChild(langCode, '', dispatch, childAge, false);
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
                    console.log("Seconderror-", error);
                    return new Error('No Import Succeded');
                })


            }
        }
        else {
            console.error('Download failed with status code:', downloadres.statusCode);
            // return null; // Handle the error appropriately
        }
    }

}


export const backup = Backup.getInstance();