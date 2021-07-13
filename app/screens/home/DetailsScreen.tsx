import ActivitiesCategories from '@components/ActivitiesCategories';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleDetailsContainer, ArticleHeading } from '@components/shared/ArticlesStyle';
import { BgActivityTint } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { FlexDirRow } from '@components/shared/FlexBoxStyle';
import { HeaderIconView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TrackMilestoneView from '@components/shared/TrackMilestoneView';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading6Bold } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, View } from 'react-native';
import HTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '../../../App';

type DetailsScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: DetailsScreenNavigationProp;
};

export type RelatedArticlesProps = {
  related_articles?:any,
  category?:any,
  currentId?:any
}
// const headerColor = 'red';
const DetailsScreen = ({route, navigation}: any) => {
  const {headerColor, fromScreen, backgroundColor,detailData} = route.params;
  // const {headerColor, fromScreen, backgroundColor,detailData,setFilteredArticleData} = route.params;
  // console.log(detailData);
  const {t} = useTranslation();
  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  let filterArray: string[] = [];
  const setNewFilteredArticleData = (itemId:any) => {
    navigation.navigate({
      name: fromScreen,
      params: {categoryArray:itemId},
      merge: true,
    });
  }
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <FlexDirRow
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
            <Heading2>{detailData.title}</Heading2>
          </HeaderTitleView>
        </FlexDirRow>

        <ScrollView style={{flex: 4}}>
          <View>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={{width: '100%', height: 200}}
              // source={detailData.cover_image ? {uri : "file://" + destinationFolder + ((JSON.parse(detailData.cover_image).url).split('/').pop())} : require('@assets/trash/defaultArticleImage.png')}
              source={require('@assets/trash/defaultArticleImage.png')}
            />
          </View>
          <ShareFavButtons  isFavourite={false} backgroundColor={headerColor} />
          <ArticleDetailsContainer>
          <Heading6Bold>{ categoryData.filter((x: any) => x.id==detailData.category)[0].name }</Heading6Bold>
          <Heading2>{detailData.title}</Heading2>
          <HTML
            source={{html: detailData.body}}
            baseFontStyle={{fontSize: 16, color: '#000000'}}
          />
          </ArticleDetailsContainer>
          {fromScreen === 'Articles' ? (
            <>
              <View style={{backgroundColor: backgroundColor}}>
                
                {/*  <RelatedArticles related_articles={[6781]} category={detailData.category} currentId={detailData.id} />
                   <RelatedArticles related_articles={detailData.related_articles} category={detailData.category} /> */}
                
                <ArticleHeading>
                  <Heading2>{t('detailScreenArticleHeader')}</Heading2>
                </ArticleHeading>
                <ArticleCategories borderColor={headerColor} filterOnCategory={setNewFilteredArticleData} filterArray={filterArray} />
              </View>
            </>
          ) : null}
          {fromScreen === 'Activities' ? (
            <>
            <MainContainer>
            <TrackMilestoneView/>
            </MainContainer>
            <BgActivityTint>
              <ArticleHeading>
                <Heading2>{t('detailScreenActivityHeader')}</Heading2>
              </ArticleHeading>
              <ActivitiesCategories
                borderColor={headerColor}
                backgroundColor={backgroundColor}
              />
              </BgActivityTint>
            </>
          ) : null}
          {
            fromScreen ==="ChildDevelopment"?
            <>
            <TrackMilestoneView/>
            </>:null
          }
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default DetailsScreen;
