import { ONBOARDING_CHILD_COUNT } from '@assets/data/firebaseEvents';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
 ButtonPrimary, ButtonText,
 ButtonUpperCaseText,
} from '@components/shared/ButtonGlobal';
import {
  ChildCenterView,
  ChildColArea1,
  ChildColArea2,
  ChildListAction,
  ChildListingBox,
  ChildListTitle,
} from '@components/shared/ChildSetupStyle';
import Icon  from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { CommonActions, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { bgcolorWhite2, primaryColor, secondaryBtnColor } from '@styles/style';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, Dimensions, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { ChildEntity } from '../database/schema/ChildDataSchema';
import { apiJsonDataGet, deleteChild, getAge, getAllChildren, getAllConfigData, isFutureDate } from '../services/childCRUD';
import { formatDate, notiPermissionUtil } from '../services/Utils';
import {
  Heading1Centerw,
  Heading3Centerw,
  Heading5,
  ShiftFromTop30
} from '../styles/typography';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import { logEvent } from '../services/EventSyncService';
import { FlexCol } from '@components/shared/FlexBoxStyle';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddSiblingDataScreen'
>;
type Props = {
  navigation: ChildSetupNavigationProp;
};
const styles = StyleSheet.create({
  autoHeight: { height: 'auto' },
  containerView: {
    backgroundColor:primaryColor,
    flex:1
  },
  textStyle: { 
    fontSize: 12,
    fontWeight: 'normal'
  },
  touchableLeft: { 
    marginLeft: 2,
    padding: 8 
  },
  touchableRight: { 
    marginRight: 2,
    padding: 8 
  },
  listBgColor:{
    backgroundColor:'red'
  },
  babyImageContainer:{
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    borderColor: secondaryBtnColor,
    borderWidth:2,
    marginVertical:30,
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
    backgroundColor:bgcolorWhite2,
    justifyContent: 'center',
    alignSelf:'center',
    alignItems: 'center'
  }
})
const ServiceProviderInfoSetup = ({ navigation }: Props): any => {
  const netInfo = useNetInfoHook();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [parentViewHeight, setParentViewheight] = useState(0);
  const [profileViewHeight, setProfileViewheight] = useState(0);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const windowHeight = Dimensions.get('window').height;
  const genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  const childList = useAppSelector(
    (state: any) => state.childData.childDataSet.allChild != '' ? JSON.parse(state.childData.childDataSet.allChild) : [],
  );
  const onLayout = (event: any): any => {
    setParentViewheight(event.nativeEvent.layout.height);
  }
  useEffect(() => {
    if (isFocused) {
       getAllChildren(dispatch, childAge, 0);
       getAllConfigData(dispatch);
       notiPermissionUtil();
       setTimeout(() => {
         navigation.dispatch(state => {
           // Remove the home route from the stack
           const routes = state.routes.filter(r => r.name !== 'LoadingScreen');
 
           return CommonActions.reset({
             ...state,
             routes,
             index: routes.length - 1,
           });
         });
       }, 100);
    }
  }, [isFocused]);
  useFocusEffect(
    React.useCallback(() => {
     
      const backAction = (): any => {
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );
      navigation.addListener('gestureEnd', backAction);
      return (): any => {
        navigation.removeListener('gestureEnd', backAction);
        backHandler.remove();
      }
    }, [])
  );
  const deleteRecord = (index: number, dispatch: any, uuid: string): any => {
    return new Promise((resolve, reject) => {
      Alert.alert(t('deleteChildTxt'), t('deleteWarnTxt'),
        [
          {
            text: t('removeOption1'),
            onPress: (): any => resolve("error"),
            style: "cancel"
          },
          {
            text: t('growthScreendelText'), onPress: async (): Promise<any> => {
          
              await deleteChild(navigation,languageCode, index, dispatch, 'ChildEntity', uuid, 'uuid ="' + uuid + '"', resolve, reject, childAge, t,childList);
              getAllChildren(dispatch, childAge, 0);
            }
          }
        ]
      );
    });

  }
  const editRecord = (data: any): any => {
    navigation.navigate('AddSiblingDataScreen', { headerTitle: t('babyNotificationUpdateBtn'), childData: data });
  }
  const renderDailyReadItem = (dispatch: any, data: ChildEntity, index: number, gender: any): any => {
   console.log('Gender is',gender)
    return (
      <ChildListingBox key={index}>
       { gender != '' && gender != 0 && gender != undefined ? 
         gender=='Girl' ?
         <Icon name="ic_baby_girl" size={40} color='#000' />
         :  <Icon name="ic_baby" size={40} color='#000' />
         :<Icon name="ic_baby_girl" size={40} color='#000' />}
        <ChildColArea1>
       
          <ChildListTitle >{data.childName}{(gender != '' && gender != 0 && gender != undefined) ? <Text style={styles.textStyle}>, {gender}</Text> : null}</ChildListTitle>
          <Heading5>{(data.birthDate != null && data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn', { childdob: data.birthDate != null ? formatDate(data.birthDate) : '' }) : t('expectedChildDobLabel')}</Heading5>
        </ChildColArea1>
        <ChildColArea2>
          {
            childList.length > 1 ? (
              <TouchableHighlight style={styles.touchableRight} underlayColor="transparent" onPress={(): any => {
                
                deleteRecord(index, dispatch, data.uuid)}}>
                <ChildListAction>
                  <Icon
                    name="ic_trash"
                    size={16}
                    color="#000"
                  />
                </ChildListAction>
              </TouchableHighlight>
            ) : null
          }
          <TouchableHighlight style={styles.touchableLeft} underlayColor="transparent" onPress={(): any => editRecord(data)}>
            <ChildListAction>
              <Icon
                name="ic_edit"
                size={16}
                color="#000"

              />
            </ChildListAction>
          </TouchableHighlight>
        </ChildColArea2>
      </ChildListingBox>
    );
  };
  


  const childSetup = async (): Promise<any> => {
    const Ages = await getAge(childList, childAge);
    let apiJsonData;
    if (Ages?.length > 0) {
      apiJsonData = apiJsonDataGet(String(Ages), "all")
    }
    else {
      apiJsonData = apiJsonDataGet("all", "all")
    }
    const eventData= {'name': ONBOARDING_CHILD_COUNT,'params': { child_count: childList?.length }  }
    logEvent(eventData,netInfo.isConnected)
   
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoadingScreen',
          params: { apiJsonData: apiJsonData, prevPage: 'ChildSetup' },
        },
      ],
    });
  };

  return (
    <>
      <View style={styles.containerView}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <OnboardingContainer>
          <OverlayLoadingComponent loading={loading} />
          <OnboardingHeading>
            <ChildCenterView>
              <Heading1Centerw>
                {t('serviceProviderHeaderInfoText')}
              </Heading1Centerw>
              <ShiftFromTop30>
                <Heading3Centerw>
                  {t('serviceProviderHeaderSubInfoText')}
                </Heading3Centerw>
              </ShiftFromTop30>
            </ChildCenterView>
          </OnboardingHeading>
          <FlexCol>
             <View style={styles.babyImageContainer}>
             <Icon
                name="ic_baby_girl"
                size={90}
                color="#000"
              />
             </View>

    

          
            <View onLayout={onLayout} style={{flexDirection:'column'}}>
           
                <ButtonPrimary onPress={(e:any): any => {
                e.stopPropagation();
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  childSetup();
                }, 0)

              }}>
                  <ButtonUpperCaseText numberOfLines={2}>{t('letGetStartedText')}</ButtonUpperCaseText>
                </ButtonPrimary>
            </View>
            
              </FlexCol>
        </OnboardingContainer>
      </View>
    </>
  );
};

export default ServiceProviderInfoSetup;
