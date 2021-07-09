import AgeBrackets from '@components/AgeBrackets';
import ChilDevelopmentCollapsibleItem from '@components/ChilDevelopmentCollapsibleItem';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleHeading } from '@components/shared/ArticlesStyle';
import { BannerContainer, MainContainer } from '@components/shared/Container';
import { DevelopmentContent, DevelopmentPercent, DevelopmentStatus } from '@components/shared/DevelopmentStyle';
import { FDirCol, FDirRow, Flex4, FlexDirCol, FlexDirRowSpace, FlexDirRowSpaceStart } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { PrematureTagDevelopment } from '@components/shared/PrematureTag';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading3, Heading3Regular, Heading4, Heading5Bold, ShiftFromTop10, ShiftFromTop20, ShiftFromTop5 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView, View
} from 'react-native';
import { ThemeContext } from 'styled-components/native';

type ChildDevelopmentNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ChildDevelopmentNavigationProp;
};
const ChildDevelopment = ({navigation}: Props) => {
  const cditems = [
    {
      id: 0,
      title: 'Laughs at a human face',
    },
    {
      id: 1,
      title: "Carefully observes people's face",
    },
    {
      id: 2,
      title: 'Shows that she is angry or happy',
    },
    {
      id: 3,
      title:
        'Begins a mimic facial movements and expressions, as well as sound',
    },
    {
      id: 4,
      title: "Carefully observes people's face",
    },
    {
      id: 5,
      title: 'Shows that she is angry or happy',
    },
    {
      id: 6,
      title:
        'Begins a mimic facial movements and expressions, as well as soundy',
    },
  ];
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const backgroundColor = themeContext.colors.CHILDDEVELOPMENT_TINTCOLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const {t} = useTranslation();
  const onPressInfo = () => {
    // navigation.navigate('DetailsScreen', {
    //   fromScreen: 'ChildDevelopment',
    //   headerColor: artHeaderColor,
    //   backgroundColor: artBackgroundColor,
    // });
  };
  const renderItem = (item: typeof cditems[0]) => (
    <ChilDevelopmentCollapsibleItem item={item} subItemSaperatorColor={headerColor} />
  );
  const ContentThatGoesBelowTheFlatList = () => {
    return (
      <>
      <ShiftFromTop20>
       <MainContainer><BannerContainer>
        
         
          <Heading5Bold>{t('developScreentipsText')}</Heading5Bold>
          <ShiftFromTop10><Heading3Regular>
            Watch your baby's behaviour and talk to your paediatrician or
            visiting nurse if you notice that at the end of the first month you
            baby:
          </Heading3Regular></ShiftFromTop10>
          
        
        </BannerContainer></MainContainer></ShiftFromTop20>
      </>
    );
  };
  const ContentThatGoesAboveTheFlatList = () => {
    return (
      <>
        <AgeBrackets
          itemColor={backgroundColor}
          activatedItemColor={headerColor}
        />
        <View>
          <Image
            source={require('@assets/trash/card2.jpeg')}
            style={{width: '100%'}}
          />
        </View>
        <ArticleHeading>
          <FlexDirRowSpace>
          <Heading3>3rd and 4th Month </Heading3>
          <PrematureTagDevelopment>
          <Heading5Bold>
              {t('developScreenprematureText')}
            </Heading5Bold>
          </PrematureTagDevelopment>
          </FlexDirRowSpace>
          <ShiftFromTop5>
          <FlexDirRowSpaceStart>
          <Heading2>
            The Period of Diverse Experiences
          </Heading2>
          <Pressable onPress={onPressInfo}>
            <ShiftFromTop5>
                <Icon name="ic_info" size={15} color="#000" />
                </ShiftFromTop5>
            </Pressable>
          </FlexDirRowSpaceStart>
          </ShiftFromTop5>
          <FDirCol>
            <DevelopmentStatus>
            <FlexDirRowSpace>
              <DevelopmentContent>
              <FDirRow>
            
            <OuterIconRow>
              <OuterIconLeft>
              <Icon
            name="ic_incom"
            size={24}
            color="#FFF"
            style={{backgroundColor: 'red', borderRadius: 150}}
          />
              </OuterIconLeft>
            </OuterIconRow>
          <Heading4>{t('developScreenchartLabel')}</Heading4>
          </FDirRow>
          <ShiftFromTop5>
              <Heading3>{t('developScreenchartText')}</Heading3>
              </ShiftFromTop5>
              </DevelopmentContent>
             <DevelopmentPercent>
                <Heading3>25%</Heading3>
             </DevelopmentPercent>
            </FlexDirRowSpace>
            </DevelopmentStatus>
            <FDirRow>
            <Heading3Regular>
          {t('developScreenmileStoneQ')}
        </Heading3Regular>
            </FDirRow>
          </FDirCol>
        
        </ArticleHeading>
        
      </>
    );
  };
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <FlexDirCol>
         
          <TabScreenHeader
            title={t('developScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
          />
          <Flex4 style={{backgroundColor: backgroundColor, margin:-3}}>
            <View>
              <FlatList
                data={cditems}
                renderItem={({item, index}) => renderItem(item)}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled={true}
                ListHeaderComponent={ContentThatGoesAboveTheFlatList}
                ListFooterComponent={ContentThatGoesBelowTheFlatList}
              />
            </View>
          </Flex4>
          </FlexDirCol>
      </SafeAreaView>
    </>
  );
};

export default ChildDevelopment;
