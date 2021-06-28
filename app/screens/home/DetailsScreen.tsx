import ActivitiesCategories from '@components/ActivitiesCategories';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Icon from '@components/shared/Icon';
import RelatedArticles from '@components/shared/RelatedArticles';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TrackMilestoneView from '@components/shared/TrackMilestoneView';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading2w } from '@styles/typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type DetailsScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: DetailsScreenNavigationProp;
};

// const headerColor = 'red';
const DetailsScreen = ({route, navigation}: any) => {
  const {headerColor, fromScreen, backgroundColor} = route.params;
  const {t} = useTranslation();
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
            <Heading2w>{fromScreen}</Heading2w>
          </View>
        </View>

        <ScrollView style={{flex: 4}}>
          <View style={{alignItems: 'center'}}>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={{width: '100%', height: 200}}
              source={require('@assets/trash/card5.jpeg')}
            />
          </View>
          <ShareFavButtons backgroundColor={headerColor} />
          <Text style={{margin: 5}}>
            {
              'Planning now in the refrigerator. But eget urna viverra molestie quam, ac commodo mauris consequat tincidunt. Each players textbooks, any development organization sauce, notebook Nullam varius. Let us live is mauris commodo nulla ornare, in order that he wishes to drink the throat. However, please players invest a lot of time. For posuere mauris ut consectetur element. Maecenas quis Vestibulum ac habitasse, trucks than of life, rutrum Sed Phasellus. No lion not feasible in vehicles production. Ultricies soccer relay makeup. Consequently and fear of financing, and the territories tortor iaculis, vehicula ligula. For bananas skirt smile, who ugly hairstyle. In fact, well as the mass, posuere a weekend or a, rhoncus nec ligula. Soccer employee at the clinical site.'
            }
          </Text>
          <Text style={{margin: 5}}>
            Orci varius natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus. Pellentesque fringilla tincidunt nisi, vitae
            tincidunt augue sagittis vitae. Quisque commodo nunc nisl, eu
            iaculis turpis vehicula id. Donec sem justo, bibendum non congue a,
            elementum et sem. Curabitur blandit nisi vitae enim efficitur, nec
            molestie lacus fermentum. Sed sodales ligula eu odio tristique, a
            porttitor turpis semper. Curabitur aliquet diam magna. Phasellus
            accumsan, lorem vitae malesuada mollis, nisi metus consectetur
            lectus, id posuere ante massa a lorem. Suspendisse eu dapibus augue.
            Nunc a sapien porta augue ultrices vehicula eget id dui. Vestibulum
            posuere risus eget augue condimentum, id tincidunt lectus
            sollicitudin. Donec pulvinar urna eu nunc iaculis finibus. Aliquam
            eleifend velit ac semper semper.
          </Text>
          {fromScreen === 'Articles' ? (
            <>
              <View style={{backgroundColor: backgroundColor}}>
                <View style={{flex: 1, padding: 5, marginVertical: 10}}>
                  <RelatedArticles />
                </View>
                <View style={{padding: 20}}>
                  <Heading2>{t('detailScreenArticleHeader')}</Heading2>
                </View>
                <ArticleCategories />
              </View>
            </>
          ) : null}
          {fromScreen === 'Activities' ? (
            <>
            <TrackMilestoneView/>
              <View style={{backgroundColor: backgroundColor, padding: 20}}>
                <Heading2>{t('detailScreenActivityHeader')}</Heading2>
              </View>
              <ActivitiesCategories
                borderColor={headerColor}
                backgroundColor={backgroundColor}
              />
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
