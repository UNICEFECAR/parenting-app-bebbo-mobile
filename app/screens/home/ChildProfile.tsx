import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonLinkPress, ButtonText, ButtonTextMdLineL, ButtonTextSmLine } from '@components/shared/ButtonGlobal';
import Icon, {
  OuterIconLeft,
  OuterIconRow,
  TickView
} from '@components/shared/Icon';
import { ProfileActionView,ParentListView, ProfileLinkCol,ProfileLinkRow, ProfileListDefault,ProfileSectionView, ProfileListInner,ProfileIconView,ProfileLinkView, ProfileListView, ProfileListActiveChild, ProfileTextView, ParentRowView, ParentColView, ProfileContentView, ParentSection, ParentLabel, ParentData, ProfileListViewSelected } from '@components/shared/ProfileListingStyle';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w, Heading3, Heading5, Heading5Bold, Heading6 } from '@styles/typography';
import React, { useContext } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setActiveChild } from '../../services/childCRUD';

type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};

// const DATA = [
//   {
//     id: '1',
//     childname: 'Harvey',
//     gender: 'Boy',
//     birthday: new Date(),
//   },
//   {
//     id: '2',
//     childname: 'Donna',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '3',
//     childname: 'Michael',
//     gender: 'Boy',
//     birthday: new Date(),
//   },
//   {
//     id: '4',
//     childname: 'Rachel',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '5',
//     childname: 'Louis',
//     gender: 'Boy',
//     birthday: new Date(),
//   },
//   {
//     id: '6',
//     childname: 'Jessica',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '7',
//     childname: 'Samantha',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '8',
//     childname: 'Katrina',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '9',
//     childname: 'Sheila',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '10',
//     childname: 'Jeff',
//     gender: 'Boy',
//     birthday: new Date(),
//   },
//   {
//     id: '11',
//     childname: 'Alex',
//     gender: 'Boy',
//     birthday: new Date(),
//   },
// ];
const ChildProfile = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const secopndaryColor = themeContext.colors.SECONDARY_COLOR;
  const secopndaryTintColor = themeContext.colors.SECONDARY_TINTCOLOR;
  const dispatch = useAppDispatch();
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getAllChildren(dispatch);
  //     getAllConfigData(dispatch);
  //   },[])
  // );
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );
  console.log(childList,"..childList..");
  const allConfigData = useAppSelector(
    (state: any) => state.variableData?.variableData != '' ? JSON.parse(state.variableData?.variableData) :state.variableData?.variableData
  );
  const userParentalRoleData=allConfigData?.length>0?allConfigData.filter(item => item.key === "userParentalRole"):[];
  const userNameData=allConfigData?.length>0?allConfigData.filter(item => item.key === "userName"):[];
  const currentActiveChildId=allConfigData?.length>0?allConfigData.filter(item => item.key === "currentActiveChildId"):[];
  //console.log(allConfigData,"..userParentalRole..")
  const currentActiveChild=currentActiveChildId?.length>0?currentActiveChildId[0].value:null;
  //console.log(currentActiveChild,"..currentActiveChild..");
  const renderChildItem = (dispatch: any, data: any, index: number) => (
 
    <View key={index}>
      {
         ((currentActiveChild !=""  &&  currentActiveChild !=null  &&  currentActiveChild !=undefined) && currentActiveChild==data.uuid) ? (
          <ProfileListViewSelected>
          <ProfileIconView><Icon name="ic_baby" size={30} color="#000" /></ProfileIconView>
          <ProfileTextView
           >
             <ProfileSectionView>
             <Heading3>{data.name!="" ? data.name:"Child"+(index+1)}</Heading3>
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
              </ProfileLinkView>
           </ProfileTextView>
          <ProfileActionView>
          <OuterIconRow><OuterIconLeft><TickView><Icon name="ic_tick" size={12} color="#009B00" /></TickView></OuterIconLeft></OuterIconRow>
          
            <Heading5Bold>Activated</Heading5Bold>
            </ProfileActionView>
          </ProfileListViewSelected>
            ) :
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
              <ButtonTextSmLine onPress={() => {
                setActiveChild(data.uuid)
                }}>Activate Profile</ButtonTextSmLine>
            </ProfileLinkView>
          </ProfileTextView>
          <ProfileActionView>
            {/* Pressable button */}
            <Text></Text>
          </ProfileActionView>
        </ProfileListInner>
      </ProfileListDefault>
}
  </View>
  );
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
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
                {'Child and Parent Profile'}
              </Heading2w>
            </View>
          </View>
        {/* <View
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
              alignItems:'center',
            }}>
            <View style={{flex: 1}}>
              <BurgerIcon />
            </View>
            <View style={{flex: 3}}>
              <Heading2w> {'Child and ParentProfile'}</Heading2w>
            </View>
          </View> */}
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
                  style={{height: 'auto', }}
                  nestedScrollEnabled={true}>
                  {childList?.map((item: any, index: number) => {
                    return renderChildItem(dispatch, item, index);
                  })}
                </ScrollView>
              <ProfileLinkRow style={{
                  backgroundColor: secopndaryTintColor,
                }}>
                 
                <ProfileLinkCol>
              <ButtonLinkPress
                  
                  onPress={() => {
                    navigation.navigate('EditChildProfile',{childData:null});
                  }}>
                    <OuterIconRow><OuterIconLeft><Icon
                    name="ic_plus"
                    size={24}
                    color="#000"
                    
                  /></OuterIconLeft></OuterIconRow>
                  
                  <ButtonTextMdLineL>Add sister or brother</ButtonTextMdLineL>
                 
                </ButtonLinkPress>
            
                </ProfileLinkCol>
                <ProfileLinkCol>
                <ButtonLinkPress
                  
                  onPress={() => {
                    navigation.navigate('AddExpectingChildProfile');
                  }}>
                    <OuterIconRow><OuterIconLeft><Icon
                    name="ic_plus"
                    size={24}
                    color="#000"
                    
                  /></OuterIconLeft></OuterIconRow>
                  
                  <ButtonTextMdLineL>Add Expecting Child</ButtonTextMdLineL>
                 
                </ButtonLinkPress>
                </ProfileLinkCol>
                </ProfileLinkRow>

                
                <ParentListView style={{backgroundColor: secopndaryTintColor}}>
                <ProfileContentView>
                <ProfileTextView>	
                            <Heading3>Parent Details</Heading3>	
                          </ProfileTextView>
                  <ProfileActionView>	
                          <ButtonLinkPress	
                              onPress={() => {
                                navigation.navigate('EditParentDetails',{
                                  userParentalRoleData:userParentalRoleData?.length>0?userParentalRoleData[0].value:'',
                                  parentEditName:userNameData?.length>0?userNameData[0].value:''
                                });
                              }}>	
                              <ButtonTextSmLine>Edit Profile</ButtonTextSmLine>	
                            </ButtonLinkPress>	
                                  	
                              </ProfileActionView>
                  
                              </ProfileContentView>

                              <ProfileContentView>	
                          <ParentRowView>	
                            <ParentSection>	
                              <ParentLabel>	
                                <Text>Your role</Text>	
                              </ParentLabel>	
                              <ParentData>	
                              <Text>{userParentalRoleData?.length>0?userParentalRoleData[0].value:''}</Text>
                              </ParentData>	
                            </ParentSection>	
                            <ParentSection>	
                              <ParentLabel>	
                                <Text>Name</Text>	
                              </ParentLabel>	
                              <ParentData>	
                              <Text>{userNameData?.length>0?userNameData[0].value:''}</Text>
                              </ParentData>	
                            </ParentSection>	

                          </ParentRowView>	
                  </ProfileContentView>	             
              </ParentListView>
                {/* <View style={{flexDirection: 'row'}}>
                  <View style={{padding: 10}}>
                    <Text>Name</Text>
                  </View>
                  <View style={{padding: 10}}>
                    <Text>{userNameData?.length>0?userNameData[0].value:''}</Text>
                  </View>
                </View> */}
              </View>
            </View>
          {/* </ScrollView> */}
        {/* </View> */}
      </SafeAreaView>
    </>
  );
};

export default ChildProfile;
