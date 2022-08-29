import { ONBOARDING_CHILD_COUNT } from '@assets/data/firebaseEvents';
import {
  both_parent_gender,
  femaleData,
  maleData,
  relationShipFatherId,
  relationShipMotherId,
} from '@assets/translations/appOfflineData/apiConstants';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonPrimary, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import {
  ChildContentArea,
  ChildRelationList,
  ChildSection,
  FormContainer1,
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText,
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import ToggleRadios from '@components/ToggleRadios';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import React, { createRef, useContext, useEffect, useState } from 'react';
import analytics from '@react-native-firebase/analytics';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View, ScrollView, BackHandler, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { setInfoModalOpened } from '../redux/reducers/utilsSlice';
import { apiJsonDataGet, getAge, getAllChildren, setActiveChild } from '../services/childCRUD';
import { getChild } from '../services/Utils';
import {
  Heading1Centerw,
  Heading3,
  SideSpacing25,
  ShiftFromTop50,
  Heading3Centerw,
  ShiftFromTopBottom20,
  ShiftFromTop10,
} from '../styles/typography';
import { setAllLocalNotificationGenerateType } from '../redux/reducers/notificationSlice';
import { primaryColor } from '@styles/style';

const styles = StyleSheet.create({
  containerView: {
    backgroundColor:primaryColor,
    flex:1
  },
  headingStyle1: { 
    fontWeight: "bold",
    textAlign: 'center'
  },
  headingStyle2: { 
    textAlign: 'center'
  },
  scrollViewStyle: { 
    padding: 0,
    paddingTop: 0
  }
})
const ChildImportSetup = (props: any):any => {
  let { importResponse } = props.route.params;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [relationship, setRelationship] = useState('');
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipname, setRelationshipName] = useState('');
  const actionSheetRef = createRef<any>();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  let relationshipData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender,
  );
  relationshipData = relationshipData.map((v:any) => ({ ...v, title: v.name })).filter(function (e: any) {
    return e.id != both_parent_gender;
  });
  const relationship_to_parent = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).relationship_to_parent,
  );
  useEffect(() => {
    const backAction = ():any => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    props.navigation.addListener('gestureEnd', backAction);
    return ():any => {
      props.navigation.removeListener('gestureEnd', backAction);
      backHandler.remove();
    }
  }, []);
  const getCheckedParentItem = (checkedItem: any):any => {
    if (
      typeof checkedItem.id === 'string' ||
      checkedItem.id instanceof String
    ) {
      setRelationship(checkedItem.id);
    } else {
      setRelationship(String(checkedItem.id));
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      props.navigation.dispatch((state:any) => {
        // Remove the home route from the stack
        const routes = state.routes.filter((r:any) => r.name !== 'LoadingScreen');

        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    }, [])
  );

  return (
    <>

      <View style={styles.containerView}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <OnboardingContainer>

            <ChildContentArea>
              <ChildSection>

                <View>
                  <ShiftFromTop50>
                    <Heading1Centerw style={styles.headingStyle1}>{t('successOnboardingImport')}</Heading1Centerw>
                  </ShiftFromTop50>
                  <ShiftFromTop10><Text></Text></ShiftFromTop10>
                  <ShiftFromTopBottom20>
                    <Heading3Centerw style={styles.headingStyle2}>{t('updateImportText')}</Heading3Centerw>
                  </ShiftFromTopBottom20>
                  <FormInputGroup
                    onPress={():any => {
                      actionSheetRef.current?.setModalVisible();
                    }}>
                    <LabelText>{t('childSetuprelationSelectTitle')}</LabelText>
                    <FormInputBox>
                      <FormDateText>
                        <Text>{relationshipname ? relationshipname : t('childSetuprelationSelectText')}</Text>
                      </FormDateText>
                      <FormDateAction>
                        <Icon name="ic_angle_down" size={10} color="#000" />
                      </FormDateAction>
                    </FormInputBox>
                  </FormInputGroup>

                  <View>
                    {
                      userRelationToParent != null && userRelationToParent != undefined && userRelationToParent != relationShipMotherId && userRelationToParent != relationShipFatherId ?
                        <FormContainer1>
                          <LabelText>{t('parentGender')}</LabelText>
                          <ToggleRadios
                            options={relationshipData}
                            tickbgColor={headerColor}
                            tickColor={'#FFF'}
                            getCheckedItem={getCheckedParentItem}
                          />
                        </FormContainer1>
                        : null
                    }
                  </View>
                </View>
              </ChildSection>

            </ChildContentArea>
          </OnboardingContainer>

        </ScrollView>
        <ActionSheet ref={actionSheetRef}>

          <View>
            {relationship_to_parent.map((item: any, index: any) => {
              return (
                <ChildRelationList key={index}>
                  <Pressable
                    onPress={():any => {
                      setUserRelationToParent(item.id);
                      if (item.id == relationShipMotherId) {
                        if (typeof femaleData.id === 'string' || femaleData.id instanceof String) {
                          setRelationship(femaleData.id);
                        }
                        else {
                          setRelationship(String(femaleData.id));
                        }
                      }
                      else if (item.id == relationShipFatherId) {
                        if (typeof maleData.id === 'string' || maleData.id instanceof String) {
                          setRelationship(maleData.id);
                        }
                        else {
                          setRelationship(String(maleData.id));
                        }
                      }
                      else {
                        if (userRelationToParent == relationShipMotherId || userRelationToParent == relationShipFatherId) {
                          setRelationship('');
                        }
                      }
                      setRelationshipName(item.name);
                      actionSheetRef.current?.hide();
                    }}>
                    <Heading3>{item.name}</Heading3>
                  </Pressable>
                </ChildRelationList>
              );
            })}

          </View>
        </ActionSheet>

        <SideSpacing25>
          <ButtonRow>
            <ButtonPrimary
              disabled={relationship == null || relationship == "" || relationship == undefined || userRelationToParent == undefined ? true : false}
              onPress={async (e):Promise<any> => {
                e.stopPropagation();
                if (importResponse) {
                  importResponse = JSON.parse(importResponse);
                }
                let counter: any = 0;
                if (importResponse?.length > 0) {
                  const resolvedPromises = importResponse.map(async (item: any) => {
                    if (item.birthDate != null && item.birthDate != undefined) {
                      const itemnew = await getChild(item, genders);
                      const childData: any = [];
                      childData.push(itemnew);
                      await userRealmCommon.create<ChildEntity>(ChildEntitySchema, childData);
                      let childId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
                      await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userParentalRole", relationship);
                      await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userRelationToParent", String(userRelationToParent));
                      await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userEnteredChildData", "true");
                      if (counter == 0) {
                        if (childId?.length > 0) {
                          childId = childId[0].value;
                          const activeChildData = importResponse.filter((x: any) => x.uuid == childId);
                          if (activeChildData.length > 0) {
                            await setActiveChild(languageCode, childId, dispatch, child_age, false);
                          }
                          else {
                            await setActiveChild(languageCode, '', dispatch, child_age, false);
                          }
                        }
                        else {
                          await setActiveChild(languageCode, '', dispatch, child_age, false);
                        }
                        counter++;
                      }

                    }
                  });
                  const notiFlagObj = { key: 'generateNotifications', value: true };
                  dispatch(setInfoModalOpened(notiFlagObj));
                  const localnotiFlagObj = { generateFlag: true, generateType: 'add', childuuid: 'all' };
                  dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
                  await Promise.all(resolvedPromises).then(async item => {
                    console.log("item--",item);
                    if (importResponse.length > 0) {
                      const childList = await getAllChildren(dispatch, child_age, 1);
                      const Ages = await getAge(childList, child_age);
                      let apiJsonData;
                      if (Ages?.length > 0) {
                        apiJsonData = apiJsonDataGet(String(Ages), "all")
                      }
                      else {
                        apiJsonData = apiJsonDataGet("all", "all")
                      }
                      analytics().logEvent(ONBOARDING_CHILD_COUNT, { child_count: childList?.length })

                      props.navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'LoadingScreen',
                            params: { apiJsonData: apiJsonData, prevPage: 'ChilSetup' },
                          },
                        ],
                      });
                    }
                    else {
                      // BackHandler.exitApp();
                    }
                  });

                }

              }}>
              <ButtonText>{t('childSetupcontinueBtnText')}</ButtonText>
            </ButtonPrimary>
          </ButtonRow>
        </SideSpacing25>
      </View>
    </>

  );
};

export default ChildImportSetup;