import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import BurgerIcon from '@components/shared/BurgerIcon';
import { ButtonText, ButtonTextSmLine } from '@components/shared/ButtonGlobal';
import Icon, {
  OuterIconLeft,
  OuterIconRow,
  TickView
} from '@components/shared/Icon';
import {
  ProfileActionView, ProfileIconView,
  ProfileLinkView, ProfileListActiveChild, ProfileListDefault, ProfileListInner, ProfileSectionView, ProfileTextView
} from '@components/shared/ProfileListingStyle';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3, Heading5, Heading5Bold, Heading6 } from '@styles/typography';
import React, { useContext } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../App';
import { getAllChildren, getAllConfigData } from '../../services/childCRUD';

type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};

const ChildProfile = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const secopndaryColor = themeContext.colors.SECONDARY_COLOR;
  const secopndaryTintColor = themeContext.colors.SECONDARY_TINTCOLOR;
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      getAllConfigData(dispatch);
    },[])
  );
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      :[],
  );
  
 
  const allConfigData = useAppSelector(
    (state: any) => state.variableData?.variableData != '' ? JSON.parse(state.variableData?.variableData) :state.variableData?.variableData
  );
  const userParentalRoleData=allConfigData?.length>0?allConfigData.filter(item => item.key === "userParentalRole"):[];
  const userNameData=allConfigData?.length>0?allConfigData.filter(item => item.key === "userName"):[];
  
  //console.log(allConfigData,"..userParentalRole..")
  const renderChildItem = (dispatch: any, data: any, index: number) => (
    <View key={index}>
      {/* <ProfileListViewSelected>
                <ProfileIconView><Icon name="ic_baby" size={30} color="#000" /></ProfileIconView>
                <ProfileTextView
                 >
                   <Heading3>Jenny</Heading3>
                   <Heading5>Girl</Heading5>
                 </ProfileTextView>
                <ProfileActionView>
                <OuterIconRow><OuterIconLeft><TickView><Icon name="ic_tick" size={12} color="#009B00" /></TickView></OuterIconLeft></OuterIconRow>
                  <Heading5Bold>Activated</Heading5Bold></ProfileActionView>
      </ProfileListViewSelected> */}

      <ProfileListDefault
        style={{
          backgroundColor: secopndaryTintColor,
        }}>
          <ProfileListInner>
        <ProfileIconView><Icon name="ic_baby" size={30} color="#000" /></ProfileIconView>
        <ProfileTextView
                 >
                   <ProfileSectionView>
                   <Heading3>{data.name!="" ? data.name:"Child"+(index+1)},</Heading3>
                   <OuterIconLeft></OuterIconLeft>
                   <Heading6>{data.gender?data.gender:''}</Heading6>
                  
                   </ProfileSectionView>
          
                   <Heading5>Born on {data.birthDate}</Heading5>
                   
                   <ProfileLinkView>
            <ButtonTextSmLine
                onPress={() => {
                  navigation.navigate('EditChildProfile',{childData:data});
                }}>
                <Text>Edit Profile</Text>
              </ButtonTextSmLine>
              <View>
                <Text>|</Text>
              </View>
              <ButtonTextSmLine>Activate Profile</ButtonTextSmLine>
            </ProfileLinkView>
          </ProfileTextView>
          <ProfileActionView>
            {/* Pressable button */}
            <Text></Text>
          </ProfileActionView>
        </ProfileListInner>
      </ProfileListDefault>
    </View>
  );
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <View style={{flex: 1}}>
              <BurgerIcon />
            </View>
            <View style={{flex: 3}}>
              <Text> {'Child and Parent Profile'}</Text>
            </View>
          </View>
          {/* <ScrollView style={{flex: 4, backgroundColor: '#FFF'}}> */}
            <View style={{margin: 15}}>
              <View style={{flexDirection: 'column'}}>
                {/* <ProfileListActiveChild
                  style={{
                    backgroundColor: secopndaryColor,
                  }}>
                  <ProfileIconView>
                    <Icon name="ic_baby" size={30} color="#000" />
                  </ProfileIconView>
                  <ProfileTextView>
                    <ProfileSectionView>
                      <Heading3>Jenny,</Heading3>
                      <OuterIconLeft></OuterIconLeft>
                      <Heading6>Girl</Heading6>
                    </ProfileSectionView>
                    <Heading5>Born on 08 Jul 2020</Heading5>
                    <ProfileLinkView>
                      <ButtonTextSmLine
                        onPress={() => {
                          navigation.navigate('EditChildProfile');
                        }}>
                        <Text>Edit Profile</Text>
                      </ButtonTextSmLine>
                    </ProfileLinkView>
                  </ProfileTextView>

                  <ProfileActionView>
                    <OuterIconRow>
                      <OuterIconLeft>
                        <TickView>
                          <Icon name="ic_tick" size={12} color="#009B00" />
                        </TickView>
                      </OuterIconLeft>
                    </OuterIconRow>
                    <Heading5Bold>Activated</Heading5Bold>
                  </ProfileActionView>
                </ProfileListActiveChild> */}
                <ScrollView
                  style={{height: '70%', marginTop: 15}}
                  nestedScrollEnabled={true}>
                  {childList?.map((item: any, index: number) => {
                    return renderChildItem(dispatch, item, index);
                  })}
                </ScrollView>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: secopndaryTintColor,
                    marginBottom: 10,
                    borderBottomWidth: 1,
                    borderColor: '#EEE',
                  }}>
                  <Pressable
                    style={{padding: 10, flexDirection: 'row'}}
                    onPress={() => {
                      navigation.navigate('EditChildProfile',{childData:''});
                    }}>
                    <Icon
                      name="ic_plus"
                      size={25}
                      color="#000"
                      style={{padding: 10}}
                    />
                    <Text>Add sister or brother</Text>
                  </Pressable>
                  <Pressable
                    style={{padding: 10, flexDirection: 'row'}}
                    onPress={() => {
                      navigation.navigate('AddExpectingChildProfile');
                    }}>
                    <Icon
                      name="ic_plus"
                      size={25}
                      color="#000"
                      style={{padding: 10}}
                    />
                    <Text>Add Expecting Child</Text>
                  </Pressable>
                </View>
              </View>
              <View style={{backgroundColor: secopndaryTintColor}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{padding: 10}}>
                    <ButtonText>Parent Details</ButtonText>
                  </View>
                  <View style={{padding: 10}}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('EditParentDetails');
                      }}>
                      <Text>Edit Profile</Text>
                    </Pressable>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{padding: 10}}>
                    <Text>Your role is</Text>
                  </View>
                  <View style={{padding: 10}}>
                    <Text>{userParentalRoleData?.length>0?JSON.parse(userParentalRoleData[0].value):''}</Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{padding: 10}}>
                    <Text>Name</Text>
                  </View>
                  <View style={{padding: 10}}>
                    <Text>{userNameData?.length>0?userNameData[0].value:''}</Text>
                  </View>
                </View>
              </View>
            </View>
          {/* </ScrollView> */}
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChildProfile;
