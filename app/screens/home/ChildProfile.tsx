import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonLinkPress, ButtonTextMdLineL,
  ButtonTextSmLine
} from '@components/shared/ButtonGlobal';
import { MainContainer,AreaContainer } from '@components/shared/Container';
import { VerticalDivider } from '@components/shared/Divider';
import { FDirRow, FlexColEnd,FlexCol,FlexRow} from '@components/shared/FlexBoxStyle';
import { HeaderIconView, HeaderRowView, HeaderTitleView,HeaderIconPress} from '@components/shared/HeaderContainerStyle';
import Icon, {
  OuterIconLeft,
  OuterIconRow,
  TickView
} from '@components/shared/Icon';
import { ImageIcon } from '@components/shared/Image';
import PrematureTag from '@components/shared/PrematureTag';
import {
  ParentData, ParentLabel, ParentListView, ParentRowView, ParentSection, ProfileActionView, ProfileContentView, ProfileIconView, ProfileLinkCol,
  ProfileLinkRow, ProfileLinkView, ProfileListDefault, ProfileListInner, ProfileListViewSelected1, ProfileSectionView, ProfileTextView
} from '@components/shared/ProfileListingStyle';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2w,
  Heading3,
  Heading5,
  Heading5Bold,
  Heading6,
  ShiftFromBottom5,
  Heading5BoldW
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { getAllChildren, getAllConfigData, setActiveChild } from '../../services/childCRUD';
import { formatDate } from '../../services/Utils';

type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const ChildProfile = ({navigation}: Props) => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const secopndaryColor = themeContext.colors.SECONDARY_COLOR;
  const secopndaryTintColor = themeContext.colors.SECONDARY_TINTCOLOR;
  const genders = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender:[],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch,child_age,0);
      getAllConfigData(dispatch);
      navigation.dispatch(state => {
        // Remove the home route from the stack
        const routes = state.routes.filter(r => r.name !== 'LoadingScreen' && r.name !== 'EditChildProfile');
      
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    },[])
  );
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );
  const activeChild = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild)
    : [],
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
const luxonLocale = useAppSelector(
  (state: any) => state.selectedCountry.luxonLocale,
);
const isFutureDate = (date: Date) => {
  return new Date(date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)
};
const currentActiveChild =activeChild.uuid;
const child_age = useAppSelector(
  (state: any) =>
  state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
);
  const allConfigData = useAppSelector((state: any) =>
    state.variableData?.variableData != ''
      ? JSON.parse(state.variableData?.variableData)
      : state.variableData?.variableData,
  );
  const userParentalRoleData =
    allConfigData?.length > 0
      ? allConfigData.filter((item) => item.key === 'userParentalRole')
      : [];
  const userNameData =
    allConfigData?.length > 0
      ? allConfigData.filter((item) => item.key === 'userName')
      : [];
      const relationship_to_parent = useAppSelector(
        (state: any) =>
        state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).relationship_to_parent:[],
      );
      const userRelationToParent =
      allConfigData?.length > 0
        ? allConfigData.filter((item) => item.key === 'userRelationToParent')
        : [];
   const relationshipData = useAppSelector(
        (state: any) =>
        state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender:[],
      );

      console.log(relationshipData,"..relationshipData..")
    let relationshipValue = relationshipData.length>0 && userParentalRoleData.length>0 ? relationshipData.find((o:any) => String(o.id) === userParentalRoleData[0].value):'';
    let relationshipToParent = relationship_to_parent.length>0 && userRelationToParent.length>0 ? relationship_to_parent.find((o:any) => String(o.id) === userRelationToParent[0].value):'';
    console.log(relationshipValue,"..relationshipValue..")
    console.log(relationshipToParent,"..relationshipToParent..")
  // const currentActiveChildId =
  //   allConfigData?.length > 0
  //     ? allConfigData.filter((item) => item.key === 'currentActiveChildId')
  //     : [];
  //console.log(allConfigData,"..userParentalRole..")
  // const currentActiveChild =
  //   currentActiveChildId?.length > 0 ? currentActiveChildId[0].value : null;
  // //console.log(currentActiveChild,"..currentActiveChild..");
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const SortedchildList = [...childList].sort((a: any, b: any) => {
    if (a.uuid == currentActiveChild) return -1;
  });
  const renderChildProfile = (dispatch: any, data: any, index: number,genderName:string) => (
    console.log(genderName,"...ggnme"),
    <View key={data.uuid}>
      {currentActiveChild != '' &&
      currentActiveChild != null &&
      currentActiveChild != undefined &&
      currentActiveChild == data.uuid ? (
        <ProfileListViewSelected1>
          
          <ProfileIconView>
            {
          data.photoUri!='' ? 
          <ImageIcon source={{uri:  "file://"+CHILDREN_PATH +data.photoUri }} style={{borderRadius:20,width:40,height:40}}>
         </ImageIcon>  : <Icon name="ic_baby" size={30} color="#000" />
            }
          </ProfileIconView>
          <ProfileTextView  style={{paddingRight:5}}>
            <ProfileSectionView>
              <Heading3 style={{flexShrink:1}}>{data.childName}{genderName!='' && genderName!=null && genderName!=undefined ?
              <Text style={{fontSize:12,fontWeight:'normal'}}>{', '+genderName}</Text>:null}
              </Heading3>
            </ProfileSectionView>
            <Heading5>      
              {( data.birthDate != '' &&
                    data.birthDate != null &&
                    data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn',{childdob:data.birthDate!=null? formatDate(data.birthDate,luxonLocale):''}):t('expectedChildDobLabel')}
            </Heading5>
            <ProfileLinkView>
              <ButtonTextSmLine numberOfLines={2}
                onPress={() => {
                  console.log("..2222..");
                  data.index = index;
                  console.log(isFutureDate(data.birthDate),"..isFutureDate(data.birthDate)..");
                  if(isFutureDate(data.birthDate)){
                    navigation.navigate('AddExpectingChildProfile', {childData: data});
                  }
                  else{
                    navigation.navigate('EditChildProfile', {childData: data});
                  }
                }}>
                <Text>{t('editProfileBtn')}</Text>
              </ButtonTextSmLine>
            </ProfileLinkView>
          </ProfileTextView>
          
          <ProfileActionView style={{flex:1}}>
          <FlexColEnd>
            {/* Premature Tag Insert Here */}
          {/* <ShiftFromBottom5>
          <PrematureTag>
          <Heading5BoldW>
          {t('developScreenprematureText')}
          </Heading5BoldW>
          </PrematureTag>
          </ShiftFromBottom5> */}
          {/* Premature Tag End Here */}
          <FDirRow>
            <OuterIconRow>
              <OuterIconLeft>
                <TickView>
                  <Icon name="ic_tick" size={11} color="#009B00" />
                </TickView>
              </OuterIconLeft>
            </OuterIconRow>

            <Heading5Bold style={{flexShrink:1}}>{t('childActivatedtxt')}</Heading5Bold>
            </FDirRow>
            </FlexColEnd>  
          </ProfileActionView>
        </ProfileListViewSelected1>
      ) : (
        
        <ProfileListDefault
          style={{
             backgroundColor: secopndaryTintColor,
             flexDirection:'column',flex:1,
          }}>
          <ProfileListInner>
            <ProfileIconView>
              {
          data.photoUri!='' ? 
          <ImageIcon source={{uri:  "file://"+CHILDREN_PATH +data.photoUri }} style={{borderRadius:20,width:40,height:40}}>
         </ImageIcon>  : <Icon name="ic_baby" size={30} color="#000" />
            }
            </ProfileIconView>
            <FlexCol> 
            <FlexRow>
            <ProfileTextView>
              <ProfileSectionView style={{alignItems:'flex-start'}}>
              <Heading3>{data.childName}{genderName!='' && genderName!=null && genderName!=undefined ?<Text style={{fontSize:12,fontWeight:'normal'}}>{', '+genderName}</Text>:null}
              </Heading3>
                
              </ProfileSectionView>
              <Heading5>      
                          {( data.birthDate != '' &&
                               data.birthDate != null &&
                               data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn',{childdob:data.birthDate!=null? formatDate(data.birthDate,luxonLocale):''}):t('expectedChildDobLabel')}
                        </Heading5>
              
            </ProfileTextView>
            <ProfileActionView>
              {/* Pressable button */}
              {/* <Text></Text> */}
              <FlexColEnd>
              {/* Premature Tag Insert Here */}
          {/* <ShiftFromBottom5>
          <PrematureTag>
          <Heading5BoldW>
          {t('developScreenprematureText')}
          </Heading5BoldW>
          </PrematureTag>
          </ShiftFromBottom5> */}
           {/* Premature Tag End Here */}
            </FlexColEnd>  
            </ProfileActionView>
            </FlexRow>
            <ProfileLinkView style={{marginLeft:6}}>
                <ButtonTextSmLine numberOfLines={2} style={{flexShrink:1,alignItems:'flex-start', textAlign:'left'}}
                  onPress={() => {
                  data.index = index;
                  console.log(isFutureDate(data.birthDate),"..isFutureDate(data.birthDate)..");
                  if(isFutureDate(data.birthDate)){
                    navigation.navigate('AddExpectingChildProfile', {childData: data});
                  }
                  else{
                    navigation.navigate('EditChildProfile', {childData: data});
                  }
                  }}>
                  <Text  style={{flexShrink:1}}>{t('editProfileBtn')}</Text>
                </ButtonTextSmLine>
                <VerticalDivider>
                  {/* <Text>|</Text> */}
                  <Text></Text>
                </VerticalDivider>
                <ButtonTextSmLine numberOfLines={2} style={{flexShrink:1,alignItems:'flex-start', textAlign:'left'}}
                  onPress={() => {
                    setActiveChild(languageCode,data.uuid,dispatch,child_age);
                  }}>
                 <Text  style={{flexShrink:1}}>{t('childActivatebtn')}</Text>
                </ButtonTextSmLine>
              </ProfileLinkView>
            </FlexCol>
            
          </ProfileListInner>
        </ProfileListDefault>        
      )}
    </View>
  );
  
  return (
    <>
      <View style={{flex: 1,backgroundColor:headerColor}}>
       
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        
        <HeaderRowView
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
          <HeaderIconPress 
              onPress={(e) => {
                e.stopPropagation();
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#FFF" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
          <Heading2w numberOfLines={1}>{t('childProfileHeader')}</Heading2w>
          </HeaderTitleView>
        </HeaderRowView>
        <FlexCol style={{backgroundColor:"#FFF"}}>
        <AreaContainer>
          <View style={{flexDirection: 'column'}}>
            <ScrollView style={{maxHeight:windowHeight-360,height:'auto'}} nestedScrollEnabled={true}>
              {SortedchildList.length > 0
                ? SortedchildList.map((item: any, index: number) => {
                   console.log(item,"..item..");
                  // console.log(genders,"..genders..");
                  const genderLocal=(genders?.length>0 && item.gender!="")? genders.find(genderset => genderset.id == parseInt(item.gender)).name:'';
                  console.log(genderLocal,"..genderLocal..")
                  return renderChildProfile(dispatch, item, index,genderLocal);
                  })
                : null}
            </ScrollView>
            <ProfileLinkRow
              style={{
                 backgroundColor: secopndaryTintColor,
                
              }}>
             <ProfileLinkCol>
                <ButtonLinkPress
                  onPress={() => {
                    navigation.navigate('EditChildProfile', {childData: null});
                  }}>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_plus" size={20} color="#000" />
                    </OuterIconLeft>
                  </OuterIconRow>

                  <ButtonTextMdLineL>{t('childSetupListaddSiblingBtn')}</ButtonTextMdLineL>
                </ButtonLinkPress>
                </ProfileLinkCol>
                <ProfileLinkCol>
                <ButtonLinkPress
                  onPress={() => {
                    navigation.navigate('AddExpectingChildProfile',{childData: null});
                  }}>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_plus" size={20} color="#000" />
                    </OuterIconLeft>
                  </OuterIconRow>

                  <ButtonTextMdLineL>{t('expectChildAddTxt2')}</ButtonTextMdLineL>
                </ButtonLinkPress>
                </ProfileLinkCol>
            </ProfileLinkRow>

            <ParentListView style={{backgroundColor: secopndaryTintColor}}>
              <ProfileContentView>
                <ProfileTextView>
                  <Heading3>{t('parentDetailsTxt')}</Heading3>
                </ProfileTextView>
                <ProfileActionView>
                  <ButtonLinkPress
                    onPress={() => {
                      navigation.navigate('EditParentDetails', {
                        userParentalRoleData:
                          userParentalRoleData?.length > 0
                            ? userParentalRoleData[0].value
                            : '',
                        parentEditName:
                          userNameData?.length > 0 ? userNameData[0].value : '',
                          userRelationToParentEdit:userRelationToParent?.length > 0
                          ? userRelationToParent[0].value
                          : '',
                      });
                    }}>
                    <ButtonTextSmLine numberOfLines={2}>{t('editProfileBtn')}</ButtonTextSmLine>
                  </ButtonLinkPress>
                </ProfileActionView>
              </ProfileContentView>

              <ProfileContentView>
                <ParentRowView>
                  
                
                  <ParentSection>
                    <ParentLabel>
                      <Text>{t('parentRoleLabel')}</Text>
                    </ParentLabel>
                    <ParentData>
                     
                      <Text style={{marginLeft:15}}>
                        {userRelationToParent?.length > 0 ? relationshipToParent.name : ''}
                      </Text>
                 
                    </ParentData>
                  </ParentSection>
                  <ParentSection>
                    <ParentLabel>
                      <Text>{t('parentGender')}</Text>
                    </ParentLabel>
                    <ParentData>
                    <Text style={{marginLeft:15}}>
                        {
                        userParentalRoleData?.length > 0
                          ? relationshipValue.name
                          : ''
                        }
                      </Text>
                    </ParentData>
                    
                  </ParentSection>
                  <ParentSection>
                    <ParentLabel>
                      <Text>{t('parentNameLabel')}</Text>
                    </ParentLabel>
                    <ParentData>
                      <Text style={{marginLeft:15}}>
                        {userNameData?.length > 0 ? userNameData[0].value : ''}
                      </Text>
                     
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
        </AreaContainer>
        </FlexCol>
      </View>
    </>
  );
};

export default ChildProfile;
