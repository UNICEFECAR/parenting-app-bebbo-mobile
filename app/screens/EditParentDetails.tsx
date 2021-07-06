import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import {
    ChildRelationList,
    FormDateAction, FormDateText,
    FormInputBox,
    FormInputGroup,
    LabelText
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createRef, useContext, useState } from 'react';
import {
    Pressable, SafeAreaView, StyleSheet, Text, TextInput, View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { getAllChildren, getAllConfigData } from '../services/childCRUD';
import {
    Heading2w,
    Heading3
} from '../styles/typography';

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList
>;

type Props = {
  route:any,
  navigation: ChildSetupNavigationProp;
};

const EditParentDetails = ({route,navigation}: Props) => {
  const {userParentalRoleData,parentEditName}=route.params;
  const [relationship, setRelationship] = useState(userParentalRoleData?userParentalRoleData:"");
  const [relationshipName, setRelationshipName] = useState("");
  // const genders = ['Father', 'Mother', 'Other'];
  const relationshipData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender,
  );
  let relationshipValue = relationshipData.length>0 && userParentalRoleData!="" ? relationshipData.find((o:any) => o.id === userParentalRoleData):'';
  // console.log(relationshipName,"..relationshipName..");

  const actionSheetRef = createRef<any>();
  const themeContext = useContext(ThemeContext);
  const dispatch=useAppDispatch();
  const [parentName, setParentName] = React.useState(parentEditName?parentEditName:"");
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      getAllConfigData(dispatch);
     // console.log(relationshipValue.name,"..relationshipValue.name")
      setRelationshipName(relationshipValue!="" && relationshipValue!=null && relationshipValue!=undefined?relationshipValue.name:'');
 
       },[])
  );
  const saveParentData=async (relationship:string,parentName:any)=>{
    let userParentalRole = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userParentalRole", relationship);
    let userNames = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userName",parentName);
    // console.log(userParentalRole,"..userParentalRole")
    // console.log(userNames,"..userNames")
    navigation.navigate('ChildProfileScreen');
  }
   
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
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
              <Heading2w>
                {'Edit Parent Details'}
              </Heading2w>
            </View>
          </View>
       

        <FormInputGroup
              onPress={() => {
                actionSheetRef.current?.setModalVisible();
              }}>
              <LabelText>Relationship with child</LabelText>

              <FormInputBox>
                <FormDateText>
                  <Text>{relationshipName ? relationshipName : 'Select'}</Text>
                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_angle_down" size={10} color="#000" />
                </FormDateAction>
              </FormInputBox>
            </FormInputGroup>
        <ActionSheet ref={actionSheetRef}>
          <View>
            {
            relationshipData.map((item, index) => {
              return (
                <ChildRelationList key={index}>
                  <Pressable
                    onPress={() => {
                      setRelationship(item.id);
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
          <View>
            <LabelText>Parent Name</LabelText>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
              clearButtonMode="always"
              onChangeText={(value:any) => { setParentName(value) }}
              value={parentName}
              // onChangeText={queryText => handleSearch(queryText)}
              placeholder="Enter your name"
              style={{
                backgroundColor: '#fff',
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
            />
          </View>
          <View style={{width: '100%', marginTop: 30}}>
            <ButtonPrimary
              onPress={() => {
                saveParentData(relationship,parentName);
             
              }}>
              <ButtonText>Save Data</ButtonText>
            </ButtonPrimary>
          </View>
      </SafeAreaView>
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
