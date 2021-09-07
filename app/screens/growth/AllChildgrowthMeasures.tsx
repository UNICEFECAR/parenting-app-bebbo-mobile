import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import ActiveChildMeasureTimeline from '@components/growth/ActiveChildMeasureTimeline';
import {
  ButtonContainer,
  ButtonPrimary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { FlexCol } from '@components/shared/FlexBoxStyle';
import { HeaderIconView, HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2, ShiftFromTop10
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { isFutureDate } from '../../services/childCRUD';


type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AllChildgrowthMeasures = ({route, navigation}) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  // const [childmeasures, setChildmeasures] = React.useState<any[]>([]);
  const {t} = useTranslation();
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        {/* <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}> */}
            <HeaderRowView
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
          <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
          </HeaderIconView>
          <HeaderTitleView>
          <Heading2> {t('growthScreenallMeasureHeader')}</Heading2>
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
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
            </View>
            <View style={{flex: 9, padding: 7}}>
              <Heading2>
               
              </Heading2>
            </View>
          </View> */}
        <FlexCol>
          <View
            style={{
              flex: 9,
              backgroundColor: backgroundColor,
              padding: 20,
              paddingLeft: 5,
              maxHeight: '100%',
            }}>
              <ActiveChildMeasureTimeline activeChild={activeChild}/>
            {/* <Timeline
              data={activeChild.measures}
              circleSize={20}
              circleColor={headerColor}
              lineColor="#000"
              showTime={false}
              lineWidth={1}
              descriptionStyle={{color: 'gray'}}
              renderDetail={renderDetail}
              innerCircle={'icon'}
              iconDefault={<Icon name={'ic_tick'} color="#000" size={10} />}
              eventDetailStyle={{
                backgroundColor: '#FFF',
                marginBottom: 10,
                padding: 15,
                borderRadius: 4,
              }}
            /> */}</View>
            <ButtonContainer style={{backgroundColor: backgroundColor}}>
              <ShiftFromTop10>
                <ButtonPrimary
                  disabled={isFutureDate(activeChild?.birthDate)}
                  style={{backgroundColor: headerColor}}
                  onPress={() => {
                    navigation.navigate('AddNewChildgrowth', {
                      headerTitle: t('growthScreenaddNewBtntxt'),
                    });
                  }}>
                  <ButtonText numberOfLines={2}>{t('growthScreenaddNewBtntxt')}</ButtonText>
                </ButtonPrimary>
              </ShiftFromTop10>
            </ButtonContainer>
          
          </FlexCol>
        
      </SafeAreaView>
    </>
  );
};

export default AllChildgrowthMeasures;
