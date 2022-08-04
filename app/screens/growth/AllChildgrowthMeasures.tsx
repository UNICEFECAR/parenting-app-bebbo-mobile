import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import ActiveChildMeasureTimeline from '@components/growth/ActiveChildMeasureTimeline';
import {
  ButtonContainer,
  ButtonPrimary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { FlexCol } from '@components/shared/FlexBoxStyle';
import { HeaderIconPress, HeaderIconView, HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import { IconML } from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2, ShiftFromTop10
} from '@styles/typography';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { isFutureDate } from '../../services/childCRUD';


type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AllChildgrowthMeasures = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const {t} = useTranslation();
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
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
                <IconML name={'ic_back'} color="#000" size={15} />
              </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
          <Heading2> {t('growthScreenallMeasureHeader')}</Heading2>
          </HeaderTitleView>
          
        </HeaderRowView>
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
            </View>
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
        
      </View>
    </>
  );
};

export default AllChildgrowthMeasures;
