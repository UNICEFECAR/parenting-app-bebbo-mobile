import { bothParentGender, femaleData, maleData, regexpEmojiPresentation, relationShipFatherId, relationShipMotherId } from '@assets/translations/appOfflineData/apiConstants';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonMangeProfileContainer, ButtonPrimary, ButtonText, ButtonUpperCaseText } from '@components/shared/ButtonGlobal';
import {
  ChildRelationList,
  FormContainer,
  FormContainer1,
  FormDateAction, FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText
} from '@components/shared/ChildSetupStyle';
import { MainManageProfileContainer } from '@components/shared/Container';
import { HeaderIconPress, HeaderIconView, HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon, { IconML } from '@components/shared/Icon';
import TextInputML from '@components/shared/TextInputML';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Pressable, StyleSheet, Text, View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { updateActiveChild } from '../services/childCRUD';
import {
  Heading2w,
  Heading3, ShiftFromTop10
} from '../styles/typography';
import { bgcolorWhite } from '@styles/style';

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList
>;

type Props = {
  route: any;
  navigation: ChildSetupNavigationProp;
};
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  headerRowView: {
    maxHeight: 50
  },
  headetTitleText: {
    color: bgcolorWhite
  },
  textInputML: { width: '100%' }

})
const EditParentDetails = ({ route, navigation }: Props): any => {
  const { userParentalRoleData, userRelationToParentEdit, parentEditName } = route.params;
  const [relationship, setRelationship] = useState(userParentalRoleData ? userParentalRoleData : "");
  const [relationshipUniqueName, setRelationshipUniqueName] = useState();
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipName, setRelationshipName] = useState("");
  const [defaultGenderValue, setDefaultGenderValue] = React.useState<any>(null);
  let relationshipData = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender : [],
  );
  const taxonomyIds = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomyIds,
  );
  const relationshipToParentGlobal = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).relationship_to_parent,
  );

  relationshipData = relationshipData.map((v: any) => ({ ...v, title: v.name })).filter(function (e: any) {
    return e.unique_name != taxonomyIds?.bothParentGender;
  });
  const actionSheetRef = createRef<any>();
  const themeContext = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [parentName, setParentName] = React.useState(parentEditName ? parentEditName : "");
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const relationshipToParent = relationshipToParentGlobal.length > 0 && userParentalRoleData != "" ? relationshipToParentGlobal.find((o: any) => o.id === userParentalRoleData) : '';
   const relationshipValue = relationshipData.find((item:any) => item.id === userRelationToParentEdit);
  // console.log('result is',relationshipToParent);
  useFocusEffect(
    React.useCallback(() => {
      console.log('relationshipToParentGlobal uswe role', relationshipData);
      console.log('userRelationToParentEdit uswe role', userRelationToParentEdit);
      console.log('relationshipToParent uswe role', relationshipToParent);
      console.log('userParentalRoleDatav uswe role', userParentalRoleData);
      console.log('relationship is', relationship);
      setRelationshipName(relationshipToParent != "" && relationshipToParent != null && relationshipToParent != undefined ? relationshipToParent.name : '');
      setUserRelationToParent(relationshipToParent != "" && relationshipToParent != null && relationshipToParent != undefined ? relationshipToParent.unique_name : '');
      setDefaultGenderValue(userRelationToParentEdit != ''
        ? relationshipData.find((item: any) => item.id == userRelationToParentEdit)
        : { title: '' })
        setRelationshipUniqueName(relationshipValue.unique_name);
    }, [])
  );
  useEffect(() => {
    const backAction = (): any => {
      navigation.goBack();
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
  }, []);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const saveParentData = async (relationship: any, parentName: any, userRelationToParent: any): Promise<any> => {
    const relationshipnew: any = relationship;
    if (typeof relationshipnew === 'string' || relationshipnew instanceof String) {
      relationship = relationshipnew
    }
    else {
      relationship = String(relationshipnew);
    }
    console.log('save uswe role', relationship);
    console.log('save userRelationToParent', userRelationToParent);
    await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userParentalRole", relationship);
    await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userRelationToParent", String(userRelationToParent));
    await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userName", parentName);
    userRelationToParent = userRelationToParent.length > 0 ? userRelationToParent[0].value : '';
    updateActiveChild(activeChild, "parent_gender", relationship, dispatch, String(userRelationToParent),taxonomyIds?.boyChildGender);
    navigation.navigate('ChildProfileScreen');
  }
  const getCheckedParentItem = (checkedItem: any): any => {
    if (
      typeof checkedItem.id === 'string' ||
      checkedItem.id instanceof String
    ) {
      setRelationship(checkedItem.id);
      setRelationshipUniqueName(checkedItem.unique_name);
    } else {
      setRelationship(String(checkedItem.id));
      setRelationshipUniqueName(checkedItem.unique_name);
    }
  };
  return <>
    <View style={[styles.flex1, { backgroundColor: bgcolorWhite }]}>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <HeaderRowView
        style={[styles.headerRowView, { backgroundColor: headerColor }]}>
        <HeaderIconView>
          <HeaderIconPress
            onPress={(): any => {
              navigation.goBack();
            }}>
            <IconML name={'ic_back'} color="#FFF" size={15} />
          </HeaderIconPress>
        </HeaderIconView>
        <HeaderTitleView>
          <Heading2w style={styles.headetTitleText} numberOfLines={1}>
            {t('babyNotificationUpdateBtn')}
          </Heading2w>
        </HeaderTitleView>
      </HeaderRowView>
      <MainManageProfileContainer>
        <FormInputGroup
          onPress={(): any => {
            actionSheetRef.current?.setModalVisible(true);
          }}>
          <LabelText>{t('childSetuprelationSelectTitle')}</LabelText>

          <FormInputBox>
            <FormDateText>
              <Text>{relationshipName ? relationshipName : 'Select'}</Text>
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
                  defaultValue={defaultGenderValue}
                  tickbgColor={headerColor}
                  tickColor={'#FFF'}
                  getCheckedItem={getCheckedParentItem}
                />
              </FormContainer1>
              : null
          }
        </View>
        <ActionSheet ref={actionSheetRef}>
          <View style={{ marginBottom: 40 }}>
            {
              relationshipToParentGlobal.map((item: any, index: any) => {
                return (
                  <ChildRelationList key={index}>
                    <Pressable
                      onPress={(): any => {
                        setUserRelationToParent(item.unique_name);

                        if (item.unique_name == taxonomyIds?.relationShipMotherId) {
                          if (typeof taxonomyIds?.femaleData.unique_name === 'string' || taxonomyIds?.femaleData.unique_name instanceof String) {
                            setRelationship(taxonomyIds?.femaleData.unique_name);
                          }
                          else {
                            setRelationship(String(taxonomyIds?.femaleData.unique_name));
                          }
                        }
                        else if (item.unique_name == taxonomyIds?.relationShipFatherId) {
                          if (typeof taxonomyIds?.maleData.unique_name === 'string' || taxonomyIds?.maleData.unique_name instanceof String) {
                            setRelationship(taxonomyIds?.maleData.unique_name);
                          }
                          else {
                            setRelationship(String(taxonomyIds?.maleData.unique_name));
                          }
                        }
                        else {
                          console.log("22", userRelationToParent, item.unique_name);
                          if (item.id == taxonomyIds?.relationShipMotherId || item.id == taxonomyIds?.relationShipFatherId) {
                            setRelationship('');
                          }
                        }
                        setRelationshipName(item.name);
                        actionSheetRef.current?.setModalVisible(false);
                      }}>
                      <Heading3>{item.name}</Heading3>
                    </Pressable>
                  </ChildRelationList>
                );
              })}
          </View>
        </ActionSheet>
        <FormContainer>
          <LabelText>{t('parentNameTxt')}</LabelText>
          <FormInputBox>
            <TextInputML
              autoCapitalize="none"
              style={styles.textInputML}
              autoCorrect={false}
              maxLength={30}
              clearButtonMode="always"
              onChangeText={(value: any): any => {
                if (value.replace(/\s/g, "") == "") {
                  setParentName(value.replace(/\s/g, ''));
                } else {
                  setParentName(value.replace(regexpEmojiPresentation, ''));
                }
              }}
              value={parentName}
              //placeholder={t('parentPlaceNameTxt')}
              //placeholderTextColor={"#77777779"}
              allowFontScaling={false}
            /></FormInputBox>
        </FormContainer>
      </MainManageProfileContainer>
      <ShiftFromTop10>
        <ButtonMangeProfileContainer>
          <ButtonPrimary
            disabled={
              relationship == "" || relationship == null || relationship == undefined || parentName == null || parentName == undefined || parentName == "" ? true : false}
            onPress={(): any => {
              saveParentData(relationshipUniqueName, parentName, userRelationToParent);
            }}>
            <ButtonUpperCaseText numberOfLines={2}>{t('childSetupListsaveBtnText')}</ButtonUpperCaseText>
          </ButtonPrimary>
        </ButtonMangeProfileContainer>
      </ShiftFromTop10>
    </View>
  </>;
};

export default EditParentDetails;
