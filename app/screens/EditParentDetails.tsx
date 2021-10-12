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
import Icon from '@components/shared/Icon';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Pressable, StyleSheet, Text, TextInput, View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  route:any,
  navigation: ChildSetupNavigationProp;
};

const EditParentDetails = ({route,navigation}: Props) => {
  const {userParentalRoleData,userRelationToParentEdit,parentEditName}=route.params;
  const [relationship, setRelationship] = useState(userParentalRoleData?userParentalRoleData:"");
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipName, setRelationshipName] = useState("");
  // const genders = ['Father', 'Mother', 'Other'];
  let relationshipData = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender:[],
  );
  let relationshipValue = relationshipData.length>0 && userParentalRoleData!="" ? relationshipData.find((o:any) => String(o.id) === userParentalRoleData):'';
  // console.log(relationshipName,"..relationshipName..");
  const relationship_to_parent = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).relationship_to_parent,
  );
  let relationshipToParent = relationship_to_parent.length>0 && userRelationToParentEdit!="" ? relationship_to_parent.find((o:any) => String(o.id) === userRelationToParentEdit):'';
  relationshipData= relationshipData.map((v) => ({ ...v, title: v.name })).filter(function (e, i, a) {
    return e.id!=both_parent_gender;
  });
  const actionSheetRef = createRef<any>();
  const themeContext = useContext(ThemeContext);
  const dispatch=useAppDispatch();
  const {t} = useTranslation();
  const [parentName, setParentName] = React.useState(parentEditName?parentEditName:"");
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  useFocusEffect(
    React.useCallback(() => {
      setRelationshipName(relationshipToParent!="" && relationshipToParent!=null && relationshipToParent!=undefined?relationshipToParent.name:'');
      setUserRelationToParent(relationshipToParent!="" && relationshipToParent!=null && relationshipToParent!=undefined?relationshipToParent.id:'');
       },[])
  );
  useEffect(() => {
    const backAction = () => {
      console.log("11")
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    navigation.addListener('gestureEnd', backAction);
    return () => {
      navigation.removeListener('gestureEnd', backAction);
      backHandler.remove();
    }
  }, []);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const getDefaultgenderValue = () => {
    return userParentalRoleData != ''
      ? relationshipData.find((item) => item.id == relationship)
      : { title: '' };
  };

  const saveParentData=async (relationship:any,parentName:any,userRelationToParent:any)=>{
    console.log(userRelationToParent,"../",typeof(userRelationToParent))
    console.log(typeof(relationship),"typeof");
    var relationshipnew:any=relationship;
    if (typeof relationshipnew === 'string' || relationshipnew instanceof String){
      relationship=relationshipnew
    }
    else{
      relationship=String(relationshipnew);
    }
    let userParentalRole = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userParentalRole", relationship);
    let userRelationToParentRole = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userRelationToParent", String(userRelationToParent));
    let userNames = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userName",parentName);
    // console.log(userParentalRole,"..userParentalRole")
    // console.log(userNames,"..userNames");
    userRelationToParent=userRelationToParent.length>0?userRelationToParent[0].value:'';
    updateActiveChild(activeChild,"parent_gender",relationship, dispatch,userRelationToParentRole);
    navigation.navigate('ChildProfileScreen');
  }
  const getCheckedParentItem = (checkedItem:any) => {
    console.log(checkedItem,"..checkedItem");
    if (
      typeof checkedItem.id === 'string' ||
      checkedItem.id instanceof String
    ) {
      setRelationship(checkedItem.id);
    } else {
      setRelationship(String(checkedItem.id));
    }
  };
  return (
    <>
      <View style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
          <HeaderIconPress 
               onPress={() => {
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#FFF" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
          <Heading2w numberOfLines={1}>
              {t('editParentTxt')}
              </Heading2w>
          </HeaderTitleView>
        </HeaderRowView>
        {/* <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <View style={{flex: 1, padding: 15}}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#FFF" size={15} />
              </Pressable>
            </View>
            <View style={{flex: 9, padding: 7}}>
              <Heading2w numberOfLines={1}>
              {t('editParentTxt')}
              </Heading2w>
            </View>
          </View> */}
       
<MainContainer>
        <FormInputGroup
              onPress={() => {
                actionSheetRef.current?.setModalVisible();
              }}>
              <LabelText>{t('relationShipTxt')}</LabelText>

              <FormInputBox>
                <FormDateText>
                  {/* <Text>{userRelationToParent ? userRelationToParent : 'Select'}</Text> */}
                  <Text>{relationshipName ? relationshipName : 'Select'}</Text>
                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_angle_down" size={10} color="#000" />
                </FormDateAction>
              </FormInputBox>
            </FormInputGroup>
            <View>
           {
                userRelationToParent!=null && userRelationToParent!=undefined && userRelationToParent != relationShipMotherId && userRelationToParent != relationShipFatherId ?
                  <FormContainer1>
                    <LabelText>{t('parentGender')}</LabelText>
                      <ToggleRadios
                        options={relationshipData}
                        defaultValue={getDefaultgenderValue()}
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
            relationship_to_parent.map((item, index) => {
              return (
                <ChildRelationList key={index}>
                  <Pressable
                    onPress={() => {
                      // if (typeof item.id === 'string' || item.id instanceof String){
                      //   setRelationship(item.id);
                      // }
                      // else{
                      //   setRelationship(String(item.id));
                      // }
                      // setRelationshipName(item.name);
                      console.log(item,"..item..");  
                        setUserRelationToParent(item.id);
                        console.log(userRelationToParent,"..userRelationToParent..");  
                      if(item.id == relationShipMotherId){
                        if (typeof femaleData.id === 'string' || femaleData.id instanceof String) {
                          setRelationship(femaleData.id);
                        }
                        else {
                          setRelationship(String(femaleData.id));
                        }
                      }
                      else if(item.id == relationShipFatherId){
                        if (typeof maleData.id === 'string' || maleData.id instanceof String) {
                          setRelationship(maleData.id);
                        }
                        else {
                          setRelationship(String(maleData.id));
                        }
                      }
                      else{
                        if(userRelationToParent==relationShipMotherId || userRelationToParent==relationShipFatherId){
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
            <TextInput
              autoCapitalize="none"
              style={{width:'100%'}}
              autoCorrect={false}
              maxLength={30}
              clearButtonMode="always"
              onChangeText={(value:any) => { 
                // setParentName(value.replace(/\s/g, ''))
               if (value.replace(/\s/g,"")=="") {
                  console.log("..11value")
                  setParentName(value.replace(/\s/g, '')); 
                 } else {
                  console.log("..22value")
                  // if (/^[a-zA-Z ]*$/.test(value)) {
                  setParentName(value.replace(regexpEmojiPresentation, ''));
                  // }
                 }
               }}
              // value={parentName.replace(/\s/g, '')}
              value={parentName}
              // onChangeText={queryText => handleSearch(queryText)}
              placeholder={t('parentPlaceNameTxt')}
              allowFontScaling={false} 
            /></FormInputBox>
          </FormContainer>
          </MainContainer>
          <ShiftFromTop10>
          <ButtonContainer>
            {/* <Text>{userRelationToParent+"/"+relationship+"/"+parentName}huhi</Text> */}
            <ButtonPrimary
             disabled={
              relationship=="" || relationship==null || relationship==undefined || parentName==null || parentName==undefined || parentName=="" ? true :false}
              onPress={() => {
                saveParentData(relationship,parentName,userRelationToParent);
             
              }}>
              <ButtonText numberOfLines={2}>{t('childSetupListsaveBtnText')}</ButtonText>
            </ButtonPrimary>
          </ButtonContainer>
          </ShiftFromTop10>
      </View>
    </>
  );
};

export default EditParentDetails;
const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#FFF',
    color: '#20232a',
    textAlign: 'left',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
