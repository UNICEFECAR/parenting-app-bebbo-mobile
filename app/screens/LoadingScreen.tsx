import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { BackHandler, I18nManager, Platform } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import LoadingScreenComponent from '../components/LoadingScreenComponent';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { ActivitiesEntitySchema } from '../database/schema/ActivitiesSchema';
import { ArticleEntitySchema } from '../database/schema/ArticleSchema';
import { BasicPagesSchema } from '../database/schema/BasicPagesSchema';
import { ChildDevelopmentSchema } from '../database/schema/ChildDevelopmentSchema';
import { DailyHomeMessagesSchema } from '../database/schema/DailyHomeMessagesSchema';
import { FAQsSchema } from '../database/schema/FAQsSchema';
import { HealthCheckUpsSchema } from '../database/schema/HealthCheckUpsSchema';
import { MilestonesSchema } from '../database/schema/MilestonesSchema';
import { StandardDevHeightForAgeSchema } from '../database/schema/StandardDevHeightForAgeSchema';
import { StandardDevWeightForHeightSchema } from '../database/schema/StandardDevWeightForHeightSchema';
import { SurveysSchema } from '../database/schema/SurveysSchema';
import { TaxonomySchema } from '../database/schema/TaxonomySchema';
import { VaccinationSchema } from '../database/schema/VaccinationSchema';
import { VideoArticleEntitySchema } from '../database/schema/VideoArticleSchema';
import { setDownloadedBufferAgeBracket } from '../redux/reducers/childSlice';
import { fetchAPI } from '../redux/sagaMiddleware/sagaActions';
import { receiveAPIFailure } from '../redux/sagaMiddleware/sagaSlice';
import { apiJsonDataGet, getAge } from '../services/childCRUD';
import { deleteArticleNotPinned } from '../services/commonApiService';
import KeepAwake from '@sayem314/react-native-keep-awake';
import { clientIdKey } from 'react-native-dotenv';
import RNRestart from 'react-native-restart';
import i18next from 'i18next';
import { onLocalizationSelect, setSponsorStore } from '../redux/reducers/localizationSlice';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;
type Props = {
  route: any;
  navigation: ChildSetupNavigationProp;
};


const LoadingScreen = ({ route, navigation }: Props): any => {
  const dispatch = useAppDispatch();
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const childList = useAppSelector(
    (state: any) => state.childData.childDataSet.allChild != '' ? JSON.parse(state.childData.childDataSet.allChild) : [],
  );
  const {
    apiJsonData = null,
    prevPage = null,
    downloadWeeklyData = null,
    downloadMonthlyData = null,
    downloadBufferData = null,
    ageBrackets = null,
    forceupdatetime = null,
    isFirst = false
  } = route.params || {};
  const sponsors = useAppSelector(
    (state: any) => state.selectedCountry.sponsors,
  );
  const allCountries = useAppSelector(
    (state: any) =>
      state.selectedCountry.countries != '' ? JSON.parse(state.selectedCountry.countries) : [],
  );

  const AppLayoutDirectionScreen = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirectionScreen,
  );
  const AppLayoutDirection = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirection,
  );

  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const bufferAgeBracket = useAppSelector((state: any) =>
    state.childData.childDataSet.bufferAgeBracket
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
  const incrementalSyncDT = useAppSelector((state: any) =>
    (state.utilsData.incrementalSyncDT),
  );
  const allDataDownloadFlag = useAppSelector((state: any) =>
    (state.utilsData.allDataDownloadFlag),
  );
  const netInfo = useNetInfoHook();
  const [netflag, setnetflag] = useState(false);
  const getAgeWithAgeBrackets = async (prevPage: any): Promise<any> => {
    const alldataarr: any[] = [], deltadataarr: any[] = [];
    if (allDataDownloadFlag == true && prevPage != "CountryLangChange") {
      bufferAgeBracket.map((x: any) => deltadataarr.push(x));
    }
    else {
      const Ages = await getAge(childList, childAge);
      const ageBrackets: any = [];
      childList.map((child: any) => {
        const childAgedays = (DateTime.now()).diff((DateTime.fromISO(child.birthDate)), 'days').toObject().days;
        if (childAgedays) {
          if (childAgedays >= child.taxonomyData.days_to - child.taxonomyData.buffers_days) {
            const i = childAge.findIndex((item: any) => item?.id === child?.taxonomyData?.id);
            if (i > -1 && i < childAge.length - 1) {
              const nextchildAgeData = childAge[i + 1];
              if (nextchildAgeData.age_bracket.length > 0) {
                nextchildAgeData.age_bracket.map((ages: any) => {
                  ageBrackets.push(ages);
                })
              }
            }
          }
        }
      });
      const newAges = [...new Set([...Ages, ...ageBrackets])];
      newAges.map(x => {
        if (bufferAgeBracket.indexOf(x) == -1) {
          alldataarr.push(x);
        } else {
          deltadataarr.push(x);
        }
      })
    }
    return { alldataarr: alldataarr, deltadataarr: deltadataarr };
  }
  const callSagaApi = async (enableImageDownload: any): Promise<any> => {
    const routes = navigation.getState().routes;
    console.log(routes, "Routes is");
    console.log(routes.length, "in callSagaApi navigation history--", navigation.getState().routes);
    const prevRoute = routes.length > 2 ? routes[routes.length - 2] : null;
    if (prevPage == "ChildSetup" || prevPage == "AddEditChild") {
      dispatch(fetchAPI(apiJsonData, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonData, netInfo.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
    else if (prevPage == "Home") {
      //append agebrackets to existing on error obj
      dispatch(fetchAPI(apiJsonData, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonData, netInfo.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
    else if (prevPage == "CountryLangChange" || prevPage == "DownloadUpdate" || prevPage == "ForceUpdate" || prevPage == "DownloadAllData") {
      //when downloading all data replace agebrackets
      const Ages = await getAgeWithAgeBrackets(prevPage);
      const newAges = [...new Set([...Ages.alldataarr, ...Ages.deltadataarr])]
    // let apiJsonDataarticleall: any[] = [], apiJsonDataarticledelta: any[] = [];
      // if (Ages.alldataarr?.length > 0 || Ages.deltadataarr?.length > 0) {
      //   if (prevPage == "DownloadAllData" && allDataDownloadFlag == true) {
      //     if (Ages.alldataarr?.length > 0) {
      //       apiJsonDataarticleall = apiJsonDataGet("all");
      //     }
      //     if (Ages.deltadataarr?.length > 0) {
      //       apiJsonDataarticledelta = apiJsonDataGet(true, incrementalSyncDT);
      //     }
      //   }
      //   else if (prevPage == "DownloadAllData" && allDataDownloadFlag == false) {
      //     apiJsonDataarticleall = apiJsonDataGet("all")
      //   } else if (prevPage == "CountryLangChange") {
      //     apiJsonDataarticleall = apiJsonDataGet("all")
      //   } else {
      //     if (Ages.alldataarr?.length > 0) {
      //       apiJsonDataarticleall = apiJsonDataGet("all");
      //     }
      //     if (Ages.deltadataarr?.length > 0) {
      //       apiJsonDataarticledelta = apiJsonDataGet(true, incrementalSyncDT);
      //     }
      //   }
      // } else {
      //   apiJsonDataarticleall = apiJsonDataGet("all");
      // }
      const apiJsonDataarticleall = apiJsonDataGet("all");
      if (apiJsonDataarticleall.length > 0) {
        apiJsonData.push(apiJsonDataarticleall[0]);
      }
      // if (apiJsonDataarticledelta.length > 0) {
      //   apiJsonData.push(apiJsonDataarticledelta[0]);
      // }
      console.log(apiJsonData, "--apiJsonDataarticle---", apiJsonDataarticleall, "---apiJsonDataarticleall---");
      if (prevRoute && prevRoute.name && prevRoute.name == 'DetailsScreen') {
        console.log("do nothing");
      } else {
        //check download all flag on second downlaodd all click
        if (prevPage == "CountryLangChange" || (prevPage == "DownloadAllData" && allDataDownloadFlag == false)) {
          const schemaarray = [ArticleEntitySchema, VideoArticleEntitySchema, DailyHomeMessagesSchema,
            BasicPagesSchema, TaxonomySchema, MilestonesSchema, ChildDevelopmentSchema, VaccinationSchema, HealthCheckUpsSchema,
            SurveysSchema, ActivitiesEntitySchema, StandardDevHeightForAgeSchema, StandardDevWeightForHeightSchema, FAQsSchema]
          const resolvedPromises = schemaarray.map(async schema => {
            await dataRealmCommon.deleteOneByOne(schema);
          })
          await Promise.all(resolvedPromises);
        }
      }
      const payload = { errorArr: [], fromPage: 'OnLoad' }
      dispatch(receiveAPIFailure(payload));
      dispatch(fetchAPI(apiJsonData, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonData, netInfo.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
    else if (prevPage == "PeriodicSync") {
      //if flag true for buffer then append those in agebrackets
    //  let allAgeBrackets: any[] = [], deltaageBracktes: any[] = [];
      // if (downloadBufferData == true) {
      //   if (ageBrackets?.length > 0) {
      //     ageBrackets.map((ages: any) => {
      //       if (bufferAgeBracket.indexOf(ages) == -1) {
      //         allAgeBrackets.push(ages);
      //       } else {
      //         deltaageBracktes.push(ages);
      //       }
      //     })
      //   }
      // }
      // if (downloadWeeklyData == true) {
      //   const Ages = await getAgeWithAgeBrackets(prevPage);
      //   //check download all flag
      //   if (Ages.alldataarr?.length > 0) {
      //     allAgeBrackets = [...new Set([...allAgeBrackets, ...Ages.alldataarr])]
      //   }
      //   if (Ages.deltadataarr?.length > 0) {
      //     deltaageBracktes = [...new Set([...deltaageBracktes, ...Ages.deltadataarr])]
      //   }
      // }
     // allAgeBrackets = [...new Set(allAgeBrackets)];
      // let apiJsonDataarticleall: any[] = [], apiJsonDataarticledelta: any[] = [];
      // if (allAgeBrackets.length > 0) {
        
      // }
      // if (deltaageBracktes.length > 0) {
       
      // }
      const apiJsonDataarticleall = apiJsonDataGet("all")
      const apiJsonDataarticledelta = apiJsonDataGet("all", true, incrementalSyncDT)
      if (apiJsonDataarticleall.length > 0) {
        apiJsonData.push(apiJsonDataarticleall[0]);
      }
      if (apiJsonDataarticledelta.length > 0) {
        apiJsonData.push(apiJsonDataarticledelta[0]);
      }
      console.log(apiJsonData, "--apiJsonDataarticle sync---", apiJsonDataarticleall, "---apiJsonDataarticleall---", apiJsonDataarticledelta);
      // if (allAgeBrackets.length > 0) {
      //   const newAges = [...new Set([...allAgeBrackets, ...bufferAgeBracket])]
      //   dispatch(setDownloadedBufferAgeBracket(newAges))
      // }
      dispatch(fetchAPI(apiJsonData, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonData, netInfo.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
    else if (prevPage == "ImportScreen") {
      //when importing data replace agebrackets
      // const Ages = await getAge(childList, childAge);
      // let apiJsonDataarticle;
      // if (Ages?.length > 0) {
      //   apiJsonDataarticle = apiJsonDataGet("all")
      // }
      // else {
      //   apiJsonDataarticle = apiJsonDataGet("all")
      // }
      const apiJsonDataarticle = apiJsonDataGet("all")
      //Article delete fun if not pinned have to create with ArticleEntitySchema after cvariable success dispatch
      await deleteArticleNotPinned();
      dispatch(setDownloadedBufferAgeBracket([]))
      dispatch(fetchAPI(apiJsonDataarticle, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonDataarticle, netInfo.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
    else {
      dispatch(fetchAPI(apiJsonData, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonData, netInfo.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      console.log(incrementalSyncDT, "incrementalSyncDT in useeffect laoding---", netflag);
      if (netInfo.isConnected != null && netflag == false) {
        let enableImageDownload = false;
        if (toggleSwitchVal == false && netInfo.isConnected == true) {
          enableImageDownload = true
        } else {
          enableImageDownload = false
        }
        console.log("keep awake activated");
        setnetflag(true);
        callSagaApi(enableImageDownload);
      }

    }, [netInfo.isConnected])
  );
  useEffect(() => {
    console.log('Sponsers List Data is',sponsors)
    const backAction = (): any => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return (): any => {
      backHandler.remove();
    }
  }, []);

  useEffect(() => {
    if(allCountries?.length === 1 && allCountries[0]?.languages?.length === 1 && isFirst){
      const language = allCountries[0]?.languages?.[0]
      i18next.changeLanguage(language.locale)
      .then(() => {
        if (language?.locale == 'GRarb' || language?.locale == 'GRda') {
          if (AppLayoutDirection == 'ltr') {
            //remove rtl on backhandler
            Platform.OS == 'ios' ? setTimeout(() => {
              I18nManager.forceRTL(true);
              RNRestart.Restart();
            }, 100) :
              setTimeout(() => {
                I18nManager.forceRTL(true);
                RNRestart.Restart()
              }, 0);
          } else {
            I18nManager.forceRTL(true);
          }
        } else {
          I18nManager.forceRTL(false);
        }
      })
      
      dispatch(setSponsorStore(allCountries[0]));
      dispatch(onLocalizationSelect({ "languages": allCountries[0]?.languages, "countryId": allCountries[0]?.CountryID }));
    }
  },[isFirst])


  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.SECONDARY_COLOR;
  return (
    <>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <KeepAwake />
      <LoadingScreenComponent sponsors={sponsors} prevPage={prevPage}></LoadingScreenComponent>
    </>

  );
};

export default LoadingScreen;
