import getAllDataToStore, { getAllDataOnRetryToStore } from '@assets/translations/appOfflineData/getDataToStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { DateTime } from 'luxon';
import { Alert } from "react-native";
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import { store } from "../../App";
// import { appConfig, buildFor, buildForBangla, buildForBebbo, finalUrl } from '../assets/translations/appOfflineData/apiConstants';
import { appConfig } from '../instance';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ActivitiesEntity, ActivitiesEntitySchema } from '../database/schema/ActivitiesSchema';
import { ArticleEntity, ArticleEntitySchema } from '../database/schema/ArticleSchema';
import { BasicPagesEntity, BasicPagesSchema } from '../database/schema/BasicPagesSchema';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { VideoArticleEntity, VideoArticleEntitySchema } from '../database/schema/VideoArticleSchema';
import downloadImages from '../downloadImages/ImageStorage';
import { CommonApiInterface } from "../interface/interface";
import { setDailyArticleGamesCategory, setShowedDailyDataCategory } from '../redux/reducers/articlesSlice';
import { setchatBotData, setDownloadedBufferAgeBracket } from '../redux/reducers/childSlice';
import { setCountriesStore, setSponsorStore } from '../redux/reducers/localizationSlice';
import { setAllLocalNotificationGenerateType, setAllNotificationData } from '../redux/reducers/notificationSlice';
import { setIncrementalSyncDT, setInfoModalOpened, setSyncDate, setuserIsFirstTime } from '../redux/reducers/utilsSlice';
import axiosService from './axiosService';
import LocalNotifications from './LocalNotifications';


export const client =
  'https://raw.githubusercontent.com/UNICEFECAR/parent-buddy-mobile/master/src/translations/';

const commonApiService: CommonApiInterface = async (apiEndpoint: string, methodname: any, postdata: object) => {
  const storedata = store.getState();

  const selectedCountry = storedata.selectedCountry?.countryId || '';
  const selectedLang = storedata.selectedCountry.languageCode;
  const newurl = appConfig.finalUrl(apiEndpoint, selectedCountry, selectedLang)
  const responseData: any = {};
  responseData.apiEndpoint = apiEndpoint;
  console.log(newurl, '[API]', responseData)
  return await axiosService({
    method: methodname,
    url: newurl,
    params: postdata
  })
    .then((response: any) => {
      responseData.data = response.data
      responseData.status = response.status
      return responseData;
    })
    .catch((err: any) => {
      responseData.data = err?.message
      responseData.status = err?.response?.status;
      return responseData;
    });
}
export const updateIncrementalSyncDT = async (response: any, dispatch: any, _navigation: any, _languageCode: string, prevPage: string): Promise<any> => {
  const articleresp = response.find((y: any) => y.apiEndpoint == appConfig.apiConfig.articles);
  const videoarticleresp = response.find((y: any) => y.apiEndpoint == appConfig.apiConfig.videoArticles);
  const activitiesresp = response.find((y: any) => y.apiEndpoint == appConfig.apiConfig.activities);
  // const faqpinnedresp = response.find((y:any)=>y.apiEndpoint == appConfig.faqPinnedContent);
  const faqsresp = response.find((y: any) => y.apiEndpoint == appConfig.apiConfig.faqs);
  // const faqupdatedpinnedresp = response.find((y:any)=>y.apiEndpoint == appConfig.faqUpdatedPinnedContent);
  const archiveresp = response.find((y: any) => y.apiEndpoint == appConfig.apiConfig.archive);
  if (articleresp && articleresp != null && articleresp.data) {
    if (prevPage != "AddEditChild") {
      dispatch(setIncrementalSyncDT({ key: 'articlesDatetime', value: articleresp.data.datetime }));
    }
  }
  if (videoarticleresp && videoarticleresp != null && videoarticleresp.data) {
    dispatch(setIncrementalSyncDT({ key: 'videoArticlesDatetime', value: videoarticleresp.data.datetime }));
  }
  if (activitiesresp && activitiesresp != null && activitiesresp.data) {
    dispatch(setIncrementalSyncDT({ key: 'activitiesDatetime', value: activitiesresp.data.datetime }));
  }
  // if(faqpinnedresp && faqpinnedresp != null && faqpinnedresp.data) {
  //   dispatch(setIncrementalSyncDT({key: 'faqPinnedContentDatetime', value: faqpinnedresp.data.datetime}));
  // }
  if (faqsresp && faqsresp != null && faqsresp.data) {
    dispatch(setIncrementalSyncDT({ key: 'faqsDatetime', value: faqsresp.data.datetime }));
  }
  // if(faqupdatedpinnedresp && faqupdatedpinnedresp != null && faqupdatedpinnedresp.data) {
  //   dispatch(setIncrementalSyncDT({key: 'faqUpdatedPinnedContentDatetime', value: faqupdatedpinnedresp.data.datetime}));
  // }
  if (archiveresp && archiveresp != null && archiveresp.data) {
    dispatch(setIncrementalSyncDT({ key: 'archiveDatetime', value: archiveresp.data.datetime }));
  }
}
export const onAddEditChildSuccess = async (response: any, dispatch: any, navigation: any, languageCode: string, prevPage: string, activeChild: any, oldErrorObj: any): Promise<any> => {
  const artresp = response.find((x: any) => x.apiEndpoint == 'articles' && x.status == 200);
  if (artresp && artresp != null) {
    const artobj = oldErrorObj.find((x: any) => x.apiEndpoint == 'articles');
    if (artobj && artobj != null) {
      const storedata = store.getState();
      const bufferAgeBracket = storedata.childData.childDataSet.bufferAgeBracket;
      const childagearray = storedata.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(storedata.utilsData.taxonomy.allTaxonomyData).child_age : [];
      const agesarr = artobj.postdata.childAge == 'all' ? childagearray.map((x: any) => x.id) : artobj.postdata.childAge.split(',').map(Number);
      const mergedarray = [...new Set([...agesarr, ...bufferAgeBracket])];
      dispatch(setDownloadedBufferAgeBracket(mergedarray))
    }
  }

  navigation.navigate('ChildProfileScreen');
}
export const onSponsorApiSuccess = async (response: any, dispatch: any, navigation: any, languageCode: string, prevPage: string): Promise<any> => {
  const allDatatoStore = await getAllDataToStore(languageCode, dispatch, prevPage);
  console.log("allDatatoStore ", prevPage, "--", allDatatoStore);
  navigation.navigate('Terms');
}
export const onCountryApiSuccess = async (response: any, dispatch: any, navigation: any, languageCode: string, prevPage: string): Promise<any> => {
  console.log('Response for country is', response)
  if (response && response[0] && response[0].apiEndpoint == appConfig.apiConfig.countryGroups) {
    response = response[0];
    if (response.data && response.data.status && response.data.status == 200) {
      console.log('type of sponser data for country is', typeof response.data.data)
      console.log('sponser data for country is', response.data.data)
      console.log('sponser data for country issdsd', response.data?.data[0])
      dispatch(setuserIsFirstTime(true));
      dispatch(setCountriesStore(response.data?.data))
      const allDatatoStore = await getAllDataToStore(languageCode, dispatch, prevPage);
      console.log("allDatatoStore ", prevPage, "--", allDatatoStore, languageCode);
    }
  }

  // navigation.navigate('Walkthrough');
}
export const onOnLoadApiSuccess = async (_response: any, dispatch: any, navigation: any, languageCode: string, prevPage: string): Promise<any> => {
  const allDatatoStore = await getAllDataToStore(languageCode, dispatch, prevPage);
  console.log("allDatatoStore ", prevPage, "--", allDatatoStore);
  const allJsonData = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
  if (allJsonData?.length > 0) {
    navigation.navigate('ChildSetupList');
  }
  else {
    navigation.navigate('ChildSetup');
  }
}
export const onChildSetupApiSuccess = async (response: any, dispatch: any, navigation: any, languageCode: string, prevPage: string, activeChild: any, oldErrorObj: any): Promise<any> => {
  const artresp = response.find((x: any) => x.apiEndpoint == 'articles' && x.status == 200);
  if (artresp && artresp != null) {
    const artobj = oldErrorObj.find((x: any) => x.apiEndpoint == 'articles');
    if (artobj && artobj != null) {
      const storedata = store.getState();
      const childagearray = storedata.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(storedata.utilsData.taxonomy.allTaxonomyData).child_age : [];
      const artarray = artobj.postdata.childAge == 'all' ? childagearray.map((x: any) => x.id) : artobj.postdata.childAge.split(',').map(Number)
      dispatch(setDownloadedBufferAgeBracket(artarray))
    }
  }
  //setDownloadedBufferAgeBracket save data from apiJsonData
  const allDatatoStore = await getAllDataToStore(languageCode, dispatch, prevPage, activeChild);
  console.log("allDatatoStore ", prevPage, "--", allDatatoStore);
  navigation.reset({
    index: 0,
    routes: [
      {
        name: 'HomeDrawerNavigator',
      },
    ],
  });
}
export const downloadArticleImages = async (): Promise<any> => {
  // return new Promise(async (resolve, reject) => {
  const databaseData = await dataRealmCommon.getData<ArticleEntity>(ArticleEntitySchema);
  const databaseDataact = await dataRealmCommon.getData<ActivitiesEntity>(ActivitiesEntitySchema);
  const databaseDatabasicpg = await dataRealmCommon.getData<BasicPagesEntity>(BasicPagesSchema);
  const databaseDatavideoart = await dataRealmCommon.getData<VideoArticleEntity>(VideoArticleEntitySchema);
  const imageArray: any[] = [];
  databaseData.map((x: any) => {
    if (x.embedded_images && x.embedded_images.length > 0) {
      x.embedded_images.map((y: any) => {
        if ((y.split('https://')[1] || y.split('http://')[1])) {
          imageArray.push({ uri: y })
        }
      });
    }
    if (x['cover_image'] != "" && x['cover_image'] != null && x['cover_image'] != undefined && x['cover_image'].url != "" && x['cover_image'].url != null && x['cover_image'].url != undefined && (x['cover_image'].url.split('https://')[1] || x['cover_image'].url.split('http://')[1])) {
      imageArray.push({ uri: x.cover_image.url })
    }
  })
  databaseDataact.map((x: any) => {
    if (x.embedded_images && x.embedded_images.length > 0) {
      x.embedded_images.map((y: any) => {
        if ((y.split('https://')[1] || y.split('http://')[1])) {
          imageArray.push({ uri: y })
        }
      });
    }
    if (x['cover_image'] != "" && x['cover_image'] != null && x['cover_image'] != undefined && x['cover_image'].url != "" && x['cover_image'].url != null && x['cover_image'].url != undefined && (x['cover_image'].url.split('https://')[1] || x['cover_image'].url.split('http://')[1])) {
      imageArray.push({ uri: x.cover_image.url })
    }
  })
  databaseDatabasicpg.map((x: any) => {
    if (x.embedded_images && x.embedded_images.length > 0) {
      x.embedded_images.map((y: any) => {
        if ((y.split('https://')[1] || y.split('http://')[1])) {
          imageArray.push({ uri: y })
        }
      });
    }
    if (x['cover_image'] != "" && x['cover_image'] != null && x['cover_image'] != undefined && x['cover_image'].url != "" && x['cover_image'].url != null && x['cover_image'].url != undefined && (x['cover_image'].url.split('https://')[1] || x['cover_image'].url.split('http://')[1])) {
      imageArray.push({ uri: x.cover_image.url })
    }
  })
  databaseDatavideoart.map((x: any) => {
    if (x.embedded_images && x.embedded_images.length > 0) {
      x.embedded_images.map((y: any) => {
        if ((y.split('https://')[1] || y.split('http://')[1])) {
          imageArray.push({ uri: y })
        }
      });
    }
    if (x['cover_image'] != "" && x['cover_image'] != null && x['cover_image'] != undefined && x['cover_image'].url != "" && x['cover_image'].url != null && x['cover_image'].url != undefined && (x['cover_image'].url.split('https://')[1] || x['cover_image'].url.split('http://')[1])) {
      imageArray.push({ uri: x.cover_image.url })
    }
  })

  FastImage.preload(imageArray, () => {
    console.log("images preloaded");
  },
    () => {
      return 'complete';
    })
  // });
}
export const onHomeapiSuccess = async (response: any, dispatch: any, navigation: any, languageCode: string, prevPage: string, activeChild: any, oldErrorObj: any, forceupdatetime: any, downloadWeeklyData: any, downloadMonthlyData: any, enableImageDownload: any): Promise<any> => {
  const resolvedPromises = oldErrorObj.map(async (x: any) => {
    const allDatatoStore = await getAllDataOnRetryToStore(x.apiEndpoint, languageCode, dispatch, prevPage, activeChild);
    return allDatatoStore;

  })
  const forceUpdateData = [
    {
      apiEndpoint: appConfig.apiConfig.checkUpdate,
      method: 'get',
      postdata: {},
      saveinDB: false,
    }
  ];
  await Promise.all(resolvedPromises);
  dispatch(setInfoModalOpened({ key: 'showDownloadPopup', value: false }));
  //delete all notifications from slice for all child
  const currentDate = DateTime.now().toMillis();
  if (prevPage == "CountryLangChange" || prevPage == "DownloadUpdate" || prevPage == "ForceUpdate" || prevPage == "DownloadAllData") {
    dispatch(setSyncDate({ key: 'weeklyDownloadDate', value: currentDate }));
    dispatch(setSyncDate({ key: 'monthlyDownloadDate', value: currentDate }));
    if (prevPage == 'ForceUpdate') {
      AsyncStorage.setItem('forceUpdateTime', forceupdatetime);
      LocalNotifications.cancelAllReminderLocalNotification();
      dispatch(setAllNotificationData([]));
      const notiFlagObj = { key: 'generateNotifications', value: true };
      dispatch(setInfoModalOpened(notiFlagObj));
      const localNotiFlagObj = { generateFlag: true, generateType: 'add', childuuid: 'all' };
      dispatch(setAllLocalNotificationGenerateType(localNotiFlagObj));
    }
  }
  if (prevPage == "PeriodicSync") {
    if (downloadWeeklyData == true) {
      dispatch(setSyncDate({ key: 'weeklyDownloadDate', value: currentDate }));
    }
    if (downloadMonthlyData == true) {
      dispatch(setSyncDate({ key: 'monthlyDownloadDate', value: currentDate }));
    }
  }

  if (prevPage == 'DownloadAllData' || prevPage == 'ImportScreen' || prevPage == 'CountryLangChange') {
    const artresp = response.find((x: any) => x.apiEndpoint == 'articles' && x.status == 200);
    if (artresp && artresp != {}) {
      const artobj = oldErrorObj.find((x: any) => x.apiEndpoint == 'articles');
      if (artobj && artobj != {}) {
        const storedata = store.getState();
        const childagearray = storedata.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(storedata.utilsData.taxonomy.allTaxonomyData).child_age : [];
        const artarray = artobj.postdata.childAge == 'all' ? childagearray.map((x: any) => x.id) : artobj.postdata.childAge.split(',').map(Number)
        console.log(artarray, "---childagearray--", childagearray);
        dispatch(setDownloadedBufferAgeBracket(artarray))
      }
    }
  }


  if (prevPage == 'CountryLangChange' || prevPage == 'ImportScreen') {
    await userRealmCommon.verifyFavorites();
    LocalNotifications.cancelAllReminderLocalNotification();
    dispatch(setDailyArticleGamesCategory({}));
    dispatch(setShowedDailyDataCategory({}));
    dispatch(setAllNotificationData([]));
    dispatch(setchatBotData([]));
    dispatch(setInfoModalOpened({ key: 'allDataDownloadFlag', value: false }));
    const notiFlagObj = { key: 'generateNotifications', value: true };
    dispatch(setInfoModalOpened(notiFlagObj));
    const localnotiFlagObj = { generateFlag: true, generateType: 'add', childuuid: 'all' };
    dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
    if (prevPage == 'CountryLangChange') {
      const apiresponse = await commonApiService(forceUpdateData[0].apiEndpoint, forceUpdateData[0].method, forceUpdateData[0].postdata);
      const forceUpdateTime = apiresponse && apiresponse.data && apiresponse.data.updated_at ? apiresponse.data.updated_at : '0';
      AsyncStorage.setItem('forceUpdateTime', forceUpdateTime);
    }
  }
  const storedata = store.getState();
  const errorObj = storedata.failedOnloadApiObjReducer.errorObj;
  if (prevPage == 'DownloadUpdate' && errorObj?.length == 0) {
    Alert.alert(i18n.t('downloadUpdateSuccessPopupTitle'), i18n.t('downloadUpdateSuccessPopupText'),
      [
        {
          text: i18n.t('downloadUpdateSuccessOkBtn'), onPress: async (): Promise<any> => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'HomeDrawerNavigator',
                },
              ],
            });
          }
        }
      ]
    );
  }
  else if (prevPage == 'DownloadAllData' && errorObj?.length == 0) {
    if (enableImageDownload) {
      await downloadArticleImages();
      Alert.alert(i18n.t('downloadAllSuccessPopupTitle'), i18n.t('downloadAllSuccessPopupText'),
        [
          {
            text: i18n.t('downloadAllSuccessOkBtn'), onPress: async (): Promise<any> => {
              dispatch(setInfoModalOpened({ key: 'allDataDownloadFlag', value: true }));
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'HomeDrawerNavigator',
                  },
                ],
              });
            }
          }
        ]
      );
    } else {
      Alert.alert(i18n.t('downloadAllSuccessPopupTitle'), i18n.t('downloadAllSuccessPopupText'),
        [
          {
            text: i18n.t('downloadAllSuccessOkBtn'), onPress: async (): Promise<any> => {
              dispatch(setInfoModalOpened({ key: 'allDataDownloadFlag', value: true }));
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'HomeDrawerNavigator',
                  },
                ],
              });
            }
          }
        ]
      );
    }

  }
  else {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeDrawerNavigator',
        },
      ],
    });
  }
}
export const onHomeSurveyapiSuccess = async (_response: any, dispatch: any, _navigation: any, languageCode: string, prevPage: string, activeChild: any, oldErrorObj: any): Promise<any> => {
  const resolvedPromises = oldErrorObj.map(async (x: any) => {
    const allDatatoStore = await getAllDataOnRetryToStore(x.apiEndpoint, languageCode, dispatch, prevPage, activeChild);
    return allDatatoStore;
  });
  await Promise.all(resolvedPromises);
}
export const onHomeVideoartapiSuccess = async (_response: any, dispatch: any, _navigation: any, languageCode: string, prevPage: string, activeChild: any, oldErrorObj: any): Promise<any> => {
  const resolvedPromises = oldErrorObj.map(async (x: any) => {
    const allDatatoStore = await getAllDataOnRetryToStore(x.apiEndpoint, languageCode, dispatch, prevPage, activeChild);
    return allDatatoStore;
  });
  await Promise.all(resolvedPromises);
}
export const retryAlert = (): any => {
  return new Promise((resolve, reject) => {
    Alert.alert(i18n.t('retryPopupTitle'), i18n.t('retryPopupText'),
      [
        {
          text: i18n.t('retryCancelPopUpBtn'),
          onPress: (): any => reject("Retry Cancelled"),
          style: "cancel"
        },
        { text: i18n.t('retryRetryBtn'), onPress: (): any => resolve("Retry success") }
      ]
    );
  });
}
export const cancelRetryAlert = (): any => {
  return new Promise((resolve) => {
    Alert.alert(i18n.t('cancelRetryPopupTitle'), i18n.t('cancelPopupText'),
      [
        { text: i18n.t('cancelPopUpBtn'), onPress: (): any => resolve("cancelRetry success") }
      ]
    );
  });
}
export const retryAlert1 = (bandwidth: any, toggle: any): any => {
  return new Promise((resolve) => {
    if (bandwidth == 1) {
      bandwidth = i18n.t('lowBandwidth');
    }
    else {
      bandwidth = i18n.t('highBandwidth');
    }
    if (toggle == 1) {
      toggle = i18n.t('dataSaveron');
    }
    else {
      toggle = i18n.t('dataSaveroff');
    }
    //"Do you want to switch"+toggle+"data saver mode?"
    setTimeout(() => {
      Alert.alert(bandwidth, toggle,
        [
          {
            text: i18n.t('retryCancelPopUpBtn'),
            onPress: (): any => resolve("cancel"),
            style: "cancel"
          },
          { text: i18n.t('vcIsMeasuredOption1'), onPress: (): any => resolve("yes") }
        ]
      );
    }, 2500);
  });
}
export const deleteArticleNotPinned = async (): Promise<any> => {
  const createresult = await dataRealmCommon.delete(ArticleEntitySchema.name, "isarticle_pinned!='1'");
  return createresult;
}
export default commonApiService;
