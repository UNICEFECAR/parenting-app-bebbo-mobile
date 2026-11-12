import type { UpdateMode } from "realm";
import { googleAuth } from "./googleAuth";
import { googleDrive } from "./googleDrive";
import * as RNFS from "@dr.pogodin/react-native-fs";
import { userRealmCommon } from "../database/dbquery/userRealmCommon";
import { appConfig } from "../instances";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import {
  ConfigSettingsEntity,
  ConfigSettingsSchema,
} from "../database/schema/ConfigSettingsSchema";
import { getAllChildren, setActiveChild } from "./childCRUD";
import { safeOpenRealm, safeDeleteRealm } from "../redux/reducers/realmSafe";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../database/schema/ChildDataSchema";
import { setInfoModalOpened } from "../redux/reducers/utilsSlice";
import AesCrypto from "react-native-aes-crypto";
import { encryptionsIVKey, encryptionsKey } from "react-native-dotenv";
import { getChild } from "../services/Utils";
/**
 * Export / import user realm to GDrive in order to create backup.
 */
class Backup {
  private static instance: Backup;
  importedrealm?: any;
  private operationRunning = false;

  private constructor() {
    console.log("initialized");
  }
  static getInstance(): Backup {
    if (!Backup.instance) {
      Backup.instance = new Backup();
    }
    return Backup.instance;
  }
  public encryptData = (text: string, key: any): any => {
    return AesCrypto.encrypt(text, key, encryptionsIVKey, "aes-256-cbc").then(
      (cipher: any) => ({
        cipher,
      })
    );
  };
  public decryptData = (text: string, key: any): any => {
    return AesCrypto.decrypt(text, key, encryptionsIVKey, "aes-256-cbc");
  };
  public async export(): Promise<boolean> {
    if (this.operationRunning) return false;
    this.operationRunning = true;
    try {
      if (!(await googleAuth.ensureSignedIn())) return false;
      if (!(await userRealmCommon.openRealm())) throw new Error("Cannot open user data");
      const jsonData = await userRealmCommon.exportUserRealmDataToJson();
      if (!Array.isArray(jsonData) || !jsonData.length) throw new Error("No data to back up");
      const cipher = await this.encryptData(JSON.stringify(jsonData), encryptionsKey);
      const previousFiles = await googleDrive.findBackupFiles();
      if (previousFiles instanceof Error) throw previousFiles;
      const backupFolderId = previousFiles[0]?.parents?.[0] || await googleDrive.safeCreateFolder({
        name: appConfig.backupGDriveFolderName,
        parentFolderId: "root",
      });
      if (backupFolderId instanceof Error) throw backupFolderId;
      const response = await googleDrive.createFileMultipart({
        name: appConfig.backupGDriveFileName,
        content: cipher.cipher,
        parentFolderId: backupFolderId,
        isBase64: false,
      });
      if (response instanceof Error) throw response;
      if (!response) throw new Error("Backup upload was not confirmed");
      // Keep the previous backup until Drive has confirmed the replacement.
      // A cleanup failure must not mark the successful upload as failed.
      // Replace one previous file, as before; leave other matching copies intact.
      for (const file of previousFiles.slice(0, 1)) {
        if (file.id === response) continue;
        try {
          const deleted = await googleDrive.deleteFile(file.id);
          if (deleted instanceof Error) throw deleted;
        } catch (error) {
          console.warn("Previous Drive backup could not be removed", error);
        }
      }
      return true;
    } finally {
      this.operationRunning = false;
    }
  }

  public closeImportedRealm(): any {
    if (this.importedrealm) {
      try {
        this.importedrealm.close();
      } catch (e) {
        console.warn('closeImportedRealm warning', e);
      }
      delete this.importedrealm;
    }
  }
  public async importFromFile(
    oldChildrenData: any,
    navigation: any,
    genders: any,
    dispatch: any,
    childAge: any,
    langCode: any,
    taxonomyIds?: any
  ): Promise<any> {
    console.log("oldchildrenresponse nwq", oldChildrenData);
    try {
      if (oldChildrenData?.length > 0) {
        const resolvedPromises = oldChildrenData.map(async (item: any) => {
          console.log("here log");
          if (item.birthDate != null && item.birthDate != undefined) {
            console.log("here log 1", item, genders);
            const itemnew = await getChild(item, genders);
            console.log("here log itemnew", itemnew);
            const childData: any = [];
            childData.push(itemnew);
            //await userRealmCommon.create<ChildEntity>(ChildEntitySchema, childData);
            return userRealmCommon
              .create<ChildEntity>(ChildEntitySchema, childData)
              .then(function (results) {
                console.log("results>>", results);
                return results;
              });
          }
        });
        const notiFlagObj = { key: "generateNotifications", value: true };
        dispatch(setInfoModalOpened(notiFlagObj));
        await Promise.all(resolvedPromises)
          .then(async (item: any) => {
            const allChildren: any = await getAllChildren(
              dispatch,
              childAge,
              1
            );

            let childId =
              await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(
                ConfigSettingsSchema,
                "key='currentActiveChildId'"
              );
            this.closeImportedRealm();

            if (allChildren?.length > 0) {
              if (childId?.length > 0) {
                childId = childId[0].value;
                const activeChildData = allChildren.filter(
                  (x: any) => x.uuid == childId
                );
                if (activeChildData.length > 0) {
                  await setActiveChild(
                    langCode,
                    childId,
                    dispatch,
                    childAge,
                    false,
                    taxonomyIds?.boyChildGender
                  );
                  navigation.navigate("LoadingScreen", {
                    apiJsonData: [],
                    prevPage: "ImportScreen",
                  });
                  try {
                    await safeDeleteRealm({
                      path: RNFS.TemporaryDirectoryPath + "/" + "user1.realm",
                    });
                  } catch (error) {
                    console.log("error",error);
                  }
                  return "Imported";
                } else {
                  await setActiveChild(
                    langCode,
                    "",
                    dispatch,
                    childAge,
                    false,
                    taxonomyIds?.boyChildGender
                  );
                  navigation.navigate("LoadingScreen", {
                    apiJsonData: [],
                    prevPage: "ImportScreen",
                  });
                  try {
                    await safeDeleteRealm({
                      path: RNFS.TemporaryDirectoryPath + "/" + "user1.realm",
                    });
                  } catch (error) {
                    console.log("error",error);
                  }
                  return "Imported";
                }
              } else {
                await setActiveChild(
                  langCode,
                  "",
                  dispatch,
                  childAge,
                  false,
                  taxonomyIds?.boyChildGender
                );
                navigation.navigate("LoadingScreen", {
                  apiJsonData: [],
                  prevPage: "ImportScreen",
                });
                try {
                  await safeDeleteRealm({
                    path: RNFS.TemporaryDirectoryPath + "/" + "user1.realm",
                  });
                } catch (error) {
                  console.log("error",error);
                }
                return "Imported";
              }
            } else {
              return new Error("No Data");
            }
          })
          .catch((error) => {
            console.log("error-", error);
            return new Error("No Import Succeded");
          });
      }
    } catch (error) {
      console.log("importFromFile error", error);
    }
  }
  public async import1(
    navigation: any,
    langCode: any,
    dispatch: any,
    childAge: any,
    genders: any
  ): Promise<any> {
    if (this.operationRunning) return new Error("Backup operation is already running");
    this.operationRunning = true;
    try {
      return await this.readDriveBackup();
    } catch (error) {
      return error instanceof Error ? error : new Error("Backup could not be read");
    } finally {
      this.operationRunning = false;
    }
  }

  private validateChildren(data: any): any[] {
    if (!Array.isArray(data) || !data.length || data.some(child =>
      !child || typeof child.uuid !== "string" || !child.uuid ||
      !child.birthDate || !Number.isFinite(new Date(child.birthDate).getTime())
    ) || new Set(data.map(child => child.uuid)).size !== data.length) {
      throw new Error("Backup contains invalid child data");
    }
    return data;
  }

  private async readDriveBackup(): Promise<any[]> {
    if (!(await googleAuth.ensureSignedIn())) throw new Error("loginCanceled");
    const files = await googleDrive.findBackupFiles();
    if (files instanceof Error) throw files;
    if (!files.length) throw new Error("No accessible Drive backup was found");
    const file = files[0];
    // Download to a separate file; never close or overwrite the live user Realm.
    const filePath = RNFS.DocumentDirectoryPath + "/drive-backup-download.realm";
    try {
      const download = await googleDrive.downloadAndReadFile({ fileId: file.id, filePath });
      if (download?.statusCode !== 200) throw new Error("Backup download failed");
      if (file.name.endsWith(".json")) {
        const encrypted = await RNFS.readFile(filePath, "utf8");
        const decrypted = await this.decryptData(encrypted, encryptionsKey);
        // Older backups may contain control characters after decryption.
        const text = decrypted.replace(/[\x00-\x1F\x7F]/g, "");
        return this.validateChildren(JSON.parse(text));
      }
      this.closeImportedRealm();
      this.importedrealm = await safeOpenRealm({ path: filePath });
      if (!this.importedrealm) throw new Error("Backup Realm could not be opened");
      // Detach all data before closing the downloaded Realm.
      return this.validateChildren(JSON.parse(JSON.stringify(this.importedrealm.objects("ChildEntity"))));
    } finally {
      this.closeImportedRealm();
      await safeDeleteRealm({ path: filePath });
    }
  }

  public async import(
    navigation: any,
    langCode: any,
    dispatch: any,
    childAge: any,
    genders: any,
    taxonomyIds?: any
  ): Promise<"Imported" | Error> {
    if (this.operationRunning) return new Error("Backup operation is already running");
    this.operationRunning = true;
    try {
      const data = await this.readDriveBackup();
      const children = await Promise.all(data.map(child => getChild(child, genders)));
      for (const child of children) {
        for (const field of ["createdAt", "updatedAt", "birthDate", "plannedTermDate"]) {
          if (child[field] != null) {
            child[field] = new Date(child[field]);
            if (!Number.isFinite(child[field].getTime())) throw new Error("Invalid backup date");
          }
        }
      }
      const realm = await userRealmCommon.openRealm();
      if (!realm) throw new Error("Cannot open user data");
      // A failed insert rolls back the deletion as part of the same transaction.
      realm.write(() => {
        realm.deleteAll();
        children.forEach(child => realm.create(ChildEntitySchema.name, child, "modified" as UpdateMode));
      });
      const allChildren = await getAllChildren(dispatch, childAge, 1);
      if (!allChildren?.length) throw new Error("Restored children could not be loaded");
      const settings = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(
        ConfigSettingsSchema, "key='currentActiveChildId'"
      );
      const previousChildId = settings?.[0]?.value;
      const childId = allChildren.some((child: any) => child.uuid === previousChildId) ? previousChildId : "";
      await setActiveChild(langCode, childId, dispatch, childAge, false, taxonomyIds?.boyChildGender);
      dispatch(setInfoModalOpened({ key: "generateNotifications", value: true }));
      navigation.navigate("LoadingScreen", { apiJsonData: [], prevPage: "ImportScreen" });
      return "Imported";
    } catch (error) {
      return error instanceof Error ? error : new Error("Backup could not be restored");
    } finally {
      this.operationRunning = false;
    }
  }

}

export const backup = Backup.getInstance();
