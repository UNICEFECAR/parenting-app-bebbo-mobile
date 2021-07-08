import ActivitiesCategories from '@components/ActivitiesCategories';
import AgeBrackets from '@components/AgeBrackets';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleHeading, ActivityBox, ArticleListContainer,ArticleListContent } from '@components/shared/ArticlesStyle';
import { ButtonTextSmLine } from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FDirCol, FDirRow, FlexCol, FlexDirRow,FlexDirRowSpace} from '@components/shared/FlexBoxStyle';
import PrematureTag,{PrematureTagActivity} from '@components/shared/PrematureTag';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3, Heading4, Heading5Bold, Heading6Bold, ShiftFromTop5, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
type ActivitiesNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ActivitiesNavigationProp;
};

const DATA = [
  {
    id: '1',
    imagePath: require('@assets/trash/card1.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '2',
    imagePath: require('@assets/trash/card2.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '3',
    imagePath: require('@assets/trash/card3.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '4',
    imagePath: require('@assets/trash/card4.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '5',
    imagePath: require('@assets/trash/card5.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '6',
    imagePath: require('@assets/trash/card6.jpeg'),
    title: 'Picking stuff around',
  },
];
const ContainerView = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.ACTIVITIES_TINTCOLOR};
`;
const SuggestedActivities = () => {
  const {t} = useTranslation();
  return (
    <ArticleListContainer>
      <Image
        style={styles.cardImage}
        source={require('@assets/trash/card5.jpeg')}
        resizeMode={'cover'}
      />
      <ArticleListContent>
      <ShiftFromTopBottom5>
          <Heading6Bold>Play and learning</Heading6Bold>
          </ShiftFromTopBottom5>
          <Heading3>{'General recommendations for overweight and obese infants'}</Heading3>
      
      <ActivityBox>
        <View>
          <Heading6Bold>
            {t('actScreenpendingMilestone')} {t('actScreenmilestones')}
          </Heading6Bold>
          <ShiftFromTop5>
          <Heading4>{'Laugh at Human face'}</Heading4>
          </ShiftFromTop5>
        </View>
        <View>
          <ButtonTextSmLine>
            {t('actScreentrack')} {t('actScreenmilestones')}
          </ButtonTextSmLine>
        </View>
        
      </ActivityBox>
      
      </ArticleListContent>
      <ShareFavButtons isFavourite={false} backgroundColor={'#FFF'}/>
    </ArticleListContainer>
  );
};
const Activities = ({navigation}: Props) => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ACTIVITIES_COLOR;
  const backgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const onPress = () => {
    navigation.navigate('DetailsScreen', {
      fromScreen: 'Activities',
      headerColor: headerColor,
      backgroundColor: backgroundColor,
    });
  };

  const renderActivityItem = (item: typeof DATA[0], index: number) => (
    <Pressable onPress={onPress} key={index}>
      <ArticleListContainer>
        <Image
          style={styles.cardImage}
          source={item.imagePath}
          resizeMode={'cover'}
        />
        <ArticleListContent>
            <ShiftFromTopBottom5>
          <Heading6Bold>Cognitive</Heading6Bold>
          </ShiftFromTopBottom5>
          <Heading3>{item.title}</Heading3>
          </ArticleListContent>
        
        <ShareFavButtons  isFavourite={false} backgroundColor={'#FFF'}/>
      </ArticleListContainer>
    </Pressable>
  );

  return (
    <>
      <ContainerView>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ScrollView nestedScrollEnabled={true}>
          <TabScreenHeader
            title={t('actScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
          />
          <FlexCol>
            <AgeBrackets
              itemColor={backgroundColor}
              activatedItemColor={headerColor}
            />
            <ActivitiesCategories
              borderColor={headerColor}
              backgroundColor={backgroundColor}
            />
            <View style={{height: 450, marginBottom: 15}}>
            <ArticleHeading>
              <FlexDirRowSpace>
                
                <Heading3>{t('actScreensugacttxt')}</Heading3>
              <PrematureTagActivity>
                <Heading5Bold>{t('actScreenprematureText')}</Heading5Bold>
              </PrematureTagActivity>
              </FlexDirRowSpace>
              </ArticleHeading>
              
              <SuggestedActivities />
            </View>
            <ArticleHeading>
              <Heading3>{t('actScreenotheracttxt')}</Heading3>
            </ArticleHeading>
            <View>
{DATA.map((item, index) => {
  return renderActivityItem(item, index);
})}
            </View>
          </FlexCol>
        </ScrollView>
      </ContainerView>
    </>
  );
};

export default Activities;

const styles = StyleSheet.create({
  item: {
    height: '100%',
    backgroundColor: '#FFF',
    // padding: 20,
    // marginVertical: 8,
    // marginHorizontal: 16,
    // borderRadius: 5,
    flex: 1,
  },
  title: {
    fontSize: 16,
    padding: 10,
    // flex: 1,
    color: '#000',
  },
  // label: {
  //   // fontSize: 12,
  //   // paddingLeft: 10,
  //   // flex: 1,
  //   // color: '#000',
  // },
  cardImage: {
    height: 200,
    width: '100%',
    // flex: 1,
    // alignSelf: 'center',
    // borderTopRightRadius: 5,
    // borderTopLeftRadius: 5,
  },
});
