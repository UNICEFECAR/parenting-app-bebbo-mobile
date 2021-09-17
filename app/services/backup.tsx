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
import Realm, { ObjectSchema, Collection } from 'realm';
import { getChild } from "./Utils";
import { ChildEntity, ChildEntitySchema } from "../database/schema/ChildDataSchema";
import { setInfoModalOpened } from "../redux/reducers/utilsSlice";
/**
 * Export / import user realm to GDrive in order to create backup.
 */
class Backup {
    private static instance: Backup;
    importedrealm?: Realm;

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

    public closeImportedRealm() {
        if (this.importedrealm) {
            // console.log("closed");
            this.importedrealm.close();
            delete this.importedrealm;
        }
    }

    public async import(navigation: any, langCode: any, dispatch: any, child_age: any, genders: any): Promise<any> {
        // await googleAuth.signOut();
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
        console.log(userRealmCommon.realm?.schemaVersion, "..old userRealmCommon.");
        // userRealmCommon.closeRealm();
        const downloadres = await googleDrive.downloadAndReadFile({
            fileId: backupFileId,
            filePath: RNFS.DocumentDirectoryPath + '/' + 'user1.realm',
        });
        console.log(downloadres, "..downloadres..");
        userRealmCommon.closeRealm();
        // try{
        if (downloadres && downloadres.statusCode == 200) {
            this.closeImportedRealm();
            this.importedrealm = await new Realm({ path: 'user1.realm' });
            if (this.importedrealm) {
                await userRealmCommon.openRealm();
                userRealmCommon.deleteAllAtOnce();
                console.log("111111Realm is located at: " + this.importedrealm.path);
                this.closeImportedRealm();
                this.importedrealm = await new Realm({ path: 'user1.realm' });
                const user1Path = this.importedrealm.path;
                const oldChildrenData = this.importedrealm.objects('ChildEntity');
                console.log("Realm is located at: " + this.importedrealm.path);
                console.log("11Realm is located at: " + oldChildrenData);
                if (oldChildrenData?.length > 0) {
                    const resolvedPromises = oldChildrenData.map(async (item: any) => {
                        console.log(item, "..item..");
                        if(item.birthDate!=null && item.birthDate!=undefined){
                        const itemnew = await getChild(item, genders);
                        let childData: any = [];
                        childData.push(itemnew);
                        console.log(childData, "..childData..");
                        let createresult = await userRealmCommon.create<ChildEntity>(ChildEntitySchema, childData);
                        console.log(createresult, "..createresult");
                        }
                        // let createresult = newRealm.create(ChildEntitySchema.name, getChild(item));
                        //console.log(createresult,".....createresult...");
                    });
                     let notiFlagObj = { key: 'generateNotifications', value: true };
                    dispatch(setInfoModalOpened(notiFlagObj));
                    await Promise.all(resolvedPromises).then(async item => {
                        console.log(userRealmCommon.realm?.schemaVersion, "..new userRealmCommon schema version.");

                        //this.importedrealm?.deleteAll();
                        // RNFS.exists(user1Path)
                        // .then((res) => {
                        //   if (res) {
                        //     RNFS.unlink(user1Path)
                        //       .then(() => console.log('FILE DELETED'))
                        //   }
                        // }) 
                        let allChildren = await getAllChildren(dispatch, child_age,1);
                        console.log(allChildren, "..allChildren..")
                        let childId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
                        let allChildrenList: Child[] = [];
                        this.closeImportedRealm();
                            try {
                                Realm.deleteFile({ path: 'user1.realm' });
                            } catch (error) {
                                console.log(error);
                            }
                        if (allChildren.length > 0) {
                            allChildren.map((child: any) => {
                                if (childId?.length > 0) {
                                    childId = childId[0].value;
                                    if (childId === child.uuid) {
                                        setActiveChild(langCode, child.uuid, dispatch, child_age);
                                        navigation.navigate('LoadingScreen', {
                                            apiJsonData: [],
                                            prevPage: 'ImportScreen'
                                        });
                                        return "Imported";
                                    }
                                    else {
                                        setActiveChild(langCode, '', dispatch, child_age);
                                        navigation.navigate('LoadingScreen', {
                                            apiJsonData: [],
                                            prevPage: 'ImportScreen'
                                        });
                                        return "Imported";
                                    }
                                }
                                else {
                                    setActiveChild(langCode, '', dispatch, child_age);
                                    navigation.navigate('LoadingScreen', {
                                        apiJsonData: [],
                                        prevPage: 'ImportScreen'
                                    });
                                    return "Imported";
                                }
                            });
                        }
                        else {
                            return new Error('No Data');
                        }
                    }).catch(error => {
                        return new Error('No Import Succeded');
                    })


                }
            }

            // return downloadres;

        }

        // } catch (e) {
        //     return new Error('file not downloaded..');
        // }
        // Open user realm  
        // return downloadres;
    }
}

export const backup = Backup.getInstance();