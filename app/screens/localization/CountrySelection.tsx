import { localization } from '@assets/data/localization';
import CountryItem from '@components/CountryItem';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonSection,
  ButtonviewClick,
  ButtonviewNext,
  ButtonviewPrevious
} from '@components/shared/ButtonView';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingStyle from '@components/shared/OnboardingStyle';
import { LocalizationStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SelectionView } from '@styles/style';
import { ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, FlatList, Text } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import { deleteImageFile } from '../../downloadImages/ImageStorage';
import { setSponsorStore } from '../../redux/reducers/localizationSlice';
import { receiveAPIFailure } from '../../redux/sagaMiddleware/sagaSlice';
import { formatStringDate } from '../../services/Utils';
type CountrySelectionNavigationProp = StackNavigationProp<
  LocalizationStackParamList,
  'LanguageSelection'
>;

type Props = {
  navigation: CountrySelectionNavigationProp;
};

// import {API_URL, API_TOKEN} from "react-native-dotenv";
//{navigation}: Props
type localizationType = {
  name: string;
  displayName: string;
  countryId: number;
  languages: {
    name: string;
    displayName: string;
    languageCode: string;
    locale: string;
  };
};
const CountrySelection = (props: any) => {
  const { t,i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const dispatch = useAppDispatch();
  const [country, setCountry] = useState<localizationType>();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
  );
  const locale = useAppSelector(
    (state: any) => state.selectedCountry.locale,
  );
  const sponsors = useAppSelector(
    (state: any) => state.selectedCountry.sponsors,
  );
  console.log("...sponsors..", sponsors);
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (userIsOnboarded == true) {
          i18n.changeLanguage(locale);
          props.navigation.goBack()
        }
        return true;
      };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    const selectedCountry: any = localization.find(
      (country) => country.countryId === countryId,
    );
    const fetchData = async () => {
      if (userIsOnboarded == false) {
        let deleteresult = await userRealmCommon.deleteBy(ChildEntitySchema,"isMigrated == false");
        dataRealmCommon.deleteAllAtOnce();
        // if(sponsors.country_national_partner!=undefined && sponsors.country_national_partner!="" && sponsors?.country_national_partner!=null){
        //   deleteImageFile(sponsors?.country_national_partner);
        // }
        // if(sponsors.country_sponsor_logo!=undefined && sponsors.country_sponsor_logo!="" && sponsors?.country_sponsor_logo!=null){
        //   deleteImageFile(sponsors?.country_sponsor_logo);
        // }
        dispatch(setSponsorStore({country_national_partner:null,country_sponsor_logo:null}));
        let payload = {errorArr:[],fromPage:'OnLoad'}
        dispatch(receiveAPIFailure(payload));
      }
    }
    fetchData()
    setCountry(selectedCountry);

    return () => backHandler.remove();
  }, []),
  );
  const renderItem = ({ item }: any) => (
    <CountryItem item={item} currentItem={country} setCountry={setCountry} />
  );
  
  // console.log("-----bj ",i18n);
  return (
    <>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      
      <OnboardingContainer>
        <OnboardingStyle
          title={t('selectYourCountry').toString()}
          iconname="ic_country"
        />

        <SelectionView>
          <FlatList
            data={localization}
            renderItem={renderItem}
            keyExtractor={(item) => item.countryId.toString()}
          />
        </SelectionView>
        {country ? (
          <ButtonSection>
            <ShiftFromTopBottom10>
              <ButtonviewNext>
                <ButtonviewClick
                  style={{}}
                  onPress={() =>
                    props.navigation.navigate('LanguageSelection', { country })
                  }>
                  <Icon name="ic_angle_right" size={32} color="#000" />
                </ButtonviewClick>
              </ButtonviewNext>
            </ShiftFromTopBottom10>
          </ButtonSection>
        ) : (
          <ButtonviewPrevious>
            <ButtonviewClick onPress={() => { }}>
              <Icon name="ic_angle_right" size={32} color="#000" />
            </ButtonviewClick>
          </ButtonviewPrevious>
        )}
      </OnboardingContainer>
    </>
  );
};

export default CountrySelection;
