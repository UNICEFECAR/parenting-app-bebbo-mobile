import { both_parent_gender, femaleData, maleData, regexpEmojiPresentation, relationShipFatherId, relationShipMotherId } from '@assets/translations/appOfflineData/apiConstants';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonContainer, ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import {
  ChildRelationList,
  FormContainer,
  FormContainer1,
  FormDateAction, FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
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

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList
>;

type Props = {
  route: any;
  navigation: ChildSetupNavigationProp;
};
const styles=StyleSheet.create({
  flex1:{flex: 1},
  headerRowView:{
    maxHeight: 50
  },
  textInputML:{width:'100%'}

})
const EditParentDetails = ({ route, navigation }: Props):any => {
  const { userParentalRoleData, userRelationToParentEdit, parentEditName } = route.params;
  const [relationship, setRelationship] = useState(userParentalRoleData ? userParentalRoleData : "");
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipName, setRelationshipName] = useState("");
  const [defaultGenderValue, setDefaultGenderValue] = React.useState<any>(null);
  let relationshipData = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender : [],
  );
  const relationship_to_parent = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).relationship_to_parent,
  );
  const relationshipToParent = relationship_to_parent.length > 0 && userRelationToParentEdit != "" ? relationship_to_parent.find((o: any) => String(o.id) === userRelationToParentEdit) : '';
  relationshipData = relationshipData.map((v:any) => ({ ...v, title: v.name })).filter(function (e: any) {
    return e.id != both_parent_gender;
  });
  const actionSheetRef = createRef<any>();
  const themeContext = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [parentName, setParentName] = React.useState(parentEditName ? parentEditName : "");
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  useFocusEffect(
    React.useCallback(() => {
      setRelationshipName(relationshipToParent != "" && relationshipToParent != null && relationshipToParent != undefined ? relationshipToParent.name : '');
      setUserRelationToParent(relationshipToParent != "" && relationshipToParent != null && relationshipToParent != undefined ? relationshipToParent.id : '');
      setDefaultGenderValue(userParentalRoleData != ''
        ? relationshipData.find((item:any) => item.id == relationship)
        : { title: '' })
    }, [])
  );
  useEffect(() => {
    const backAction = ():any => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    navigation.addListener('gestureEnd', backAction);
    return ():any => {
      navigation.removeListener('gestureEnd', backAction);
      backHandler.remove();
    }
  }, []);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const saveParentData = async (relationship: any, parentName: any, userRelationToParent: any):Promise<any> => {
    const relationshipnew: any = relationship;
    if (typeof relationshipnew === 'string' || relationshipnew instanceof String) {
      relationship = relationshipnew
    }
    else {
      relationship = String(relationshipnew);
    }
     await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userParentalRole", relationship);
     await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userRelationToParent", String(userRelationToParent));
     await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userName", parentName);
    userRelationToParent = userRelationToParent.length > 0 ? userRelationToParent[0].value : '';
    updateActiveChild(activeChild, "parent_gender", relationship, dispatch, String(userRelationToParent));
    navigation.navigate('ChildProfileScreen');
  }
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
  return <>
    <View style={[styles.flex1,{ backgroundColor: headerColor }]}>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <HeaderRowView
        style={[styles.headerRowView,{backgroundColor: headerColor}]}>
        <HeaderIconView>
          <HeaderIconPress
            onPress={():any => {
              navigation.goBack();
            }}>
            <IconML name={'ic_back'} color="#FFF" size={15} />
          </HeaderIconPress>
        </HeaderIconView>
        <HeaderTitleView>
          <Heading2w numberOfLines={1}>
            {t('editParentTxt')}
          </Heading2w>
        </HeaderTitleView>
      </HeaderRowView>
      <MainContainer>
        <FormInputGroup
          onPress={():any => {
            actionSheetRef.current?.setModalVisible();
          }}>
          <LabelText>{t('relationShipTxt')}</LabelText>

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
          <View>
            {
              relationship_to_parent.map((item: any, index: any) => {
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
                          console.log("22", userRelationToParent, item.id);
                          if (item.id == relationShipMotherId || item.id == relationShipFatherId) {
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
        <FormContainer>
          <LabelText>{t('parentNameTxt')}</LabelText>
          <FormInputBox>
            <TextInputML
              autoCapitalize="none"
              style={styles.textInputML}
              autoCorrect={false}
              maxLength={30}
              clearButtonMode="always"
              onChangeText={(value: any):any => {
                if (value.replace(/\s/g, "") == "") {
                  setParentName(value.replace(/\s/g, ''));
                } else {
                  setParentName(value.replace(regexpEmojiPresentation, ''));
                }
              }}
              value={parentName}
              placeholder={t('parentPlaceNameTxt')}
              placeholderTextColor={"gray"}
              allowFontScaling={false}
            /></FormInputBox>
        </FormContainer>
      </MainContainer>
      <ShiftFromTop10>
        <ButtonContainer>
          <ButtonPrimary
            disabled={
              relationship == "" || relationship == null || relationship == undefined || parentName == null || parentName == undefined || parentName == "" ? true : false}
            onPress={():any => {
              saveParentData(relationship, parentName, userRelationToParent);
            }}>
            <ButtonText numberOfLines={2}>{t('childSetupListsaveBtnText')}</ButtonText>
          </ButtonPrimary>
        </ButtonContainer>
      </ShiftFromTop10>
    </View>
  </>;
};

export default EditParentDetails;

